// Copyright 2016-2019 Cargo-Bundle developers <https://github.com/burtonageo/cargo-bundle>
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

#[cfg(windows)]
use crate::bundle::windows::util;
use crate::{bundle::common::CommandExt, Settings};
use anyhow::Context;
#[cfg(windows)]
use std::path::PathBuf;
#[cfg(windows)]
use std::sync::OnceLock;
use std::{path::Path, process::Command};

impl Settings {
  pub(crate) fn can_sign(&self) -> bool {
    self.windows().sign_command.is_some() || self.windows().certificate_thumbprint.is_some()
  }

  pub(crate) fn sign_params(&self) -> SignParams {
    SignParams {
      product_name: self.product_name().into(),
      digest_algorithm: self
        .windows()
        .digest_algorithm
        .as_ref()
        .map(|algorithm| algorithm.to_string())
        .unwrap_or_else(|| "sha256".to_string()),
      certificate_thumbprint: self
        .windows()
        .certificate_thumbprint
        .clone()
        .unwrap_or_default(),
      timestamp_url: self
        .windows()
        .timestamp_url
        .as_ref()
        .map(|url| url.to_string()),
      tsp: self.windows().tsp,
      sign_command: self.windows().sign_command.clone(),
    }
  }
}

#[cfg_attr(not(windows), allow(dead_code))]
pub struct SignParams {
  pub product_name: String,
  pub digest_algorithm: String,
  pub certificate_thumbprint: String,
  pub timestamp_url: Option<String>,
  pub tsp: bool,
  pub sign_command: Option<String>,
}

#[cfg(windows)]
fn signtool() -> Option<PathBuf> {
  // sign code forked from https://github.com/forbjok/rust-codesign
  static SIGN_TOOL: OnceLock<crate::Result<PathBuf>> = OnceLock::new();
  SIGN_TOOL
    .get_or_init(|| {
      const INSTALLED_ROOTS_REGKEY_PATH: &str = r"SOFTWARE\Microsoft\Windows Kits\Installed Roots";
      const KITS_ROOT_REGVALUE_NAME: &str = r"KitsRoot10";

      // Open 32-bit HKLM "Installed Roots" key
      let installed_roots_key = windows_registry::LOCAL_MACHINE
        .open(INSTALLED_ROOTS_REGKEY_PATH)
        .map_err(|_| crate::Error::OpenRegistry(INSTALLED_ROOTS_REGKEY_PATH.to_string()))?;

      // Get the Windows SDK root path
      let kits_root_10_path: String = installed_roots_key
        .get_string(KITS_ROOT_REGVALUE_NAME)
        .map_err(|_| crate::Error::GetRegistryValue(KITS_ROOT_REGVALUE_NAME.to_string()))?;

      // Construct Windows SDK bin path
      let kits_root_10_bin_path = Path::new(&kits_root_10_path).join("bin");

      let mut installed_kits: Vec<String> = installed_roots_key
        .keys()
        .map_err(|_| crate::Error::FailedToEnumerateRegKeys)?
        .collect();

      // Sort installed kits
      installed_kits.sort();

      /* Iterate through installed kit version keys in reverse (from newest to oldest),
      adding their bin paths to the list.
      Windows SDK 10 v10.0.15063.468 and later will have their signtools located there. */
      let mut kit_bin_paths: Vec<PathBuf> = installed_kits
        .iter()
        .rev()
        .map(|kit| kits_root_10_bin_path.join(kit))
        .collect();

      /* Add kits root bin path.
      For Windows SDK 10 versions earlier than v10.0.15063.468, signtool will be located there. */
      kit_bin_paths.push(kits_root_10_bin_path);

      // Choose which version of SignTool to use based on OS bitness
      let arch_dir = util::os_bitness().ok_or(crate::Error::UnsupportedBitness)?;

      /* Iterate through all bin paths, checking for existence of a SignTool executable. */
      for kit_bin_path in &kit_bin_paths {
        /* Construct SignTool path. */
        let signtool_path = kit_bin_path.join(arch_dir).join("signtool.exe");

        /* Check if SignTool exists at this location. */
        if signtool_path.exists() {
          // SignTool found. Return it.
          return Ok(signtool_path);
        }
      }

      Err(crate::Error::SignToolNotFound)
    })
    .as_ref()
    .ok()
    .cloned()
}

/// Check if binary is already signed.
/// Used to skip sidecar binaries that are already signed.
#[cfg(windows)]
pub fn verify(path: &Path) -> crate::Result<bool> {
  let signtool = signtool().ok_or(crate::Error::SignToolNotFound)?;

  let mut cmd = Command::new(signtool);
  cmd.arg("verify");
  cmd.arg("/pa");
  cmd.arg(path);

  Ok(cmd.status()?.success())
}

fn parse_custom_sign_command(command: &str) -> crate::Result<Vec<String>> {
  let mut result = Vec::<String>::new();

  let mut buffer = String::new();

  #[derive(Copy, Clone)]
  enum State {
    Idle,
    // Parsing unquoted element
    Unquoted,
    // Parsing quoted element
    Quoted,
    // just after '"' parsing quoted element
    // expecting '"' or whitespace and error otherwise
    // Example: "foo"bar is error
    // We accept '""' as a way to escape a quote
    QuotedJustAfterQuote,
  }

  let mut state = State::Idle;

  for c in command.chars() {
    match (state, c) {
      (State::Idle, c) if c.is_ascii_whitespace() => {
        // skip whitespace
      }
      (State::Idle, '"') => {
        state = State::Quoted;
      }
      (State::Idle, c) => {
        buffer.push(c);
        state = State::Unquoted;
      }

      (State::Unquoted, c) if c.is_ascii_whitespace() => {
        result.push(buffer.clone());
        buffer.clear();
        state = State::Idle;
      }
      (State::Unquoted, '"') => {
        return Err(anyhow::anyhow!("custom signing command contains an unclosed quote").into());
      }
      (State::Unquoted, c) => {
        buffer.push(c);
      }

      (State::Quoted, '"') => {
        state = State::QuotedJustAfterQuote;
      }
      (State::Quoted, c) => {
        buffer.push(c);
      }

      (State::QuotedJustAfterQuote, '"') => {
        buffer.push('"');
        state = State::Quoted;
      }
      (State::QuotedJustAfterQuote, c) if c.is_ascii_whitespace() => {
        result.push(buffer.clone());
        buffer.clear();
        state = State::Idle;
      }
      (State::QuotedJustAfterQuote, _) => {
        return Err(anyhow::anyhow!("custom signing command contains an unclosed quote").into());
      }
    }
  }

  match state {
    State::Idle => {}
    State::Unquoted => {
      result.push(buffer);
    }
    State::Quoted => {
      return Err(anyhow::anyhow!("custom signing command contains an unclosed quote").into());
    }
    State::QuotedJustAfterQuote => {
      result.push(buffer);
    }
  }

  Ok(result)
}

pub fn sign_command_custom<P: AsRef<Path>>(path: P, command: &str) -> crate::Result<Command> {
  let path = path.as_ref();
  let args = parse_custom_sign_command(command)?;
  let mut args = args.iter();

  let bin = args
    .next()
    .context("custom signing command doesn't contain a bin?")?;

  let mut cmd = Command::new(bin);
  for arg in args {
    if arg == "%1" {
      cmd.arg(path);
    } else {
      cmd.arg(arg);
    }
  }
  Ok(cmd)
}

#[cfg(windows)]
pub fn sign_command_default<P: AsRef<Path>>(
  path: P,
  params: &SignParams,
) -> crate::Result<Command> {
  let signtool = signtool().ok_or(crate::Error::SignToolNotFound)?;

  let mut cmd = Command::new(signtool);
  cmd.arg("sign");
  cmd.args(["/fd", &params.digest_algorithm]);
  cmd.args(["/sha1", &params.certificate_thumbprint]);
  cmd.args(["/d", &params.product_name]);

  if let Some(ref timestamp_url) = params.timestamp_url {
    if params.tsp {
      cmd.args(["/tr", timestamp_url]);
      cmd.args(["/td", &params.digest_algorithm]);
    } else {
      cmd.args(["/t", timestamp_url]);
    }
  }

  cmd.arg(path.as_ref());

  Ok(cmd)
}

pub fn sign_command<P: AsRef<Path>>(path: P, params: &SignParams) -> crate::Result<Command> {
  match &params.sign_command {
    Some(custom_command) => sign_command_custom(path, custom_command),
    #[cfg(windows)]
    None => sign_command_default(path, params),

    // should not be reachable
    #[cfg(not(windows))]
    None => Ok(Command::new("")),
  }
}

pub fn sign_custom<P: AsRef<Path>>(path: P, custom_command: &str) -> crate::Result<()> {
  let path = path.as_ref();

  log::info!(action = "Signing";"{} with a custom signing command", tauri_utils::display_path(path));

  let mut cmd = sign_command_custom(path, custom_command)?;

  let output = cmd.output_ok()?;

  let stdout = String::from_utf8_lossy(output.stdout.as_slice()).into_owned();
  log::info!("{:?}", stdout);

  Ok(())
}

#[cfg(windows)]
pub fn sign_default<P: AsRef<Path>>(path: P, params: &SignParams) -> crate::Result<()> {
  let signtool = signtool().ok_or(crate::Error::SignToolNotFound)?;
  let path = path.as_ref();

  log::info!(action = "Signing"; "{} with identity \"{}\"", tauri_utils::display_path(path), params.certificate_thumbprint);

  let mut cmd = sign_command_default(path, params)?;
  log::debug!("Running signtool {:?}", signtool);

  // Execute SignTool command
  let output = cmd.output_ok()?;

  let stdout = String::from_utf8_lossy(output.stdout.as_slice()).into_owned();
  log::info!("{:?}", stdout);

  Ok(())
}

pub fn sign<P: AsRef<Path>>(path: P, params: &SignParams) -> crate::Result<()> {
  match &params.sign_command {
    Some(custom_command) => sign_custom(path, custom_command),
    #[cfg(windows)]
    None => sign_default(path, params),
    // should not be reachable, as user should either use Windows
    // or specify a custom sign_command but we succeed anyways
    #[cfg(not(windows))]
    None => Ok(()),
  }
}

pub fn try_sign(file_path: &std::path::PathBuf, settings: &Settings) -> crate::Result<()> {
  if settings.can_sign() {
    log::info!(action = "Signing"; "{}", tauri_utils::display_path(file_path));
    sign(file_path, &settings.sign_params())?;
  }
  Ok(())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse_custom_sign_command() {
    // basic cases
    assert!(parse_custom_sign_command("").unwrap().is_empty());
    assert_eq!(parse_custom_sign_command("foo").unwrap(), vec!["foo".to_string()]);
    assert_eq!(parse_custom_sign_command("foo bar").unwrap(), vec!["foo".to_string(), "bar".to_string()]);
    assert_eq!(parse_custom_sign_command("foo bar baz").unwrap(), vec!["foo".to_string(), "bar".to_string(), "baz".to_string()]);
    assert_eq!(parse_custom_sign_command("foo \"bar baz\"").unwrap(), vec!["foo".to_string(), "bar baz".to_string()]);
    assert_eq!(parse_custom_sign_command("foo \"bar baz\" qux").unwrap(), vec!["foo".to_string(), "bar baz".to_string(), "qux".to_string()]);
    assert_eq!(parse_custom_sign_command("foo \"bar baz\"\"qux\"").unwrap(), vec!["foo".to_string(), "bar baz\"qux".to_string()]);
    assert_eq!(parse_custom_sign_command("\"foo bar\" baz").unwrap(), vec!["foo bar".to_string(), "baz".to_string()]);

    // non-trimmed command specified
    assert_eq!(parse_custom_sign_command("\t foo ").unwrap(), vec!["foo".to_string()]);
    assert_eq!(parse_custom_sign_command("\t foo \"bar baz\"\"qux\" \t").unwrap(), vec!["foo".to_string(), "bar baz\"qux".to_string()]);

    // unclosed quote
    assert!(parse_custom_sign_command("foo \"bar baz").is_err());
    assert!(parse_custom_sign_command("foo \"bar baz\" qux \"").is_err());
    assert!(parse_custom_sign_command("foo\"bar baz\" qux").is_err());
    assert!(parse_custom_sign_command("foo \"bar baz\"qux").is_err());
  }
}

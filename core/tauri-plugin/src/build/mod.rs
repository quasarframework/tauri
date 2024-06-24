// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use std::path::{Path, PathBuf};

use anyhow::Result;
use tauri_utils::acl::{self, Error};

pub mod mobile;

use serde::de::DeserializeOwned;

use std::{env::var, io::Cursor};

pub fn plugin_config<T: DeserializeOwned>(name: &str) -> Option<T> {
  let config_env_var_name = format!(
    "TAURI_{}_PLUGIN_CONFIG",
    name.to_uppercase().replace('-', "_")
  );
  if let Ok(config_str) = var(&config_env_var_name) {
    println!("cargo:rerun-if-env-changed={config_env_var_name}");
    serde_json::from_reader(Cursor::new(config_str))
      .map(Some)
      .expect("failed to parse configuration")
  } else {
    None
  }
}

pub struct Builder<'a> {
  commands: &'a [&'static str],
  global_scope_schema: Option<schemars::schema::RootSchema>,
  global_api_script_path: Option<PathBuf>,
  android_path: Option<PathBuf>,
  ios_path: Option<PathBuf>,
}

impl<'a> Builder<'a> {
  pub fn new(commands: &'a [&'static str]) -> Self {
    Self {
      commands,
      global_scope_schema: None,
      global_api_script_path: None,
      android_path: None,
      ios_path: None,
    }
  }

  /// Sets the global scope JSON schema.
  pub fn global_scope_schema(mut self, schema: schemars::schema::RootSchema) -> Self {
    self.global_scope_schema.replace(schema);
    self
  }

  /// Sets the path to the script that is injected in the webview when the `withGlobalTauri` configuration is set to true.
  ///
  /// This is usually an IIFE that injects the plugin API JavaScript bindings to `window.__TAURI__`.
  pub fn global_api_script_path<P: Into<PathBuf>>(mut self, path: P) -> Self {
    self.global_api_script_path.replace(path.into());
    self
  }

  /// Sets the Android project path.
  pub fn android_path<P: Into<PathBuf>>(mut self, android_path: P) -> Self {
    self.android_path.replace(android_path.into());
    self
  }

  /// Sets the iOS project path.
  pub fn ios_path<P: Into<PathBuf>>(mut self, ios_path: P) -> Self {
    self.ios_path.replace(ios_path.into());
    self
  }

  /// [`Self::try_build`] but will exit automatically if an error is found.
  pub fn build(self) {
    if let Err(error) = self.try_build() {
      println!("{}: {error:#}", env!("CARGO_PKG_NAME"));
      std::process::exit(1);
    }
  }

  /// Ensure this crate is properly configured to be a Tauri plugin.
  ///
  /// # Errors
  ///
  /// Errors will occur if environmental variables expected to be set inside of [build scripts]
  /// are not found, or if the crate violates Tauri plugin conventions.
  pub fn try_build(self) -> Result<()> {
    // convention: plugin names should not use underscores
    let name = build_var("CARGO_PKG_NAME")?;
    if name.contains('_') {
      anyhow::bail!("plugin names cannot contain underscores");
    }

    let out_dir = PathBuf::from(build_var("OUT_DIR")?);

    // requirement: links MUST be set and MUST match the name
    let _links = std::env::var("CARGO_MANIFEST_LINKS").map_err(|_| Error::LinksMissing)?;

    let autogenerated = Path::new("permissions").join(acl::build::AUTOGENERATED_FOLDER_NAME);
    let commands_dir = autogenerated.join("commands");

    std::fs::create_dir_all(&autogenerated).expect("unable to create permissions dir");

    if !self.commands.is_empty() {
      acl::build::autogenerate_command_permissions(&commands_dir, self.commands, "", true);
    }

    println!("cargo:rerun-if-changed=permissions");
    let permissions =
      acl::build::define_permissions("./permissions/**/*.*", &name, &out_dir, |_| true)?;

    if permissions.is_empty() {
      let _ = std::fs::remove_file(format!(
        "./permissions/{}/{}",
        acl::build::PERMISSION_SCHEMAS_FOLDER_NAME,
        acl::PERMISSION_SCHEMA_FILE_NAME
      ));
      let _ = std::fs::remove_file(autogenerated.join(acl::build::PERMISSION_DOCS_FILE_NAME));
    } else {
      acl::build::generate_schema(&permissions, "./permissions")?;
      acl::build::generate_docs(&permissions, &autogenerated, &name.strip_prefix("tauri-plugin-").unwrap_or(&name))?;
    }

    if let Some(global_scope_schema) = self.global_scope_schema {
      acl::build::define_global_scope_schema(global_scope_schema, &name, &out_dir)?;
    }

    if let Some(path) = self.global_api_script_path {
      tauri_utils::plugin::define_global_api_script_path(path);
    }

    mobile::setup(self.android_path, self.ios_path)?;

    Ok(())
  }
}

fn cfg_alias(alias: &str, has_feature: bool) {
  println!("cargo:rustc-check-cfg=cfg({alias})");
  if has_feature {
    println!("cargo:rustc-cfg={alias}");
  }
}

/// Grab an env var that is expected to be set inside of build scripts.
fn build_var(key: &'static str) -> Result<String, Error> {
  std::env::var(key).map_err(|_| Error::BuildVar(key))
}

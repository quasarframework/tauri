// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use cargo_mobile::{
  apple::{
    config::{
      Config as AppleConfig, Metadata as AppleMetadata, Platform as ApplePlatform,
      Raw as RawAppleConfig,
    },
    device::{Device, RunError},
    ios_deploy,
    target::{CompileLibError, Target},
  },
  config::app::App,
  device::PromptError,
  env::{Env, Error as EnvError},
  opts::NoiseLevel,
  os, util,
  util::prompt,
};
use clap::{Parser, Subcommand};

use super::{
  ensure_init, env, get_app,
  init::{command as init_command, init_dot_cargo, Options as InitOptions},
  log_finished, read_options, CliOptions, Target as MobileTarget,
};
use crate::{
  helpers::config::{get as get_tauri_config, Config as TauriConfig},
  Result,
};

use std::path::PathBuf;

mod build;
mod dev;
mod open;
pub(crate) mod project;
mod xcode_script;

#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  EnvInitFailed(#[from] EnvError),
  #[error(transparent)]
  InitDotCargo(super::init::Error),
  #[error("invalid tauri configuration: {0}")]
  InvalidTauriConfig(String),
  #[error("{0}")]
  ProjectNotInitialized(String),
  #[error(transparent)]
  OpenFailed(os::OpenFileError),
  #[error("{0}")]
  DevFailed(String),
  #[error("{0}")]
  BuildFailed(String),
  #[error(transparent)]
  NoHomeDir(util::NoHomeDir),
  #[error("SDK root provided by Xcode was invalid. {sdk_root} doesn't exist or isn't a directory")]
  SdkRootInvalid { sdk_root: PathBuf },
  #[error("Include dir was invalid. {include_dir} doesn't exist or isn't a directory")]
  IncludeDirInvalid { include_dir: PathBuf },
  #[error("macOS SDK root was invalid. {macos_sdk_root} doesn't exist or isn't a directory")]
  MacosSdkRootInvalid { macos_sdk_root: PathBuf },
  #[error("Arch specified by Xcode was invalid. {arch} isn't a known arch")]
  ArchInvalid { arch: String },
  #[error(transparent)]
  CompileLibFailed(CompileLibError),
  #[error(transparent)]
  FailedToPromptForDevice(PromptError<ios_deploy::DeviceListError>),
  #[error(transparent)]
  RunFailed(RunError),
  #[error("{0}")]
  TargetInvalid(String),
}

#[derive(Parser)]
#[clap(
  author,
  version,
  about = "iOS commands",
  subcommand_required(true),
  arg_required_else_help(true)
)]
pub struct Cli {
  #[clap(subcommand)]
  command: Commands,
}

#[derive(Subcommand)]
enum Commands {
  Init(InitOptions),
  Open,
  Dev(dev::Options),
  Build(build::Options),
  #[clap(hide(true))]
  XcodeScript(xcode_script::Options),
}

pub fn command(cli: Cli, verbosity: usize) -> Result<()> {
  let noise_level = NoiseLevel::from_occurrences(verbosity as u64);
  match cli.command {
    Commands::Init(options) => init_command(options, MobileTarget::Ios)?,
    Commands::Open => open::command()?,
    Commands::Dev(options) => dev::command(options, noise_level)?,
    Commands::Build(options) => build::command(options, noise_level)?,
    Commands::XcodeScript(options) => xcode_script::command(options)?,
  }

  Ok(())
}

pub fn get_config(
  config: &TauriConfig,
  cli_options: &CliOptions,
) -> (App, AppleConfig, AppleMetadata) {
  let app = get_app(config);
  let ios_options = cli_options.clone();

  let raw = RawAppleConfig {
    development_team: std::env::var("TAURI_APPLE_DEVELOPMENT_TEAM")
        .ok()
        .or_else(|| config.tauri.ios.development_team.clone())
        .expect("you must set `tauri > iOS > developmentTeam` config value or the `TAURI_APPLE_DEVELOPMENT_TEAM` environment variable"),
    ios_features: ios_options.features.clone(),
    bundle_version: config.package.version.clone(),
    bundle_version_short: config.package.version.clone(),
    ..Default::default()
  };
  let config = AppleConfig::from_raw(app.clone(), Some(raw)).unwrap();

  let metadata = AppleMetadata {
    supported: true,
    ios: ApplePlatform {
      cargo_args: Some(ios_options.args),
      features: ios_options.features,
      ..Default::default()
    },
    macos: Default::default(),
  };

  (app, config, metadata)
}

fn with_config<T>(
  cli_options: Option<CliOptions>,
  f: impl FnOnce(&App, &AppleConfig, &AppleMetadata, CliOptions) -> Result<T, Error>,
) -> Result<T, Error> {
  let (app, config, metadata, cli_options) = {
    let tauri_config =
      get_tauri_config(None).map_err(|e| Error::InvalidTauriConfig(e.to_string()))?;
    let tauri_config_guard = tauri_config.lock().unwrap();
    let tauri_config_ = tauri_config_guard.as_ref().unwrap();
    let cli_options = cli_options.unwrap_or_else(|| read_options(tauri_config_, MobileTarget::Ios));
    let (app, config, metadata) = get_config(tauri_config_, &cli_options);
    (app, config, metadata, cli_options)
  };
  f(&app, &config, &metadata, cli_options)
}

fn device_prompt<'a>(env: &'_ Env) -> Result<Device<'a>, PromptError<ios_deploy::DeviceListError>> {
  let device_list =
    ios_deploy::device_list(env).map_err(|cause| PromptError::detection_failed("iOS", cause))?;
  if !device_list.is_empty() {
    let index = if device_list.len() > 1 {
      prompt::list(
        concat!("Detected ", "iOS", " devices"),
        device_list.iter(),
        "device",
        None,
        "Device",
      )
      .map_err(|cause| PromptError::prompt_failed("iOS", cause))?
    } else {
      0
    };
    let device = device_list.into_iter().nth(index).unwrap();
    println!(
      "Detected connected device: {} with target {:?}",
      device,
      device.target().triple,
    );
    Ok(device)
  } else {
    Err(PromptError::none_detected("iOS"))
  }
}

fn detect_target_ok<'a>(env: &Env) -> Option<&'a Target<'a>> {
  device_prompt(env).map(|device| device.target()).ok()
}

fn open_and_wait(config: &AppleConfig, env: &Env) -> ! {
  log::info!("Opening Xcode");
  if let Err(e) = os::open_file_with("Xcode", config.project_dir(), env) {
    log::error!("{}", e);
  }
  loop {
    std::thread::sleep(std::time::Duration::from_secs(24 * 60 * 60));
  }
}

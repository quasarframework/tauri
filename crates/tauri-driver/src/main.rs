// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

//! [![](https://github.com/tauri-apps/tauri/raw/dev/.github/splash.png)](https://tauri.app)
//!
//! Cross-platform WebDriver server for Tauri applications.
//!
//! This is a [WebDriver Intermediary Node](https://www.w3.org/TR/webdriver/#dfn-intermediary-nodes) that wraps the native WebDriver server for platforms that [Tauri](https://github.com/tauri-apps/tauri) supports. Your WebDriver client will connect to the running `tauri-driver` server, and `tauri-driver` will handle starting the native WebDriver server for you behind the scenes. It requires two separate ports to be used since two distinct [WebDriver Remote Ends](https://www.w3.org/TR/webdriver/#dfn-remote-ends) run.

#![doc(
  html_logo_url = "https://github.com/tauri-apps/tauri/raw/dev/.github/icon.png",
  html_favicon_url = "https://github.com/tauri-apps/tauri/raw/dev/.github/icon.png"
)]

#[cfg(not(target_os = "macos"))]
mod cli;
#[cfg(not(target_os = "macos"))]
mod server;
#[cfg(not(target_os = "macos"))]
mod webdriver;

#[cfg(target_os = "macos")]
fn main() {
  println!("tauri-driver is not supported on macOS");
  std::process::exit(1);
}

#[cfg(not(target_os = "macos"))]
fn main() {
  let args = pico_args::Arguments::from_env().into();

  // start the native webdriver on the port specified in args
  let mut driver = webdriver::native(&args);
  let driver = driver
    .spawn()
    .expect("error while running native webdriver");

  // start our webdriver intermediary node
  if let Err(e) = server::run(args, driver) {
    eprintln!("error while running server: {}", e);
    std::process::exit(1);
  }
}

// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use tao::dpi::PhysicalSize;

#[cfg(any(
  target_os = "linux",
  target_os = "dragonfly",
  target_os = "freebsd",
  target_os = "netbsd",
  target_os = "openbsd"
))]
mod linux;
#[cfg(target_os = "macos")]
mod macos;
#[cfg(windows)]
mod windows;

#[cfg(desktop)]
pub trait MonitorExt {
  /// Enable or disable the window
  ///
  /// ## Platform-specific:
  ///
  /// - **Android / iOS**: Unsupported.
  fn work_area(&self) -> PhysicalSize<u32>;
}

// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use tao::platform::unix::MonitorHandleExtUnix;

impl super::MonitorExt for tao::monitor::MonitorHandle {
  fn work_area(&self) -> tao::dpi::PhysicalSize<u32> {
    self.gdk_monitor().workarea()
  }
}

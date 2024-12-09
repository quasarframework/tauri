// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use gtk::prelude::MonitorExt;
use tao::{dpi::PhysicalSize, platform::unix::MonitorHandleExtUnix};

impl super::MonitorExt for tao::monitor::MonitorHandle {
  fn work_area(&self) -> PhysicalSize<u32> {
    let rect = self.gdk_monitor().workarea();
    PhysicalSize::new(rect.width(), rect.height())
  }
}

// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use tao::dpi::PhysicalSize;

impl super::MonitorExt for tao::monitor::MonitorHandle {
  fn get_work_area_size(&self) -> tao::dpi::PhysicalSize<u32> {
    use objc2_app_kit::NSScreen;
    use tao::platform::macos::MonitorHandleExtMacOS;
    if let Some(ns_screen) = target_monitor.ns_screen() {
      let ns_screen: &NSScreen = unsafe { &*ns_screen.cast() };
      let rect = ns_screen.visibleFrame();
      return TaoLogicalSize::new(rect.size.width, rect.size.height)
        .to_physical(target_monitor.scale_factor());
    }
    self.size()
  }
}

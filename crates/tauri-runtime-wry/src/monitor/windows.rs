// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use tao::dpi::PhysicalSize;

impl super::MonitorExt for tao::monitor::MonitorHandle {
  fn work_area(&self) -> tao::dpi::PhysicalSize<u32> {
    use tao::platform::windows::MonitorHandleExtWindows;
    use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, HMONITOR, MONITORINFO};
    let mut monitor_info = MONITORINFO {
      cbSize: std::mem::size_of::<MONITORINFO>() as u32,
      ..Default::default()
    };
    let status = unsafe { GetMonitorInfoW(HMONITOR(self.hmonitor() as _), &mut monitor_info) };
    if status.into() {
      return PhysicalSize::new(
        (monitor_info.rcWork.right - monitor_info.rcWork.left) as u32,
        (monitor_info.rcWork.bottom - monitor_info.rcWork.top) as u32,
      );
    }
    self.size()
  }
}

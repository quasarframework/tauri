// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

impl super::MonitorExt for tao::monitor::MonitorHandle {
  fn get_work_area_size(&self) -> tao::dpi::PhysicalSize<u32> {
    self.size()
  }
}

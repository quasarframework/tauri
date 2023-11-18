// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { CheckMenuItemOptions } from './menu/checkMenuItem'
import { SubmenuOptions } from './menu/submenu'
import { MenuItemOptions } from './menu/menuItem'
import { IconMenuItemOptions } from './menu/iconMenuItem'
import { PredefinedMenuItemOptions } from './menu/predefinedMenuItem'

export * from './menu/submenu'
export * from './menu/menuItem'
export * from './menu/menu'
export * from './menu/checkMenuItem'
export * from './menu/iconMenuItem'
export * from './menu/predefinedMenuItem'

/**
 * Menu types and utilities.
 *
 * This package is also accessible with `window.__TAURI__.menu` when [`build.withGlobalTauri`](https://tauri.app/v1/api/config/#buildconfig.withglobaltauri) in `tauri.conf.json` is set to `true`.
 * @module
 */

export type MenuItemKind =
  | MenuItemOptions
  | SubmenuOptions
  | IconMenuItemOptions
  | PredefinedMenuItemOptions
  | CheckMenuItemOptions

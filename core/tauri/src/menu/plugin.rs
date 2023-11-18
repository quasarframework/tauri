// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use std::{
  collections::HashMap,
  sync::{Mutex, MutexGuard},
};

use serde::{Deserialize, Serialize};
use tauri_runtime::window::dpi::Position;

use super::{sealed::ContextMenuBase, *};
use crate::{
  command,
  ipc::{channel::ChannelRef, Channel},
  plugin::{Builder, TauriPlugin},
  resources::{ResourceId, ResourceTable},
  AppHandle, IconDto, Manager, RunEvent, Runtime, State, Window,
};
use tauri_macros::do_menu_item;

#[derive(Deserialize, Serialize)]
pub(crate) enum ItemKind {
  Menu,
  MenuItem,
  Predefined,
  Submenu,
  Check,
  Icon,
}

#[derive(Deserialize)]
pub(crate) struct AboutMetadata {
  pub name: Option<String>,
  pub version: Option<String>,
  pub short_version: Option<String>,
  pub authors: Option<Vec<String>>,
  pub comments: Option<String>,
  pub copyright: Option<String>,
  pub license: Option<String>,
  pub website: Option<String>,
  pub website_label: Option<String>,
  pub credits: Option<String>,
  pub icon: Option<IconDto>,
}

impl From<AboutMetadata> for super::AboutMetadata {
  fn from(value: AboutMetadata) -> Self {
    Self {
      name: value.name,
      version: value.version,
      short_version: value.short_version,
      authors: value.authors,
      comments: value.comments,
      copyright: value.copyright,
      license: value.license,
      website: value.website,
      website_label: value.website_label,
      credits: value.credits,
      icon: value.icon.map(Into::into),
    }
  }
}

#[allow(clippy::large_enum_variant)]
#[derive(Deserialize)]
enum Predefined {
  Separator,
  Copy,
  Cut,
  Paste,
  SelectAll,
  Undo,
  Redo,
  Minimize,
  Maximize,
  Fullscreen,
  Hide,
  HideOthers,
  ShowAll,
  CloseWindow,
  Quit,
  About(Option<AboutMetadata>),
  Services,
}

#[derive(Deserialize)]
struct SubmenuPayload {
  id: Option<MenuId>,
  text: String,
  enabled: Option<bool>,
  items: Vec<MenuItemPayloadKind>,
}

impl SubmenuPayload {
  pub fn create_item<R: Runtime>(
    self,
    window: &Window<R>,
    resources_table: &MutexGuard<'_, ResourceTable>,
  ) -> crate::Result<Submenu<R>> {
    let mut builder = if let Some(id) = self.id {
      SubmenuBuilder::with_id(window, id, self.text)
    } else {
      SubmenuBuilder::new(window, self.text)
    };
    if let Some(enabled) = self.enabled {
      builder = builder.enabled(enabled);
    }
    for item in self.items {
      builder = item.with_item(window, resources_table, |i| Ok(builder.item(i)))?;
    }

    builder.build()
  }
}

#[derive(Deserialize)]
struct CheckMenuItemPayload {
  handler: Option<ChannelRef>,
  id: Option<MenuId>,
  text: String,
  checked: bool,
  enabled: Option<bool>,
  accelerator: Option<String>,
}

impl CheckMenuItemPayload {
  pub fn create_item<R: Runtime>(self, window: &Window<R>) -> CheckMenuItem<R> {
    let mut builder = if let Some(id) = self.id {
      CheckMenuItemBuilder::with_id(id, self.text)
    } else {
      CheckMenuItemBuilder::new(self.text)
    };
    if let Some(accelerator) = self.accelerator {
      builder = builder.accelerator(accelerator);
    }
    if let Some(enabled) = self.enabled {
      builder = builder.enabled(enabled);
    }

    let item = builder.checked(self.checked).build(window);

    if let Some(handler) = self.handler {
      let handler = Channel::from_ipc(window.clone(), handler.0);
      window
        .state::<MenuChannels>()
        .0
        .lock()
        .unwrap()
        .insert(item.id().clone(), handler);
    }

    item
  }
}

#[derive(Deserialize)]
#[serde(untagged)]
enum Icon {
  Native(NativeIcon),
  Icon(IconDto),
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct IconMenuItemPayload {
  handler: Option<ChannelRef>,
  id: Option<MenuId>,
  text: String,
  icon: Icon,
  enabled: Option<bool>,
  accelerator: Option<String>,
}

impl IconMenuItemPayload {
  pub fn create_item<R: Runtime>(self, window: &Window<R>) -> IconMenuItem<R> {
    let mut builder = if let Some(id) = self.id {
      IconMenuItemBuilder::with_id(id, self.text)
    } else {
      IconMenuItemBuilder::new(self.text)
    };
    if let Some(accelerator) = self.accelerator {
      builder = builder.accelerator(accelerator);
    }
    if let Some(enabled) = self.enabled {
      builder = builder.enabled(enabled);
    }
    builder = match self.icon {
      Icon::Native(native_icon) => builder.native_icon(native_icon),
      Icon::Icon(icon) => builder.icon(icon.into()),
    };

    let item = builder.build(window);

    if let Some(handler) = self.handler {
      let handler = Channel::from_ipc(window.clone(), handler.0);
      window
        .state::<MenuChannels>()
        .0
        .lock()
        .unwrap()
        .insert(item.id().clone(), handler);
    }

    item
  }
}

#[derive(Deserialize)]
struct MenuItemPayload {
  handler: Option<ChannelRef>,
  id: Option<MenuId>,
  text: String,
  enabled: Option<bool>,
  accelerator: Option<String>,
}

impl MenuItemPayload {
  pub fn create_item<R: Runtime>(self, window: &Window<R>) -> MenuItem<R> {
    let mut builder = if let Some(id) = self.id {
      MenuItemBuilder::with_id(id, self.text)
    } else {
      MenuItemBuilder::new(self.text)
    };
    if let Some(accelerator) = self.accelerator {
      builder = builder.accelerator(accelerator);
    }
    if let Some(enabled) = self.enabled {
      builder = builder.enabled(enabled);
    }

    let item = builder.build(window);

    if let Some(handler) = self.handler {
      let handler = Channel::from_ipc(window.clone(), handler.0);
      window
        .state::<MenuChannels>()
        .0
        .lock()
        .unwrap()
        .insert(item.id().clone(), handler);
    }

    item
  }
}

#[derive(Deserialize)]
struct PredefinedMenuItemPayload {
  item: Predefined,
  text: Option<String>,
}

impl PredefinedMenuItemPayload {
  pub fn create_item<R: Runtime>(self, window: &Window<R>) -> PredefinedMenuItem<R> {
    match self.item {
      Predefined::Separator => PredefinedMenuItem::separator(window),
      Predefined::Copy => PredefinedMenuItem::copy(window, self.text.as_deref()),
      Predefined::Cut => PredefinedMenuItem::cut(window, self.text.as_deref()),
      Predefined::Paste => PredefinedMenuItem::paste(window, self.text.as_deref()),
      Predefined::SelectAll => PredefinedMenuItem::select_all(window, self.text.as_deref()),
      Predefined::Undo => PredefinedMenuItem::undo(window, self.text.as_deref()),
      Predefined::Redo => PredefinedMenuItem::redo(window, self.text.as_deref()),
      Predefined::Minimize => PredefinedMenuItem::minimize(window, self.text.as_deref()),
      Predefined::Maximize => PredefinedMenuItem::maximize(window, self.text.as_deref()),
      Predefined::Fullscreen => PredefinedMenuItem::fullscreen(window, self.text.as_deref()),
      Predefined::Hide => PredefinedMenuItem::hide(window, self.text.as_deref()),
      Predefined::HideOthers => PredefinedMenuItem::hide_others(window, self.text.as_deref()),
      Predefined::ShowAll => PredefinedMenuItem::show_all(window, self.text.as_deref()),
      Predefined::CloseWindow => PredefinedMenuItem::close_window(window, self.text.as_deref()),
      Predefined::Quit => PredefinedMenuItem::quit(window, self.text.as_deref()),
      Predefined::About(metadata) => {
        PredefinedMenuItem::about(window, self.text.as_deref(), metadata.map(Into::into))
      }
      Predefined::Services => PredefinedMenuItem::services(window, self.text.as_deref()),
    }
  }
}

#[derive(Deserialize)]
#[serde(untagged)]
enum MenuItemPayloadKind {
  ExistingItem((ResourceId, ItemKind)),
  Predefined(PredefinedMenuItemPayload),
  Check(CheckMenuItemPayload),
  Submenu(SubmenuPayload),
  Icon(IconMenuItemPayload),
  MenuItem(MenuItemPayload),
}

impl MenuItemPayloadKind {
  pub fn with_item<T, R: Runtime, F: FnOnce(&dyn IsMenuItem<R>) -> crate::Result<T>>(
    self,
    window: &Window<R>,
    resources_table: &MutexGuard<'_, ResourceTable>,
    f: F,
  ) -> crate::Result<T> {
    match self {
      Self::ExistingItem((rid, kind)) => {
        do_menu_item!(resources_table, rid, kind, |i| f(&*i))
      }
      Self::Submenu(i) => f(&i.create_item(window, resources_table)?),
      Self::Predefined(i) => f(&i.create_item(window)),
      Self::Check(i) => f(&i.create_item(window)),
      Self::Icon(i) => f(&i.create_item(window)),
      Self::MenuItem(i) => f(&i.create_item(window)),
    }
  }
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct NewOptions {
  id: Option<MenuId>,
  text: Option<String>,
  enabled: Option<bool>,
  checked: Option<bool>,
  accelerator: Option<String>,
  #[serde(rename = "item")]
  predefined_item: Option<Predefined>,
  icon: Option<Icon>,
  items: Option<Vec<MenuItemPayloadKind>>,
}

#[command(root = "crate")]
fn new<R: Runtime>(
  app: AppHandle<R>,
  window: Window<R>,
  kind: ItemKind,
  options: Option<NewOptions>,
  channels: State<'_, MenuChannels>,
  handler: Channel,
) -> crate::Result<(ResourceId, MenuId)> {
  let options = options.unwrap_or_default();
  let mut resources_table = app.manager.resources_table();

  let (rid, id) = match kind {
    ItemKind::Menu => {
      let mut builder = MenuBuilder::new(&app);
      if let Some(id) = options.id {
        builder = builder.id(id);
      }
      if let Some(items) = options.items {
        for item in items {
          builder = item.with_item(&window, &resources_table, |i| Ok(builder.item(i)))?;
        }
      }
      let menu = builder.build()?;
      let id = menu.id().clone();
      let rid = resources_table.add(menu);

      (rid, id)
    }

    ItemKind::Submenu => {
      let submenu = SubmenuPayload {
        id: options.id,
        text: options.text.unwrap_or_default(),
        enabled: options.enabled,
        items: options.items.unwrap_or_default(),
      }
      .create_item(&window, &resources_table)?;
      let id = submenu.id().clone();
      let rid = resources_table.add(submenu);

      (rid, id)
    }

    ItemKind::MenuItem => {
      let item = MenuItemPayload {
        // handler managed in this function instead
        handler: None,
        id: options.id,
        text: options.text.unwrap_or_default(),
        enabled: options.enabled,
        accelerator: options.accelerator,
      }
      .create_item(&window);
      let id = item.id().clone();
      let rid = resources_table.add(item);
      (rid, id)
    }

    ItemKind::Predefined => {
      let item = PredefinedMenuItemPayload {
        item: options.predefined_item.unwrap(),
        text: options.text,
      }
      .create_item(&window);
      let id = item.id().clone();
      let rid = resources_table.add(item);
      (rid, id)
    }

    ItemKind::Check => {
      let item = CheckMenuItemPayload {
        // handler managed in this function instead
        handler: None,
        id: options.id,
        text: options.text.unwrap_or_default(),
        checked: options.checked.unwrap_or_default(),
        enabled: options.enabled,
        accelerator: options.accelerator,
      }
      .create_item(&window);
      let id = item.id().clone();
      let rid = resources_table.add(item);
      (rid, id)
    }

    ItemKind::Icon => {
      let item = IconMenuItemPayload {
        // handler managed in this function instead
        handler: None,
        id: options.id,
        text: options.text.unwrap_or_default(),
        icon: options.icon.unwrap_or(Icon::Native(NativeIcon::User)),
        enabled: options.enabled,
        accelerator: options.accelerator,
      }
      .create_item(&window);
      let id = item.id().clone();
      let rid = resources_table.add(item);
      (rid, id)
    }
  };

  channels.0.lock().unwrap().insert(id.clone(), handler);

  Ok((rid, id))
}

#[command(root = "crate")]
fn append<R: Runtime>(
  window: Window<R>,
  rid: ResourceId,
  kind: ItemKind,
  items: Vec<MenuItemPayloadKind>,
) -> crate::Result<()> {
  let resources_table = window.manager.resources_table();
  match kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| menu.append(i))?;
      }
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| submenu.append(i))?;
      }
    }
    _ => unreachable!(),
  };

  Ok(())
}

#[command(root = "crate")]
fn prepend<R: Runtime>(
  window: Window<R>,
  rid: ResourceId,
  kind: ItemKind,
  items: Vec<MenuItemPayloadKind>,
) -> crate::Result<()> {
  let resources_table = window.manager.resources_table();
  match kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| menu.prepend(i))?;
      }
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| submenu.prepend(i))?;
      }
    }
    _ => unreachable!(),
  };

  Ok(())
}

#[command(root = "crate")]
fn insert<R: Runtime>(
  window: Window<R>,
  rid: ResourceId,
  kind: ItemKind,
  items: Vec<MenuItemPayloadKind>,
  mut position: usize,
) -> crate::Result<()> {
  let resources_table = window.manager.resources_table();
  match kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| menu.insert(i, position))?;
        position += 1
      }
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(rid)?;
      for item in items {
        item.with_item(&window, &resources_table, |i| submenu.insert(i, position))?;
        position += 1
      }
    }
    _ => unreachable!(),
  };

  Ok(())
}

#[command(root = "crate")]
fn remove<R: Runtime>(
  app: AppHandle<R>,
  menu_rid: ResourceId,
  menu_kind: ItemKind,
  item: (ResourceId, ItemKind),
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  let (rid, kind) = item;
  match menu_kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(menu_rid)?;
      do_menu_item!(resources_table, rid, kind, |i| menu.remove(&*i))?;
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(menu_rid)?;
      do_menu_item!(resources_table, rid, kind, |i| submenu.remove(&*i))?;
    }
    _ => unreachable!(),
  };

  Ok(())
}

macro_rules! make_item_resource {
  ($resources_table:ident, $item:ident) => {{
    let id = $item.id().clone();
    let (rid, kind) = match $item {
      MenuItemKind::MenuItem(i) => ($resources_table.add(i), ItemKind::MenuItem),
      MenuItemKind::Submenu(i) => ($resources_table.add(i), ItemKind::Submenu),
      MenuItemKind::Predefined(i) => ($resources_table.add(i), ItemKind::Predefined),
      MenuItemKind::Check(i) => ($resources_table.add(i), ItemKind::Check),
      MenuItemKind::Icon(i) => ($resources_table.add(i), ItemKind::Icon),
    };
    (rid, id, kind)
  }};
}

#[command(root = "crate")]
fn remove_at<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
  position: usize,
) -> crate::Result<Option<(ResourceId, MenuId, ItemKind)>> {
  let mut resources_table = app.manager.resources_table();
  match kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(rid)?;
      if let Some(item) = menu.remove_at(position)? {
        return Ok(Some(make_item_resource!(resources_table, item)));
      }
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(rid)?;
      if let Some(item) = submenu.remove_at(position)? {
        return Ok(Some(make_item_resource!(resources_table, item)));
      }
    }
    _ => unreachable!(),
  };

  Ok(None)
}

#[command(root = "crate")]
fn items<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
) -> crate::Result<Vec<(ResourceId, MenuId, ItemKind)>> {
  let mut resources_table = app.manager.resources_table();
  let items = match kind {
    ItemKind::Menu => resources_table.get::<Menu<R>>(rid)?.items()?,
    ItemKind::Submenu => resources_table.get::<Submenu<R>>(rid)?.items()?,
    _ => unreachable!(),
  };

  Ok(
    items
      .into_iter()
      .map(|i| make_item_resource!(resources_table, i))
      .collect::<Vec<_>>(),
  )
}

#[command(root = "crate")]
fn get<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
  id: MenuId,
) -> crate::Result<Option<(ResourceId, MenuId, ItemKind)>> {
  let mut resources_table = app.manager.resources_table();
  match kind {
    ItemKind::Menu => {
      let menu = resources_table.get::<Menu<R>>(rid)?;
      if let Some(item) = menu.get(&id) {
        return Ok(Some(make_item_resource!(resources_table, item)));
      }
    }
    ItemKind::Submenu => {
      let submenu = resources_table.get::<Submenu<R>>(rid)?;
      if let Some(item) = submenu.get(&id) {
        return Ok(Some(make_item_resource!(resources_table, item)));
      }
    }
    _ => unreachable!(),
  };

  Ok(None)
}

#[command(root = "crate")]
async fn popup<R: Runtime>(
  app: AppHandle<R>,
  current_window: Window<R>,
  rid: ResourceId,
  kind: ItemKind,
  window: Option<String>,
  at: Option<Position>,
) -> crate::Result<()> {
  let window = window
    .map(|w| app.get_window(&w))
    .unwrap_or(Some(current_window));

  if let Some(window) = window {
    let resources_table = app.manager.resources_table();
    match kind {
      ItemKind::Menu => {
        let menu = resources_table.get::<Menu<R>>(rid)?;
        menu.popup_inner(window, at)?;
      }
      ItemKind::Submenu => {
        let submenu = resources_table.get::<Submenu<R>>(rid)?;
        submenu.popup_inner(window, at)?;
      }
      _ => unreachable!(),
    };
  }

  Ok(())
}

#[command(root = "crate")]
fn default<R: Runtime>(app: AppHandle<R>) -> crate::Result<(ResourceId, MenuId)> {
  let mut resources_table = app.manager.resources_table();
  let menu = Menu::default(&app)?;
  let id = menu.id().clone();
  let rid = resources_table.add(menu);
  Ok((rid, id))
}

#[command(root = "crate")]
async fn set_as_app_menu<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
) -> crate::Result<Option<(ResourceId, MenuId)>> {
  let mut resources_table = app.manager.resources_table();
  let menu = resources_table.get::<Menu<R>>(rid)?;
  if let Some(menu) = menu.set_as_app_menu()? {
    let id = menu.id().clone();
    let rid = resources_table.add(menu);
    return Ok(Some((rid, id)));
  }
  Ok(None)
}

#[command(root = "crate")]
async fn set_as_window_menu<R: Runtime>(
  app: AppHandle<R>,
  current_window: Window<R>,
  rid: ResourceId,
  window: Option<String>,
) -> crate::Result<Option<(ResourceId, MenuId)>> {
  let window = window
    .map(|w| app.get_window(&w))
    .unwrap_or(Some(current_window));

  if let Some(window) = window {
    let mut resources_table = app.manager.resources_table();
    let menu = resources_table.get::<Menu<R>>(rid)?;
    if let Some(menu) = menu.set_as_window_menu(&window)? {
      let id = menu.id().clone();
      let rid = resources_table.add(menu);
      return Ok(Some((rid, id)));
    }
  }
  Ok(None)
}

#[command(root = "crate")]
fn text<R: Runtime>(app: AppHandle<R>, rid: ResourceId, kind: ItemKind) -> crate::Result<String> {
  let resources_table = app.manager.resources_table();
  do_menu_item!(resources_table, rid, kind, |i| i.text())
}

#[command(root = "crate")]
fn set_text<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
  text: String,
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  do_menu_item!(resources_table, rid, kind, |i| i.set_text(text))
}

#[command(root = "crate")]
fn is_enabled<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
) -> crate::Result<bool> {
  let resources_table = app.manager.resources_table();
  do_menu_item!(resources_table, rid, kind, |i| i.is_enabled(), !Predefined)
}

#[command(root = "crate")]
fn set_enabled<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
  enabled: bool,
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  do_menu_item!(
    resources_table,
    rid,
    kind,
    |i| i.set_enabled(enabled),
    !Predefined
  )
}

#[command(root = "crate")]
fn set_accelerator<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  kind: ItemKind,
  accelerator: Option<String>,
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  do_menu_item!(
    resources_table,
    rid,
    kind,
    |i| i.set_accelerator(accelerator),
    !Predefined | !Submenu
  )
}

#[command(root = "crate")]
fn set_as_windows_menu_for_nsapp<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
) -> crate::Result<()> {
  #[cfg(target_os = "macos")]
  {
    let resources_table = app.manager.resources_table();
    let submenu = resources_table.get::<Submenu<R>>(rid)?;
    submenu.set_as_help_menu_for_nsapp()?;
  }

  let _ = rid;
  let _ = app;
  Ok(())
}

#[command(root = "crate")]
fn set_as_help_menu_for_nsapp<R: Runtime>(app: AppHandle<R>, rid: ResourceId) -> crate::Result<()> {
  #[cfg(target_os = "macos")]
  {
    let resources_table = app.manager.resources_table();
    let submenu = resources_table.get::<Submenu<R>>(rid)?;
    submenu.set_as_help_menu_for_nsapp()?;
  }

  let _ = rid;
  let _ = app;

  Ok(())
}

#[command(root = "crate")]
fn is_checked<R: Runtime>(app: AppHandle<R>, rid: ResourceId) -> crate::Result<bool> {
  let resources_table = app.manager.resources_table();
  let check_item = resources_table.get::<CheckMenuItem<R>>(rid)?;
  check_item.is_checked()
}

#[command(root = "crate")]
fn set_checked<R: Runtime>(app: AppHandle<R>, rid: ResourceId, checked: bool) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  let check_item = resources_table.get::<CheckMenuItem<R>>(rid)?;
  check_item.set_checked(checked)
}

#[command(root = "crate")]
fn set_icon<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  icon: Option<IconDto>,
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  let icon_item = resources_table.get::<IconMenuItem<R>>(rid)?;
  icon_item.set_icon(icon.map(Into::into))
}

#[command(root = "crate")]
fn set_native_icon<R: Runtime>(
  app: AppHandle<R>,
  rid: ResourceId,
  icon: Option<NativeIcon>,
) -> crate::Result<()> {
  let resources_table = app.manager.resources_table();
  let icon_item = resources_table.get::<IconMenuItem<R>>(rid)?;
  icon_item.set_native_icon(icon)
}

struct MenuChannels(Mutex<HashMap<MenuId, Channel>>);

pub(crate) fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("menu")
    .setup(|app, _api| {
      app.manage(MenuChannels(Mutex::default()));
      Ok(())
    })
    .on_event(|app, e| {
      if let RunEvent::MenuEvent(e) = e {
        if let Some(channel) = app.state::<MenuChannels>().0.lock().unwrap().get(&e.id) {
          let _ = channel.send(&e.id);
        }
      }
    })
    .invoke_handler(crate::generate_handler![
      new,
      append,
      prepend,
      insert,
      remove,
      remove_at,
      items,
      get,
      popup,
      default,
      set_as_app_menu,
      set_as_window_menu,
      text,
      set_text,
      is_enabled,
      set_enabled,
      set_accelerator,
      set_as_windows_menu_for_nsapp,
      set_as_help_menu_for_nsapp,
      is_checked,
      set_checked,
      set_icon,
      set_native_icon,
    ])
    .build()
}

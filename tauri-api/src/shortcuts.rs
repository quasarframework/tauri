use tauri_hotkey::{parse_hotkey, HotkeyManager};

/// The shortcut manager builder.
#[derive(Default)]
pub struct ShortcutManager(HotkeyManager);

impl ShortcutManager {
  /// Initializes a new instance of the shortcut manager.
  pub fn new() -> Self {
    Default::default()
  }

  /// Registers a new shortcut handler.
  pub fn register_shortcut<H: FnMut() + Send + 'static>(
    &mut self,
    shortcut: String,
    handler: H,
  ) -> crate::Result<()> {
    let hotkey = parse_hotkey(&shortcut)?;
    self.0.register(hotkey, handler)?;
    Ok(())
  }
}

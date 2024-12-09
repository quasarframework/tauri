---
tauri-bundler: 'patch:enhance'
---

The bundler now reads the `TAURI_BUNDLER_DMG_IGNORE_CI` env var to decide whether to check for `CI: true` when building DMG files.

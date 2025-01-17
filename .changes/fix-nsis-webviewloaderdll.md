---
tauri-bundler: 'patch:bug'
---

Fixed an issue leading to NSIS based installers to not contain the `WebView2Loader.dll` file when targetting `windows-gnu`.

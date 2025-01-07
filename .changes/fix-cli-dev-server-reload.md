---
tauri-cli: 'patch:bug'
'@tauri-apps/cli': 'patch:bug'
---

Fixed an issue that caused the built-in dev server to constantly refresh on Linux. This only affected users who do not have `devUrl` point to a URL.

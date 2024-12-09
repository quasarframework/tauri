---
"@tauri-apps/api": "patch:bug"
---

Removed the generic in the type of the callback function argument in `mockIPC` which prevented its proper use in tests using TypeScript.

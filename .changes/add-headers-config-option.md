---
"tauri-utils": 'minor:feat'
"tauri": 'minor:feat'
---
Adds a new configuration option `headers` under >app>security for the tauri configuration file. Headers defined there are added to every http response from tauri to the web view. This doesn't include IPC messages and error responses. The `Content-Security-Policy`(CSP) remains untouched and still is defined separately.

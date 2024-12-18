---
'tauri': patch:bug
---

Fixes #11955: a panic caused by an assert when the resource random id has been used already. The panic would result in this line:
`panic: assertion failed: removed_resource.is_none()`
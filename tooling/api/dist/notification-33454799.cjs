"use strict";var i=require("./tauri-7725a9e6.cjs"),t=require("./tauri-1ac190e6.cjs");function e(){return i.__awaiter(this,void 0,void 0,(function(){return i.__generator(this,(function(i){return"default"!==window.Notification.permission?[2,Promise.resolve("granted"===window.Notification.permission)]:[2,t.invokeTauriCommand({__tauriModule:"Notification",message:{cmd:"isNotificationPermissionGranted"}})]}))}))}function n(){return i.__awaiter(this,void 0,void 0,(function(){return i.__generator(this,(function(i){return[2,window.Notification.requestPermission()]}))}))}function o(i){"string"==typeof i?new window.Notification(i):new window.Notification(i.title,i)}var r=Object.freeze({__proto__:null,sendNotification:o,requestPermission:n,isPermissionGranted:e});exports.isPermissionGranted=e,exports.notification=r,exports.requestPermission=n,exports.sendNotification=o;

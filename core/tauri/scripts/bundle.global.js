"use strict";var __TAURI_IIFE__=(()=>{var L=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var ge=Object.getOwnPropertyNames;var he=Object.prototype.hasOwnProperty;var d=(i,e)=>{for(var t in e)L(i,t,{get:e[t],enumerable:!0})},ye=(i,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of ge(e))!he.call(i,s)&&s!==t&&L(i,s,{get:()=>e[s],enumerable:!(r=pe(e,s))||r.enumerable});return i};var fe=i=>ye(L({},"__esModule",{value:!0}),i);var Qt={};d(Qt,{app:()=>k,cli:()=>U,clipboard:()=>z,dialog:()=>I,event:()=>V,fs:()=>j,globalShortcut:()=>q,http:()=>$,invoke:()=>Kt,notification:()=>J,os:()=>ie,path:()=>K,process:()=>Q,shell:()=>Y,tauri:()=>R,updater:()=>X,window:()=>te});var k={};d(k,{getName:()=>we,getTauriVersion:()=>ve,getVersion:()=>Pe,hide:()=>Te,show:()=>Me});var R={};d(R,{convertFileSrc:()=>_e,invoke:()=>f,transformCallback:()=>c});function be(){return window.crypto.getRandomValues(new Uint32Array(1))[0]}function c(i,e=!1){let t=be(),r=`_${t}`;return Object.defineProperty(window,r,{value:s=>(e&&Reflect.deleteProperty(window,r),i?.(s)),writable:!1,configurable:!0}),t}async function f(i,e={}){return new Promise((t,r)=>{let s=c(l=>{t(l),Reflect.deleteProperty(window,`_${a}`)},!0),a=c(l=>{r(l),Reflect.deleteProperty(window,`_${s}`)},!0);window.__TAURI_IPC__({cmd:i,callback:s,error:a,...e})})}function _e(i,e="asset"){let t=encodeURIComponent(i);return navigator.userAgent.includes("Windows")?`https://${e}.localhost/${t}`:`${e}://localhost/${t}`}async function n(i){return f("tauri",i)}async function Pe(){return n({__tauriModule:"App",message:{cmd:"getAppVersion"}})}async function we(){return n({__tauriModule:"App",message:{cmd:"getAppName"}})}async function ve(){return n({__tauriModule:"App",message:{cmd:"getTauriVersion"}})}async function Me(){return n({__tauriModule:"App",message:{cmd:"show"}})}async function Te(){return n({__tauriModule:"App",message:{cmd:"hide"}})}var U={};d(U,{getMatches:()=>Oe});async function Oe(){return n({__tauriModule:"Cli",message:{cmd:"cliMatches"}})}var z={};d(z,{readText:()=>Ce,writeText:()=>Fe});async function Fe(i){return n({__tauriModule:"Clipboard",message:{cmd:"writeText",data:i}})}async function Ce(){return n({__tauriModule:"Clipboard",message:{cmd:"readText",data:null}})}var I={};d(I,{ask:()=>We,confirm:()=>Se,message:()=>De,open:()=>Ee,save:()=>Ae});async function Ee(i={}){return typeof i=="object"&&Object.freeze(i),n({__tauriModule:"Dialog",message:{cmd:"openDialog",options:i}})}async function Ae(i={}){return typeof i=="object"&&Object.freeze(i),n({__tauriModule:"Dialog",message:{cmd:"saveDialog",options:i}})}async function De(i,e){let t=typeof e=="string"?{title:e}:e;return n({__tauriModule:"Dialog",message:{cmd:"messageDialog",message:i.toString(),title:t?.title?.toString(),type:t?.type,buttonLabel:t?.okLabel?.toString()}})}async function We(i,e){let t=typeof e=="string"?{title:e}:e;return n({__tauriModule:"Dialog",message:{cmd:"askDialog",message:i.toString(),title:t?.title?.toString(),type:t?.type,buttonLabels:[t?.okLabel?.toString()??"Yes",t?.cancelLabel?.toString()??"No"]}})}async function Se(i,e){let t=typeof e=="string"?{title:e}:e;return n({__tauriModule:"Dialog",message:{cmd:"confirmDialog",message:i.toString(),title:t?.title?.toString(),type:t?.type,buttonLabels:[t?.okLabel?.toString()??"Ok",t?.cancelLabel?.toString()??"Cancel"]}})}var V={};d(V,{TauriEvent:()=>M,emit:()=>T,listen:()=>N,once:()=>H});async function ne(i,e){return n({__tauriModule:"Event",message:{cmd:"unlisten",event:i,eventId:e}})}async function w(i,e,t){await n({__tauriModule:"Event",message:{cmd:"emit",event:i,windowLabel:e,payload:t}})}async function b(i,e,t){return n({__tauriModule:"Event",message:{cmd:"listen",event:i,windowLabel:e,handler:c(t)}}).then(r=>async()=>ne(i,r))}async function v(i,e,t){return b(i,e,r=>{t(r),ne(i,r.id).catch(()=>{})})}var M=(u=>(u.WINDOW_RESIZED="tauri://resize",u.WINDOW_MOVED="tauri://move",u.WINDOW_CLOSE_REQUESTED="tauri://close-requested",u.WINDOW_CREATED="tauri://window-created",u.WINDOW_DESTROYED="tauri://destroyed",u.WINDOW_FOCUS="tauri://focus",u.WINDOW_BLUR="tauri://blur",u.WINDOW_SCALE_FACTOR_CHANGED="tauri://scale-change",u.WINDOW_THEME_CHANGED="tauri://theme-changed",u.WINDOW_FILE_DROP="tauri://file-drop",u.WINDOW_FILE_DROP_HOVER="tauri://file-drop-hover",u.WINDOW_FILE_DROP_CANCELLED="tauri://file-drop-cancelled",u.MENU="tauri://menu",u.CHECK_UPDATE="tauri://update",u.UPDATE_AVAILABLE="tauri://update-available",u.INSTALL_UPDATE="tauri://update-install",u.STATUS_UPDATE="tauri://update-status",u.DOWNLOAD_PROGRESS="tauri://update-download-progress",u))(M||{});async function N(i,e){return b(i,null,e)}async function H(i,e){return v(i,null,e)}async function T(i,e){return w(i,void 0,e)}var j={};d(j,{BaseDirectory:()=>O,Dir:()=>O,copyFile:()=>He,createDir:()=>Ie,exists:()=>qe,readBinaryFile:()=>Re,readDir:()=>ze,readTextFile:()=>Le,removeDir:()=>Ne,removeFile:()=>Ve,renameFile:()=>je,writeBinaryFile:()=>Ue,writeFile:()=>ke,writeTextFile:()=>ke});var O=(o=>(o[o.Audio=1]="Audio",o[o.Cache=2]="Cache",o[o.Config=3]="Config",o[o.Data=4]="Data",o[o.LocalData=5]="LocalData",o[o.Desktop=6]="Desktop",o[o.Document=7]="Document",o[o.Download=8]="Download",o[o.Executable=9]="Executable",o[o.Font=10]="Font",o[o.Home=11]="Home",o[o.Picture=12]="Picture",o[o.Public=13]="Public",o[o.Runtime=14]="Runtime",o[o.Template=15]="Template",o[o.Video=16]="Video",o[o.Resource=17]="Resource",o[o.App=18]="App",o[o.Log=19]="Log",o[o.Temp=20]="Temp",o[o.AppConfig=21]="AppConfig",o[o.AppData=22]="AppData",o[o.AppLocalData=23]="AppLocalData",o[o.AppCache=24]="AppCache",o[o.AppLog=25]="AppLog",o))(O||{});async function Le(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"readTextFile",path:i,options:e}})}async function Re(i,e={}){let t=await n({__tauriModule:"Fs",message:{cmd:"readFile",path:i,options:e}});return Uint8Array.from(t)}async function ke(i,e,t){typeof t=="object"&&Object.freeze(t),typeof i=="object"&&Object.freeze(i);let r={path:"",contents:""},s=t;return typeof i=="string"?r.path=i:(r.path=i.path,r.contents=i.contents),typeof e=="string"?r.contents=e??"":s=e,n({__tauriModule:"Fs",message:{cmd:"writeFile",path:r.path,contents:Array.from(new TextEncoder().encode(r.contents)),options:s}})}async function Ue(i,e,t){typeof t=="object"&&Object.freeze(t),typeof i=="object"&&Object.freeze(i);let r={path:"",contents:[]},s=t;return typeof i=="string"?r.path=i:(r.path=i.path,r.contents=i.contents),e&&"dir"in e?s=e:typeof i=="string"&&(r.contents=e??[]),n({__tauriModule:"Fs",message:{cmd:"writeFile",path:r.path,contents:Array.from(r.contents instanceof ArrayBuffer?new Uint8Array(r.contents):r.contents),options:s}})}async function ze(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"readDir",path:i,options:e}})}async function Ie(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"createDir",path:i,options:e}})}async function Ne(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"removeDir",path:i,options:e}})}async function He(i,e,t={}){return n({__tauriModule:"Fs",message:{cmd:"copyFile",source:i,destination:e,options:t}})}async function Ve(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"removeFile",path:i,options:e}})}async function je(i,e,t={}){return n({__tauriModule:"Fs",message:{cmd:"renameFile",oldPath:i,newPath:e,options:t}})}async function qe(i,e={}){return n({__tauriModule:"Fs",message:{cmd:"exists",path:i,options:e}})}var q={};d(q,{isRegistered:()=>Je,register:()=>Ge,registerAll:()=>$e,unregister:()=>Ke,unregisterAll:()=>Qe});async function Ge(i,e){return n({__tauriModule:"GlobalShortcut",message:{cmd:"register",shortcut:i,handler:c(e)}})}async function $e(i,e){return n({__tauriModule:"GlobalShortcut",message:{cmd:"registerAll",shortcuts:i,handler:c(e)}})}async function Je(i){return n({__tauriModule:"GlobalShortcut",message:{cmd:"isRegistered",shortcut:i}})}async function Ke(i){return n({__tauriModule:"GlobalShortcut",message:{cmd:"unregister",shortcut:i}})}async function Qe(){return n({__tauriModule:"GlobalShortcut",message:{cmd:"unregisterAll"}})}var $={};d($,{Body:()=>p,Client:()=>C,Response:()=>F,ResponseType:()=>re,fetch:()=>Ye,getClient:()=>se});var re=(r=>(r[r.JSON=1]="JSON",r[r.Text=2]="Text",r[r.Binary=3]="Binary",r))(re||{}),p=class{constructor(e,t){this.type=e,this.payload=t}static form(e){let t={},r=(s,a)=>{if(a!==null){let l;typeof a=="string"?l=a:a instanceof Uint8Array||Array.isArray(a)?l=Array.from(a):a instanceof File?l={file:a.name,mime:a.type,fileName:a.name}:typeof a.file=="string"?l={file:a.file,mime:a.mime,fileName:a.fileName}:l={file:Array.from(a.file),mime:a.mime,fileName:a.fileName},t[String(s)]=l}};if(e instanceof FormData)for(let[s,a]of e)r(s,a);else for(let[s,a]of Object.entries(e))r(s,a);return new p("Form",t)}static json(e){return new p("Json",e)}static text(e){return new p("Text",e)}static bytes(e){return new p("Bytes",Array.from(e instanceof ArrayBuffer?new Uint8Array(e):e))}},F=class{constructor(e){this.url=e.url,this.status=e.status,this.ok=this.status>=200&&this.status<300,this.headers=e.headers,this.rawHeaders=e.rawHeaders,this.data=e.data}},C=class{constructor(e){this.id=e}async drop(){return n({__tauriModule:"Http",message:{cmd:"dropClient",client:this.id}})}async request(e){let t=!e.responseType||e.responseType===1;return t&&(e.responseType=2),n({__tauriModule:"Http",message:{cmd:"httpRequest",client:this.id,options:e}}).then(r=>{let s=new F(r);if(t){try{s.data=JSON.parse(s.data)}catch(a){if(s.ok&&s.data==="")s.data={};else if(s.ok)throw Error(`Failed to parse response \`${s.data}\` as JSON: ${a};
              try setting the \`responseType\` option to \`ResponseType.Text\` or \`ResponseType.Binary\` if the API does not return a JSON response.`)}return s}return s})}async get(e,t){return this.request({method:"GET",url:e,...t})}async post(e,t,r){return this.request({method:"POST",url:e,body:t,...r})}async put(e,t,r){return this.request({method:"PUT",url:e,body:t,...r})}async patch(e,t){return this.request({method:"PATCH",url:e,...t})}async delete(e,t){return this.request({method:"DELETE",url:e,...t})}};async function se(i){return n({__tauriModule:"Http",message:{cmd:"createClient",options:i}}).then(e=>new C(e))}var G=null;async function Ye(i,e){return G===null&&(G=await se()),G.request({url:i,method:e?.method??"GET",...e})}var J={};d(J,{isPermissionGranted:()=>Ze,requestPermission:()=>Xe,sendNotification:()=>Be});async function Ze(){return window.Notification.permission!=="default"?Promise.resolve(window.Notification.permission==="granted"):n({__tauriModule:"Notification",message:{cmd:"isNotificationPermissionGranted"}})}async function Xe(){return window.Notification.requestPermission()}function Be(i){typeof i=="string"?new window.Notification(i):new window.Notification(i.title,i)}var K={};d(K,{BaseDirectory:()=>O,appCacheDir:()=>nt,appConfigDir:()=>ae,appDataDir:()=>tt,appDir:()=>et,appLocalDataDir:()=>it,appLogDir:()=>oe,audioDir:()=>rt,basename:()=>Dt,cacheDir:()=>st,configDir:()=>at,dataDir:()=>ot,delimiter:()=>Tt,desktopDir:()=>lt,dirname:()=>Et,documentDir:()=>ut,downloadDir:()=>dt,executableDir:()=>ct,extname:()=>At,fontDir:()=>mt,homeDir:()=>pt,isAbsolute:()=>Wt,join:()=>Ct,localDataDir:()=>gt,logDir:()=>vt,normalize:()=>Ft,pictureDir:()=>ht,publicDir:()=>yt,resolve:()=>Ot,resolveResource:()=>bt,resourceDir:()=>ft,runtimeDir:()=>_t,sep:()=>Mt,templateDir:()=>Pt,videoDir:()=>wt});function _(){return navigator.appVersion.includes("Win")}async function et(){return ae()}async function ae(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:21}})}async function tt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:22}})}async function it(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:23}})}async function nt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:24}})}async function rt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:1}})}async function st(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:2}})}async function at(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:3}})}async function ot(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:4}})}async function lt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:6}})}async function ut(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:7}})}async function dt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:8}})}async function ct(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:9}})}async function mt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:10}})}async function pt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:11}})}async function gt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:5}})}async function ht(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:12}})}async function yt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:13}})}async function ft(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:17}})}async function bt(i){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:i,directory:17}})}async function _t(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:14}})}async function Pt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:15}})}async function wt(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:16}})}async function vt(){return oe()}async function oe(){return n({__tauriModule:"Path",message:{cmd:"resolvePath",path:"",directory:25}})}var Mt=_()?"\\":"/",Tt=_()?";":":";async function Ot(...i){return n({__tauriModule:"Path",message:{cmd:"resolve",paths:i}})}async function Ft(i){return n({__tauriModule:"Path",message:{cmd:"normalize",path:i}})}async function Ct(...i){return n({__tauriModule:"Path",message:{cmd:"join",paths:i}})}async function Et(i){return n({__tauriModule:"Path",message:{cmd:"dirname",path:i}})}async function At(i){return n({__tauriModule:"Path",message:{cmd:"extname",path:i}})}async function Dt(i,e){return n({__tauriModule:"Path",message:{cmd:"basename",path:i,ext:e}})}async function Wt(i){return n({__tauriModule:"Path",message:{cmd:"isAbsolute",path:i}})}var Q={};d(Q,{exit:()=>St,relaunch:()=>xt});async function St(i=0){return n({__tauriModule:"Process",message:{cmd:"exit",exitCode:i}})}async function xt(){return n({__tauriModule:"Process",message:{cmd:"relaunch"}})}var Y={};d(Y,{Child:()=>E,Command:()=>P,EventEmitter:()=>g,open:()=>Rt});async function Lt(i,e,t=[],r){return typeof t=="object"&&Object.freeze(t),n({__tauriModule:"Shell",message:{cmd:"execute",program:e,args:t,options:r,onEventFn:c(i)}})}var g=class{constructor(){this.eventListeners=Object.create(null)}addListener(e,t){return this.on(e,t)}removeListener(e,t){return this.off(e,t)}on(e,t){return e in this.eventListeners?this.eventListeners[e].push(t):this.eventListeners[e]=[t],this}once(e,t){let r=(...s)=>{this.removeListener(e,r),t(...s)};return this.addListener(e,r)}off(e,t){return e in this.eventListeners&&(this.eventListeners[e]=this.eventListeners[e].filter(r=>r!==t)),this}removeAllListeners(e){return e?delete this.eventListeners[e]:this.eventListeners=Object.create(null),this}emit(e,...t){if(e in this.eventListeners){let r=this.eventListeners[e];for(let s of r)s(...t);return!0}return!1}listenerCount(e){return e in this.eventListeners?this.eventListeners[e].length:0}prependListener(e,t){return e in this.eventListeners?this.eventListeners[e].unshift(t):this.eventListeners[e]=[t],this}prependOnceListener(e,t){let r=(...s)=>{this.removeListener(e,r),t(...s)};return this.prependListener(e,r)}},E=class{constructor(e){this.pid=e}async write(e){return n({__tauriModule:"Shell",message:{cmd:"stdinWrite",pid:this.pid,buffer:typeof e=="string"?e:Array.from(e)}})}async kill(){return n({__tauriModule:"Shell",message:{cmd:"killChild",pid:this.pid}})}},P=class extends g{constructor(t,r=[],s){super();this.stdout=new g;this.stderr=new g;this.program=t,this.args=typeof r=="string"?[r]:r,this.options=s??{}}static sidecar(t,r=[],s){let a=new P(t,r,s);return a.options.sidecar=!0,a}async spawn(){return Lt(t=>{switch(t.event){case"Error":this.emit("error",t.payload);break;case"Terminated":this.emit("close",t.payload);break;case"Stdout":this.stdout.emit("data",t.payload);break;case"Stderr":this.stderr.emit("data",t.payload);break}},this.program,this.args,this.options).then(t=>new E(t))}async execute(){return new Promise((t,r)=>{this.on("error",r);let s=[],a=[];this.stdout.on("data",l=>{s.push(l)}),this.stderr.on("data",l=>{a.push(l)}),this.on("close",l=>{t({code:l.code,signal:l.signal,stdout:s.join(`
`),stderr:a.join(`
`)})}),this.spawn().catch(r)})}};async function Rt(i,e){return n({__tauriModule:"Shell",message:{cmd:"open",path:i,with:e}})}var X={};d(X,{checkUpdate:()=>Ut,installUpdate:()=>kt,onUpdaterEvent:()=>Z});async function Z(i){return N("tauri://update-status",e=>{i(e?.payload)})}async function kt(){let i;function e(){i&&i(),i=void 0}return new Promise((t,r)=>{function s(a){if(a.error){e(),r(a.error);return}a.status==="DONE"&&(e(),t())}Z(s).then(a=>{i=a}).catch(a=>{throw e(),a}),T("tauri://update-install").catch(a=>{throw e(),a})})}async function Ut(){let i;function e(){i&&i(),i=void 0}return new Promise((t,r)=>{function s(l){e(),t({manifest:l,shouldUpdate:!0})}function a(l){if(l.error){e(),r(l.error);return}l.status==="UPTODATE"&&(e(),t({shouldUpdate:!1}))}H("tauri://update-available",l=>{s(l?.payload)}).catch(l=>{throw e(),l}),Z(a).then(l=>{i=l}).catch(l=>{throw e(),l}),T("tauri://update").catch(l=>{throw e(),l})})}var te={};d(te,{CloseRequestedEvent:()=>x,LogicalPosition:()=>D,LogicalSize:()=>A,PhysicalPosition:()=>y,PhysicalSize:()=>h,UserAttentionType:()=>ue,WebviewWindow:()=>m,WebviewWindowHandle:()=>W,WindowManager:()=>S,appWindow:()=>B,availableMonitors:()=>Ht,currentMonitor:()=>It,getAll:()=>de,getCurrent:()=>zt,primaryMonitor:()=>Nt});var A=class{constructor(e,t){this.type="Logical";this.width=e,this.height=t}},h=class{constructor(e,t){this.type="Physical";this.width=e,this.height=t}toLogical(e){return new A(this.width/e,this.height/e)}},D=class{constructor(e,t){this.type="Logical";this.x=e,this.y=t}},y=class{constructor(e,t){this.type="Physical";this.x=e,this.y=t}toLogical(e){return new D(this.x/e,this.y/e)}},ue=(t=>(t[t.Critical=1]="Critical",t[t.Informational=2]="Informational",t))(ue||{});function zt(){return new m(window.__TAURI_METADATA__.__currentWindow.label,{skip:!0})}function de(){return window.__TAURI_METADATA__.__windows.map(i=>new m(i.label,{skip:!0}))}var le=["tauri://created","tauri://error"],W=class{constructor(e){this.label=e,this.listeners=Object.create(null)}async listen(e,t){return this._handleTauriEvent(e,t)?Promise.resolve(()=>{let r=this.listeners[e];r.splice(r.indexOf(t),1)}):b(e,this.label,t)}async once(e,t){return this._handleTauriEvent(e,t)?Promise.resolve(()=>{let r=this.listeners[e];r.splice(r.indexOf(t),1)}):v(e,this.label,t)}async emit(e,t){if(le.includes(e)){for(let r of this.listeners[e]||[])r({event:e,id:-1,windowLabel:this.label,payload:t});return Promise.resolve()}return w(e,this.label,t)}_handleTauriEvent(e,t){return le.includes(e)?(e in this.listeners?this.listeners[e].push(t):this.listeners[e]=[t],!0):!1}},S=class extends W{async scaleFactor(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"scaleFactor"}}}})}async innerPosition(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"innerPosition"}}}}).then(({x:e,y:t})=>new y(e,t))}async outerPosition(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"outerPosition"}}}}).then(({x:e,y:t})=>new y(e,t))}async innerSize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"innerSize"}}}}).then(({width:e,height:t})=>new h(e,t))}async outerSize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"outerSize"}}}}).then(({width:e,height:t})=>new h(e,t))}async isFullscreen(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isFullscreen"}}}})}async isMinimized(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isMinimized"}}}})}async isMaximized(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isMaximized"}}}})}async isDecorated(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isDecorated"}}}})}async isResizable(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isResizable"}}}})}async isMaximizable(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isMaximizable"}}}})}async isMinimizable(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isMinimizable"}}}})}async isClosable(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isClosable"}}}})}async isVisible(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isVisible"}}}})}async title(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"title"}}}})}async theme(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"theme"}}}})}async center(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"center"}}}})}async requestUserAttention(e){let t=null;return e&&(e===1?t={type:"Critical"}:t={type:"Informational"}),n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"requestUserAttention",payload:t}}}})}async setResizable(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setResizable",payload:e}}}})}async setMaximizable(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMaximizable",payload:e}}}})}async setMinimizable(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMinimizable",payload:e}}}})}async setClosable(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setClosable",payload:e}}}})}async setTitle(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setTitle",payload:e}}}})}async maximize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"maximize"}}}})}async unmaximize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"unmaximize"}}}})}async toggleMaximize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"toggleMaximize"}}}})}async minimize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"minimize"}}}})}async unminimize(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"unminimize"}}}})}async show(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"show"}}}})}async hide(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"hide"}}}})}async close(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"close"}}}})}async setDecorations(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setDecorations",payload:e}}}})}async setAlwaysOnTop(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setAlwaysOnTop",payload:e}}}})}async setContentProtected(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setContentProtected",payload:e}}}})}async setSize(e){if(!e||e.type!=="Logical"&&e.type!=="Physical")throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setSize",payload:{type:e.type,data:{width:e.width,height:e.height}}}}}})}async setMinSize(e){if(e&&e.type!=="Logical"&&e.type!=="Physical")throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMinSize",payload:e?{type:e.type,data:{width:e.width,height:e.height}}:null}}}})}async setMaxSize(e){if(e&&e.type!=="Logical"&&e.type!=="Physical")throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMaxSize",payload:e?{type:e.type,data:{width:e.width,height:e.height}}:null}}}})}async setPosition(e){if(!e||e.type!=="Logical"&&e.type!=="Physical")throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setPosition",payload:{type:e.type,data:{x:e.x,y:e.y}}}}}})}async setFullscreen(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setFullscreen",payload:e}}}})}async setFocus(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setFocus"}}}})}async setIcon(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setIcon",payload:{icon:typeof e=="string"?e:Array.from(e)}}}}})}async setSkipTaskbar(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setSkipTaskbar",payload:e}}}})}async setCursorGrab(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorGrab",payload:e}}}})}async setCursorVisible(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorVisible",payload:e}}}})}async setCursorIcon(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorIcon",payload:e}}}})}async setCursorPosition(e){if(!e||e.type!=="Logical"&&e.type!=="Physical")throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorPosition",payload:{type:e.type,data:{x:e.x,y:e.y}}}}}})}async setIgnoreCursorEvents(e){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setIgnoreCursorEvents",payload:e}}}})}async startDragging(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"startDragging"}}}})}async onResized(e){return this.listen("tauri://resize",t=>{t.payload=me(t.payload),e(t)})}async onMoved(e){return this.listen("tauri://move",t=>{t.payload=ce(t.payload),e(t)})}async onCloseRequested(e){return this.listen("tauri://close-requested",t=>{let r=new x(t);Promise.resolve(e(r)).then(()=>{if(!r.isPreventDefault())return this.close()})})}async onFocusChanged(e){let t=await this.listen("tauri://focus",s=>{e({...s,payload:!0})}),r=await this.listen("tauri://blur",s=>{e({...s,payload:!1})});return()=>{t(),r()}}async onScaleChanged(e){return this.listen("tauri://scale-change",e)}async onMenuClicked(e){return this.listen("tauri://menu",e)}async onFileDropEvent(e){let t=await this.listen("tauri://file-drop",a=>{e({...a,payload:{type:"drop",paths:a.payload}})}),r=await this.listen("tauri://file-drop-hover",a=>{e({...a,payload:{type:"hover",paths:a.payload}})}),s=await this.listen("tauri://file-drop-cancelled",a=>{e({...a,payload:{type:"cancel"}})});return()=>{t(),r(),s()}}async onThemeChanged(e){return this.listen("tauri://theme-changed",e)}},x=class{constructor(e){this._preventDefault=!1;this.event=e.event,this.windowLabel=e.windowLabel,this.id=e.id}preventDefault(){this._preventDefault=!0}isPreventDefault(){return this._preventDefault}},m=class extends S{constructor(e,t={}){super(e),t?.skip||n({__tauriModule:"Window",message:{cmd:"createWebview",data:{options:{label:e,...t}}}}).then(async()=>this.emit("tauri://created")).catch(async r=>this.emit("tauri://error",r))}static getByLabel(e){return de().some(t=>t.label===e)?new m(e,{skip:!0}):null}},B;"__TAURI_METADATA__"in window?B=new m(window.__TAURI_METADATA__.__currentWindow.label,{skip:!0}):(console.warn(`Could not find "window.__TAURI_METADATA__". The "appWindow" value will reference the "main" window label.
Note that this is not an issue if running this frontend on a browser instead of a Tauri window.`),B=new m("main",{skip:!0}));function ee(i){return i===null?null:{name:i.name,scaleFactor:i.scaleFactor,position:ce(i.position),size:me(i.size)}}function ce(i){return new y(i.x,i.y)}function me(i){return new h(i.width,i.height)}async function It(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"currentMonitor"}}}}).then(ee)}async function Nt(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"primaryMonitor"}}}}).then(ee)}async function Ht(){return n({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"availableMonitors"}}}}).then(i=>i.map(ee))}var ie={};d(ie,{EOL:()=>Vt,arch:()=>$t,platform:()=>jt,tempdir:()=>Jt,type:()=>Gt,version:()=>qt});var Vt=_()?`\r
`:`
`;async function jt(){return n({__tauriModule:"Os",message:{cmd:"platform"}})}async function qt(){return n({__tauriModule:"Os",message:{cmd:"version"}})}async function Gt(){return n({__tauriModule:"Os",message:{cmd:"osType"}})}async function $t(){return n({__tauriModule:"Os",message:{cmd:"arch"}})}async function Jt(){return n({__tauriModule:"Os",message:{cmd:"tempdir"}})}var Kt=f;return fe(Qt);})();
window.__TAURI__ = __TAURI_IIFE__

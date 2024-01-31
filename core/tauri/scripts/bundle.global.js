var __TAURI_IIFE__=function(e){"use strict";function t(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function n(e,t,n,i,r){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?r.call(e,n):r?r.value=n:t.set(e,n),n}var i,r;function a(e,t=!1){return window.__TAURI_INTERNALS__.transformCallback(e,t)}"function"==typeof SuppressedError&&SuppressedError;class s{constructor(){this.__TAURI_CHANNEL_MARKER__=!0,i.set(this,(()=>{})),this.id=a((e=>{t(this,i,"f").call(this,e)}))}set onmessage(e){n(this,i,e,"f")}get onmessage(){return t(this,i,"f")}toJSON(){return`__CHANNEL__:${this.id}`}}i=new WeakMap;class l{constructor(e,t,n){this.plugin=e,this.event=t,this.channelId=n}async unregister(){return o(`plugin:${this.plugin}|remove_listener`,{event:this.event,channelId:this.channelId})}}async function o(e,t={},n){return window.__TAURI_INTERNALS__.invoke(e,t,n)}class u{get rid(){return t(this,r,"f")}constructor(e){r.set(this,void 0),n(this,r,e,"f")}async close(){return o("plugin:resources|close",{rid:this.rid})}}r=new WeakMap;var c=Object.freeze({__proto__:null,Channel:s,PluginListener:l,Resource:u,addPluginListener:async function(e,t,n){const i=new s;return i.onmessage=n,o(`plugin:${e}|register_listener`,{event:t,handler:i}).then((()=>new l(e,t,i.id)))},convertFileSrc:function(e,t="asset"){return window.__TAURI_INTERNALS__.convertFileSrc(e,t)},invoke:o,transformCallback:a});var d,p=Object.freeze({__proto__:null,getName:async function(){return o("plugin:app|name")},getTauriVersion:async function(){return o("plugin:app|tauri_version")},getVersion:async function(){return o("plugin:app|version")},hide:async function(){return o("plugin:app|app_hide")},show:async function(){return o("plugin:app|app_show")}});async function h(e,t){await o("plugin:event|unlisten",{event:e,eventId:t})}async function y(e,t,n){const i=n?.target?n.target:{kind:"Any"};return o("plugin:event|listen",{event:e,target:i,handler:a(t)}).then((t=>async()=>h(e,t)))}async function w(e,t,n){return y(e,(n=>{t(n),h(e,n.id).catch((()=>{}))}),n)}async function g(e,t){await o("plugin:event|emit",{event:e,payload:t})}async function b(e,t,n){await o("plugin:event|emit_to",{target:e,event:t,payload:n})}!function(e){e.WINDOW_RESIZED="tauri://resize",e.WINDOW_MOVED="tauri://move",e.WINDOW_CLOSE_REQUESTED="tauri://close-requested",e.WINDOW_DESTROYED="tauri://destroyed",e.WINDOW_FOCUS="tauri://focus",e.WINDOW_BLUR="tauri://blur",e.WINDOW_SCALE_FACTOR_CHANGED="tauri://scale-change",e.WINDOW_THEME_CHANGED="tauri://theme-changed",e.WEBVIEW_CREATED="tauri://webview-created",e.WEBVIEW_FILE_DROP="tauri://file-drop",e.WEBVIEW_FILE_DROP_HOVER="tauri://file-drop-hover",e.WEBVIEW_FILE_DROP_CANCELLED="tauri://file-drop-cancelled"}(d||(d={}));var _=Object.freeze({__proto__:null,get TauriEvent(){return d},emit:g,emitTo:b,listen:y,once:w});class m{constructor(e,t){this.type="Logical",this.width=e,this.height=t}}class f{constructor(e,t){this.type="Physical",this.width=e,this.height=t}toLogical(e){return new m(this.width/e,this.height/e)}}class v{constructor(e,t){this.type="Logical",this.x=e,this.y=t}}class k{constructor(e,t){this.type="Physical",this.x=e,this.y=t}toLogical(e){return new v(this.x/e,this.y/e)}}var E,A,D=Object.freeze({__proto__:null,LogicalPosition:v,LogicalSize:m,PhysicalPosition:k,PhysicalSize:f});!function(e){e[e.Critical=1]="Critical",e[e.Informational=2]="Informational"}(E||(E={}));class P{constructor(e){this._preventDefault=!1,this.event=e.event,this.id=e.id}preventDefault(){this._preventDefault=!0}isPreventDefault(){return this._preventDefault}}function I(){return new T(window.__TAURI_INTERNALS__.metadata.currentWindow.label,{skip:!0})}function L(){return window.__TAURI_INTERNALS__.metadata.windows.map((e=>new T(e.label,{skip:!0})))}!function(e){e.None="none",e.Normal="normal",e.Indeterminate="indeterminate",e.Paused="paused",e.Error="error"}(A||(A={}));const S=["tauri://created","tauri://error"];class T{constructor(e,t={}){this.label=e,this.listeners=Object.create(null),t?.skip||o("plugin:window|create",{options:{...t,parent:"string"==typeof t.parent?t.parent:t.parent?.label,label:e}}).then((async()=>this.emit("tauri://created"))).catch((async e=>this.emit("tauri://error",e)))}static getByLabel(e){return L().find((t=>t.label===e))??null}static getCurrent(){return I()}static getAll(){return L()}static async getFocusedWindow(){for(const e of L())if(await e.isFocused())return e;return null}async listen(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):y(e,t,{target:{kind:"Window",label:this.label}})}async once(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):w(e,t,{target:{kind:"Window",label:this.label}})}async emit(e,t){if(S.includes(e)){for(const n of this.listeners[e]||[])n({event:e,id:-1,payload:t});return Promise.resolve()}return g(e,t)}async emitTo(e,t,n){if(S.includes(t)){for(const e of this.listeners[t]||[])e({event:t,id:-1,payload:n});return Promise.resolve()}return b(e,t,n)}_handleTauriEvent(e,t){return!!S.includes(e)&&(e in this.listeners?this.listeners[e].push(t):this.listeners[e]=[t],!0)}async scaleFactor(){return o("plugin:window|scale_factor",{label:this.label})}async innerPosition(){return o("plugin:window|inner_position",{label:this.label}).then((({x:e,y:t})=>new k(e,t)))}async outerPosition(){return o("plugin:window|outer_position",{label:this.label}).then((({x:e,y:t})=>new k(e,t)))}async innerSize(){return o("plugin:window|inner_size",{label:this.label}).then((({width:e,height:t})=>new f(e,t)))}async outerSize(){return o("plugin:window|outer_size",{label:this.label}).then((({width:e,height:t})=>new f(e,t)))}async isFullscreen(){return o("plugin:window|is_fullscreen",{label:this.label})}async isMinimized(){return o("plugin:window|is_minimized",{label:this.label})}async isMaximized(){return o("plugin:window|is_maximized",{label:this.label})}async isFocused(){return o("plugin:window|is_focused",{label:this.label})}async isDecorated(){return o("plugin:window|is_decorated",{label:this.label})}async isResizable(){return o("plugin:window|is_resizable",{label:this.label})}async isMaximizable(){return o("plugin:window|is_maximizable",{label:this.label})}async isMinimizable(){return o("plugin:window|is_minimizable",{label:this.label})}async isClosable(){return o("plugin:window|is_closable",{label:this.label})}async isVisible(){return o("plugin:window|is_visible",{label:this.label})}async title(){return o("plugin:window|title",{label:this.label})}async theme(){return o("plugin:window|theme",{label:this.label})}async center(){return o("plugin:window|center",{label:this.label})}async requestUserAttention(e){let t=null;return e&&(t=e===E.Critical?{type:"Critical"}:{type:"Informational"}),o("plugin:window|request_user_attention",{label:this.label,value:t})}async setResizable(e){return o("plugin:window|set_resizable",{label:this.label,value:e})}async setMaximizable(e){return o("plugin:window|set_maximizable",{label:this.label,value:e})}async setMinimizable(e){return o("plugin:window|set_minimizable",{label:this.label,value:e})}async setClosable(e){return o("plugin:window|set_closable",{label:this.label,value:e})}async setTitle(e){return o("plugin:window|set_title",{label:this.label,value:e})}async maximize(){return o("plugin:window|maximize",{label:this.label})}async unmaximize(){return o("plugin:window|unmaximize",{label:this.label})}async toggleMaximize(){return o("plugin:window|toggle_maximize",{label:this.label})}async minimize(){return o("plugin:window|minimize",{label:this.label})}async unminimize(){return o("plugin:window|unminimize",{label:this.label})}async show(){return o("plugin:window|show",{label:this.label})}async hide(){return o("plugin:window|hide",{label:this.label})}async close(){return o("plugin:window|close",{label:this.label})}async destroy(){return o("plugin:window|destroy",{label:this.label})}async setDecorations(e){return o("plugin:window|set_decorations",{label:this.label,value:e})}async setShadow(e){return o("plugin:window|set_shadow",{label:this.label,value:e})}async setEffects(e){return o("plugin:window|set_effects",{label:this.label,value:e})}async clearEffects(){return o("plugin:window|set_effects",{label:this.label,value:null})}async setAlwaysOnTop(e){return o("plugin:window|set_always_on_top",{label:this.label,value:e})}async setAlwaysOnBottom(e){return o("plugin:window|set_always_on_bottom",{label:this.label,value:e})}async setContentProtected(e){return o("plugin:window|set_content_protected",{label:this.label,value:e})}async setSize(e){if(!e||"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return o("plugin:window|set_size",{label:this.label,value:{type:e.type,data:{width:e.width,height:e.height}}})}async setMinSize(e){if(e&&"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return o("plugin:window|set_min_size",{label:this.label,value:e?{type:e.type,data:{width:e.width,height:e.height}}:null})}async setMaxSize(e){if(e&&"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return o("plugin:window|set_max_size",{label:this.label,value:e?{type:e.type,data:{width:e.width,height:e.height}}:null})}async setPosition(e){if(!e||"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return o("plugin:window|set_position",{label:this.label,value:{type:e.type,data:{x:e.x,y:e.y}}})}async setFullscreen(e){return o("plugin:window|set_fullscreen",{label:this.label,value:e})}async setFocus(){return o("plugin:window|set_focus",{label:this.label})}async setIcon(e){return o("plugin:window|set_icon",{label:this.label,value:"string"==typeof e?e:Array.from(e)})}async setSkipTaskbar(e){return o("plugin:window|set_skip_taskbar",{label:this.label,value:e})}async setCursorGrab(e){return o("plugin:window|set_cursor_grab",{label:this.label,value:e})}async setCursorVisible(e){return o("plugin:window|set_cursor_visible",{label:this.label,value:e})}async setCursorIcon(e){return o("plugin:window|set_cursor_icon",{label:this.label,value:e})}async setCursorPosition(e){if(!e||"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return o("plugin:window|set_cursor_position",{label:this.label,value:{type:e.type,data:{x:e.x,y:e.y}}})}async setIgnoreCursorEvents(e){return o("plugin:window|set_ignore_cursor_events",{label:this.label,value:e})}async startDragging(){return o("plugin:window|start_dragging",{label:this.label})}async startResizeDragging(e){return o("plugin:window|start_resize_dragging",{label:this.label,value:e})}async setProgressBar(e){return o("plugin:window|set_progress_bar",{label:this.label,value:e})}async setVisibleOnAllWorkspaces(e){return o("plugin:window|set_visible_on_all_workspaces",{label:this.label,value:e})}async onResized(e){return this.listen(d.WINDOW_RESIZED,(t=>{t.payload=R(t.payload),e(t)}))}async onMoved(e){return this.listen(d.WINDOW_MOVED,(t=>{t.payload=W(t.payload),e(t)}))}async onCloseRequested(e){return this.listen(d.WINDOW_CLOSE_REQUESTED,(t=>{const n=new P(t);Promise.resolve(e(n)).then((()=>{if(!n.isPreventDefault())return this.destroy()}))}))}async onFocusChanged(e){const t=await this.listen(d.WINDOW_FOCUS,(t=>{e({...t,payload:!0})})),n=await this.listen(d.WINDOW_BLUR,(t=>{e({...t,payload:!1})}));return()=>{t(),n()}}async onScaleChanged(e){return this.listen(d.WINDOW_SCALE_FACTOR_CHANGED,e)}async onThemeChanged(e){return this.listen(d.WINDOW_THEME_CHANGED,e)}}var C,x;function z(e){return null===e?null:{name:e.name,scaleFactor:e.scaleFactor,position:W(e.position),size:R(e.size)}}function W(e){return new k(e.x,e.y)}function R(e){return new f(e.width,e.height)}!function(e){e.AppearanceBased="appearanceBased",e.Light="light",e.Dark="dark",e.MediumLight="mediumLight",e.UltraDark="ultraDark",e.Titlebar="titlebar",e.Selection="selection",e.Menu="menu",e.Popover="popover",e.Sidebar="sidebar",e.HeaderView="headerView",e.Sheet="sheet",e.WindowBackground="windowBackground",e.HudWindow="hudWindow",e.FullScreenUI="fullScreenUI",e.Tooltip="tooltip",e.ContentBackground="contentBackground",e.UnderWindowBackground="underWindowBackground",e.UnderPageBackground="underPageBackground",e.Mica="mica",e.Blur="blur",e.Acrylic="acrylic",e.Tabbed="tabbed",e.TabbedDark="tabbedDark",e.TabbedLight="tabbedLight"}(C||(C={})),function(e){e.FollowsWindowActiveState="followsWindowActiveState",e.Active="active",e.Inactive="inactive"}(x||(x={}));var F=Object.freeze({__proto__:null,CloseRequestedEvent:P,get Effect(){return C},get EffectState(){return x},LogicalPosition:v,LogicalSize:m,PhysicalPosition:k,PhysicalSize:f,get ProgressBarStatus(){return A},get UserAttentionType(){return E},Window:T,availableMonitors:async function(){return o("plugin:window|available_monitors").then((e=>e.map(z)))},currentMonitor:async function(){return o("plugin:window|current_monitor").then(z)},getAll:L,getCurrent:I,primaryMonitor:async function(){return o("plugin:window|primary_monitor").then(z)}});function O(){return new U(I(),window.__TAURI_INTERNALS__.metadata.currentWebview.label,{skip:!0})}function N(){return window.__TAURI_INTERNALS__.metadata.webviews.map((e=>new U(T.getByLabel(e.windowLabel),e.label,{skip:!0})))}const M=["tauri://created","tauri://error"];class U{constructor(e,t,n){this.window=e,this.label=t,this.listeners=Object.create(null),n?.skip||o("plugin:webview|create_webview",{windowLabel:e.label,label:t,options:n}).then((async()=>this.emit("tauri://created"))).catch((async e=>this.emit("tauri://error",e)))}static getByLabel(e){return N().find((t=>t.label===e))??null}static getCurrent(){return O()}static getAll(){return N()}async listen(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):y(e,t,{target:{kind:"Webview",label:this.label}})}async once(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):w(e,t,{target:{kind:"Webview",label:this.label}})}async emit(e,t){if(M.includes(e)){for(const n of this.listeners[e]||[])n({event:e,id:-1,payload:t});return Promise.resolve()}return g(e,t)}async emitTo(e,t,n){if(M.includes(t)){for(const e of this.listeners[t]||[])e({event:t,id:-1,payload:n});return Promise.resolve()}return b(e,t,n)}_handleTauriEvent(e,t){return!!M.includes(e)&&(e in this.listeners?this.listeners[e].push(t):this.listeners[e]=[t],!0)}async position(){return o("plugin:webview|webview_position",{label:this.label}).then((({x:e,y:t})=>new k(e,t)))}async size(){return o("plugin:webview|webview_size",{label:this.label}).then((({width:e,height:t})=>new f(e,t)))}async close(){return o("plugin:webview|close",{label:this.label})}async setSize(e){if(!e||"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return o("plugin:webview|set_webview_size",{label:this.label,value:{type:e.type,data:{width:e.width,height:e.height}}})}async setPosition(e){if(!e||"Logical"!==e.type&&"Physical"!==e.type)throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return o("plugin:webview|set_webview_position",{label:this.label,value:{type:e.type,data:{x:e.x,y:e.y}}})}async setFocus(){return o("plugin:webview|set_webview_focus",{label:this.label})}async onFileDropEvent(e){const t=await this.listen(d.WEBVIEW_FILE_DROP,(t=>{e({...t,payload:{type:"drop",paths:t.payload.paths,position:B(t.payload.position)}})})),n=await this.listen(d.WEBVIEW_FILE_DROP_HOVER,(t=>{e({...t,payload:{type:"hover",paths:t.payload.paths,position:B(t.payload.position)}})})),i=await this.listen(d.WEBVIEW_FILE_DROP_CANCELLED,(t=>{e({...t,payload:{type:"cancel"}})}));return()=>{t(),n(),i()}}}function B(e){return new k(e.x,e.y)}class V{constructor(e,t={}){this.label=e,this.listeners=Object.create(null),t?.skip||o("plugin:webview|create_webview_window",{options:{...t,parent:"string"==typeof t.parent?t.parent:t.parent?.label,label:e}}).then((async()=>this.emit("tauri://created"))).catch((async e=>this.emit("tauri://error",e)))}static getByLabel(e){const t=N().find((t=>t.label===e))??null;return t?new V(t.label,{skip:!0}):null}static getCurrent(){const e=O();return new V(e.label,{skip:!0})}static getAll(){return N().map((e=>new V(e.label,{skip:!0})))}async listen(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):y(e,t,{target:{kind:"WebviewWindow",label:this.label}})}async once(e,t){return this._handleTauriEvent(e,t)?Promise.resolve((()=>{const n=this.listeners[e];n.splice(n.indexOf(t),1)})):w(e,t,{target:{kind:"WebviewWindow",label:this.label}})}}var j,H;j=V,H=[T,U],(Array.isArray(H)?H:[H]).forEach((e=>{Object.getOwnPropertyNames(e.prototype).forEach((t=>{"object"==typeof j.prototype&&j.prototype&&t in j.prototype||Object.defineProperty(j.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)??Object.create(null))}))}));var G,q=Object.freeze({__proto__:null,Webview:U,WebviewWindow:V,getAll:N,getCurrent:O});!function(e){e[e.Audio=1]="Audio",e[e.Cache=2]="Cache",e[e.Config=3]="Config",e[e.Data=4]="Data",e[e.LocalData=5]="LocalData",e[e.Document=6]="Document",e[e.Download=7]="Download",e[e.Picture=8]="Picture",e[e.Public=9]="Public",e[e.Video=10]="Video",e[e.Resource=11]="Resource",e[e.Temp=12]="Temp",e[e.AppConfig=13]="AppConfig",e[e.AppData=14]="AppData",e[e.AppLocalData=15]="AppLocalData",e[e.AppCache=16]="AppCache",e[e.AppLog=17]="AppLog",e[e.Desktop=18]="Desktop",e[e.Executable=19]="Executable",e[e.Font=20]="Font",e[e.Home=21]="Home",e[e.Runtime=22]="Runtime",e[e.Template=23]="Template"}(G||(G={}));var Q=Object.freeze({__proto__:null,get BaseDirectory(){return G},appCacheDir:async function(){return o("plugin:path|resolve_directory",{directory:G.AppCache})},appConfigDir:async function(){return o("plugin:path|resolve_directory",{directory:G.AppConfig})},appDataDir:async function(){return o("plugin:path|resolve_directory",{directory:G.AppData})},appLocalDataDir:async function(){return o("plugin:path|resolve_directory",{directory:G.AppLocalData})},appLogDir:async function(){return o("plugin:path|resolve_directory",{directory:G.AppLog})},audioDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Audio})},basename:async function(e,t){return o("plugin:path|basename",{path:e,ext:t})},cacheDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Cache})},configDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Config})},dataDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Data})},delimiter:function(){return window.__TAURI_INTERNALS__.plugins.path.delimiter},desktopDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Desktop})},dirname:async function(e){return o("plugin:path|dirname",{path:e})},documentDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Document})},downloadDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Download})},executableDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Executable})},extname:async function(e){return o("plugin:path|extname",{path:e})},fontDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Font})},homeDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Home})},isAbsolute:async function(e){return o("plugin:path|isAbsolute",{path:e})},join:async function(...e){return o("plugin:path|join",{paths:e})},localDataDir:async function(){return o("plugin:path|resolve_directory",{directory:G.LocalData})},normalize:async function(e){return o("plugin:path|normalize",{path:e})},pictureDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Picture})},publicDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Public})},resolve:async function(...e){return o("plugin:path|resolve",{paths:e})},resolveResource:async function(e){return o("plugin:path|resolve_directory",{directory:G.Resource,path:e})},resourceDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Resource})},runtimeDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Runtime})},sep:function(){return window.__TAURI_INTERNALS__.plugins.path.sep},tempDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Temp})},templateDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Template})},videoDir:async function(){return o("plugin:path|resolve_directory",{directory:G.Video})}});class $ extends u{constructor(e,t){super(e),this.id=t}static async new(e){e?.menu&&(e.menu=[e.menu.rid,e.menu.kind]),e?.icon&&(e.icon="string"==typeof e.icon?e.icon:Array.from(e.icon));const t=new s;return e?.action&&(t.onmessage=e.action,delete e.action),o("plugin:tray|new",{options:e??{},handler:t}).then((([e,t])=>new $(e,t)))}async setIcon(e){let t=null;return e&&(t="string"==typeof e?e:Array.from(e)),o("plugin:tray|set_icon",{rid:this.rid,icon:t})}async setMenu(e){return e&&(e=[e.rid,e.kind]),o("plugin:tray|set_menu",{rid:this.rid,menu:e})}async setTooltip(e){return o("plugin:tray|set_tooltip",{rid:this.rid,tooltip:e})}async setTitle(e){return o("plugin:tray|set_title",{rid:this.rid,title:e})}async setVisible(e){return o("plugin:tray|set_visible",{rid:this.rid,visible:e})}async setTempDirPath(e){return o("plugin:tray|set_temp_dir_path",{rid:this.rid,path:e})}async setIconAsTemplate(e){return o("plugin:tray|set_icon_as_template",{rid:this.rid,asTemplate:e})}async setMenuOnLeftClick(e){return o("plugin:tray|set_show_menu_on_left_click",{rid:this.rid,onLeft:e})}}var Z,J,K,Y=Object.freeze({__proto__:null,TrayIcon:$});function X(e){if("items"in e)e.items=e.items?.map((e=>"rid"in e?e:X(e)));else if("action"in e&&e.action){const t=new s;return t.onmessage=e.action,delete e.action,{...e,handler:t}}return e}async function ee(e,t){const n=new s;let i=null;return t&&"object"==typeof t&&("action"in t&&t.action&&(n.onmessage=t.action,delete t.action),"items"in t&&t.items&&(i=t.items.map((e=>"rid"in e?[e.rid,e.kind]:X(e))))),o("plugin:menu|new",{kind:e,options:t?{...t,items:i}:void 0,handler:n})}class te extends u{get id(){return t(this,Z,"f")}get kind(){return t(this,J,"f")}constructor(e,t,i){super(e),Z.set(this,void 0),J.set(this,void 0),n(this,Z,t,"f"),n(this,J,i,"f")}}Z=new WeakMap,J=new WeakMap;class ne extends te{constructor(e,t){super(e,t,"MenuItem")}static async new(e){return ee("MenuItem",e).then((([e,t])=>new ne(e,t)))}async text(){return o("plugin:menu|text",{rid:this.rid,kind:this.kind})}async setText(e){return o("plugin:menu|set_text",{rid:this.rid,kind:this.kind,text:e})}async isEnabled(){return o("plugin:menu|is_enabled",{rid:this.rid,kind:this.kind})}async setEnabled(e){return o("plugin:menu|set_enabled",{rid:this.rid,kind:this.kind,enabled:e})}async setAccelerator(e){return o("plugin:menu|set_accelerator",{rid:this.rid,kind:this.kind,accelerator:e})}}class ie extends te{constructor(e,t){super(e,t,"Check")}static async new(e){return ee("Check",e).then((([e,t])=>new ie(e,t)))}async text(){return o("plugin:menu|text",{rid:this.rid,kind:this.kind})}async setText(e){return o("plugin:menu|set_text",{rid:this.rid,kind:this.kind,text:e})}async isEnabled(){return o("plugin:menu|is_enabled",{rid:this.rid,kind:this.kind})}async setEnabled(e){return o("plugin:menu|set_enabled",{rid:this.rid,kind:this.kind,enabled:e})}async setAccelerator(e){return o("plugin:menu|set_accelerator",{rid:this.rid,kind:this.kind,accelerator:e})}async isChecked(){return o("plugin:menu|is_checked",{rid:this.rid})}async setChecked(e){return o("plugin:menu|set_checked",{rid:this.rid,checked:e})}}!function(e){e.Add="Add",e.Advanced="Advanced",e.Bluetooth="Bluetooth",e.Bookmarks="Bookmarks",e.Caution="Caution",e.ColorPanel="ColorPanel",e.ColumnView="ColumnView",e.Computer="Computer",e.EnterFullScreen="EnterFullScreen",e.Everyone="Everyone",e.ExitFullScreen="ExitFullScreen",e.FlowView="FlowView",e.Folder="Folder",e.FolderBurnable="FolderBurnable",e.FolderSmart="FolderSmart",e.FollowLinkFreestanding="FollowLinkFreestanding",e.FontPanel="FontPanel",e.GoLeft="GoLeft",e.GoRight="GoRight",e.Home="Home",e.IChatTheater="IChatTheater",e.IconView="IconView",e.Info="Info",e.InvalidDataFreestanding="InvalidDataFreestanding",e.LeftFacingTriangle="LeftFacingTriangle",e.ListView="ListView",e.LockLocked="LockLocked",e.LockUnlocked="LockUnlocked",e.MenuMixedState="MenuMixedState",e.MenuOnState="MenuOnState",e.MobileMe="MobileMe",e.MultipleDocuments="MultipleDocuments",e.Network="Network",e.Path="Path",e.PreferencesGeneral="PreferencesGeneral",e.QuickLook="QuickLook",e.RefreshFreestanding="RefreshFreestanding",e.Refresh="Refresh",e.Remove="Remove",e.RevealFreestanding="RevealFreestanding",e.RightFacingTriangle="RightFacingTriangle",e.Share="Share",e.Slideshow="Slideshow",e.SmartBadge="SmartBadge",e.StatusAvailable="StatusAvailable",e.StatusNone="StatusNone",e.StatusPartiallyAvailable="StatusPartiallyAvailable",e.StatusUnavailable="StatusUnavailable",e.StopProgressFreestanding="StopProgressFreestanding",e.StopProgress="StopProgress",e.TrashEmpty="TrashEmpty",e.TrashFull="TrashFull",e.User="User",e.UserAccounts="UserAccounts",e.UserGroup="UserGroup",e.UserGuest="UserGuest"}(K||(K={}));class re extends te{constructor(e,t){super(e,t,"Icon")}static async new(e){return ee("Icon",e).then((([e,t])=>new re(e,t)))}async text(){return o("plugin:menu|text",{rid:this.rid,kind:this.kind})}async setText(e){return o("plugin:menu|set_text",{rid:this.rid,kind:this.kind,text:e})}async isEnabled(){return o("plugin:menu|is_enabled",{rid:this.rid,kind:this.kind})}async setEnabled(e){return o("plugin:menu|set_enabled",{rid:this.rid,kind:this.kind,enabled:e})}async setAccelerator(e){return o("plugin:menu|set_accelerator",{rid:this.rid,kind:this.kind,accelerator:e})}async setIcon(e){return o("plugin:menu|set_icon",{rid:this.rid,icon:e})}}class ae extends te{constructor(e,t){super(e,t,"Predefined")}static async new(e){return ee("Predefined",e).then((([e,t])=>new ae(e,t)))}async text(){return o("plugin:menu|text",{rid:this.rid,kind:this.kind})}async setText(e){return o("plugin:menu|set_text",{rid:this.rid,kind:this.kind,text:e})}}function se([e,t,n]){switch(n){case"Submenu":return new le(e,t);case"Predefined":return new ae(e,t);case"Check":return new ie(e,t);case"Icon":return new re(e,t);default:return new ne(e,t)}}class le extends te{constructor(e,t){super(e,t,"Submenu")}static async new(e){return ee("Submenu",e).then((([e,t])=>new le(e,t)))}async text(){return o("plugin:menu|text",{rid:this.rid,kind:this.kind})}async setText(e){return o("plugin:menu|set_text",{rid:this.rid,kind:this.kind,text:e})}async isEnabled(){return o("plugin:menu|is_enabled",{rid:this.rid,kind:this.kind})}async setEnabled(e){return o("plugin:menu|set_enabled",{rid:this.rid,kind:this.kind,enabled:e})}async append(e){return o("plugin:menu|append",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e))})}async prepend(e){return o("plugin:menu|prepend",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e))})}async insert(e,t){return o("plugin:menu|insert",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e)),position:t})}async remove(e){return o("plugin:menu|remove",{rid:this.rid,kind:this.kind,item:[e.rid,e.kind]})}async removeAt(e){return o("plugin:menu|remove_at",{rid:this.rid,kind:this.kind,position:e}).then(se)}async items(){return o("plugin:menu|items",{rid:this.rid,kind:this.kind}).then((e=>e.map(se)))}async get(e){return o("plugin:menu|get",{rid:this.rid,kind:this.kind,id:e}).then((e=>e?se(e):null))}async popup(e,t){let n=null;return e&&(n={type:e instanceof k?"Physical":"Logical",data:e}),o("plugin:menu|popup",{rid:this.rid,kind:this.kind,window:t?.label??null,at:n})}async setAsWindowsMenuForNSApp(){return o("plugin:menu|set_as_windows_menu_for_nsapp",{rid:this.rid})}async setAsHelpMenuForNSApp(){return o("plugin:menu|set_as_help_menu_for_nsapp",{rid:this.rid})}}function oe([e,t,n]){switch(n){case"Submenu":return new le(e,t);case"Predefined":return new ae(e,t);case"Check":return new ie(e,t);case"Icon":return new re(e,t);default:return new ne(e,t)}}class ue extends te{constructor(e,t){super(e,t,"Menu")}static async new(e){return ee("Menu",e).then((([e,t])=>new ue(e,t)))}static async default(){return o("plugin:menu|create_default").then((([e,t])=>new ue(e,t)))}async append(e){return o("plugin:menu|append",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e))})}async prepend(e){return o("plugin:menu|prepend",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e))})}async insert(e,t){return o("plugin:menu|insert",{rid:this.rid,kind:this.kind,items:(Array.isArray(e)?e:[e]).map((e=>"rid"in e?[e.rid,e.kind]:e)),position:t})}async remove(e){return o("plugin:menu|remove",{rid:this.rid,kind:this.kind,item:[e.rid,e.kind]})}async removeAt(e){return o("plugin:menu|remove_at",{rid:this.rid,kind:this.kind,position:e}).then(oe)}async items(){return o("plugin:menu|items",{rid:this.rid,kind:this.kind}).then((e=>e.map(oe)))}async get(e){return o("plugin:menu|get",{rid:this.rid,kind:this.kind,id:e}).then((e=>e?oe(e):null))}async popup(e,t){let n=null;return e&&(n={type:e instanceof k?"Physical":"Logical",data:e}),o("plugin:menu|popup",{rid:this.rid,kind:this.kind,window:t?.label??null,at:n})}async setAsAppMenu(){return o("plugin:menu|set_as_app_menu",{rid:this.rid}).then((e=>e?new ue(e[0],e[1]):null))}async setAsWindowMenu(e){return o("plugin:menu|set_as_window_menu",{rid:this.rid,window:e?.label??null}).then((e=>e?new ue(e[0],e[1]):null))}}var ce=Object.freeze({__proto__:null,CheckMenuItem:ie,IconMenuItem:re,Menu:ue,MenuItem:ne,get NativeIcon(){return K},PredefinedMenuItem:ae,Submenu:le});return e.app=p,e.core=c,e.dpi=D,e.event=_,e.menu=ce,e.path=Q,e.tray=Y,e.webview=q,e.window=F,e}({});window.__TAURI__=__TAURI_IIFE__;

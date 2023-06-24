(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const p of a.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&i(p)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerpolicy&&(a.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?a.credentials="include":r.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();function $(){}function st(e){return e()}function Xe(){return Object.create(null)}function V(e){e.forEach(st)}function vt(e){return typeof e=="function"}function he(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let ke;function bt(e,t){return ke||(ke=document.createElement("a")),ke.href=t,e===ke.href}function yt(e){return Object.keys(e).length===0}function wt(e,...t){if(e==null)return $;const n=e.subscribe(...t);return n.unsubscribe?()=>n.unsubscribe():n}function kt(e,t,n){e.$$.on_destroy.push(wt(t,n))}function o(e,t){e.appendChild(t)}function k(e,t,n){e.insertBefore(t,n||null)}function w(e){e.parentNode.removeChild(e)}function Ye(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function f(e){return document.createElement(e)}function Et(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function Q(e){return document.createTextNode(e)}function g(){return Q(" ")}function lt(){return Q("")}function F(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function c(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function $t(e){return Array.from(e.childNodes)}function Lt(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}class xt{constructor(t=!1){this.is_svg=!1,this.is_svg=t,this.e=this.n=null}c(t){this.h(t)}m(t,n,i=null){this.e||(this.is_svg?this.e=Et(n.nodeName):this.e=f(n.nodeName),this.t=n,this.c(t)),this.i(i)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let n=0;n<this.n.length;n+=1)k(this.t,this.n[n],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(w)}}let de;function ue(e){de=e}function ct(){if(!de)throw new Error("Function called outside component initialization");return de}function xe(e){ct().$$.on_mount.push(e)}function at(e){ct().$$.on_destroy.push(e)}const ce=[],Ne=[],$e=[],Je=[],St=Promise.resolve();let Ie=!1;function Ot(){Ie||(Ie=!0,St.then(ut))}function We(e){$e.push(e)}const De=new Set;let Ee=0;function ut(){const e=de;do{for(;Ee<ce.length;){const t=ce[Ee];Ee++,ue(t),Tt(t.$$)}for(ue(null),ce.length=0,Ee=0;Ne.length;)Ne.pop()();for(let t=0;t<$e.length;t+=1){const n=$e[t];De.has(n)||(De.add(n),n())}$e.length=0}while(ce.length);for(;Je.length;)Je.pop()();Ie=!1,De.clear(),ue(e)}function Tt(e){if(e.fragment!==null){e.update(),V(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(We)}}const Le=new Set;let z;function Ct(){z={r:0,c:[],p:z}}function Dt(){z.r||V(z.c),z=z.p}function Ae(e,t){e&&e.i&&(Le.delete(e),e.i(t))}function Ke(e,t,n,i){if(e&&e.o){if(Le.has(e))return;Le.add(e),z.c.push(()=>{Le.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function Qe(e){e&&e.c()}function Me(e,t,n,i){const{fragment:r,on_mount:a,on_destroy:p,after_update:s}=e.$$;r&&r.m(t,n),i||We(()=>{const u=a.map(st).filter(vt);p?p.push(...u):V(u),e.$$.on_mount=[]}),s.forEach(We)}function Re(e,t){const n=e.$$;n.fragment!==null&&(V(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Nt(e,t){e.$$.dirty[0]===-1&&(ce.push(e),Ot(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Se(e,t,n,i,r,a,p,s=[-1]){const u=de;ue(e);const d=e.$$={fragment:null,ctx:null,props:a,update:$,not_equal:r,bound:Xe(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(u?u.$$.context:[])),callbacks:Xe(),dirty:s,skip_bound:!1,root:t.target||u.$$.root};p&&p(d.root);let E=!1;if(d.ctx=n?n(e,t.props||{},(v,S,...H)=>{const O=H.length?H[0]:S;return d.ctx&&r(d.ctx[v],d.ctx[v]=O)&&(!d.skip_bound&&d.bound[v]&&d.bound[v](O),E&&Nt(e,v)),S}):[],d.update(),E=!0,V(d.before_update),d.fragment=i?i(d.ctx):!1,t.target){if(t.hydrate){const v=$t(t.target);d.fragment&&d.fragment.l(v),v.forEach(w)}else d.fragment&&d.fragment.c();t.intro&&Ae(e.$$.fragment),Me(e,t.target,t.anchor,t.customElement),ut()}ue(u)}class Oe{$destroy(){Re(this,1),this.$destroy=$}$on(t,n){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!yt(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const K=[];function It(e,t=$){let n;const i=new Set;function r(s){if(he(e,s)&&(e=s,n)){const u=!K.length;for(const d of i)d[1](),K.push(d,e);if(u){for(let d=0;d<K.length;d+=2)K[d][0](K[d+1]);K.length=0}}}function a(s){r(s(e))}function p(s,u=$){const d=[s,u];return i.add(d),i.size===1&&(n=t(r)||$),s(e),()=>{i.delete(d),i.size===0&&(n(),n=null)}}return{set:r,update:a,subscribe:p}}function Wt(e){let t;return{c(){t=f("p"),t.innerHTML=`This is a demo of Tauri&#39;s API capabilities using the <code>@tauri-apps/api</code> package. It&#39;s used as the main validation app, serving as the test bed of our
  development process. In the future, this app will be used on Tauri&#39;s integration
  tests.`},m(n,i){k(n,t,i)},p:$,i:$,o:$,d(n){n&&w(t)}}}class At extends Oe{constructor(t){super(),Se(this,t,null,Wt,he,{})}}var Mt=Object.defineProperty,dt=(e,t)=>{for(var n in t)Mt(e,n,{get:t[n],enumerable:!0})},ft=(e,t,n)=>{if(!t.has(e))throw TypeError("Cannot "+n)},Ze=(e,t,n)=>(ft(e,t,"read from private field"),n?n.call(e):t.get(e)),Rt=(e,t,n)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,n)},Pt=(e,t,n,i)=>(ft(e,t,"write to private field"),i?i.call(e,n):t.set(e,n),n),Ht={};dt(Ht,{Channel:()=>ht,PluginListener:()=>mt,addPluginListener:()=>qt,convertFileSrc:()=>Ut,invoke:()=>P,transformCallback:()=>fe});function jt(){return window.crypto.getRandomValues(new Uint32Array(1))[0]}function fe(e,t=!1){let n=jt(),i=`_${n}`;return Object.defineProperty(window,i,{value:r=>(t&&Reflect.deleteProperty(window,i),e==null?void 0:e(r)),writable:!1,configurable:!0}),n}var ae,ht=class{constructor(){this.__TAURI_CHANNEL_MARKER__=!0,Rt(this,ae,()=>{}),this.id=fe(e=>{Ze(this,ae).call(this,e)})}set onmessage(e){Pt(this,ae,e)}get onmessage(){return Ze(this,ae)}toJSON(){return`__CHANNEL__:${this.id}`}};ae=new WeakMap;var mt=class{constructor(e,t,n){this.plugin=e,this.event=t,this.channelId=n}async unregister(){return P(`plugin:${this.plugin}|remove_listener`,{event:this.event,channelId:this.channelId})}};async function qt(e,t,n){let i=new ht;return i.onmessage=n,P(`plugin:${e}|register_listener`,{event:t,handler:i}).then(()=>new mt(e,t,i.id))}async function P(e,t={},n){return new Promise((i,r)=>{let a=fe(s=>{i(s),Reflect.deleteProperty(window,`_${p}`)},!0),p=fe(s=>{r(s),Reflect.deleteProperty(window,`_${a}`)},!0);console.log(e,n),window.__TAURI_IPC__({cmd:e,callback:a,error:p,payload:t,options:n})})}function Ut(e,t="asset"){let n=encodeURIComponent(e);return navigator.userAgent.includes("Windows")||navigator.userAgent.includes("Android")?`https://${t}.localhost/${n}`:`${t}://localhost/${n}`}var zt={};dt(zt,{TauriEvent:()=>pt,emit:()=>_t,listen:()=>Pe,once:()=>Ft});var pt=(e=>(e.WINDOW_RESIZED="tauri://resize",e.WINDOW_MOVED="tauri://move",e.WINDOW_CLOSE_REQUESTED="tauri://close-requested",e.WINDOW_CREATED="tauri://window-created",e.WINDOW_DESTROYED="tauri://destroyed",e.WINDOW_FOCUS="tauri://focus",e.WINDOW_BLUR="tauri://blur",e.WINDOW_SCALE_FACTOR_CHANGED="tauri://scale-change",e.WINDOW_THEME_CHANGED="tauri://theme-changed",e.WINDOW_FILE_DROP="tauri://file-drop",e.WINDOW_FILE_DROP_HOVER="tauri://file-drop-hover",e.WINDOW_FILE_DROP_CANCELLED="tauri://file-drop-cancelled",e.MENU="tauri://menu",e))(pt||{});async function gt(e,t){await P("plugin:event|unlisten",{event:e,eventId:t})}async function Pe(e,t,n){return P("plugin:event|listen",{event:e,windowLabel:n==null?void 0:n.target,handler:fe(t)}).then(i=>async()=>gt(e,i))}async function Ft(e,t,n){return Pe(e,i=>{t(i),gt(e,i.id).catch(()=>{})},n)}async function _t(e,t,n){await P("plugin:event|emit",{event:e,windowLabel:n==null?void 0:n.target,payload:t})}function Vt(e){let t,n,i,r,a,p,s,u;return{c(){t=f("div"),n=f("button"),n.textContent="Call Log API",i=g(),r=f("button"),r.textContent="Call Request (async) API",a=g(),p=f("button"),p.textContent="Send event to Rust",c(n,"class","btn"),c(n,"id","log"),c(r,"class","btn"),c(r,"id","request"),c(p,"class","btn"),c(p,"id","event")},m(d,E){k(d,t,E),o(t,n),o(t,i),o(t,r),o(t,a),o(t,p),s||(u=[F(n,"click",e[0]),F(r,"click",e[1]),F(p,"click",e[2])],s=!0)},p:$,i:$,o:$,d(d){d&&w(t),s=!1,V(u)}}}function Bt(e,t,n){let{onMessage:i}=t,r;xe(async()=>{r=await Pe("rust-event",i)}),at(()=>{r&&r()});function a(){P("log_operation",{event:"tauri-click",payload:"this payload is optional because we used Option in Rust"})}function p(){P("perform_request",{endpoint:"dummy endpoint arg",body:{id:5,name:"test"}}).then(i).catch(i)}function s(){_t("js-event","this is the payload string")}return e.$$set=u=>{"onMessage"in u&&n(3,i=u.onMessage)},[a,p,s,i]}class Gt extends Oe{constructor(t){super(),Se(this,t,Bt,Vt,he,{onMessage:3})}}function Xt(e){let t;return{c(){t=f("div"),t.innerHTML=`<div class="note-red grow">Not available for Linux</div> 
  <video id="localVideo" autoplay="" playsinline=""><track kind="captions"/></video>`,c(t,"class","flex flex-col gap-2")},m(n,i){k(n,t,i)},p:$,i:$,o:$,d(n){n&&w(t)}}}function Yt(e,t,n){let{onMessage:i}=t;const r=window.constraints={audio:!0,video:!0};function a(s){const u=document.querySelector("video"),d=s.getVideoTracks();i("Got stream with constraints:",r),i(`Using video device: ${d[0].label}`),window.stream=s,u.srcObject=s}function p(s){if(s.name==="ConstraintNotSatisfiedError"){const u=r.video;i(`The resolution ${u.width.exact}x${u.height.exact} px is not supported by your device.`)}else s.name==="PermissionDeniedError"&&i("Permissions have not been granted to use your camera and microphone, you need to allow the page access to your devices in order for the demo to work.");i(`getUserMedia error: ${s.name}`,s)}return xe(async()=>{try{const s=await navigator.mediaDevices.getUserMedia(r);a(s)}catch(s){p(s)}}),at(()=>{window.stream.getTracks().forEach(function(s){s.stop()})}),e.$$set=s=>{"onMessage"in s&&n(0,i=s.onMessage)},[i]}class Jt extends Oe{constructor(t){super(),Se(this,t,Yt,Xt,he,{onMessage:0})}}function et(e,t,n){const i=e.slice();return i[25]=t[n],i}function tt(e,t,n){const i=e.slice();return i[28]=t[n],i}function Kt(e){let t;return{c(){t=f("span"),c(t,"class","i-codicon-menu animate-duration-300ms animate-fade-in")},m(n,i){k(n,t,i)},d(n){n&&w(t)}}}function Qt(e){let t;return{c(){t=f("span"),c(t,"class","i-codicon-close animate-duration-300ms animate-fade-in")},m(n,i){k(n,t,i)},d(n){n&&w(t)}}}function Zt(e){let t,n;return{c(){t=Q(`Switch to Dark mode
        `),n=f("div"),c(n,"class","i-ph-moon")},m(i,r){k(i,t,r),k(i,n,r)},d(i){i&&w(t),i&&w(n)}}}function en(e){let t,n;return{c(){t=Q(`Switch to Light mode
        `),n=f("div"),c(n,"class","i-ph-sun")},m(i,r){k(i,t,r),k(i,n,r)},d(i){i&&w(t),i&&w(n)}}}function tn(e){let t,n,i,r,a=e[28].label+"",p,s,u,d;function E(){return e[14](e[28])}return{c(){t=f("a"),n=f("div"),i=g(),r=f("p"),p=Q(a),c(n,"class",e[28].icon+" mr-2"),c(t,"href","##"),c(t,"class",s="nv "+(e[1]===e[28]?"nv_selected":""))},m(v,S){k(v,t,S),o(t,n),o(t,i),o(t,r),o(r,p),u||(d=F(t,"click",E),u=!0)},p(v,S){e=v,S&2&&s!==(s="nv "+(e[1]===e[28]?"nv_selected":""))&&c(t,"class",s)},d(v){v&&w(t),u=!1,d()}}}function nt(e){let t,n=e[28]&&tn(e);return{c(){n&&n.c(),t=lt()},m(i,r){n&&n.m(i,r),k(i,t,r)},p(i,r){i[28]&&n.p(i,r)},d(i){n&&n.d(i),i&&w(t)}}}function it(e){let t,n=e[25].html+"",i;return{c(){t=new xt(!1),i=lt(),t.a=i},m(r,a){t.m(n,r,a),k(r,i,a)},p(r,a){a&16&&n!==(n=r[25].html+"")&&t.p(n)},d(r){r&&w(i),r&&t.d()}}}function nn(e){let t,n,i,r,a,p,s,u,d,E,v,S,H,O,Z,I,me,b,j,C,q,B,ee,te,pe,ge,m,_,D,W,A,ne,U=e[1].label+"",Te,He,_e,ie,y,je,N,ve,qe,G,be,Ue,re,ze,oe,se,Ce,Fe;function Ve(l,T){return l[0]?Qt:Kt}let ye=Ve(e),M=ye(e);function Be(l,T){return l[2]?en:Zt}let we=Be(e),R=we(e),X=e[5],L=[];for(let l=0;l<X.length;l+=1)L[l]=nt(tt(e,X,l));var Y=e[1].component;function Ge(l){return{props:{onMessage:l[9],insecureRenderHtml:l[10]}}}Y&&(y=new Y(Ge(e)));let J=e[4],x=[];for(let l=0;l<J.length;l+=1)x[l]=it(et(e,J,l));return{c(){t=f("div"),M.c(),n=g(),i=f("div"),r=f("aside"),a=f("img"),s=g(),u=f("a"),R.c(),d=g(),E=f("br"),v=g(),S=f("div"),H=g(),O=f("br"),Z=g(),I=f("a"),I.innerHTML=`Documentation
      <span class="i-codicon-link-external"></span>`,me=g(),b=f("a"),b.innerHTML=`GitHub
      <span class="i-codicon-link-external"></span>`,j=g(),C=f("a"),C.innerHTML=`Source
      <span class="i-codicon-link-external"></span>`,q=g(),B=f("br"),ee=g(),te=f("div"),pe=g(),ge=f("br"),m=g(),_=f("div");for(let l=0;l<L.length;l+=1)L[l].c();D=g(),W=f("main"),A=f("div"),ne=f("h1"),Te=Q(U),He=g(),_e=f("div"),ie=f("div"),y&&Qe(y.$$.fragment),je=g(),N=f("div"),ve=f("div"),qe=g(),G=f("div"),be=f("p"),be.textContent="Console",Ue=g(),re=f("div"),re.innerHTML='<div class="i-codicon-clear-all"></div>',ze=g(),oe=f("div");for(let l=0;l<x.length;l+=1)x[l].c();c(t,"id","sidebarToggle"),c(t,"class","z-2000 display-none lt-sm:flex justify-center items-center absolute top-2 left-2 w-8 h-8 rd-8 bg-accent dark:bg-darkAccent active:bg-accentDark dark:active:bg-darkAccentDark"),c(a,"class","self-center p-7 cursor-pointer"),bt(a.src,p="tauri_logo.png")||c(a,"src",p),c(a,"alt","Tauri logo"),c(u,"href","##"),c(u,"class","nv justify-between h-8"),c(S,"class","bg-white/5 h-2px"),c(I,"class","nv justify-between h-8"),c(I,"target","_blank"),c(I,"href","https://tauri.app/v1/guides/"),c(b,"class","nv justify-between h-8"),c(b,"target","_blank"),c(b,"href","https://github.com/tauri-apps/tauri"),c(C,"class","nv justify-between h-8"),c(C,"target","_blank"),c(C,"href","https://github.com/tauri-apps/tauri/tree/dev/examples/api"),c(te,"class","bg-white/5 h-2px"),c(_,"class","flex flex-col overflow-y-auto children-h-10 children-flex-none gap-1"),c(r,"id","sidebar"),c(r,"class","lt-sm:h-screen lt-sm:shadow-lg lt-sm:shadow lt-sm:transition-transform lt-sm:absolute lt-sm:z-1999 bg-darkPrimaryLighter transition-colors-250 overflow-hidden grid grid-rows-[min-content_auto] select-none px-2"),c(ie,"class","mr-2"),c(_e,"class","overflow-y-auto"),c(A,"class","px-5 overflow-hidden grid grid-rows-[auto_1fr]"),c(ve,"class","bg-black/20 h-2px cursor-ns-resize"),c(be,"class","font-semibold"),c(re,"class","cursor-pointer h-85% rd-1 p-1 flex justify-center items-center hover:bg-hoverOverlay dark:hover:bg-darkHoverOverlay active:bg-hoverOverlay/25 dark:active:bg-darkHoverOverlay/25 "),c(G,"class","flex justify-between items-center px-2"),c(oe,"class","px-2 overflow-y-auto all:font-mono code-block all:text-xs"),c(N,"id","console"),c(N,"class","select-none h-15rem grid grid-rows-[2px_2rem_1fr] gap-1 overflow-hidden"),c(W,"class","flex-1 bg-primary dark:bg-darkPrimary transition-transform transition-colors-250 grid grid-rows-[2fr_auto]"),c(i,"class","flex h-screen w-screen overflow-hidden children-pt8 children-pb-2 text-primaryText dark:text-darkPrimaryText")},m(l,T){k(l,t,T),M.m(t,null),k(l,n,T),k(l,i,T),o(i,r),o(r,a),o(r,s),o(r,u),R.m(u,null),o(r,d),o(r,E),o(r,v),o(r,S),o(r,H),o(r,O),o(r,Z),o(r,I),o(r,me),o(r,b),o(r,j),o(r,C),o(r,q),o(r,B),o(r,ee),o(r,te),o(r,pe),o(r,ge),o(r,m),o(r,_);for(let h=0;h<L.length;h+=1)L[h].m(_,null);o(i,D),o(i,W),o(W,A),o(A,ne),o(ne,Te),o(A,He),o(A,_e),o(_e,ie),y&&Me(y,ie,null),o(W,je),o(W,N),o(N,ve),o(N,qe),o(N,G),o(G,be),o(G,Ue),o(G,re),o(N,ze),o(N,oe);for(let h=0;h<x.length;h+=1)x[h].m(oe,null);e[15](N),se=!0,Ce||(Fe=[F(u,"click",e[7]),F(ve,"mousedown",e[12]),F(re,"click",e[11])],Ce=!0)},p(l,[T]){if(ye!==(ye=Ve(l))&&(M.d(1),M=ye(l),M&&(M.c(),M.m(t,null))),we!==(we=Be(l))&&(R.d(1),R=we(l),R&&(R.c(),R.m(u,null))),T&99){X=l[5];let h;for(h=0;h<X.length;h+=1){const le=tt(l,X,h);L[h]?L[h].p(le,T):(L[h]=nt(le),L[h].c(),L[h].m(_,null))}for(;h<L.length;h+=1)L[h].d(1);L.length=X.length}if((!se||T&2)&&U!==(U=l[1].label+"")&&Lt(Te,U),Y!==(Y=l[1].component)){if(y){Ct();const h=y;Ke(h.$$.fragment,1,0,()=>{Re(h,1)}),Dt()}Y?(y=new Y(Ge(l)),Qe(y.$$.fragment),Ae(y.$$.fragment,1),Me(y,ie,null)):y=null}if(T&16){J=l[4];let h;for(h=0;h<J.length;h+=1){const le=et(l,J,h);x[h]?x[h].p(le,T):(x[h]=it(le),x[h].c(),x[h].m(oe,null))}for(;h<x.length;h+=1)x[h].d(1);x.length=J.length}},i(l){se||(y&&Ae(y.$$.fragment,l),se=!0)},o(l){y&&Ke(y.$$.fragment,l),se=!1},d(l){l&&w(t),M.d(),l&&w(n),l&&w(i),R.d(),Ye(L,l),y&&Re(y),Ye(x,l),e[15](null),Ce=!1,V(Fe)}}}let rt=50;function ot(e){const t=document.querySelector("html");e?t.classList.add("dark"):t.classList.remove("dark"),localStorage&&localStorage.setItem("theme",e?"dark":"")}function rn(e,t){e.style.setProperty("--translate-x",`${t?"0":"-18.75"}rem`)}function on(e,t,n){let i;const r=navigator.userAgent.toLowerCase();r.includes("android")||r.includes("iphone");const a=[{label:"Welcome",component:At,icon:"i-ph-hand-waving"},{label:"Communication",component:Gt,icon:"i-codicon-radio-tower"},{label:"WebRTC",component:Jt,icon:"i-ph-broadcast"}];let p=a[0];function s(m){n(1,p=m)}let u;xe(()=>{n(2,u=localStorage&&localStorage.getItem("theme")=="dark"),ot(u)});function d(){n(2,u=!u),ot(u)}let E=It([]);kt(e,E,m=>n(4,i=m));function v(m){E.update(_=>[{html:`<pre><strong class="text-accent dark:text-darkAccent">[${new Date().toLocaleTimeString()}]:</strong> `+(typeof m=="string"?m:JSON.stringify(m,null,1))+"</pre>"},..._])}function S(m){E.update(_=>[{html:`<pre><strong class="text-accent dark:text-darkAccent">[${new Date().toLocaleTimeString()}]:</strong> `+m+"</pre>"},..._])}function H(){E.update(()=>[])}let O,Z,I;function me(m){I=m.clientY;const _=window.getComputedStyle(O);Z=parseInt(_.height,10);const D=A=>{const ne=A.clientY-I,U=Z-ne;n(3,O.style.height=`${U<rt?rt:U}px`,O)},W=()=>{document.removeEventListener("mouseup",W),document.removeEventListener("mousemove",D)};document.addEventListener("mouseup",W),document.addEventListener("mousemove",D)}let b=!1,j,C,q=!1,B=0,ee=0;const te=(m,_,D)=>Math.min(Math.max(_,m),D);xe(()=>{n(13,j=document.querySelector("#sidebar")),C=document.querySelector("#sidebarToggle"),document.addEventListener("click",m=>{C.contains(m.target)?n(0,b=!b):b&&!j.contains(m.target)&&n(0,b=!1)}),document.addEventListener("touchstart",m=>{if(C.contains(m.target))return;const _=m.touches[0].clientX;(0<_&&_<20&&!b||b)&&(q=!0,B=_)}),document.addEventListener("touchmove",m=>{if(q){const _=m.touches[0].clientX;ee=_;const D=(_-B)/10;j.style.setProperty("--translate-x",`-${te(0,b?0-D:18.75-D,18.75)}rem`)}}),document.addEventListener("touchend",()=>{if(q){const m=(ee-B)/10;n(0,b=b?m>-(18.75/2):m>18.75/2)}q=!1})});const pe=m=>{s(m),n(0,b=!1)};function ge(m){Ne[m?"unshift":"push"](()=>{O=m,n(3,O)})}return e.$$.update=()=>{if(e.$$.dirty&1){const m=document.querySelector("#sidebar");m&&rn(m,b)}},[b,p,u,O,i,a,s,d,E,v,S,H,me,j,pe,ge]}class sn extends Oe{constructor(t){super(),Se(this,t,on,nn,he,{})}}new sn({target:document.querySelector("#app")});

// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use std::{
  borrow::Cow,
  collections::{HashMap, HashSet},
  fmt,
  fs::create_dir_all,
  sync::{Arc, Mutex, MutexGuard},
};

use http::{
  header::{ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_ORIGIN},
  HeaderValue, Method, StatusCode,
};
use serde::Serialize;
use serialize_to_javascript::{default_template, DefaultTemplate, Template};
use url::Url;

use tauri_macros::default_runtime;
use tauri_utils::debug_eprintln;
#[cfg(feature = "isolation")]
use tauri_utils::pattern::isolation::RawIsolationPayload;
use tauri_utils::{
  assets::{AssetKey, CspHash},
  config::{Csp, CspDirectiveSources},
  html::{SCRIPT_NONCE_TOKEN, STYLE_NONCE_TOKEN},
};

use crate::{
  app::{
    AppHandle, GlobalMenuEventListener, GlobalWindowEvent, GlobalWindowEventListener, OnPageLoad,
    PageLoadPayload, WindowMenuEvent,
  },
  event::{assert_event_name_is_valid, Event, EventHandler, Listeners},
  ipc::{CallbackFn, Invoke, InvokeBody, InvokeHandler, InvokeResponder, InvokeResponse},
  pattern::PatternJavascript,
  plugin::PluginStore,
  runtime::{
    http::{
      MimeType, Request as HttpRequest, Response as HttpResponse,
      ResponseBuilder as HttpResponseBuilder,
    },
    webview::WindowBuilder,
    window::{dpi::PhysicalSize, DetachedWindow, FileDropEvent, PendingWindow},
  },
  utils::{
    assets::Assets,
    config::{AppUrl, Config, WindowUrl},
    PackageInfo,
  },
  window::{InvokeRequest, UriSchemeProtocolHandler, WebResourceRequestHandler},
  Context, EventLoopMessage, Icon, Manager, Pattern, Runtime, Scopes, StateManager, Window,
  WindowEvent,
};

#[cfg(any(target_os = "linux", target_os = "windows"))]
use crate::path::BaseDirectory;

use crate::{runtime::menu::Menu, MenuEvent};

const WINDOW_RESIZED_EVENT: &str = "tauri://resize";
const WINDOW_MOVED_EVENT: &str = "tauri://move";
const WINDOW_CLOSE_REQUESTED_EVENT: &str = "tauri://close-requested";
const WINDOW_DESTROYED_EVENT: &str = "tauri://destroyed";
const WINDOW_FOCUS_EVENT: &str = "tauri://focus";
const WINDOW_BLUR_EVENT: &str = "tauri://blur";
const WINDOW_SCALE_FACTOR_CHANGED_EVENT: &str = "tauri://scale-change";
const WINDOW_THEME_CHANGED: &str = "tauri://theme-changed";
const WINDOW_FILE_DROP_EVENT: &str = "tauri://file-drop";
const WINDOW_FILE_DROP_HOVER_EVENT: &str = "tauri://file-drop-hover";
const WINDOW_FILE_DROP_CANCELLED_EVENT: &str = "tauri://file-drop-cancelled";
const MENU_EVENT: &str = "tauri://menu";

pub(crate) const PROCESS_IPC_MESSAGE_FN: &str =
  include_str!("../scripts/process-ipc-message-fn.js");

// we need to proxy the dev server on mobile because we can't use `localhost`, so we use the local IP address
// and we do not get a secure context without the custom protocol that proxies to the dev server
// additionally, we need the custom protocol to inject the initialization scripts on Android
// must also keep in sync with the `let mut response` assignment in prepare_uri_scheme_protocol
const PROXY_DEV_SERVER: bool = cfg!(all(dev, mobile));

#[cfg(feature = "isolation")]
#[derive(Template)]
#[default_template("../scripts/isolation.js")]
pub(crate) struct IsolationJavascript<'a> {
  pub(crate) isolation_src: &'a str,
  pub(crate) style: &'a str,
}

#[derive(Template)]
#[default_template("../scripts/ipc.js")]
pub(crate) struct IpcJavascript<'a> {
  pub(crate) isolation_origin: &'a str,
}

#[derive(Default)]
/// Spaced and quoted Content-Security-Policy hash values.
struct CspHashStrings {
  script: Vec<String>,
  style: Vec<String>,
}

/// Sets the CSP value to the asset HTML if needed (on Linux).
/// Returns the CSP string for access on the response header (on Windows and macOS).
fn set_csp<R: Runtime>(
  asset: &mut String,
  assets: Arc<dyn Assets>,
  asset_path: &AssetKey,
  manager: &WindowManager<R>,
  csp: Csp,
) -> String {
  let mut csp = csp.into();
  let hash_strings =
    assets
      .csp_hashes(asset_path)
      .fold(CspHashStrings::default(), |mut acc, hash| {
        match hash {
          CspHash::Script(hash) => {
            acc.script.push(hash.into());
          }
          CspHash::Style(hash) => {
            acc.style.push(hash.into());
          }
          _csp_hash => {
            debug_eprintln!("Unknown CspHash variant encountered: {:?}", _csp_hash);
          }
        }

        acc
      });

  let dangerous_disable_asset_csp_modification = &manager
    .config()
    .tauri
    .security
    .dangerous_disable_asset_csp_modification;
  if dangerous_disable_asset_csp_modification.can_modify("script-src") {
    replace_csp_nonce(
      asset,
      SCRIPT_NONCE_TOKEN,
      &mut csp,
      "script-src",
      hash_strings.script,
    );
  }

  if dangerous_disable_asset_csp_modification.can_modify("style-src") {
    replace_csp_nonce(
      asset,
      STYLE_NONCE_TOKEN,
      &mut csp,
      "style-src",
      hash_strings.style,
    );
  }

  #[cfg(feature = "isolation")]
  if let Pattern::Isolation { schema, .. } = &manager.inner.pattern {
    let default_src = csp
      .entry("default-src".into())
      .or_insert_with(Default::default);
    default_src.push(crate::pattern::format_real_schema(schema));
  }

  Csp::DirectiveMap(csp).to_string()
}

// inspired by https://github.com/rust-lang/rust/blob/1be5c8f90912c446ecbdc405cbc4a89f9acd20fd/library/alloc/src/str.rs#L260-L297
fn replace_with_callback<F: FnMut() -> String>(
  original: &str,
  pattern: &str,
  mut replacement: F,
) -> String {
  let mut result = String::new();
  let mut last_end = 0;
  for (start, part) in original.match_indices(pattern) {
    result.push_str(unsafe { original.get_unchecked(last_end..start) });
    result.push_str(&replacement());
    last_end = start + part.len();
  }
  result.push_str(unsafe { original.get_unchecked(last_end..original.len()) });
  result
}

fn replace_csp_nonce(
  asset: &mut String,
  token: &str,
  csp: &mut HashMap<String, CspDirectiveSources>,
  directive: &str,
  hashes: Vec<String>,
) {
  let mut nonces = Vec::new();
  *asset = replace_with_callback(asset, token, || {
    let nonce = rand::random::<usize>();
    nonces.push(nonce);
    nonce.to_string()
  });

  if !(nonces.is_empty() && hashes.is_empty()) {
    let nonce_sources = nonces
      .into_iter()
      .map(|n| format!("'nonce-{n}'"))
      .collect::<Vec<String>>();
    let sources = csp.entry(directive.into()).or_insert_with(Default::default);
    let self_source = "'self'".to_string();
    if !sources.contains(&self_source) {
      sources.push(self_source);
    }
    sources.extend(nonce_sources);
    sources.extend(hashes);
  }
}

#[default_runtime(crate::Wry, wry)]
pub struct InnerWindowManager<R: Runtime> {
  windows: Mutex<HashMap<String, Window<R>>>,
  #[cfg(all(desktop, feature = "system-tray"))]
  pub(crate) trays: Mutex<HashMap<String, crate::SystemTrayHandle<R>>>,
  pub(crate) plugins: Mutex<PluginStore<R>>,
  listeners: Listeners,
  pub(crate) state: Arc<StateManager>,

  /// The JS message handler.
  invoke_handler: Box<InvokeHandler<R>>,

  /// The page load hook, invoked when the webview performs a navigation.
  on_page_load: Box<OnPageLoad<R>>,

  config: Arc<Config>,
  assets: Arc<dyn Assets>,
  pub(crate) default_window_icon: Option<Icon>,
  pub(crate) app_icon: Option<Vec<u8>>,
  #[cfg(desktop)]
  pub(crate) tray_icon: Option<Icon>,

  package_info: PackageInfo,
  /// The webview protocols available to all windows.
  uri_scheme_protocols: HashMap<String, Arc<CustomProtocol<R>>>,
  /// The menu set to all windows.
  menu: Option<Menu>,
  /// Menu event listeners to all windows.
  menu_event_listeners: Arc<Vec<GlobalMenuEventListener<R>>>,
  /// Window event listeners to all windows.
  window_event_listeners: Arc<Vec<GlobalWindowEventListener<R>>>,
  /// Responder for invoke calls.
  invoke_responder: Option<Arc<InvokeResponder<R>>>,
  /// The script that initializes the invoke system.
  invoke_initialization_script: String,
  /// Application pattern.
  pub(crate) pattern: Pattern,
}

impl<R: Runtime> fmt::Debug for InnerWindowManager<R> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let mut d = f.debug_struct("InnerWindowManager");

    d.field("plugins", &self.plugins)
      .field("state", &self.state)
      .field("config", &self.config)
      .field("default_window_icon", &self.default_window_icon)
      .field("app_icon", &self.app_icon)
      .field("package_info", &self.package_info)
      .field("menu", &self.menu)
      .field("pattern", &self.pattern);

    #[cfg(desktop)]
    d.field("tray_icon", &self.tray_icon);

    d.finish()
  }
}

/// A resolved asset.
pub struct Asset {
  /// The asset bytes.
  pub bytes: Vec<u8>,
  /// The asset's mime type.
  pub mime_type: String,
  /// The `Content-Security-Policy` header value.
  pub csp_header: Option<String>,
}

/// Uses a custom URI scheme handler to resolve file requests
pub struct CustomProtocol<R: Runtime> {
  /// Handler for protocol
  #[allow(clippy::type_complexity)]
  pub protocol: Box<
    dyn Fn(&AppHandle<R>, &HttpRequest) -> Result<HttpResponse, Box<dyn std::error::Error>>
      + Send
      + Sync,
  >,
}

#[default_runtime(crate::Wry, wry)]
#[derive(Debug)]
pub struct WindowManager<R: Runtime> {
  pub inner: Arc<InnerWindowManager<R>>,
}

impl<R: Runtime> Clone for WindowManager<R> {
  fn clone(&self) -> Self {
    Self {
      inner: self.inner.clone(),
    }
  }
}

impl<R: Runtime> WindowManager<R> {
  #[allow(clippy::too_many_arguments)]
  pub(crate) fn with_handlers(
    #[allow(unused_mut)] mut context: Context<impl Assets>,
    plugins: PluginStore<R>,
    invoke_handler: Box<InvokeHandler<R>>,
    on_page_load: Box<OnPageLoad<R>>,
    uri_scheme_protocols: HashMap<String, Arc<CustomProtocol<R>>>,
    state: StateManager,
    window_event_listeners: Vec<GlobalWindowEventListener<R>>,
    (menu, menu_event_listeners): (Option<Menu>, Vec<GlobalMenuEventListener<R>>),
    (invoke_responder, invoke_initialization_script): (Option<Arc<InvokeResponder<R>>>, String),
  ) -> Self {
    // generate a random isolation key at runtime
    #[cfg(feature = "isolation")]
    if let Pattern::Isolation { ref mut key, .. } = &mut context.pattern {
      *key = uuid::Uuid::new_v4().to_string();
    }

    Self {
      inner: Arc::new(InnerWindowManager {
        windows: Mutex::default(),
        #[cfg(all(desktop, feature = "system-tray"))]
        trays: Default::default(),
        plugins: Mutex::new(plugins),
        listeners: Listeners::default(),
        state: Arc::new(state),
        invoke_handler,
        on_page_load,
        config: Arc::new(context.config),
        assets: context.assets,
        default_window_icon: context.default_window_icon,
        app_icon: context.app_icon,
        #[cfg(desktop)]
        tray_icon: context.system_tray_icon,
        package_info: context.package_info,
        pattern: context.pattern,
        uri_scheme_protocols,
        menu,
        menu_event_listeners: Arc::new(menu_event_listeners),
        window_event_listeners: Arc::new(window_event_listeners),
        invoke_responder,
        invoke_initialization_script,
      }),
    }
  }

  pub(crate) fn pattern(&self) -> &Pattern {
    &self.inner.pattern
  }

  /// Get a locked handle to the windows.
  pub(crate) fn windows_lock(&self) -> MutexGuard<'_, HashMap<String, Window<R>>> {
    self.inner.windows.lock().expect("poisoned window manager")
  }

  /// State managed by the application.
  pub(crate) fn state(&self) -> Arc<StateManager> {
    self.inner.state.clone()
  }

  /// The invoke responder.
  pub(crate) fn invoke_responder(&self) -> Option<Arc<InvokeResponder<R>>> {
    self.inner.invoke_responder.clone()
  }

  /// Get the base path to serve data from.
  ///
  /// * In dev mode, this will be based on the `devPath` configuration value.
  /// * Otherwise, this will be based on the `distDir` configuration value.
  #[cfg(not(dev))]
  fn base_path(&self) -> &AppUrl {
    &self.inner.config.build.dist_dir
  }

  #[cfg(dev)]
  fn base_path(&self) -> &AppUrl {
    &self.inner.config.build.dev_path
  }

  /// Get the base URL to use for webview requests.
  ///
  /// In dev mode, this will be based on the `devPath` configuration value.
  pub(crate) fn get_url(&self) -> Cow<'_, Url> {
    match self.base_path() {
      AppUrl::Url(WindowUrl::External(url)) => Cow::Borrowed(url),
      #[cfg(any(windows, target_os = "android"))]
      _ => Cow::Owned(Url::parse("https://tauri.localhost").unwrap()),
      #[cfg(not(any(windows, target_os = "android")))]
      _ => Cow::Owned(Url::parse("tauri://localhost").unwrap()),
    }
  }

  fn csp(&self) -> Option<Csp> {
    if cfg!(feature = "custom-protocol") {
      self.inner.config.tauri.security.csp.clone()
    } else {
      self
        .inner
        .config
        .tauri
        .security
        .dev_csp
        .clone()
        .or_else(|| self.inner.config.tauri.security.csp.clone())
    }
  }

  fn prepare_pending_window(
    &self,
    mut pending: PendingWindow<EventLoopMessage, R>,
    label: &str,
    window_labels: &[String],
    app_handle: AppHandle<R>,
  ) -> crate::Result<PendingWindow<EventLoopMessage, R>> {
    let is_init_global = self.inner.config.build.with_global_tauri;
    let plugin_init = self
      .inner
      .plugins
      .lock()
      .expect("poisoned plugin store")
      .initialization_script();

    let pattern_init = PatternJavascript {
      pattern: self.pattern().into(),
    }
    .render_default(&Default::default())?;

    let ipc_init = IpcJavascript {
      isolation_origin: &match self.pattern() {
        #[cfg(feature = "isolation")]
        Pattern::Isolation { schema, .. } => crate::pattern::format_real_schema(schema),
        _ => "".to_string(),
      },
    }
    .render_default(&Default::default())?;

    let mut webview_attributes = pending.webview_attributes;

    let mut window_labels = window_labels.to_vec();
    let l = label.to_string();
    if !window_labels.contains(&l) {
      window_labels.push(l);
    }
    webview_attributes = webview_attributes
      .initialization_script(&self.inner.invoke_initialization_script)
      .initialization_script(&format!(
        r#"
          Object.defineProperty(window, '__TAURI_METADATA__', {{
            value: {{
              __windows: {window_labels_array}.map(function (label) {{ return {{ label: label }} }}),
              __currentWindow: {{ label: {current_window_label} }}
            }}
          }})
        "#,
        window_labels_array = serde_json::to_string(&window_labels)?,
        current_window_label = serde_json::to_string(&label)?,
      ))
      .initialization_script(&self.initialization_script(&ipc_init.into_string(),&pattern_init.into_string(),&plugin_init, is_init_global)?);

    #[cfg(feature = "isolation")]
    if let Pattern::Isolation { schema, .. } = self.pattern() {
      webview_attributes = webview_attributes.initialization_script(
        &IsolationJavascript {
          isolation_src: &crate::pattern::format_real_schema(schema),
          style: tauri_utils::pattern::isolation::IFRAME_STYLE,
        }
        .render_default(&Default::default())?
        .into_string(),
      );
    }

    pending.webview_attributes = webview_attributes;

    let mut registered_scheme_protocols = Vec::new();

    for (uri_scheme, protocol) in &self.inner.uri_scheme_protocols {
      registered_scheme_protocols.push(uri_scheme.clone());
      let protocol = protocol.clone();
      let app_handle = Mutex::new(app_handle.clone());
      pending.register_uri_scheme_protocol(uri_scheme.clone(), move |p| {
        (protocol.protocol)(&app_handle.lock().unwrap(), p)
      });
    }

    let window_url = Url::parse(&pending.url).unwrap();
    let window_origin =
      if cfg!(windows) && window_url.scheme() != "http" && window_url.scheme() != "https" {
        format!("https://{}.localhost", window_url.scheme())
      } else {
        format!(
          "{}://{}{}",
          window_url.scheme(),
          window_url.host().unwrap(),
          if let Some(port) = window_url.port() {
            format!(":{port}")
          } else {
            "".into()
          }
        )
      };

    if !registered_scheme_protocols.contains(&"tauri".into()) {
      let web_resource_request_handler = pending.web_resource_request_handler.take();
      pending.register_uri_scheme_protocol(
        "tauri",
        self.prepare_uri_scheme_protocol(&window_origin, web_resource_request_handler),
      );
      registered_scheme_protocols.push("tauri".into());
    }

    if !registered_scheme_protocols.contains(&"ipc".into()) {
      pending.register_uri_scheme_protocol(
        "ipc",
        self.prepare_ipc_scheme_protocol(pending.label.clone()),
      );
      registered_scheme_protocols.push("ipc".into());
    }

    #[cfg(feature = "protocol-asset")]
    if !registered_scheme_protocols.contains(&"asset".into()) {
      let asset_scope = self.state().get::<crate::Scopes>().asset_protocol.clone();
      pending.register_uri_scheme_protocol("asset", move |request| {
        crate::asset_protocol::asset_protocol_handler(
          request,
          asset_scope.clone(),
          window_origin.clone(),
        )
      });
    }

    #[cfg(feature = "isolation")]
    if let Pattern::Isolation {
      assets,
      schema,
      key: _,
      crypto_keys,
    } = &self.inner.pattern
    {
      let assets = assets.clone();
      let schema_ = schema.clone();
      let url_base = format!("{schema_}://localhost");
      let aes_gcm_key = *crypto_keys.aes_gcm().raw();

      pending.register_uri_scheme_protocol(schema, move |request| {
        match request_to_path(request, &url_base).as_str() {
          "index.html" => match assets.get(&"index.html".into()) {
            Some(asset) => {
              let asset = String::from_utf8_lossy(asset.as_ref());
              let template = tauri_utils::pattern::isolation::IsolationJavascriptRuntime {
                runtime_aes_gcm_key: &aes_gcm_key,
                process_ipc_message_fn: PROCESS_IPC_MESSAGE_FN,
              };
              match template.render(asset.as_ref(), &Default::default()) {
                Ok(asset) => HttpResponseBuilder::new()
                  .mimetype("text/html")
                  .body(asset.into_string().as_bytes().to_vec()),
                Err(_) => HttpResponseBuilder::new()
                  .status(500)
                  .mimetype("text/plain")
                  .body(Vec::new()),
              }
            }

            None => HttpResponseBuilder::new()
              .status(404)
              .mimetype("text/plain")
              .body(Vec::new()),
          },
          _ => HttpResponseBuilder::new()
            .status(404)
            .mimetype("text/plain")
            .body(Vec::new()),
        }
      });
    }

    Ok(pending)
  }

  #[cfg(not(ipc_custom_protocol))]
  fn prepare_ipc_message_handler(
    &self,
  ) -> crate::runtime::webview::WebviewIpcHandler<EventLoopMessage, R> {
    let manager = self.clone();
    Box::new(move |window, request| handle_ipc_message(request, &manager, &window.label))
  }

  fn prepare_ipc_scheme_protocol(&self, label: String) -> UriSchemeProtocolHandler {
    let manager = self.clone();
    Box::new(move |request| {
      let mut response = match *request.method() {
        Method::POST => {
          let (mut response, content_type) = match handle_ipc_request(request, &manager, &label) {
            Ok(data) => match data {
              InvokeResponse::Ok(InvokeBody::Json(v)) => (
                HttpResponse::new(serde_json::to_vec(&v)?.into()),
                "application/json",
              ),
              InvokeResponse::Ok(InvokeBody::Raw(v)) => {
                (HttpResponse::new(v.into()), "application/octet-stream")
              }
              InvokeResponse::Err(e) => {
                let mut response = HttpResponse::new(serde_json::to_vec(&e.0)?.into());
                response.set_status(StatusCode::BAD_REQUEST);
                (response, "text/plain")
              }
            },
            Err(e) => {
              let mut response = HttpResponse::new(e.as_bytes().to_vec().into());
              response.set_status(StatusCode::BAD_REQUEST);
              (response, "text/plain")
            }
          };

          response.set_mimetype(Some(content_type.into()));

          response
        }

        Method::OPTIONS => {
          let mut r = HttpResponse::new(Vec::new().into());
          r.headers_mut().insert(
            ACCESS_CONTROL_ALLOW_HEADERS,
            HeaderValue::from_static("Content-Type, Tauri-Callback, Tauri-Error"),
          );
          r
        }

        _ => {
          let mut r = HttpResponse::new(
            "only POST and OPTIONS are allowed"
              .as_bytes()
              .to_vec()
              .into(),
          );
          r.set_status(StatusCode::METHOD_NOT_ALLOWED);
          r.set_mimetype(Some("text/plain".into()));
          r
        }
      };

      response
        .headers_mut()
        .insert(ACCESS_CONTROL_ALLOW_ORIGIN, HeaderValue::from_static("*"));

      Ok(response)
    })
  }

  pub fn get_asset(&self, mut path: String) -> Result<Asset, Box<dyn std::error::Error>> {
    let assets = &self.inner.assets;
    if path.ends_with('/') {
      path.pop();
    }
    path = percent_encoding::percent_decode(path.as_bytes())
      .decode_utf8_lossy()
      .to_string();
    let path = if path.is_empty() {
      // if the url is `tauri://localhost`, we should load `index.html`
      "index.html".to_string()
    } else {
      // skip leading `/`
      path.chars().skip(1).collect::<String>()
    };

    let mut asset_path = AssetKey::from(path.as_str());

    let asset_response = assets
      .get(&path.as_str().into())
      .or_else(|| {
        debug_eprintln!("Asset `{path}` not found; fallback to {path}.html");
        let fallback = format!("{}.html", path.as_str()).into();
        let asset = assets.get(&fallback);
        asset_path = fallback;
        asset
      })
      .or_else(|| {
        debug_eprintln!(
          "Asset `{}` not found; fallback to {}/index.html",
          path,
          path
        );
        let fallback = format!("{}/index.html", path.as_str()).into();
        let asset = assets.get(&fallback);
        asset_path = fallback;
        asset
      })
      .or_else(|| {
        debug_eprintln!("Asset `{}` not found; fallback to index.html", path);
        let fallback = AssetKey::from("index.html");
        let asset = assets.get(&fallback);
        asset_path = fallback;
        asset
      })
      .ok_or_else(|| crate::Error::AssetNotFound(path.clone()))
      .map(Cow::into_owned);

    let mut csp_header = None;
    let is_html = asset_path.as_ref().ends_with(".html");

    match asset_response {
      Ok(asset) => {
        let final_data = if is_html {
          let mut asset = String::from_utf8_lossy(&asset).into_owned();
          if let Some(csp) = self.csp() {
            csp_header.replace(set_csp(
              &mut asset,
              self.inner.assets.clone(),
              &asset_path,
              self,
              csp,
            ));
          }

          asset.as_bytes().to_vec()
        } else {
          asset
        };
        let mime_type = MimeType::parse(&final_data, &path);
        Ok(Asset {
          bytes: final_data.to_vec(),
          mime_type,
          csp_header,
        })
      }
      Err(e) => {
        debug_eprintln!("{:?}", e); // TODO log::error!
        Err(Box::new(e))
      }
    }
  }

  fn prepare_uri_scheme_protocol(
    &self,
    window_origin: &str,
    web_resource_request_handler: Option<Box<WebResourceRequestHandler>>,
  ) -> UriSchemeProtocolHandler {
    #[cfg(all(dev, mobile))]
    let url = {
      let mut url = self.get_url().as_str().to_string();
      if url.ends_with('/') {
        url.pop();
      }
      url
    };
    #[cfg(not(all(dev, mobile)))]
    let manager = self.clone();
    let window_origin = window_origin.to_string();

    #[cfg(all(dev, mobile))]
    #[derive(Clone)]
    struct CachedResponse {
      status: http::StatusCode,
      headers: http::HeaderMap,
      body: bytes::Bytes,
    }

    #[cfg(all(dev, mobile))]
    let response_cache = Arc::new(Mutex::new(HashMap::new()));

    Box::new(move |request| {
      // use the entire URI as we are going to proxy the request
      let path = if PROXY_DEV_SERVER {
        request.uri()
      } else {
        // ignore query string and fragment
        request.uri().split(&['?', '#'][..]).next().unwrap()
      };

      let path = path
        .strip_prefix("tauri://localhost")
        .map(|p| p.to_string())
        // the `strip_prefix` only returns None when a request is made to `https://tauri.$P` on Windows
        // where `$P` is not `localhost/*`
        .unwrap_or_else(|| "".to_string());

      let mut builder =
        HttpResponseBuilder::new().header("Access-Control-Allow-Origin", &window_origin);

      #[cfg(all(dev, mobile))]
      let mut response = {
        let decoded_path = percent_encoding::percent_decode(path.as_bytes())
          .decode_utf8_lossy()
          .to_string();
        let url = format!("{url}{decoded_path}");
        #[allow(unused_mut)]
        let mut client_builder = reqwest::ClientBuilder::new();
        #[cfg(any(feature = "native-tls", feature = "rustls-tls"))]
        {
          client_builder = client_builder.danger_accept_invalid_certs(true);
        }
        let mut proxy_builder = client_builder.build().unwrap().get(&url);
        for (name, value) in request.headers() {
          proxy_builder = proxy_builder.header(name, value);
        }
        match crate::async_runtime::block_on(proxy_builder.send()) {
          Ok(r) => {
            let mut response_cache_ = response_cache.lock().unwrap();
            let mut response = None;
            if r.status() == StatusCode::NOT_MODIFIED {
              response = response_cache_.get(&url);
            }
            let response = if let Some(r) = response {
              r
            } else {
              let status = r.status();
              let headers = r.headers().clone();
              let body = crate::async_runtime::block_on(r.bytes())?;
              let response = CachedResponse {
                status,
                headers,
                body,
              };
              response_cache_.insert(url.clone(), response);
              response_cache_.get(&url).unwrap()
            };
            for (name, value) in &response.headers {
              builder = builder.header(name, value);
            }
            builder
              .status(response.status)
              .body(response.body.to_vec())?
          }
          Err(e) => {
            debug_eprintln!("Failed to request {}: {}", url.as_str(), e);
            return Err(Box::new(e));
          }
        }
      };

      #[cfg(not(all(dev, mobile)))]
      let mut response = {
        let asset = manager.get_asset(path)?;
        builder = builder.mimetype(&asset.mime_type);
        if let Some(csp) = &asset.csp_header {
          builder = builder.header("Content-Security-Policy", csp);
        }
        builder.body(asset.bytes)?
      };
      if let Some(handler) = &web_resource_request_handler {
        handler(request, &mut response);
      }
      // if it's an HTML file, we need to set the CSP meta tag on Linux
      #[cfg(all(not(dev), target_os = "linux"))]
      if let Some(response_csp) = response.headers().get("Content-Security-Policy") {
        let response_csp = String::from_utf8_lossy(response_csp.as_bytes());
        let html = String::from_utf8_lossy(response.body());
        let body = html.replacen(tauri_utils::html::CSP_TOKEN, &response_csp, 1);
        *response.body_mut() = body.as_bytes().to_vec().into();
      }
      Ok(response)
    })
  }

  fn initialization_script(
    &self,
    ipc_script: &str,
    pattern_script: &str,
    plugin_initialization_script: &str,
    with_global_tauri: bool,
  ) -> crate::Result<String> {
    #[derive(Template)]
    #[default_template("../scripts/init.js")]
    struct InitJavascript<'a> {
      #[raw]
      pattern_script: &'a str,
      #[raw]
      ipc_script: &'a str,
      #[raw]
      bundle_script: &'a str,
      // A function to immediately listen to an event.
      #[raw]
      listen_function: &'a str,
      #[raw]
      core_script: &'a str,
      #[raw]
      event_initialization_script: &'a str,
      #[raw]
      plugin_initialization_script: &'a str,
      #[raw]
      freeze_prototype: &'a str,
    }

    let bundle_script = if with_global_tauri {
      include_str!("../scripts/bundle.global.js")
    } else {
      ""
    };

    let freeze_prototype = if self.inner.config.tauri.security.freeze_prototype {
      include_str!("../scripts/freeze_prototype.js")
    } else {
      ""
    };

    InitJavascript {
      pattern_script,
      ipc_script,
      bundle_script,
      listen_function: &format!(
        "function listen(eventName, cb) {{ {} }}",
        crate::event::listen_js(
          self.event_listeners_object_name(),
          "eventName".into(),
          0,
          None,
          "window['_' + window.__TAURI__.transformCallback(cb) ]".into()
        )
      ),
      core_script: include_str!("../scripts/core.js"),
      event_initialization_script: &self.event_initialization_script(),
      plugin_initialization_script,
      freeze_prototype,
    }
    .render_default(&Default::default())
    .map(|s| s.into_string())
    .map_err(Into::into)
  }

  fn event_initialization_script(&self) -> String {
    format!(
      "
      Object.defineProperty(window, '{function}', {{
        value: function (eventData) {{
          const listeners = (window['{listeners}'] && window['{listeners}'][eventData.event]) || []

          for (let i = listeners.length - 1; i >= 0; i--) {{
            const listener = listeners[i]
            if (listener.windowLabel === null || listener.windowLabel === eventData.windowLabel) {{
              eventData.id = listener.id
              listener.handler(eventData)
            }}
          }}
        }}
      }});
    ",
      function = self.event_emit_function_name(),
      listeners = self.event_listeners_object_name()
    )
  }
}

#[cfg(test)]
mod test {
  use crate::{generate_context, plugin::PluginStore, StateManager, Wry};

  use super::WindowManager;

  #[test]
  fn check_get_url() {
    let context = generate_context!("test/fixture/src-tauri/tauri.conf.json", crate);
    let manager: WindowManager<Wry> = WindowManager::with_handlers(
      context,
      PluginStore::default(),
      Box::new(|_| false),
      Box::new(|_, _| ()),
      Default::default(),
      StateManager::new(),
      Default::default(),
      Default::default(),
      (None, "".into()),
    );

    #[cfg(custom_protocol)]
    {
      assert_eq!(
        manager.get_url().to_string(),
        if cfg!(windows) {
          "https://tauri.localhost/"
        } else {
          "tauri://localhost"
        }
      );
    }

    #[cfg(dev)]
    assert_eq!(manager.get_url().to_string(), "http://localhost:4000/");
  }
}

impl<R: Runtime> WindowManager<R> {
  pub fn run_invoke_handler(&self, invoke: Invoke<R>) -> bool {
    (self.inner.invoke_handler)(invoke)
  }

  pub fn run_on_page_load(&self, window: Window<R>, payload: PageLoadPayload) {
    (self.inner.on_page_load)(window.clone(), payload.clone());
    self
      .inner
      .plugins
      .lock()
      .expect("poisoned plugin store")
      .on_page_load(window, payload);
  }

  pub fn extend_api(&self, plugin: &str, invoke: Invoke<R>) -> bool {
    self
      .inner
      .plugins
      .lock()
      .expect("poisoned plugin store")
      .extend_api(plugin, invoke)
  }

  pub fn initialize_plugins(&self, app: &AppHandle<R>) -> crate::Result<()> {
    self
      .inner
      .plugins
      .lock()
      .expect("poisoned plugin store")
      .initialize(app, &self.inner.config.plugins)
  }

  pub fn prepare_window(
    &self,
    app_handle: AppHandle<R>,
    mut pending: PendingWindow<EventLoopMessage, R>,
    window_labels: &[String],
  ) -> crate::Result<PendingWindow<EventLoopMessage, R>> {
    if self.windows_lock().contains_key(&pending.label) {
      return Err(crate::Error::WindowLabelAlreadyExists(pending.label));
    }
    #[allow(unused_mut)] // mut url only for the data-url parsing
    let mut url = match &pending.webview_attributes.url {
      WindowUrl::App(path) => {
        let url = if PROXY_DEV_SERVER {
          Cow::Owned(Url::parse("tauri://localhost").unwrap())
        } else {
          self.get_url()
        };
        // ignore "index.html" just to simplify the url
        if path.to_str() != Some("index.html") {
          url
            .join(&path.to_string_lossy())
            .map_err(crate::Error::InvalidUrl)
            // this will never fail
            .unwrap()
        } else {
          url.into_owned()
        }
      }
      WindowUrl::External(url) => {
        let config_url = self.get_url();
        let is_local = config_url.make_relative(url).is_some();
        let mut url = url.clone();
        if is_local && PROXY_DEV_SERVER {
          url.set_scheme("tauri").unwrap();
          url.set_host(Some("localhost")).unwrap();
        }
        url
      }
      _ => unimplemented!(),
    };

    #[cfg(not(feature = "window-data-url"))]
    if url.scheme() == "data" {
      return Err(crate::Error::InvalidWindowUrl(
        "data URLs are not supported without the `window-data-url` feature.",
      ));
    }

    #[cfg(feature = "window-data-url")]
    if let Some(csp) = self.csp() {
      if url.scheme() == "data" {
        if let Ok(data_url) = data_url::DataUrl::process(url.as_str()) {
          let (body, _) = data_url.decode_to_vec().unwrap();
          let html = String::from_utf8_lossy(&body).into_owned();
          // naive way to check if it's an html
          if html.contains('<') && html.contains('>') {
            let mut document = tauri_utils::html::parse(html);
            tauri_utils::html::inject_csp(&mut document, &csp.to_string());
            url.set_path(&format!("text/html,{}", document.to_string()));
          }
        }
      }
    }

    pending.url = url.to_string();

    if !pending.window_builder.has_icon() {
      if let Some(default_window_icon) = self.inner.default_window_icon.clone() {
        pending.window_builder = pending
          .window_builder
          .icon(default_window_icon.try_into()?)?;
      }
    }

    if pending.window_builder.get_menu().is_none() {
      if let Some(menu) = &self.inner.menu {
        pending = pending.set_menu(menu.clone());
      }
    }

    #[cfg(target_os = "android")]
    {
      pending = pending.on_webview_created(move |ctx| {
        let plugin_manager = ctx
          .env
          .call_method(
            ctx.activity,
            "getPluginManager",
            "()Lapp/tauri/plugin/PluginManager;",
            &[],
          )?
          .l()?;

        // tell the manager the webview is ready
        ctx.env.call_method(
          plugin_manager,
          "onWebViewCreated",
          "(Landroid/webkit/WebView;)V",
          &[ctx.webview.into()],
        )?;

        Ok(())
      });
    }

    let label = pending.label.clone();
    pending = self.prepare_pending_window(
      pending,
      &label,
      window_labels,
      #[allow(clippy::redundant_clone)]
      app_handle.clone(),
    )?;
    #[cfg(not(ipc_custom_protocol))]
    {
      pending.ipc_handler = Some(self.prepare_ipc_message_handler());
    }

    // in `Windows`, we need to force a data_directory
    // but we do respect user-specification
    #[cfg(any(target_os = "linux", target_os = "windows"))]
    if pending.webview_attributes.data_directory.is_none() {
      let local_app_data = app_handle.path().resolve(
        &self.inner.config.tauri.bundle.identifier,
        BaseDirectory::LocalData,
      );
      if let Ok(user_data_dir) = local_app_data {
        pending.webview_attributes.data_directory = Some(user_data_dir);
      }
    }

    // make sure the directory is created and available to prevent a panic
    if let Some(user_data_dir) = &pending.webview_attributes.data_directory {
      if !user_data_dir.exists() {
        create_dir_all(user_data_dir)?;
      }
    }

    #[cfg(feature = "isolation")]
    let pattern = self.pattern().clone();
    let navigation_handler = pending.navigation_handler.take();
    pending.navigation_handler = Some(Box::new(move |url| {
      // always allow navigation events for the isolation iframe and do not emit them for consumers
      #[cfg(feature = "isolation")]
      if let Pattern::Isolation { schema, .. } = &pattern {
        if url.scheme() == schema
          && url.domain() == Some(crate::pattern::ISOLATION_IFRAME_SRC_DOMAIN)
        {
          return true;
        }
      }
      if let Some(handler) = &navigation_handler {
        handler(url)
      } else {
        true
      }
    }));

    Ok(pending)
  }

  pub fn attach_window(
    &self,
    app_handle: AppHandle<R>,
    window: DetachedWindow<EventLoopMessage, R>,
  ) -> Window<R> {
    let window = Window::new(self.clone(), window, app_handle);

    let window_ = window.clone();
    let window_event_listeners = self.inner.window_event_listeners.clone();
    let manager = self.clone();
    window.on_window_event(move |event| {
      let _ = on_window_event(&window_, &manager, event);
      for handler in window_event_listeners.iter() {
        handler(GlobalWindowEvent {
          window: window_.clone(),
          event: event.clone(),
        });
      }
    });
    {
      let window_ = window.clone();
      let menu_event_listeners = self.inner.menu_event_listeners.clone();
      window.on_menu_event(move |event| {
        let _ = on_menu_event(&window_, &event);
        for handler in menu_event_listeners.iter() {
          handler(WindowMenuEvent {
            window: window_.clone(),
            menu_item_id: event.menu_item_id.clone(),
          });
        }
      });
    }

    // insert the window into our manager
    {
      self
        .windows_lock()
        .insert(window.label().to_string(), window.clone());
    }

    // let plugins know that a new window has been added to the manager
    let manager = self.inner.clone();
    let window_ = window.clone();
    // run on main thread so the plugin store doesn't dead lock with the event loop handler in App
    let _ = window.run_on_main_thread(move || {
      manager
        .plugins
        .lock()
        .expect("poisoned plugin store")
        .created(window_);
    });

    #[cfg(target_os = "ios")]
    {
      window
        .with_webview(|w| {
          unsafe { crate::ios::on_webview_created(w.inner() as _, w.view_controller() as _) };
        })
        .expect("failed to run on_webview_created hook");
    }

    window
  }

  pub(crate) fn on_window_close(&self, label: &str) {
    self.windows_lock().remove(label);
  }

  pub fn emit_filter<S, F>(
    &self,
    event: &str,
    source_window_label: Option<&str>,
    payload: S,
    filter: F,
  ) -> crate::Result<()>
  where
    S: Serialize + Clone,
    F: Fn(&Window<R>) -> bool,
  {
    assert_event_name_is_valid(event);
    self
      .windows_lock()
      .values()
      .filter(|&w| filter(w))
      .try_for_each(|window| window.emit_internal(event, source_window_label, payload.clone()))
  }

  pub fn eval_script_all<S: Into<String>>(&self, script: S) -> crate::Result<()> {
    let script = script.into();
    self
      .windows_lock()
      .values()
      .try_for_each(|window| window.eval(&script))
  }

  pub fn labels(&self) -> HashSet<String> {
    self.windows_lock().keys().cloned().collect()
  }

  pub fn config(&self) -> Arc<Config> {
    self.inner.config.clone()
  }

  pub fn package_info(&self) -> &PackageInfo {
    &self.inner.package_info
  }

  pub fn unlisten(&self, handler_id: EventHandler) {
    self.inner.listeners.unlisten(handler_id)
  }

  pub fn trigger(&self, event: &str, window: Option<String>, data: Option<String>) {
    assert_event_name_is_valid(event);
    self.inner.listeners.trigger(event, window, data)
  }

  pub fn listen<F: Fn(Event) + Send + 'static>(
    &self,
    event: String,
    window: Option<String>,
    handler: F,
  ) -> EventHandler {
    assert_event_name_is_valid(&event);
    self.inner.listeners.listen(event, window, handler)
  }

  pub fn once<F: FnOnce(Event) + Send + 'static>(
    &self,
    event: String,
    window: Option<String>,
    handler: F,
  ) -> EventHandler {
    assert_event_name_is_valid(&event);
    self.inner.listeners.once(event, window, handler)
  }

  pub fn event_listeners_object_name(&self) -> String {
    self.inner.listeners.listeners_object_name()
  }

  pub fn event_emit_function_name(&self) -> String {
    self.inner.listeners.function_name()
  }

  pub fn get_window(&self, label: &str) -> Option<Window<R>> {
    self.windows_lock().get(label).cloned()
  }

  pub fn get_focused_window(&self) -> Option<Window<R>> {
    self
      .windows_lock()
      .iter()
      .find(|w| w.1.is_focused().unwrap_or(false))
      .map(|w| w.1.clone())
  }

  pub fn windows(&self) -> HashMap<String, Window<R>> {
    self.windows_lock().clone()
  }
}

/// Tray APIs
#[cfg(all(desktop, feature = "system-tray"))]
impl<R: Runtime> WindowManager<R> {
  pub fn get_tray(&self, id: &str) -> Option<crate::SystemTrayHandle<R>> {
    self.inner.trays.lock().unwrap().get(id).cloned()
  }

  pub fn trays(&self) -> HashMap<String, crate::SystemTrayHandle<R>> {
    self.inner.trays.lock().unwrap().clone()
  }

  pub fn attach_tray(&self, id: String, tray: crate::SystemTrayHandle<R>) {
    self.inner.trays.lock().unwrap().insert(id, tray);
  }

  pub fn get_tray_by_runtime_id(&self, id: u16) -> Option<(String, crate::SystemTrayHandle<R>)> {
    let trays = self.inner.trays.lock().unwrap();
    let iter = trays.iter();
    for (tray_id, tray) in iter {
      if tray.id == id {
        return Some((tray_id.clone(), tray.clone()));
      }
    }
    None
  }
}

fn on_window_event<R: Runtime>(
  window: &Window<R>,
  manager: &WindowManager<R>,
  event: &WindowEvent,
) -> crate::Result<()> {
  match event {
    WindowEvent::Resized(size) => window.emit(WINDOW_RESIZED_EVENT, size)?,
    WindowEvent::Moved(position) => window.emit(WINDOW_MOVED_EVENT, position)?,
    WindowEvent::CloseRequested { api } => {
      if window.has_js_listener(Some(window.label().into()), WINDOW_CLOSE_REQUESTED_EVENT) {
        api.prevent_close();
      }
      window.emit(WINDOW_CLOSE_REQUESTED_EVENT, ())?;
    }
    WindowEvent::Destroyed => {
      window.emit(WINDOW_DESTROYED_EVENT, ())?;
      let label = window.label();
      let windows_map = manager.inner.windows.lock().unwrap();
      let windows = windows_map.values();
      for window in windows {
        window.eval(&format!(
          r#"(function () {{ const metadata = window.__TAURI_METADATA__; if (metadata != null) {{ metadata.__windows = window.__TAURI_METADATA__.__windows.filter(w => w.label !== "{label}"); }} }})()"#,
        ))?;
      }
    }
    WindowEvent::Focused(focused) => window.emit(
      if *focused {
        WINDOW_FOCUS_EVENT
      } else {
        WINDOW_BLUR_EVENT
      },
      (),
    )?,
    WindowEvent::ScaleFactorChanged {
      scale_factor,
      new_inner_size,
      ..
    } => window.emit(
      WINDOW_SCALE_FACTOR_CHANGED_EVENT,
      ScaleFactorChanged {
        scale_factor: *scale_factor,
        size: *new_inner_size,
      },
    )?,
    WindowEvent::FileDrop(event) => match event {
      FileDropEvent::Hovered(paths) => window.emit(WINDOW_FILE_DROP_HOVER_EVENT, paths)?,
      FileDropEvent::Dropped(paths) => {
        let scopes = window.state::<Scopes>();
        for path in paths {
          if path.is_file() {
            let _ = scopes.allow_file(path);
          } else {
            let _ = scopes.allow_directory(path, false);
          }
        }
        window.emit(WINDOW_FILE_DROP_EVENT, paths)?
      }
      FileDropEvent::Cancelled => window.emit(WINDOW_FILE_DROP_CANCELLED_EVENT, ())?,
      _ => unimplemented!(),
    },
    WindowEvent::ThemeChanged(theme) => window.emit(WINDOW_THEME_CHANGED, theme.to_string())?,
  }
  Ok(())
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ScaleFactorChanged {
  scale_factor: f64,
  size: PhysicalSize<u32>,
}

fn on_menu_event<R: Runtime>(window: &Window<R>, event: &MenuEvent) -> crate::Result<()> {
  window.emit(MENU_EVENT, event.menu_item_id.clone())
}

#[cfg(feature = "isolation")]
fn request_to_path(request: &tauri_runtime::http::Request, base_url: &str) -> String {
  let mut path = request
    .uri()
    .split(&['?', '#'][..])
    // ignore query string
    .next()
    .unwrap()
    .trim_start_matches(base_url)
    .to_string();

  if path.ends_with('/') {
    path.pop();
  }

  let path = percent_encoding::percent_decode(path.as_bytes())
    .decode_utf8_lossy()
    .to_string();

  if path.is_empty() {
    // if the url has no path, we should load `index.html`
    "index.html".to_string()
  } else {
    // skip leading `/`
    path.chars().skip(1).collect()
  }
}

#[cfg(not(ipc_custom_protocol))]
fn handle_ipc_message<R: Runtime>(message: String, manager: &WindowManager<R>, label: &str) {
  if let Some(window) = manager.get_window(label) {
    #[derive(serde::Deserialize)]
    struct Message {
      cmd: String,
      callback: CallbackFn,
      error: CallbackFn,
      #[serde(flatten)]
      payload: serde_json::Value,
    }

    #[allow(unused_mut)]
    let mut invoke_message: Option<crate::Result<Message>> = None;

    #[cfg(feature = "isolation")]
    {
      #[derive(serde::Deserialize)]
      struct IsolationMessage<'a> {
        cmd: String,
        callback: CallbackFn,
        error: CallbackFn,
        #[serde(flatten)]
        payload: RawIsolationPayload<'a>,
      }

      if let Pattern::Isolation { crypto_keys, .. } = manager.pattern() {
        invoke_message.replace(
          serde_json::from_str::<IsolationMessage<'_>>(&message)
            .map_err(Into::into)
            .and_then(|message| {
              Ok(Message {
                cmd: message.cmd,
                callback: message.callback,
                error: message.error,
                payload: serde_json::from_slice(&crypto_keys.decrypt(message.payload)?)?,
              })
            }),
        );
      }
    }

    match invoke_message
      .unwrap_or_else(|| serde_json::from_str::<Message>(&message).map_err(Into::into))
    {
      Ok(message) => {
        let _ = window.on_message(InvokeRequest {
          cmd: message.cmd,
          callback: message.callback,
          error: message.error,
          body: message.payload.into(),
        });
      }
      Err(e) => {
        let _ = window.eval(&format!(
          r#"console.error({})"#,
          serde_json::Value::String(e.to_string())
        ));
      }
    }
  }
}

fn handle_ipc_request<R: Runtime>(
  request: &HttpRequest,
  manager: &WindowManager<R>,
  label: &str,
) -> std::result::Result<InvokeResponse, String> {
  if let Some(window) = manager.get_window(label) {
    // TODO: consume instead
    #[allow(unused_mut)]
    let mut body = request.body().clone();

    let cmd = request
      .uri()
      .strip_prefix("ipc://localhost/")
      .map(|c| c.to_string())
      // the `strip_prefix` only returns None when a request is made to `https://tauri.$P` on Windows
      // where `$P` is not `localhost/*`
      // in this case the IPC call is considered invalid
      .unwrap_or_else(|| "".to_string());
    let cmd = percent_encoding::percent_decode(cmd.as_bytes())
      .decode_utf8_lossy()
      .to_string();

    // the body is not set if ipc_custom_protocol is not enabled so we'll just ignore it
    #[cfg(all(feature = "isolation", ipc_custom_protocol))]
    if let Pattern::Isolation { crypto_keys, .. } = manager.pattern() {
      match RawIsolationPayload::try_from(&body).and_then(|raw| crypto_keys.decrypt(raw)) {
        Ok(data) => body = data,
        Err(e) => {
          return Err(e.to_string());
        }
      }
    }

    let callback = CallbackFn(
      request
        .headers()
        .get("Tauri-Callback")
        .ok_or("missing Tauri-Callback header")?
        .to_str()
        .map_err(|_| "Tauri-Callback header value must be a string")?
        .parse()
        .map_err(|_| "Tauri-Callback header value must be a numeric string")?,
    );
    let error = CallbackFn(
      request
        .headers()
        .get("Tauri-Error")
        .ok_or("missing Tauri-Error header")?
        .to_str()
        .map_err(|_| "Tauri-Error header value must be a string")?
        .parse()
        .map_err(|_| "Tauri-Error header value must be a numeric string")?,
    );

    let content_type = request
      .headers()
      .get(reqwest::header::CONTENT_TYPE)
      .and_then(|h| h.to_str().ok())
      .unwrap_or("application/octet-stream");
    let body = match content_type {
      "application/octet-stream" => body.into(),
      // the body is not set if ipc_custom_protocol is not enabled so we'll just ignore it
      #[cfg(not(ipc_custom_protocol))]
      "application/json" => serde_json::Value::Object(Default::default()).into(),
      #[cfg(ipc_custom_protocol)]
      "application/json" => serde_json::from_slice::<serde_json::Value>(&body)
        .map_err(|e| e.to_string())?
        .into(),
      _ => return Err(format!("unknown content type {content_type}")),
    };

    let payload = InvokeRequest {
      cmd,
      callback,
      error,
      body,
    };

    let rx = window.on_message(payload);
    Ok(rx.recv().unwrap())
  } else {
    Err("window not found".into())
  }
}

#[cfg(test)]
mod tests {
  use super::replace_with_callback;

  #[test]
  fn string_replace_with_callback() {
    let mut tauri_index = 0;
    #[allow(clippy::single_element_loop)]
    for (src, pattern, replacement, result) in [(
      "tauri is awesome, tauri is amazing",
      "tauri",
      || {
        tauri_index += 1;
        tauri_index.to_string()
      },
      "1 is awesome, 2 is amazing",
    )] {
      assert_eq!(replace_with_callback(src, pattern, replacement), result);
    }
  }
}

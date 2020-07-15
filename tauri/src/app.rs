use tauri_config::private::AsTauriConfig;
use tauri_config::Config;
use webview_rust_sys::Webview;

mod runner;

type InvokeHandler = Box<dyn FnMut(&mut Webview, &str) -> Result<(), String>>;
type Setup = Box<dyn FnMut(&mut Webview, String)>;

/// The application runner.
pub struct App {
  /// The JS message handler.
  invoke_handler: Option<InvokeHandler>,
  /// The setup callback, invoked when the webview is ready.
  setup: Option<Setup>,
  /// The HTML of the splashscreen to render.
  splashscreen_html: Option<String>,
  /// The config used
  pub(crate) config: AppConfig,
}

impl App {
  /// Runs the app until it finishes.
  pub fn run(mut self) {
    runner::run(&mut self).expect("Failed to build webview");
  }

  /// Runs the invoke handler if defined.
  /// Returns whether the message was consumed or not.
  /// The message is considered consumed if the handler exists and returns an Ok Result.
  pub(crate) fn run_invoke_handler(
    &mut self,
    webview: &mut Webview,
    arg: &str,
  ) -> Result<bool, String> {
    if let Some(ref mut invoke_handler) = self.invoke_handler {
      invoke_handler(webview, arg).map(|_| true)
    } else {
      Ok(false)
    }
  }

  /// Runs the setup callback if defined.
  pub(crate) fn run_setup(&mut self, webview: &mut Webview, source: String) {
    if let Some(ref mut setup) = self.setup {
      setup(webview, source);
    }
  }

  /// Returns the splashscreen HTML.
  pub fn splashscreen_html(&self) -> Option<&String> {
    self.splashscreen_html.as_ref()
  }
}

/// The App builder.
pub struct AppBuilder {
  /// The JS message handler.
  invoke_handler: Option<InvokeHandler>,
  /// The setup callback, invoked when the webview is ready.
  setup: Option<Setup>,
  /// The HTML of the splashscreen to render.
  splashscreen_html: Option<String>,
  /// The config used
  config: AppConfig,
}

impl AppBuilder {
  /// Creates a new App bulder.
  pub fn new<TauriConfig: AsTauriConfig>() -> Self {
    Self {
      invoke_handler: None,
      setup: None,
      splashscreen_html: None,
      config: AppConfig {
        config: serde_json::from_str(TauriConfig::raw_config()).unwrap(),
        /*assets: TauriConfig::assets(),
        index: TauriConfig::raw_index(),*/
      },
    }
  }

  /// Defines the JS message handler callback.
  pub fn invoke_handler<F: FnMut(&mut Webview, &str) -> Result<(), String> + 'static>(
    mut self,
    invoke_handler: F,
  ) -> Self {
    self.invoke_handler = Some(Box::new(invoke_handler));
    self
  }

  /// Defines the setup callback.
  pub fn setup<F: FnMut(&mut Webview, String) + 'static>(mut self, setup: F) -> Self {
    self.setup = Some(Box::new(setup));
    self
  }

  /// Defines the splashscreen HTML to render.
  pub fn splashscreen_html(mut self, html: &str) -> Self {
    self.splashscreen_html = Some(html.to_string());
    self
  }

  /// Adds a plugin to the runtime.
  pub fn plugin(self, plugin: impl crate::plugin::Plugin + 'static) -> Self {
    crate::plugin::register(plugin);
    self
  }

  /// Builds the App.
  pub fn build(self) -> App {
    App {
      invoke_handler: self.invoke_handler,
      setup: self.setup,
      splashscreen_html: self.splashscreen_html,
      config: self.config,
    }
  }
}

pub(crate) struct AppConfig {
  pub(crate) config: Config,
  /*pub(crate) assets: &'static tauri_includedir::Files,
  pub(crate) index: &'static str,*/
}

use std::{
  collections::HashMap,
  sync::{Arc, Mutex},
};

use serde::{Deserialize, Serialize, Serializer};

use crate::{
  command,
  command::{CommandArg, CommandItem},
  plugin::{Builder as PluginBuilder, TauriPlugin},
  Manager, Runtime, State, Window,
};

use super::{CallbackFn, InvokeBody, InvokeError, IpcResponse, Request, Response};

pub(crate) const IPC_PAYLOAD_PREFIX: &str = "__CHANNEL__:";
const CHANNEL_PLUGIN_NAME: &str = "__TAURI_CHANNEL__";
// TODO: ideally this const references CHANNEL_PLUGIN_NAME
pub(crate) const FETCH_CHANNEL_DATA_COMMAND: &str = "plugin:__TAURI_CHANNEL__|fetch";

#[derive(Default, Clone)]
pub struct ChannelDataCache(pub(crate) Arc<Mutex<HashMap<u32, InvokeBody>>>);

/// An IPC channel.
#[derive(Clone)]
pub struct Channel {
  id: usize,
  on_message: Arc<dyn Fn(InvokeBody) -> crate::Result<()> + Send + Sync>,
}

impl Serialize for Channel {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(&format!("{IPC_PAYLOAD_PREFIX}{}", self.id))
  }
}

impl Channel {
  /// Creates a new channel with the given message handler.
  pub fn new<F: Fn(InvokeBody) -> crate::Result<()> + Send + Sync + 'static>(
    on_message: F,
  ) -> Self {
    Self::_new(rand::random(), on_message)
  }

  pub(crate) fn _new<F: Fn(InvokeBody) -> crate::Result<()> + Send + Sync + 'static>(
    id: usize,
    on_message: F,
  ) -> Self {
    #[allow(clippy::let_and_return)]
    let channel = Self {
      id,
      on_message: Arc::new(on_message),
    };

    #[cfg(mobile)]
    crate::plugin::mobile::register_channel(channel.clone());

    channel
  }

  pub(crate) fn from_ipc<R: Runtime>(window: Window<R>, callback: CallbackFn) -> Self {
    Channel::_new(callback.0, move |body| {
      let data_id = rand::random();
      window
        .state::<ChannelDataCache>()
        .0
        .lock()
        .unwrap()
        .insert(data_id, body);
      window.eval(&format!(
        "__TAURI_INVOKE__('{FETCH_CHANNEL_DATA_COMMAND}', null, {{ headers: {{ 'Tauri-Channel-Id': {data_id} }} }}).then(window['_' + {}])",
        callback.0
      ))
    })
  }

  pub(crate) fn load_from_ipc<R: Runtime>(
    window: Window<R>,
    value: impl AsRef<str>,
  ) -> Option<Self> {
    value
      .as_ref()
      .split_once(IPC_PAYLOAD_PREFIX)
      .and_then(|(_prefix, id)| id.parse().ok())
      .map(|callback_id| Self::from_ipc(window, CallbackFn(callback_id)))
  }

  /// The channel identifier.
  pub fn id(&self) -> usize {
    self.id
  }

  /// Sends the given data through the  channel.
  pub fn send<T: IpcResponse>(&self, data: T) -> crate::Result<()> {
    let body = data.body()?;
    (self.on_message)(body)
  }
}

impl<'de, R: Runtime> CommandArg<'de, R> for Channel {
  /// Grabs the [`Window`] from the [`CommandItem`] and returns the associated [`Channel`].
  fn from_command(command: CommandItem<'de, R>) -> Result<Self, InvokeError> {
    let name = command.name;
    let arg = command.key;
    let window = command.message.window();
    let value: String =
      Deserialize::deserialize(command).map_err(|e| crate::Error::InvalidArgs(name, arg, e))?;
    Channel::load_from_ipc(window, &value).ok_or_else(|| {
      InvokeError::from_anyhow(anyhow::anyhow!(
        "invalid channel value `{value}`, expected a string in the `{IPC_PAYLOAD_PREFIX}ID` format"
      ))
    })
  }
}

#[command(root = "crate")]
fn fetch(
  request: Request<'_>,
  cache: State<'_, ChannelDataCache>,
) -> Result<Response, &'static str> {
  if let Some(id) = request
    .headers()
    .get("Tauri-Channel-Id")
    .and_then(|v| v.to_str().ok())
    .and_then(|id| id.parse().ok())
  {
    if let Some(data) = cache.0.lock().unwrap().remove(&id) {
      Ok(Response::new(data))
    } else {
      Err("data not found")
    }
  } else {
    Err("missing Tauri-Channel-Id header")
  }
}

pub fn plugin<R: Runtime>() -> TauriPlugin<R> {
  PluginBuilder::new(CHANNEL_PLUGIN_NAME)
    .invoke_handler(crate::generate_handler![fetch])
    .build()
}

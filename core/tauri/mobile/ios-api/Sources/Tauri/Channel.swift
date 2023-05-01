public class Channel {
  public let id: UInt64
  let handler: (JsonValue) -> Void

  public init(callback: UInt64, handler: @escaping (JsonValue) -> Void) {
    self.id = callback
    self.handler = handler
  }

  public func send(_ data: JsonObject) {
    handler(.dictionary(data))
  }
}

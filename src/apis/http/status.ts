/**
 * 接口状态码枚举。
 *
 * 同时用于描述后端业务响应 `code` 和常见 HTTP 状态码。
 */
export enum ApiStatus {

  /** 请求成功。 */
  success = 200,

  /** 通用业务错误或请求错误。 */
  error = 400,

  /** 未授权，通常表示 token 失效或未登录。 */
  unauthorized = 401,

  /** 禁止访问，通常表示权限不足。 */
  forbidden = 403,

  /** 资源不存在。 */
  notFound = 404,

  /** 请求方法不被允许。 */
  methodNotAllowed = 405,

  /** 请求超时。 */
  requestTimeout = 408,

  /** 服务器内部错误。 */
  internalServerError = 500,

  /** 服务端未实现当前请求能力。 */
  notImplemented = 501,

  /** 网关错误。 */
  badGateway = 502,

  /** 服务暂不可用。 */
  serviceUnavailable = 503,

  /** 网关超时。 */
  gatewayTimeout = 504,

  /** HTTP 协议版本不受支持。 */
  httpVersionNotSupported = 505,
}

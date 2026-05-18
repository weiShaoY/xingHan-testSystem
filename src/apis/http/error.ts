/**
 * HTTP 错误处理模块
 *
 * 提供统一的 HTTP 请求错误处理机制
 *
 * ## 主要功能
 *
 * - 自定义 HttpError 错误类，封装错误信息、状态码、时间戳等
 * - 错误拦截和转换，将 Axios 错误转换为标准的 HttpError
 * - 错误消息国际化处理，根据状态码返回对应的多语言错误提示
 * - 错误日志记录，便于问题追踪和调试
 * - 错误和成功消息的统一展示
 * - 类型守卫函数，用于判断错误类型
 *
 * ## 使用场景
 *
 * - HTTP 请求拦截器中统一处理错误
 * - 业务代码中捕获和处理特定错误
 * - 错误日志收集和上报
 *
 * @module apis/http/error
 * @author Art Design Pro Team
 */
import type { AxiosError } from 'axios'

import { $t } from '@/locales'

import { ApiStatus } from './status'

/**
 * 后端错误响应结构。
 *
 * 用于描述 Axios 错误响应体中和业务错误相关的字段。
 */
export type ErrorResponse = {

  /** 业务错误码或 HTTP 状态码。 */
  code: number

  /** 后端返回的错误消息，展示时优先使用。 */
  msg: string

  /** 后端返回的错误附加数据。 */
  data?: unknown

}

/**
 * 错误日志结构。
 *
 * `showError` 会通过该结构输出统一的错误日志，便于排查请求地址、
 * 请求方法、响应数据和错误堆栈。
 */
export type ErrorLogData = {

  /** 业务错误码或 HTTP 状态码。 */
  code: number

  /** 用于展示和记录的错误消息。 */
  message: string

  /** 错误响应体或额外上下文数据。 */
  data?: unknown

  /** 错误发生时间，ISO 字符串格式。 */
  timestamp: string

  /** 发生错误的请求地址。 */
  url?: string

  /** 发生错误的请求方法。 */
  method?: string

  /** 错误堆栈信息。 */
  stack?: string
}

/**
 * 标准化 HTTP 错误。
 *
 * 用于统一承载业务错误、HTTP 状态错误和网络错误。相比原生 `Error`，
 * 额外记录错误码、响应体、请求信息和发生时间。
 */
export class HttpError extends Error {
  /** 业务错误码或 HTTP 状态码。 */
  public readonly code: number

  /** 错误响应体或额外上下文数据。 */
  public readonly data?: unknown

  /** 错误发生时间，ISO 字符串格式。 */
  public readonly timestamp: string

  /** 发生错误的请求地址。 */
  public readonly url?: string

  /** 发生错误的请求方法。 */
  public readonly method?: string

  /**
   * 创建标准化 HTTP 错误。
   *
   * @param message 用于展示和记录的错误消息。
   * @param code 业务错误码或 HTTP 状态码。
   * @param options 附加的错误上下文。
   * @param options.data 错误响应体或额外上下文数据。
   * @param options.url 发生错误的请求地址。
   * @param options.method 发生错误的请求方法。
   */
  constructor(
    message: string,
    code: number,
    options?: {
      data?: unknown
      url?: string
      method?: string
    },
  ) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.data = options?.data
    this.timestamp = new Date().toISOString()
    this.url = options?.url
    this.method = options?.method
  }

  /**
   * 转换为日志结构。
   *
   * @returns 可直接输出到控制台或上报系统的错误日志数据。
   */
  public toLogData(): ErrorLogData {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      url: this.url,
      method: this.method,
      stack: this.stack,
    }
  }
}

/**
 * 根据状态码获取国际化错误消息。
 *
 * @param status HTTP 状态码或项目内置错误码。
 * @returns 对应的国际化错误消息；未匹配时返回服务器错误文案。
 */
function getErrorMessage(status: number): string {
  const errorMap: Record<number, string> = {
    [ApiStatus.unauthorized]: 'httpMsg.unauthorized',
    [ApiStatus.forbidden]: 'httpMsg.forbidden',
    [ApiStatus.notFound]: 'httpMsg.notFound',
    [ApiStatus.methodNotAllowed]: 'httpMsg.methodNotAllowed',
    [ApiStatus.requestTimeout]: 'httpMsg.requestTimeout',
    [ApiStatus.internalServerError]: 'httpMsg.internalServerError',
    [ApiStatus.badGateway]: 'httpMsg.badGateway',
    [ApiStatus.serviceUnavailable]: 'httpMsg.serviceUnavailable',
    [ApiStatus.gatewayTimeout]: 'httpMsg.gatewayTimeout',
  }

  return $t(errorMap[status] || 'httpMsg.internalServerError')
}

/**
 * 将 Axios 错误转换为标准化 HTTP 错误。
 *
 * 处理顺序：
 *
 * - 请求取消：转换为 `httpMsg.requestCancelled`。
 * - 网络错误：转换为 `httpMsg.networkError`。
 * - HTTP 错误：优先使用后端 `msg`，否则根据状态码取国际化文案。
 *
 * @param error Axios 抛出的错误对象。
 * @throws {HttpError} 标准化后的 HTTP 错误对象。
 */
export function handleError(error: AxiosError<ErrorResponse>): never {
  // 处理取消的请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('Request cancelled:', error.message)
    throw new HttpError($t('httpMsg.requestCancelled'), ApiStatus.error)
  }

  const statusCode = error.response?.status

  const responseMessage = error.response?.data?.msg

  const requestConfig = error.config

  // 处理网络错误
  if (!error.response) {
    throw new HttpError($t('httpMsg.networkError'), ApiStatus.error, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase(),
    })
  }

  // 处理 HTTP 状态码错误
  const message = responseMessage || (statusCode
    ? getErrorMessage(statusCode)
    : error.message || $t('httpMsg.requestFailed'))

  throw new HttpError(message, statusCode || ApiStatus.error, {
    data: error.response.data,
    url: requestConfig?.url,
    method: requestConfig?.method?.toUpperCase(),
  })
}

/**
 * 显示并记录错误。
 *
 * 当 `showMessage` 为 `true` 时会弹出 Element Plus 错误提示；
 * 无论是否弹出提示，都会输出统一格式的错误日志。
 *
 * @param error 标准化后的 HTTP 错误对象。
 * @param showMessage 是否显示错误消息，默认显示。
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
  if (showMessage) {
    ElNotification.error(error.message)
  }

  // 记录错误日志
  console.error('[HTTP Error]', error.toLogData())
}

/**
 * 显示成功消息。
 *
 * @param message 成功提示内容。
 * @param showMessage 是否显示消息，默认显示。
 */
export function showSuccess(message: string, showMessage: boolean = true): void {
  if (showMessage) {
    ElNotification.success(message)
  }
}

/**
 * 判断错误是否为标准化 HTTP 错误。
 *
 * @param error 待判断的错误对象。
 * @returns `true` 表示错误为 `HttpError` 实例。
 */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}

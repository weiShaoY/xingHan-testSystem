/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理
 *
 * ## 主要功能
 *
 * - 请求/响应拦截器（自动添加 Token、统一错误处理）
 * - 401 未授权自动登出（带防抖机制）
 * - 请求失败自动重试（可配置）
 * - 统一的成功/错误消息提示
 * - 支持 GET/POST/PUT/DELETE 等常用方法
 *
 * @module utils/http
 * @author Art Design Pro Team
 */

import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import type { BaseResponse } from '@/types'

import axios from 'axios'

import { $t } from '@/locales'

import { router } from '@/routers'

import { useAdminUserStore } from '@/store/modules/adminUser'

import { useClientUserStore } from '@/store/modules/clientUser'

import {
  handleError,
  HttpError,
  showError,
  showSuccess,
} from './error'

import { ApiStatus } from './status'

/** 请求超时时间，单位毫秒。 */
const REQUEST_TIMEOUT = 15000

/** 触发退出登录后的延迟时间，避免路由和状态更新抢占。 */
const LOGOUT_DELAY = 500

/** 默认最大重试次数。 */
const MAX_RETRIES = 0

/** 单次重试间隔，单位毫秒。 */
const RETRY_DELAY = 1000

/** 401 错误提示防抖时间，避免多个并发请求重复弹窗。 */
const UNAUTHORIZED_DEBOUNCE_TIME = 3000

/** 当前是否已经展示过 401 错误提示。 */
let isUnauthorizedErrorShown = false

/** 401 错误提示防抖计时器。 */
let unauthorizedTimer: NodeJS.Timeout | null = null

/**
 * 根据当前路由获取对应端的用户状态。
 *
 * - `/client` 开头的页面使用客户端用户状态。
 * - 其他页面默认使用管理端用户状态。
 *
 * @returns 当前路由所属端的用户状态 store。
 */
function getCurrentUserStore() {
  return router.currentRoute.value.path.startsWith('/client') ? useClientUserStore() : useAdminUserStore()
}

/**
 * 根据指定路径获取对应端的用户状态。
 *
 * @param path 用于判断用户端类型的路由路径。
 * @returns 指定路径所属端的用户状态 store。
 */
function getUserStoreByPath(path: string) {
  return path.startsWith('/client') ? useClientUserStore() : useAdminUserStore()
}

/**
 * 项目扩展请求配置。
 *
 * 在 Axios 原生配置基础上补充业务层控制项，用于统一控制消息提示
 * 和跨端 token 读取。
 */
type ExtendedAxiosRequestConfig = AxiosRequestConfig & {

  /** 是否显示请求失败提示，默认显示。 */
  showErrorMessage?: boolean

  /** 是否显示请求成功提示，默认不显示。 */
  showSuccessMessage?: boolean

  /** 指定用于读取 token 的路由路径，不传时根据当前路由自动判断。 */
  authPath?: string
}

const { VITE_APP_API_URL, VITE_APP_WITH_CREDENTIALS } = import.meta.env

/**
 * Axios 实例。
 *
 * 统一配置基础地址、超时时间、跨域凭证和响应转换逻辑。
 * 仅将 HTTP 2xx 视为网络层成功，业务层成功与失败由响应拦截器根据 `code` 判断。
 */
const axiosInstance = axios.create({
  // 设置全局请求超时时间。
  timeout: REQUEST_TIMEOUT,

  // 设置接口基础地址。
  baseURL: VITE_APP_API_URL,

  // 根据环境变量决定是否携带跨域凭证。
  withCredentials: VITE_APP_WITH_CREDENTIALS === 'true',

  // 只把 HTTP 2xx 状态码视为网络层成功。
  validateStatus: status => status >= 200 && status < 300,

  // 自定义响应转换器，保证 JSON 响应被解析成对象。
  transformResponse: [
    // 读取原始响应内容和响应头。
    (data, headers) => {
      // 获取响应内容类型。
      const contentType = headers['content-type']

      // 仅在 JSON 响应时尝试解析。
      if (contentType?.includes('application/json')) {
        try {
          // 将 JSON 字符串转换为 JavaScript 对象。
          return JSON.parse(data)
        }
        catch {
          // JSON 解析失败时保留原始响应内容。
          return data
        }
      }

      // 非 JSON 响应直接返回原始内容。
      return data
    },
  ],
})

/**
 * 请求拦截器。
 *
 * - 自动从当前端或 `authPath` 指定端读取 token，并写入 `Authorization`。
 * - 普通对象请求体默认按 JSON 发送。
 * - `FormData` 保持原样，避免破坏浏览器自动生成的 multipart boundary。
 */
axiosInstance.interceptors.request.use(

  // 请求发送前统一处理配置。
  (request: InternalAxiosRequestConfig) => {
    // 从请求配置中读取业务扩展字段。
    const { authPath } = request as InternalAxiosRequestConfig & ExtendedAxiosRequestConfig

    // 根据指定路径或当前路由选择对应用户状态。
    const { accessToken } = authPath ? getUserStoreByPath(authPath) : getCurrentUserStore()

    console.log('🚀 ~ file: index.ts:167 ~ accessToken:', accessToken)

    // 有 token 时写入 Authorization 请求头。
    if (accessToken) { request.headers.set('Authorization', accessToken) }

    // 普通对象请求体默认按 JSON 发送，FormData 保持浏览器原生处理。
    if (request.data && !(request.data instanceof FormData) && !request.headers['Content-Type']) {
      // 设置 JSON 请求头。
      request.headers.set('Content-Type', 'application/json')

      // 将请求体序列化为 JSON 字符串。
      request.data = JSON.stringify(request.data)
    }

    // 返回处理后的请求配置。
    return request
  },

  // 请求配置阶段发生错误时统一提示。
  (error) => {
    // 展示请求配置错误提示。
    showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error))

    // 继续向调用方抛出原始错误。
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器。
 *
 * 后端统一响应格式为 `{ code, data, msg }`：
 *
 * - `code === ApiStatus.success`：返回完整 Axios 响应，后续由 `request` 解包 `data`。
 * - `code === ApiStatus.unauthorized`：触发退出登录，并做防抖提示。
 * - 其他业务错误：抛出 `HttpError`，错误消息优先使用后端 `msg`。
 *
 * 网络层错误交给 `handleError` 标准化。
 */
axiosInstance.interceptors.response.use(

  // HTTP 2xx 响应会进入这里，再继续判断业务 code。
  (response: AxiosResponse<BaseResponse>) => {
    // 解构后端统一响应中的业务状态码和消息。
    const { code, msg } = response.data

    // 业务成功时返回完整响应，后续 request 函数会解包 data。
    if (code === ApiStatus.success) { return response }

    // 未授权时走统一退出登录和防抖提示逻辑。
    if (code === ApiStatus.unauthorized) { handleUnauthorizedError(msg) }

    // 其他业务错误统一转换成 HttpError。
    throw createHttpError(msg || $t('httpMsg.requestFailed'), code, {
      // 保存完整业务响应，便于日志排查。
      data: response.data,

      // 保存请求地址，便于定位出错接口。
      url: response.config.url,

      // 保存请求方法，并统一转成大写。
      method: response.config.method?.toUpperCase(),
    })
  },

  // 非 HTTP 2xx 或网络错误会进入这里。
  (error) => {
    // HTTP 401 直接走未授权处理。
    if (error.response?.status === ApiStatus.unauthorized) { handleUnauthorizedError() }

    // 将 Axios 错误标准化为 HttpError 后继续抛出。
    return Promise.reject(handleError(error))
  },
)

/**
 * 创建统一的 HTTP 错误对象。
 *
 * @param message 用于展示和记录的错误消息。
 * @param code 业务错误码或 HTTP 状态码。
 * @param options 附加的错误上下文，例如响应体、请求地址和请求方法。
 * @param options.data 错误响应体或附加数据。
 * @param options.url 请求地址。
 * @param options.method 请求方法。
 * @returns 标准化后的 `HttpError` 实例。
 */
function createHttpError(
  message: string,
  code: number,
  options?: {
    data?: unknown
    url?: string
    method?: string
  },
) {
  return new HttpError(message, code, options)
}

/**
 * 处理未授权错误。
 *
 * 第一次触发时会退出登录、展示错误提示，并在防抖时间内屏蔽重复提示；
 * 后续调用仍会抛出 `HttpError`，确保调用方的 promise 链进入失败分支。
 *
 * @param message 后端返回的未授权提示。
 * @throws {HttpError} 始终抛出未授权错误。
 */
function handleUnauthorizedError(message?: string): never {
  const error = createHttpError(message || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)

  if (!isUnauthorizedErrorShown) {
    isUnauthorizedErrorShown = true
    logOut()

    unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME)

    showError(error, true)
    throw error
  }

  throw error
}

/**
 * 重置 401 错误提示防抖状态。
 */
function resetUnauthorizedError() {
  isUnauthorizedErrorShown = false
  if (unauthorizedTimer) { clearTimeout(unauthorizedTimer) }

  unauthorizedTimer = null
}

/**
 * 延迟执行退出登录。
 *
 * 这里使用短延迟让当前错误提示、状态变更和路由跳转有稳定的执行顺序。
 */
function logOut() {
  setTimeout(() => {
    getCurrentUserStore().logOut()
  }, LOGOUT_DELAY)
}

/**
 * 判断错误状态码是否允许重试。
 *
 * @param statusCode 业务错误码或 HTTP 状态码。
 * @returns 是否属于可重试错误。
 */
function shouldRetry(statusCode: number) {
  return [
    ApiStatus.requestTimeout,
    ApiStatus.internalServerError,
    ApiStatus.badGateway,
    ApiStatus.serviceUnavailable,
    ApiStatus.gatewayTimeout,
  ].includes(statusCode)
}

/**
 * 带重试能力的请求包装。
 *
 * 仅当错误为 `HttpError` 且错误码属于可重试范围时才会重试。
 *
 * @typeParam T 解包后的响应数据类型。
 * @param config 请求配置。
 * @param retries 剩余重试次数。
 * @returns 解包后的响应数据。
 * @throws {HttpError} 请求失败或重试耗尽时抛出标准化错误。
 */
async function retryRequest<T>(
  config: ExtendedAxiosRequestConfig,
  retries: number = MAX_RETRIES,
): Promise<T> {
  try {
    return await request<T>(config)
  }
  catch (error) {
    if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
      await delay(RETRY_DELAY)
      return retryRequest<T>(config, retries - 1)
    }

    throw error
  }
}

/**
 * 等待指定时间。
 *
 * @param ms 等待时长，单位毫秒。
 * @returns 在指定时间后完成的 Promise。
 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 执行请求并返回业务数据。
 *
 * - `POST` 和 `PUT` 请求如果只传入 `params`，会自动转为 `data`。
 * - 成功时返回响应体中的 `data` 字段。
 * - `showSuccessMessage` 为 `true` 时显示后端成功消息。
 * - 失败时由拦截器和 `handleError` 标准化为 `HttpError`，并按 `showErrorMessage` 控制是否提示。
 *
 * @typeParam T 解包后的响应数据类型。
 * @param config 请求配置。
 * @returns 响应体中的 `data` 字段。
 * @throws {HttpError} 业务错误、HTTP 错误或网络错误。
 */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  // POST | PUT 参数自动填充
  if (
    ['POST', 'PUT'].includes(config.method?.toUpperCase() || '')
    && config.params
    && !config.data
  ) {
    config.data = config.params
    config.params = undefined
  }

  try {
    const res = await axiosInstance.request<BaseResponse<T>>(config)

    // 显示成功消息
    if (config.showSuccessMessage && res.data.msg) {
      showSuccess(res.data.msg)
    }

    return res.data.data as T
  }
  catch (error) {
    if (error instanceof HttpError && error.code !== ApiStatus.unauthorized) {
      const showMsg = config.showErrorMessage !== false

      showError(error, showMsg)
    }

    return Promise.reject(error)
  }
}

/**
 * API 方法集合。
 *
 * 每个方法都会补全对应 HTTP method，并走统一的重试、错误处理和响应解包逻辑。
 */
const api = {
  /**
   * 发送 GET 请求。
   *
   * @typeParam T 解包后的响应数据类型。
   * @param config 请求配置。
   * @returns 响应体中的 `data` 字段。
   */
  get<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({
      ...config,
      method: 'GET',
    })
  },

  /**
   * 发送 POST 请求。
   *
   * @typeParam T 解包后的响应数据类型。
   * @param config 请求配置。
   * @returns 响应体中的 `data` 字段。
   */
  post<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({
      ...config,
      method: 'POST',
    })
  },

  /**
   * 发送 PUT 请求。
   *
   * @typeParam T 解包后的响应数据类型。
   * @param config 请求配置。
   * @returns 响应体中的 `data` 字段。
   */
  put<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({
      ...config,
      method: 'PUT',
    })
  },

  /**
   * 发送 DELETE 请求。
   *
   * @typeParam T 解包后的响应数据类型。
   * @param config 请求配置。
   * @returns 响应体中的 `data` 字段。
   */
  del<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({
      ...config,
      method: 'DELETE',
    })
  },

  /**
   * 发送自定义 method 请求。
   *
   * @typeParam T 解包后的响应数据类型。
   * @param config 请求配置。
   * @returns 响应体中的 `data` 字段。
   */
  request<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>(config)
  },
}

export default api

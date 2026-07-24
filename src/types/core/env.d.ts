// / <reference types="vite/client" />

type ImportMetaEnv = {

  /** 是否为开发模式 */
  readonly DEV: boolean

  /** 运行环境 */
  readonly VITE_APP_ENV: 'development' | 'production'

  /** 版本号 */
  readonly VITE_APP_VERSION: string

  /** 端口号，注意环境变量读取出来都是字符串 */
  readonly VITE_APP_PORT: string

  /** 应用部署基础路径 */
  readonly VITE_APP_BASE_URL: string

  /** API 地址 */
  readonly VITE_APP_API_URL: string

  /** 开发代理目标地址 */
  readonly VITE_APP_API_PROXY_URL: string

  /** 权限模式 */
  readonly VITE_APP_ACCESS_MODE: 'frontend' | 'backend'

  /** 跨域请求时是否携带 Cookie */
  readonly VITE_APP_WITH_CREDENTIALS: 'true' | 'false'

  /** 是否打开路由信息 */
  readonly VITE_APP_OPEN_ROUTE_INFO: 'true' | 'false'

  /** 是否删除 console */
  readonly VITE_APP_DROP_CONSOLE: 'true' | 'false'

  /** 是否在开发环境跳过登录鉴权 */
  readonly VITE_APP_DEV_SKIP_AUTH: 'true' | 'false'

}

type ImportMeta = {
  readonly env: ImportMetaEnv
}

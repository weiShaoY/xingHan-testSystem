/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 运行环境 */
  readonly VITE_APP_ENV: 'development' | 'production'

  /** 版本号 */
  readonly VITE_VERSION: string

  /** 端口号，注意环境变量读取出来都是字符串 */
  readonly VITE_PORT: string

  /** 应用部署基础路径 */
  readonly VITE_BASE_URL: string

  /** API 地址 */
  readonly VITE_API_URL: string

  /** 开发代理目标地址 */
  readonly VITE_API_PROXY_URL: string

  /** 权限模式 */
  readonly VITE_ACCESS_MODE: 'frontend' | 'backend'

  /** 跨域请求时是否携带 Cookie */
  readonly VITE_WITH_CREDENTIALS: 'true' | 'false'

  /** 是否打开路由信息 */
  readonly VITE_OPEN_ROUTE_INFO: 'true' | 'false'

  /** 是否删除 console */
  readonly VITE_DROP_CONSOLE: 'true' | 'false'

  /** 锁屏加密密钥 */
  readonly VITE_LOCK_ENCRYPT_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

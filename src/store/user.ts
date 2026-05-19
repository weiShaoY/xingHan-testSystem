import { useRoute } from 'vue-router'

import { useAdminUserStore } from './modules/adminUser'

import { useClientUserStore } from './modules/clientUser'

/**
 * 判断指定路径是否属于客户端。
 *
 * @param path 路由路径，通常为 `route.path` 或接口配置中的 `authPath`。
 * @returns `true` 表示客户端路径，`false` 表示管理端路径。
 */
export function isClientPath(path = ''): boolean {
  return path.startsWith('/client')
}

/**
 * 根据路由路径获取对应端的用户 Store。
 *
 * `/client` 开头的路径返回客户端用户 Store，其余路径返回管理端用户 Store。
 * 适合路由守卫、HTTP 拦截器、指令等已经持有明确路径的场景。
 *
 * @param path 路由路径。
 * @returns 当前路径所属端的用户 Store。
 */
export function getUserStoreByPath(path = '') {
  return isClientPath(path) ? useClientUserStore() : useAdminUserStore()
}

/**
 * 获取当前路由所属端的用户 Store。
 *
 * 适合在 Vue 组件 `setup`、组合式函数等可以安全调用 `useRoute()` 的场景。
 *
 * @returns 当前路由所属端的用户 Store。
 */
export function useCurrentUserStore() {
  return getUserStoreByPath(useRoute().path)
}

/**
 * 根据路由路径获取对应端的本地持久化键名。
 *
 * @param path 路由路径。
 * @returns 客户端返回 `clientUser`，管理端返回 `adminUser`。
 */
export function getUserStorageKeyByPath(path = ''): 'clientUser' | 'adminUser' {
  return isClientPath(path) ? 'clientUser' : 'adminUser'
}

/**
 * 根据路由路径获取对应端的登录路由名称。
 *
 * @param path 路由路径。
 * @returns 客户端返回 `ClientLogin`，管理端返回 `AdminLogin`。
 */
export function getLoginRouteNameByPath(path = ''): 'ClientLogin' | 'AdminLogin' {
  return isClientPath(path) ? 'ClientLogin' : 'AdminLogin'
}

/**
 * 获取当前路由所属端的登录路由名称。
 *
 * 适合在 Vue 组件 `setup`、组合式函数等可以安全调用 `useRoute()` 的场景。
 *
 * @returns 当前端对应的登录路由名称。
 */
export function useCurrentLoginRouteName(): 'ClientLogin' | 'AdminLogin' {
  return getLoginRouteNameByPath(useRoute().path)
}

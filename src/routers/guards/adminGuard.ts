import type {
  NavigationGuardReturn,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
} from 'vue-router'

import type { RouteRegistry } from '../core'

import NProgress from 'nprogress'

import { nextTick } from 'vue'

import { isHttpError } from '@/apis/http/error'

import { ApiStatus } from '@/apis/http/status'

import {
  devAdminUserInfo,
  isDevSkipAuthEnabled,
} from '@/config/dev-auth'

import { useCommon } from '@/hooks/core/useCommon'

import { useMenuStore } from '@/store/modules/menu'

import { useSettingStore } from '@/store/modules/setting'

import {
  IframeRouteManager,
  MenuProcessor,
  RoutePermissionValidator,
} from '../core'

import { staticRoutes } from '../entries/static-routes'

/**
 * 路由初始化失败标记。
 *
 * 用于防止动态路由初始化失败后，继续在前置守卫中反复重试形成死循环。
 * 一旦设置为 `true`，只有刷新页面或重新登录后才会被重置。
 */
let routeInitFailed = false

/**
 * 动态路由初始化进行中标记。
 *
 * 用于拦截快速连续导航造成的并发菜单请求和重复注册。
 */
let routeInitInProgress = false

/** 获取管理端动态路由初始化失败状态。 */
export function getAdminRouteInitFailed(): boolean {
  return routeInitFailed
}

/** 重置管理端动态路由初始化状态。 */
export function resetAdminGuardState(): void {
  routeInitFailed = false
  routeInitInProgress = false
}

/**
 * 菜单处理器单例。
 *
 * 延迟创建，避免在路由守卫注册阶段提前触发菜单相关逻辑。
 */
let menuProcessor: MenuProcessor | null = null

/**
 * 是否存在由路由守卫打开、尚未关闭的全屏 loading。
 */
let pendingLoading = false

/**
 * 获取菜单处理器实例。
 *
 * @returns 菜单处理器实例。
 */
function getMenuProcessor(): MenuProcessor {
  if (!menuProcessor) {
    menuProcessor = new MenuProcessor()
  }

  return menuProcessor
}

/**
 * 获取 pendingLoading 状态
 *
 * @returns 当前是否有待关闭的路由 loading。
 */
export function getPendingLoading(): boolean {
  return pendingLoading
}

/**
 * 重置 pendingLoading 状态
 *
 * @remarks 仅重置状态标记，不主动调用 loading 组件的关闭方法。
 */
export function resetPendingLoading(): void {
  pendingLoading = false
}

/**
 * 关闭 loading 效果
 *
 * @remarks 仅关闭由当前路由守卫打开的 loading，避免误关其他业务 loading。
 */
function closeLoading(): void {
  if (pendingLoading) {
    pendingLoading = false

    nextTick(() => {
      loadingService.hideLoading()
    })
  }
}

/**
 * 检查路由是否为静态路由
 *
 * 静态路由不依赖登录态和动态菜单，例如登录页、注册页、错误页等。
 *
 * @param path 需要判断的完整访问路径。
 * @returns 是否命中静态路由配置。
 */
function isStaticRoute(path: string): boolean {
  /**
   * 递归检查路由树中是否存在匹配的静态路由。
   *
   * @param routes 待检查的路由列表。
   * @param targetPath 需要匹配的目标路径。
   * @returns 是否匹配到允许匿名访问的静态路由。
   */
  function checkRoute(routes: any[], targetPath: string): boolean {
    return routes.some((route) => {
      // 404 catch-all 路由不应视为可匿名访问的静态页，
      // 否则未登录时手动输入任意地址会直接落到 404，无法跳转登录页。
      if (route.name === 'Exception404') {
        return false
      }

      // 处理动态路由参数匹配
      const routePath = route.path

      const pattern = routePath.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*')

      const regex = new RegExp(`^${pattern}$`)

      if (regex.test(targetPath)) {
        return true
      }

      if (route.children && route.children.length > 0) {
        return checkRoute(route.children, targetPath)
      }

      return false
    })
  }

  return checkRoute(staticRoutes, path)
}

/**
 * 处理登录状态
 *
 * @param to 即将进入的目标路由。
 * @param adminUserStore 管理端用户状态 store。
 * @returns `true` 表示放行，路由对象表示重定向。
 */
function handleLoginStatus(
  to: RouteLocationNormalized,
  adminUserStore: ReturnType<typeof getUserStoreByPath>,
): true | RouteLocationRaw {
  // 开发环境启用跳过鉴权且目标不是静态路由时，模拟已登录状态。
  if (isDevSkipAuthEnabled && !isStaticRoute(to.path)) {
    // 仅在当前用户尚未登录时写入模拟登录信息。
    if (!adminUserStore.isLogin) {
      // 将当前用户状态标记为已登录。
      adminUserStore.setLoginStatus(true)

      // 写入仅供开发环境使用的模拟访问令牌和刷新令牌。
      adminUserStore.setToken('dev-skip-auth-token', 'dev-skip-auth-refresh-token')
    }

    // 开发环境鉴权已处理完成，允许继续本次导航。
    return true
  }

  // 已登录或目标为静态路由时，无需执行登录重定向。
  if (adminUserStore.isLogin || isStaticRoute(to.path)) {
    // 放行当前导航。
    return true
  }

  // 未登录访问受保护页面时，跳转到对应端的登录页。
  return {
    // 根据目标路径选择管理端或客户端的登录路由。
    name: getLoginRouteNameByPath(to.path),

    // 传递登录成功后的回跳地址。
    query: {
      // 保存包含查询参数的原始完整目标地址。
      redirect: to.fullPath,
    },
  }
}

/**
 * 判断是否为未授权错误（401）
 *
 * @param error 待判断的异常对象。
 * @returns 是否为 HTTP 401 未授权错误。
 */
function isUnauthorizedError(error: unknown): boolean {
  return isHttpError(error) && error.code === ApiStatus.unauthorized
}

/**
 * 判断当前 store 中是否已有可复用的用户信息。
 *
 * @param userInfo 当前缓存的用户信息。
 * @returns 是否已具备基础身份信息。
 */
function hasLoadedUserInfo(
  userInfo: Partial<AdminApi.Auth.UserInfo> | undefined,
): boolean {
  return Boolean(userInfo?.userId)
}

/**
 * 获取用户信息
 */
async function fetchUserInfo(): Promise<void> {
  const adminUserStore = useAdminUserStore()

  if (hasLoadedUserInfo(adminUserStore.userInfo)) {
    adminUserStore.checkAndClearWorkTabs()
    return
  }

  adminUserStore.setUserInfo(
    isDevSkipAuthEnabled
      ? devAdminUserInfo
      : (await fetchAdminGetUserInfo()).userInfo,
  )

  // 检查并清理工作台标签页（如果是不同用户登录）
  adminUserStore.checkAndClearWorkTabs()
}

/**
 * 处理动态路由注册
 *
 * 首次进入需要权限的页面时，会依次获取用户信息、获取菜单、注册动态路由、
 * 保存菜单到 store，并根据权限校验结果恢复或重定向导航。
 *
 * @param to 即将进入的目标路由。
 * @param router Vue Router 实例。
 */
async function handleDynamicRoutes(
  to: RouteLocationNormalized,
  router: Router,
  routeRegistry: RouteRegistry,
): Promise<NavigationGuardReturn> {
  // 标记初始化进行中
  routeInitInProgress = true

  // 显示 loading
  pendingLoading = true

  loadingService.showLoading()

  try {
    // 1. 获取用户信息
    await fetchUserInfo()

    // 2. 获取菜单数据
    const menuProcessor = getMenuProcessor()

    const menuList = await menuProcessor.getMenuList(to.path)

    // 3. 验证菜单数据
    if (!menuProcessor.validateMenuList(menuList)) {
      throw new Error('获取菜单列表失败，请重新登录')
    }

    // 4. 注册动态路由
    routeRegistry.register(menuList)

    // 5. 保存侧边栏菜单数据到 store
    const menuStore = useMenuStore()

    menuStore.setMenuList(menuProcessor.getSidebarMenuList(menuList))

    menuStore.addRemoveRouteFns(routeRegistry.getRemoveRouteFns())

    // 6. 保存 iframe 路由
    IframeRouteManager.getInstance().save()

    // 7. 验证工作标签页
    useWorkTabStore().validateWorkTabs(router)

    // 8. 静态路由不依赖菜单权限，初始化后直接恢复目标地址。
    if (isStaticRoute(to.path)) {
      routeInitInProgress = false
      return {
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    }

    // 8. 验证目标路径权限
    const { homePath } = useCommon()

    const { path: validatedPath, hasPermission } = RoutePermissionValidator.validatePath(
      to.path,
      menuList,
      homePath.value || '/',
    )

    // 初始化成功，重置进行中标记
    routeInitInProgress = false

    // 9. 重新导航到目标路由
    if (!hasPermission) {
      // 无权限访问，跳转到首页
      // 输出警告信息
      console.warn(`[RouteGuard] 用户无权限访问路径: ${to.path}，已跳转到首页`)

      // 直接跳转到首页
      return {
        path: validatedPath,
        replace: true,
      }
    }
    else {
      // 有权限，正常导航
      return {
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    }
  }
  catch (error) {
    console.error('[RouteGuard] 动态路由注册失败:', error)

    // 401 错误：axios 拦截器已处理退出登录，取消当前导航
    if (isUnauthorizedError(error)) {
      // 重置状态，允许重新登录后再次初始化
      routeInitInProgress = false
      return false
    }

    // 标记初始化失败，防止死循环
    routeInitFailed = true
    routeInitInProgress = false

    // 输出详细错误信息，便于排查
    if (isHttpError(error)) {
      console.error(`[RouteGuard] 错误码: ${error.code}, 消息: ${error.message}`)
    }

    // 跳转到 500 页面，使用 replace 避免产生历史记录
    return {
      name: 'Exception500',
      replace: true,
    }
  }
  finally {
    // 所有初始化结果都必须关闭由本守卫打开的 loading。
    closeLoading()
  }
}

/**
 * 处理根路径重定向到首页
 *
 * @param to 即将进入的目标路由。
 * @returns 重定向目标；未处理时返回 `undefined`。
 */
function getRootPathRedirect(to: RouteLocationNormalized): RouteLocationRaw | undefined {
  // 当前目标不是根路径时，无需执行首页重定向。
  if (to.path !== '/') {
    // 返回 false，交由后续守卫逻辑继续处理。
    return undefined
  }

  // 获取当前端配置的默认首页路径。
  const { homePath } = useCommon()

  // 仅在首页路径有效且不是根路径时发起重定向。
  if (homePath.value && !['/', '/admin'].includes(homePath.value)) {
    // 返回配置的默认首页，由 Vue Router 执行替换导航。
    return {
      path: homePath.value,
      replace: true,
    }
  }

  // 未配置可用首页时，不处理当前导航。
  return undefined
}

/**
 *  后台路由守卫设置
 */
export async function adminGuard(
  to: RouteLocationNormalized,
  router: Router,
  routeRegistry: RouteRegistry,
): Promise<NavigationGuardReturn> {
  const settingStore = useSettingStore()

  const adminUserStore = useAdminUserStore()

  // 启动进度条
  if (settingStore.showNprogress) {
    NProgress.start()
  }

  // 1. 检查登录状态
  const loginResult = handleLoginStatus(to, adminUserStore)

  if (loginResult !== true) {
    return loginResult
  }

  // 2. 检查路由初始化是否已失败（防止死循环）
  if (routeInitFailed) {
    // 已经失败过，直接放行到错误页面，不再重试
    if (to.matched.length > 0) {
      return true
    }
    else {
      // 未匹配到路由，跳转到 500 页面
      return {
        name: 'Exception500',
        replace: true,
      }
    }
  }

  // 3. 处理动态路由注册
  if (!routeRegistry.isRegistered() && adminUserStore.isLogin) {
    // 防止并发请求（快速连续导航场景）
    if (routeInitInProgress) {
      // 正在初始化中，等待完成后重新导航
      return false
    }

    return await handleDynamicRoutes(to, router, routeRegistry)
  }

  // 4. 处理根路径重定向
  const rootRedirect = getRootPathRedirect(to)

  if (rootRedirect) {
    return rootRedirect
  }

  // 5. 处理已匹配的路由
  if (to.matched.length > 0) {
    setWorkTab(to)
    setPageTitle(to)
    return true
  }

  // 6. 未匹配到路由，跳转到 404
  return {
    name: 'Exception404',
  }
}

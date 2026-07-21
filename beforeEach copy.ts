/**
 * 路由全局前置守卫模块
 *
 * 提供完整的路由导航守卫功能
 *
 * ## 主要功能
 *
 * - 登录状态验证和重定向
 * - 动态路由注册和权限控制
 * - 菜单数据获取和处理（前端/后端模式）
 * - 用户信息获取和缓存
 * - 页面标题设置
 * - 工作标签页管理
 * - 进度条和加载动画控制
 * - 静态路由识别和处理
 * - 错误处理和异常跳转
 *
 * ## 使用场景
 *
 * - 路由跳转前的权限验证
 * - 动态菜单加载和路由注册
 * - 用户登录状态管理
 * - 页面访问控制
 * - 路由级别的加载状态管理
 *
 * ## 工作流程
 *
 * 1. 检查登录状态，未登录跳转到登录页
 * 2. 首次访问时获取用户信息和菜单数据
 * 3. 根据权限动态注册路由
 * 4. 设置页面标题和工作标签页
 * 5. 处理根路径重定向到首页
 * 6. 未匹配路由跳转到 404 页面
 *
 * @module router/guards/beforeEach
 * @author Art Design Pro Team
 */
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from 'vue-router'

import NProgress from 'nprogress'

import { nextTick } from 'vue'

import { isHttpError } from '@/apis/http/error'

import { ApiStatus } from '@/apis/http/status'

import {
  devAdminUserInfo,
  devClientUserInfo,
  isDevSkipAuthEnabled,
} from '@/config/dev-auth'

import { useCommon } from '@/hooks/core/useCommon'

import {
  getLoginRouteNameByPath,
  isClientPath,
} from '@/store'

import { useAdminUserStore } from '@/store/modules/adminUser'

import { useClientUserStore } from '@/store/modules/clientUser'

import { useMenuStore } from '@/store/modules/menu'

import { useSettingStore } from '@/store/modules/setting'

import { useWorkTabStore } from '@/store/modules/workTab'

import { setWorkTab } from '@/utils/navigation'

import { setPageTitle } from '@/utils/router'

import { loadingService } from '@/utils/ui'

import {
  IframeRouteManager,
  MenuProcessor,
  RoutePermissionValidator,
  RouteRegistry,
} from '../core'

import { staticRoutes } from '../entries/static-routes'

/**
 * 动态路由注册器实例。
 *
 * 在初始化前置守卫时创建，用于判断动态路由是否已注册、
 * 注册菜单生成的路由，以及退出登录时移除动态路由。
 */
let routeRegistry: RouteRegistry | null = null

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
    nextTick(() => {
      loadingService.hideLoading()
      pendingLoading = false
    })
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
 * 获取路由初始化失败状态
 *
 * @returns 动态路由初始化是否已经失败。
 */
export function getRouteInitFailed(): boolean {
  return routeInitFailed
}

/**
 * 重置路由初始化状态（用于重新登录场景）
 *
 * @remarks 重新登录后需要允许系统再次拉取用户信息和菜单，并重新注册动态路由。
 */
export function resetRouteInitState(): void {
  routeInitFailed = false
  routeInitInProgress = false
}

/**
 * 重置路由相关状态
 *
 * @param delay 延迟执行重置的毫秒数，常用于等待退出登录跳转完成。
 */
export function resetRouterState(delay: number): void {
  setTimeout(() => {
    routeRegistry?.unregister()

    IframeRouteManager.getInstance().clear()

    const menuStore = useMenuStore()

    menuStore.removeAllDynamicRoutes()
    menuStore.setMenuList([])

    // 重置路由初始化状态，允许重新登录后再次初始化
    resetRouteInitState()
  }, delay)
}

/**
 * 处理路由守卫逻辑
 *
 * @param to 即将进入的目标路由。
 * @param from 当前导航离开的来源路由。
 * @param next Vue Router 导航控制函数。
 * @param router Vue Router 实例。
 */
async function handleRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router,
): Promise<void> {
  const settingStore = useSettingStore()

  const userStore = getUserStoreByPath(to.path)

  // 启动进度条
  if (settingStore.showNprogress) {
    NProgress.start()
  }

  // 1. 检查登录状态
  if (!handleLoginStatus(to, userStore, next)) {
    return
  }

  // 2. 检查路由初始化是否已失败（防止死循环）
  if (routeInitFailed) {
    // 已经失败过，直接放行到错误页面，不再重试
    if (to.matched.length > 0) {
      next()
    }
    else {
      // 未匹配到路由，跳转到 500 页面
      next({
        name: 'Exception500',
        replace: true,
      })
    }

    return
  }

  // 3. 处理动态路由注册
  if (!routeRegistry?.isRegistered() && userStore.isLogin) {
    // 防止并发请求（快速连续导航场景）
    if (routeInitInProgress) {
      // 正在初始化中，等待完成后重新导航
      next(false)
      return
    }

    await handleDynamicRoutes(to, next, router)

    return
  }

  // 4. 处理根路径重定向
  if (handleRootPathRedirect(to, next)) {
    return
  }

  // 5. 处理已匹配的路由
  if (to.matched.length > 0) {
    setWorkTab(to)
    setPageTitle(to)
    next()
    return
  }

  // 6. 未匹配到路由，跳转到 404
  next({
    name: 'Exception404',
  })
}

/**
 * 处理动态路由注册
 *
 * 首次进入需要权限的页面时，会依次获取用户信息、获取菜单、注册动态路由、
 * 保存菜单到 store，并根据权限校验结果恢复或重定向导航。
 *
 * @param to 即将进入的目标路由。
 * @param next Vue Router 导航控制函数。
 * @param router Vue Router 实例。
 */
async function handleDynamicRoutes(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router,
): Promise<void> {
  // 标记初始化进行中
  routeInitInProgress = true

  // 显示 loading
  pendingLoading = true

  loadingService.showLoading()

  try {
    // 1. 获取用户信息
    await fetchUserInfo(to.path)

    // 2. 获取菜单数据
    const menuProcessor = getMenuProcessor()

    const menuList = await menuProcessor.getMenuList(to.path)

    // 3. 验证菜单数据
    if (!menuProcessor.validateMenuList(menuList)) {
      throw new Error('获取菜单列表失败，请重新登录')
    }

    // 4. 注册动态路由
    routeRegistry?.register(menuList)

    // 5. 保存侧边栏菜单数据到 store
    const menuStore = useMenuStore()

    menuStore.setMenuList(menuProcessor.getSidebarMenuList(menuList))

    menuStore.addRemoveRouteFns(routeRegistry?.getRemoveRouteFns() || [])

    // 6. 保存 iframe 路由
    IframeRouteManager.getInstance().save()

    // 7. 验证工作标签页
    useWorkTabStore().validateWorkTabs(router)

    // 8. 静态路由不依赖菜单权限，初始化后直接恢复目标地址。
    if (isStaticRoute(to.path)) {
      routeInitInProgress = false
      next({
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      })
      return
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
      closeLoading()

      // 输出警告信息
      console.warn(`[RouteGuard] 用户无权限访问路径: ${to.path}，已跳转到首页`)

      // 直接跳转到首页
      next({
        path: validatedPath,
        replace: true,
      })
    }
    else {
      // 有权限，正常导航
      next({
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      })
    }
  }
  catch (error) {
    console.error('[RouteGuard] 动态路由注册失败:', error)

    // 关闭 loading
    closeLoading()

    // 401 错误：axios 拦截器已处理退出登录，取消当前导航
    if (isUnauthorizedError(error)) {
      // 重置状态，允许重新登录后再次初始化
      routeInitInProgress = false
      next(false)
      return
    }

    // 标记初始化失败，防止死循环
    routeInitFailed = true
    routeInitInProgress = false

    // 输出详细错误信息，便于排查
    if (isHttpError(error)) {
      console.error(`[RouteGuard] 错误码: ${error.code}, 消息: ${error.message}`)
    }

    // 跳转到 500 页面，使用 replace 避免产生历史记录
    next({
      name: 'Exception500',
      replace: true,
    })
  }
}

/**
 * 处理登录状态
 *
 * @param to 即将进入的目标路由。
 * @param userStore 当前目标端对应的用户状态 store。
 * @param next Vue Router 导航控制函数。
 * @returns true 表示可以继续，false 表示已处理跳转
 */
function handleLoginStatus(
  to: RouteLocationNormalized,
  userStore: ReturnType<typeof getUserStoreByPath>,
  next: NavigationGuardNext,
): boolean {
  if (isDevSkipAuthEnabled && !isStaticRoute(to.path)) {
    if (!userStore.isLogin) {
      userStore.setLoginStatus(true)
      userStore.setToken('dev-skip-auth-token', 'dev-skip-auth-refresh-token')
    }

    return true
  }

  // 已登录或访问登录页或静态路由，直接放行
  if (userStore.isLogin || isStaticRoute(to.path)) {
    return true
  }

  // 未登录且访问需要权限的页面，跳转到登录页并携带 redirect 参数
  next({
    name: getLoginRouteNameByPath(to.path),
    query: {
      redirect: to.fullPath,
    },
  })
  return false
}

/**
 * 处理根路径重定向到首页
 *
 * @param to 即将进入的目标路由。
 * @param next Vue Router 导航控制函数。
 * @returns true 表示已处理跳转，false 表示无需跳转
 */
function handleRootPathRedirect(to: RouteLocationNormalized, next: NavigationGuardNext): boolean {
  if (to.path !== '/') {
    return false
  }

  const { homePath } = useCommon()

  if (homePath.value && homePath.value !== '/') {
    next({
      path: homePath.value,
      replace: true,
    })
    return true
  }

  return false
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
 * 获取用户信息
 *
 * @param path 当前访问路径，用于选择管理端或客户端对应的用户 store。
 */
async function fetchUserInfo(path: string): Promise<void> {
  if (isClientPath(path)) {
    const userStore = useClientUserStore()

    if (hasLoadedUserInfo(userStore.userInfo)) {
      userStore.checkAndClearWorkTabs()
      return
    }

    userStore.setUserInfo(
      isDevSkipAuthEnabled
        ? devClientUserInfo
        : (await fetchClientGetUserInfo(path)).userInfo,
    )
    userStore.checkAndClearWorkTabs()
    return
  }

  const userStore = useAdminUserStore()

  if (hasLoadedUserInfo(userStore.userInfo)) {
    userStore.checkAndClearWorkTabs()
    return
  }

  userStore.setUserInfo(
    isDevSkipAuthEnabled
      ? devAdminUserInfo
      : (await fetchAdminGetUserInfo(path)).userInfo,
  )

  // 检查并清理工作台标签页（如果是不同用户登录）
  userStore.checkAndClearWorkTabs()
}

/**
 * 判断当前 store 中是否已有可复用的用户信息。
 *
 * @param userInfo 当前缓存的用户信息。
 * @returns 是否已具备基础身份信息。
 */
function hasLoadedUserInfo(
  userInfo: Partial<AdminApi.Auth.UserInfo> | Partial<ClientApi.Auth.UserInfo> | undefined,
): boolean {
  return Boolean(userInfo?.userId)
}

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
 * 设置路由全局前置守卫
 *
 * @param router Vue Router 实例。
 */
export function setupBeforeEachGuard(router: Router): void {
  // 初始化路由注册器
  routeRegistry = new RouteRegistry(router)

  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      try {
        await handleRouteGuard(to, from, next, router)
      }
      catch (error) {
        console.error('[RouteGuard] 路由守卫处理失败:', error)
        closeLoading()
        next({
          name: 'Exception500',
        })
      }
    },
  )

  // 分开写路由守卫设置
  // router.beforeEach((to, from, next) => {
  // // 后台路由
  //   if (to.path.startsWith('/admin')) {
  //     const token = localStorage.getItem('admin_token')

  //     if (!token && to.path !== '/admin/login') { return next('/admin/login') }
  //   }

  //   // 前台路由
  //   else {
  //     const token = localStorage.getItem('front_token')

  //     if (!token && to.path !== '/login') { return next('/login') }
  //   }

  //   next()
  // })

  // 前台路由守卫设置

  // 后台路由守卫设置
}

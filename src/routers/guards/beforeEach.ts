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
  RouteLocationNormalized,
  Router,
} from 'vue-router'

import { nextTick } from 'vue'

import { useMenuStore } from '@/store/modules/menu'

import { loadingService } from '@/utils/ui'

import {
  IframeRouteManager,
  RouteRegistry,
} from '../core'

import {
  adminGuard,
  getAdminRouteInitFailed,
  resetAdminGuardState,
} from './adminGuard'

import {
  clientGuard,
  getClientRouteInitFailed,
  resetClientGuardState,
} from './clientGuard'

/**
 * 动态路由注册器实例。
 *
 * 在初始化前置守卫时创建，用于判断动态路由是否已注册、
 * 注册菜单生成的路由，以及退出登录时移除动态路由。
 */
let adminRouteRegistry: RouteRegistry | null = null

/** 客户端动态路由注册器。 */
let clientRouteRegistry: RouteRegistry | null = null

/**
 * 是否存在由路由守卫打开、尚未关闭的全屏 loading。
 */
let pendingLoading = false

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
 * 获取路由初始化失败状态
 *
 * @returns 动态路由初始化是否已经失败。
 */
export function getRouteInitFailed(): boolean {
  return getAdminRouteInitFailed() || getClientRouteInitFailed()
}

/**
 * 重置路由初始化状态（用于重新登录场景）
 *
 * @remarks 重新登录后需要允许系统再次拉取用户信息和菜单，并重新注册动态路由。
 */
export function resetRouteInitState(): void {
  resetAdminGuardState()
  resetClientGuardState()
}

/**
 * 重置路由相关状态
 *
 * @param delay 延迟执行重置的毫秒数，常用于等待退出登录跳转完成。
 */
export function resetRouterState(delay: number): void {
  setTimeout(() => {
    adminRouteRegistry?.unregister()
    clientRouteRegistry?.unregister()

    IframeRouteManager.getInstance().clear()

    const menuStore = useMenuStore()

    menuStore.removeAllDynamicRoutes()
    menuStore.setMenuList([])

    // 重置路由初始化状态，允许重新登录后再次初始化
    resetRouteInitState()
  }, delay)
}

/**
 * 设置路由全局前置守卫
 *
 * @param router Vue Router 实例。
 */
export function setupBeforeEachGuard(router: Router): void {
  // 两端的动态路由独立注册和注销，避免其中一端的初始化状态阻塞另一端。
  const adminRegistry = new RouteRegistry(router)

  const clientRegistry = new RouteRegistry(router)

  adminRouteRegistry = adminRegistry
  clientRouteRegistry = clientRegistry

  router.beforeEach(
    async (to: RouteLocationNormalized) => {
      try {
        if (to.path.startsWith('/admin')) {
          return await adminGuard(to, router, adminRegistry)
        }
        else if (to.path.startsWith('/client')) {
          return await clientGuard(to, clientRegistry)
        }

        // 错误页、根路径和兜底路由不属于任一端，直接交给路由表处理。
        return true
      }
      catch (error) {
        console.error('[RouteGuard] 路由守卫处理失败:', error)
        closeLoading()
        return {
          name: 'Exception500',
        }
      }
    },
  )
}

import type { App } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'

import { configureNProgress } from '@/utils/router'

import { staticRoutes } from './entries/static-routes'

import { setupAfterEachGuard } from './guards/afterEach'

import { setupBeforeEachGuard } from './guards/beforeEach'

/**
 * 路由实例
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
})

/**
 * 初始化路由
 * @param app 应用实例
 */
export function initRouter(app: App<Element>): void {
  // 顶部进度条
  configureNProgress()

  // 路由前置守卫
  setupBeforeEachGuard(router)

  // 路由后置守卫
  setupAfterEachGuard(router)

  app.use(router)
}

/**
 * 主页路径
 * @description 主页路径，默认使用菜单第一个有效路径，配置后使用此路径
 */
export const HOME_PAGE_PATH = ''

export const CLIENT_HOME_PAGE_PATH = '/client/home'

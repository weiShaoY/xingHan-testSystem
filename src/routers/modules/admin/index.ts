import type { AppRouteRecord } from '@/types/router'

import { loadRouteModules } from '@/routers/core'

import { RoutesAlias } from '../../routesAlias'

/**
 * 管理端功能模块
 */
function loadAdminModules(): AppRouteRecord[] {
  const modules = import.meta.glob('./*.ts', {
    eager: true,
    import: '*',
  }) as Record<string, Record<string, unknown>>

  return loadRouteModules(modules)
}

const adminModules: AppRouteRecord[] = loadAdminModules()

/**
 * 管理端根路由
 */
export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: RoutesAlias.AdminLayout,
  meta: {
    title: '管理端',
    icon: 'ri:shield-line',
    isMenuRoot: true,
  },
  redirect: '/admin/course/list',

  children: adminModules,
}

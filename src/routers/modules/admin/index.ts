import type { AppRouteRecord } from '@/types/router'

import { RoutesAlias } from '../../routesAlias'

/**
 * 管理端功能模块
 */
function loadAdminModules(): AppRouteRecord[] {
  const modules = import.meta.glob('./*.ts', {
    eager: true,
    import: '*',
  }) as Record<string, Record<string, unknown>>

  const routeModules: AppRouteRecord[] = []

  const isRouteRecord = (value: unknown): value is AppRouteRecord => {
    if (!value || typeof value !== 'object') { return false }

    const route = value as Partial<AppRouteRecord>

    return typeof route.path === 'string'
  }

  Object.entries(modules)
    .filter(([filePath]) => filePath !== './index.ts')
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([, moduleExports]) => {
      Object.entries(moduleExports).forEach(([exportName, value]) => {
        if (!value) { return }

        // 兼容 xxxRoutes 命名（对象/数组）以及直接导出路由对象（如 Project）
        if (Array.isArray(value)) {
          const validRoutes = (value as unknown[]).filter(isRouteRecord) as AppRouteRecord[]

          routeModules.push(...validRoutes)
          return
        }

        if (exportName.endsWith('Routes') || isRouteRecord(value)) {
          routeModules.push(value as AppRouteRecord)
        }
      })
    })

  return sortRoutes(routeModules)
}

function sortRoutes(routes: AppRouteRecord[]): AppRouteRecord[] {
  return [...routes].sort((a, b) => {
    const aSort = a.meta?.sort

    const bSort = b.meta?.sort

    const aOrder = Number.isFinite(aSort) ? (aSort as number) : Number.MAX_SAFE_INTEGER

    const bOrder = Number.isFinite(bSort) ? (bSort as number) : Number.MAX_SAFE_INTEGER

    return aOrder - bOrder
  })
}

const adminModules: AppRouteRecord[] = loadAdminModules()

/**
 * 管理端根路由
 */
export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: RoutesAlias.Layout,
  meta: {
    title: '管理端',
    icon: 'ri:shield-line',
    isMenuRoot: true,
  },
  redirect: '/admin/dashboard/console',
  children: adminModules,
}

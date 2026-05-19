import type { AppRouteRecord } from '@/types/router'

/** Vite glob eager 导入后的路由模块集合。 */
type RouteModuleMap = Record<string, Record<string, unknown>>

/**
 * 判断未知值是否为项目路由配置。
 *
 * 这里只做最小必要判断：拥有字符串类型的 `path` 即认为是路由记录。
 * 更完整的字段校验会在动态路由注册阶段继续处理。
 *
 * @param value 待判断的模块导出值。
 * @returns 是否为项目路由配置。
 */
function isRouteRecord(value: unknown): value is AppRouteRecord {
  if (!value || typeof value !== 'object') { return false }

  const route = value as Partial<AppRouteRecord>

  return typeof route.path === 'string'
}

/**
 * 获取路由排序值。
 *
 * 未配置 `meta.sort` 的路由统一放到最后，并保持原有相对顺序。
 *
 * @param route 路由配置。
 * @returns 可用于排序的数值。
 */
function getRouteSortValue(route: AppRouteRecord): number {
  const sort = route.meta?.sort

  return Number.isFinite(sort) ? (sort as number) : Number.MAX_SAFE_INTEGER
}

/**
 * 按 `meta.sort` 对路由模块排序。
 *
 * @param routes 路由配置列表。
 * @returns 排序后的新数组，不修改原数组。
 */
export function sortRouteModules(routes: AppRouteRecord[]): AppRouteRecord[] {
  return [...routes].sort((a, b) => getRouteSortValue(a) - getRouteSortValue(b))
}

/**
 * 从 Vite glob 导入结果中提取路由模块。
 *
 * 支持以下导出形式：
 * - 直接导出单个路由对象。
 * - 导出路由对象数组。
 * - 使用 `xxxRoutes` 命名导出路由对象。
 *
 * @param modules `import.meta.glob(..., { eager: true, import: '*' })` 的返回值。
 * @param excludeFiles 需要排除的模块文件路径，默认排除当前目录入口 `./index.ts`。
 * @returns 过滤并排序后的路由模块列表。
 */
export function loadRouteModules(
  modules: RouteModuleMap,
  excludeFiles: string[] = ['./index.ts'],
): AppRouteRecord[] {
  const routeModules: AppRouteRecord[] = []

  Object.entries(modules)
    .filter(([filePath]) => !excludeFiles.includes(filePath))
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([, moduleExports]) => {
      Object.entries(moduleExports).forEach(([exportName, value]) => {
        if (!value) { return }

        // 兼容数组导出，便于一个文件维护多个同级路由。
        if (Array.isArray(value)) {
          routeModules.push(...value.filter(isRouteRecord))
          return
        }

        // 兼容 xxxRoutes 命名导出，以及直接导出路由对象的写法。
        if (exportName.endsWith('Routes') || isRouteRecord(value)) {
          routeModules.push(value as AppRouteRecord)
        }
      })
    })

  return sortRouteModules(routeModules)
}

import type { App as VueApp } from 'vue'

/**
 * 插件统一导出
 * 集中管理第三方库的封装和配置
 */

export * from './echarts'

import './svgIcons'

/**
 * 设置插件
 * @param app - Vue 应用实例
 */
export function setupPlugins(app: VueApp) {
  console.log('🚀 ~ file: index.ts:15 ~ app:', app)
}

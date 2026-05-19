/**
 * Pinia Store 配置模块
 *
 * 提供全局状态管理的初始化和配置
 *
 * ## 主要功能
 *
 * - Pinia Store 实例创建
 * - 持久化插件配置（pinia-plugin-persistedstate）
 * - 版本化存储键管理
 * - 自动数据迁移（跨版本）
 * - LocalStorage 序列化配置
 * - Store 初始化函数
 *
 * ## 持久化策略
 *
 * - 使用 StorageKeyManager 生成版本化的存储键
 * - 格式：sys-v{version}-{storeId}
 * - 自动迁移旧版本数据到当前版本
 * - 使用 localStorage 作为存储介质
 *
 * @module store/index
 * @author Art Design Pro Team
 */
import type { App } from 'vue'

import { createPinia } from 'pinia'

import { createPersistedState } from 'pinia-plugin-persistedstate'

import { StorageKeyManager } from '@/utils/storage/storage-key-manager'

/**
 * 全局 Pinia Store 实例。
 *
 * 应用内所有 Pinia 模块都会挂载到该实例上。
 */
export const store = createPinia()

/**
 * 存储键管理器实例。
 *
 * 用于为持久化 Store 生成带系统版本号的 localStorage 键名，
 * 并支持跨版本数据迁移。
 */
// const storageKeyManager = new StorageKeyManager()

/**
 * 注册 Pinia 持久化插件。
 *
 * 统一配置持久化键名、存储介质和 JSON 序列化方式。
 */
store.use(
  createPersistedState({
    /** 根据 Store ID 生成版本化存储键。 */
    // key: (storeId: string) => storageKeyManager.getStorageKey(storeId),

    /** 使用 localStorage 保存持久化状态。 */
    storage: localStorage,

    /** 配置 JSON 序列化器。 */
    serializer: {
      /** 将 Store 状态序列化为字符串。 */
      serialize: JSON.stringify,

      /** 将本地存储字符串反序列化为 Store 状态。 */
      deserialize: JSON.parse,
    },
  }),
)

/**
 * 初始化 Store。
 *
 * 将全局 Pinia Store 实例注册到 Vue 应用中。
 *
 * @param app Vue 应用实例。
 */
export function initStore(app: App<Element>): void {
  app.use(store)
}

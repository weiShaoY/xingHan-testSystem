/**
 * 存储配置管理模块
 *
 * 提供统一的本地存储键名配置
 *
 * ## 主要功能
 *
 * - 主题存储键配置
 * - 用户相关存储键配置
 * - 响应式布局存储键配置
 *
 * @module utils/storage/storage-config
 * @author Art Design Pro Team
 */
export class StorageConfig {
  /** 主题键名（index.html中使用了，如果修改，需要同步修改） */
  static readonly THEME_KEY = 'sys-theme'

  /** 上次登录用户ID键名（用于判断是否为同一用户登录） */
  static readonly LAST_USER_ID_KEY = 'sys-last-user-id'

  /** 响应式布局切换时暂存桌面端菜单类型 */
  static readonly RESPONSIVE_MENU_TYPE_KEY = 'sys-responsive-menu-type'
}

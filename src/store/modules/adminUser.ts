import type { AppRouteRecord } from '@/types/router'

import { defineStore } from 'pinia'

import { computed, ref } from 'vue'

import { LanguageEnum } from '@/enums/appEnum'

import { router } from '@/routers'

import { resetRouterState } from '@/routers/guards/beforeEach'

import { setPageTitle } from '@/utils/router'

import { StorageConfig } from '@/utils/storage/storage-config'

import { useMenuStore } from './menu'

import { useSettingStore } from './setting'

import { useWorkTabStore } from './workTab'

/**
 * 后台端最后一次登录用户 ID 的本地存储键。
 * 用于在切换用户后清理不属于当前用户的工作台标签页。
 */
const ADMIN_LAST_USER_ID_KEY = `${StorageConfig.LAST_USER_ID_KEY}:admin`

/**
 * 后台用户状态 Store。
 *
 * 负责维护后台端用户登录态、用户信息、语言、锁屏状态、访问令牌、
 * 搜索历史以及与用户相关的持久化状态。
 */
export const useAdminUserStore = defineStore(
  'adminUserStore',
  () => {
    /** 当前后台端语言。 */
    const language = ref(LanguageEnum.ZH)

    /** 当前后台用户是否已登录。 */
    const isLogin = ref(false)

    /** 当前后台页面是否处于锁屏状态。 */
    const isLock = ref(false)

    /** 锁屏密码。 */
    const lockPassword = ref('')

    /** 当前后台用户信息。 */
    const userInfo = ref<Partial<AdminApi.Auth.UserInfo>>({
    })

    /** 后台端搜索历史记录。 */
    const searchHistory = ref<AppRouteRecord[]>([])

    /** 后台端访问令牌。 */
    const accessToken = ref('')

    /** 后台端刷新令牌。 */
    const refreshToken = ref('')

    /** 获取当前后台用户信息。 */
    const getUserInfo = computed(() => userInfo.value)

    /** 获取系统设置状态。 */
    const getSettingState = computed(() => useSettingStore().$state)

    /** 获取工作台标签页状态。 */
    const getWorkTabState = computed(() => useWorkTabStore().$state)

    /**
     * 设置后台用户登录状态。
     *
     * @param status 是否已登录。
     */
    function setLoginStatus(status: boolean) {
      isLogin.value = status
    }

    /**
     * 设置当前后台用户信息。
     *
     * @param newInfo 新的后台用户信息。
     */
    function setUserInfo(newInfo: AdminApi.Auth.UserInfo) {
      userInfo.value = newInfo
    }

    /**
     * 设置后台端语言，并同步更新当前页面标题。
     *
     * @param lang 目标语言。
     */
    function setLanguage(lang: LanguageEnum) {
      setPageTitle(router.currentRoute.value)
      language.value = lang
    }

    /**
     * 设置后台端搜索历史。
     *
     * @param list 搜索历史路由列表。
     */
    function setSearchHistory(list: AppRouteRecord[]) {
      searchHistory.value = list
    }

    /**
     * 设置后台端锁屏状态。
     *
     * @param status 是否锁屏。
     */
    function setLockStatus(status: boolean) {
      isLock.value = status
    }

    /**
     * 设置锁屏密码。
     *
     * @param password 锁屏密码。
     */
    function setLockPassword(password: string) {
      lockPassword.value = password
    }

    /**
     * 设置后台端访问令牌和刷新令牌。
     *
     * @param newAccessToken 新的访问令牌。
     * @param newRefreshToken 新的刷新令牌，未传入时保留原刷新令牌。
     */
    function setToken(newAccessToken: string, newRefreshToken?: string) {
      accessToken.value = newAccessToken
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
      }
    }

    /**
     * 退出后台登录。
     *
     * 清空用户信息、登录态、锁屏状态、令牌和 iframe 路由缓存，
     * 重置菜单首页与动态路由状态，并跳转到后台登录页。
     */
    function logOut() {
      const currentUserId = userInfo.value.userId

      if (currentUserId) {
        localStorage.setItem(ADMIN_LAST_USER_ID_KEY, String(currentUserId))
      }

      userInfo.value = {

      }
      isLogin.value = false
      isLock.value = false
      lockPassword.value = ''
      accessToken.value = ''
      refreshToken.value = ''
      sessionStorage.removeItem('iframeRoutes')
      useMenuStore().setHomePath('')

      resetRouterState(500)

      const currentRoute = router.currentRoute.value

      const redirect = currentRoute.name !== 'AdminLogin' ? currentRoute.fullPath : undefined

      router.push({
        name: 'AdminLogin',
        query: redirect
          ? {
              redirect,
            }
          : undefined,
      })
    }

    /**
     * 检查后台端是否切换了登录用户，并在用户变化时清空工作台标签页。
     *
     * 该方法依赖退出登录时记录的最后用户 ID，避免新用户看到上一个用户的标签页缓存。
     */
    function checkAndClearWorkTabs() {
      const lastUserId = localStorage.getItem(ADMIN_LAST_USER_ID_KEY)

      const currentUserId = userInfo.value.userId

      if (!currentUserId) { return }

      if (!lastUserId) { return }

      if (String(currentUserId) !== lastUserId) {
        const workTabStore = useWorkTabStore()

        workTabStore.opened = []
        workTabStore.keepAliveExclude = []
      }

      localStorage.removeItem(ADMIN_LAST_USER_ID_KEY)
    }

    return {
      /** 当前后台端语言。 */
      language,

      /** 当前后台用户是否已登录。 */
      isLogin,

      /** 当前后台页面是否处于锁屏状态。 */
      isLock,

      /** 锁屏密码。 */
      lockPassword,

      /** 当前后台用户信息。 */
      userInfo,

      /** 后台端搜索历史记录。 */
      searchHistory,

      /** 后台端访问令牌。 */
      accessToken,

      /** 后台端刷新令牌。 */
      refreshToken,

      /** 获取当前后台用户信息。 */
      getUserInfo,

      /** 获取系统设置状态。 */
      getSettingState,

      /** 获取工作台标签页状态。 */
      getWorkTabState,

      /** 设置当前后台用户信息。 */
      setUserInfo,

      /** 设置后台用户登录状态。 */
      setLoginStatus,

      /** 设置后台端语言，并同步更新当前页面标题。 */
      setLanguage,

      /** 设置后台端搜索历史。 */
      setSearchHistory,

      /** 设置后台端锁屏状态。 */
      setLockStatus,

      /** 设置锁屏密码。 */
      setLockPassword,

      /** 设置后台端访问令牌和刷新令牌。 */
      setToken,

      /** 退出后台登录。 */
      logOut,

      /** 检查后台端是否切换了登录用户，并在用户变化时清空工作台标签页。 */
      checkAndClearWorkTabs,
    }
  },
  {
    persist: {
      key: 'adminUser',
      storage: localStorage,
    },
  },
)

import type { Router } from 'vue-router'

import NProgress from 'nprogress'

import { nextTick } from 'vue'

import { useCommon } from '@/hooks/core/useCommon'

import { loadingService } from '@/utils/ui'

import { getPendingLoading, resetPendingLoading } from './beforeEach'

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  const { scrollToTop } = useCommon()

  router.afterEach(() => {
    scrollToTop()

    // 无条件清理进度条，防止导航期间切换配置后留下残影。
    NProgress.done()

    // 确保进度条完全移除，避免残影
    setTimeout(() => {
      NProgress.remove()
    }, 600)

    // 关闭 loading 效果
    if (getPendingLoading()) {
      nextTick(() => {
        loadingService.hideLoading()
        resetPendingLoading()
      })
    }
  })
}

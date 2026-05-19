import type { AppRouteRecord } from '@/types/router'

import { RoutesAlias } from '../../constants/route-alias'

/**
 * 客户端根路由
 */
export const clientRoutes: AppRouteRecord = {
  path: '/client',
  name: 'Client',
  component: RoutesAlias.ClientLayout,
  meta: {
    title: '客户端',
    icon: 'ri:user-line',
  },
  redirect: '/client/home',
  children: [
    {
      name: 'ClientHome',
      path: 'home',
      component: '/client/home',
      meta: {
        title: '首页',
        icon: 'ri:home-line',
        keepAlive: false,
      },
    },
  ],
}

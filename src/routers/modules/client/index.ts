import type { AppRouteRecord } from '@/types/router'

import { RoutesAlias } from '../../routesAlias'

/**
 * 客户端功能模块
 */
export const clientRouteModules: AppRouteRecord[] = [
  {
    name: 'ClientTest',
    path: 'test',
    component: '',
    meta: {
      title: '测试',
      icon: 'ri:flask-line',
    },
    children: [
      {
        name: 'ClientTestA',
        path: 'a',
        component: '',
        meta: {
          title: 'A',
          icon: 'ri:folder-line',
        },
        children: [
          {
            name: 'ClientTestA1',
            path: 'a1',
            component: '/client/test/a/a1',
            meta: {
              title: 'A1',
              icon: 'ri:file-line',
              keepAlive: false,
            },
          },
        ],
      },
    ],
  },
]

/**
 * 客户端根路由
 */
export const clientRoutes: AppRouteRecord = {
  path: '/client',
  name: 'Client',
  component: RoutesAlias.Layout,
  meta: {
    title: '客户端',
    icon: 'ri:user-line',
    isMenuRoot: true,
  },
  redirect: '/client/test/a/a1',
  children: clientRouteModules,
}

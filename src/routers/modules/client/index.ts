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
    {
      name: 'ClientTask',
      path: 'task',
      component: '/client/task',
      meta: {
        title: '我的任务',
        icon: 'ri:task-line',
        keepAlive: false,
      },
    },
    {
      name: 'ClientCourse',
      path: 'course',
      component: '/client/course',
      meta: {
        title: '报名的课程',
        icon: 'ri:course-line',
        keepAlive: false,
      },
    },
    {
      name: 'ClientHistory',
      path: 'history',
      component: '/client/history',
      meta: {
        title: '学习历史',
        icon: 'ri:history-line',
        keepAlive: false,
      },
    },
    {
      name: 'ClientUserCenter',
      path: 'user-center',
      component: '/client/user-center',
      meta: {
        title: '个人主页',
        icon: 'ri:user-line',
        keepAlive: false,
      },
    },
  ],
}

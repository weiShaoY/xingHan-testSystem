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
      path: 'home',
      name: 'ClientHome',
      component: '/client/home',
      meta: {
        title: '首页',
        icon: 'ri:home-line',
        keepAlive: false,
        hideClientBack: true,
      },
    },
    {
      name: 'ClientUser',
      path: 'user',
      component: '/client/user',
      meta: {
        title: '个人主页',
        icon: 'ri:user-line',
        keepAlive: false,
      },
    },
    {
      path: 'task',
      name: 'ClientTask',
      component: '/client/task',
      meta: {
        title: '我的任务',
        icon: 'ri:task-line',
        keepAlive: false,
      },
    },

    {
      path: 'course',
      name: 'ClientCourse',
      component: '',
      redirect: '/client/course/list',
      meta: {
        title: '报名的课程',
        icon: 'ri:course-line',
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientCourseList',
          component: '/client/course/list',
          meta: {
            title: '报名的课程',
            icon: 'ri:file-text-line',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientCourseDetail',
          component: '/client/course/detail',
          meta: {
            title: '课程详情',
            icon: 'ri:file-text-line',
            keepAlive: false,
          },
        },
      ],

    },
    {
      path: 'history',
      name: 'ClientHistory',
      component: '/client/history/list',
      meta: {
        title: '学习历史',
        icon: 'ri:history-line',
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientHistoryList',
          component: '/client/history/list',
          meta: {
            title: '学习历史',
            icon: 'ri:history-line',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientHistoryDetail',
          component: '/client/history/detail',
          meta: {
            title: '学习历史详情',
            icon: 'ri:history-line',
            keepAlive: false,
          },
        },
      ],

    },

    // 推荐
    {
      path: 'recommend',
      name: 'ClientRecommend',
      component: '',
      meta: {
        title: '推荐课程',
        icon: 'ri:recommend-line',
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientRecommendList',
          component: '/client/recommend/list',
          meta: {
            title: '推荐课程',
            icon: 'ri:recommend-line',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientRecommendDetail',
          component: '/client/recommend/detail',
          meta: {
            title: '推荐课程详情',
            icon: 'ri:recommend-line',
            keepAlive: false,
          },
        },
      ],
    },
  ],
}

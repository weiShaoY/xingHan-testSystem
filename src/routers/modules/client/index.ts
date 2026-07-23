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
      path: 'project',
      name: 'ClientProject',
      component: '',
      meta: {
        title: '我的项目',
        keepAlive: false,
      },
      children: [
        {
          path: 'stages/:projId',
          name: 'ClientProjectStages',
          component: '/client/project/stages',
          meta: {
            title: '项目阶段列表',
            keepAlive: false,
          },
        },

      ],
    },

    // ////////
    {
      path: 'course',
      name: 'ClientCourse',
      component: '',
      redirect: '/client/course/list',
      meta: {
        title: '报名的课程',
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientCourseList',
          component: '/client/course/list',
          meta: {
            title: '报名的课程',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientCourseDetail',
          component: '/client/course/detail',
          meta: {
            title: '课程详情',
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
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientHistoryList',
          component: '/client/history/list',
          meta: {
            title: '学习历史',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientHistoryDetail',
          component: '/client/history/detail',
          meta: {
            title: '学习历史详情',
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
        keepAlive: false,
      },
      children: [
        {
          path: 'list',
          name: 'ClientRecommendList',
          component: '/client/recommend/list',
          meta: {
            title: '推荐课程',
            keepAlive: false,
          },
        },
        {
          path: 'detail',
          name: 'ClientRecommendDetail',
          component: '/client/recommend/detail',
          meta: {
            title: '推荐课程详情',
            keepAlive: false,
          },
        },
      ],
    },
  ],
}

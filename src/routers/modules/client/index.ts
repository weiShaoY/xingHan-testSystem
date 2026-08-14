import type { AppRouteRecord } from '@/types/router'

import { RoutesAlias } from '../../constants/route-alias'

const SectionRoutes: AppRouteRecord[] = [
  {
    path: ':couId/section/document/:olId?',
    name: 'ClientCourseSectionDocument',
    component: '/client/course/section/document',
    meta: {
      title: '文档',
      keepAlive: true,
      cacheName: 'ClientCourseSectionDocument',
    },
  },
  {
    path: ':couId/section/video/:olId?',
    name: 'ClientCourseSectionVideo',
    component: '/client/course/section/video',
    meta: {
      title: '视频',
      keepAlive: true,
      cacheName: 'ClientCourseSectionVideo',
    },
  },
  {
    path: ':couId/section/exam/:olId/answer',
    name: 'ClientCourseSectionExamAnswer',
    component: '/client/course/section/exam/answer',
    meta: {
      title: '考试',
      keepAlive: true,
      cacheName: 'ClientCourseSectionExamAnswer',
    },
  },
  {
    path: ':couId/section/exam/:olId/result',
    name: 'ClientCourseSectionExamResult',
    component: '/client/course/section/exam/result',
    meta: {
      title: '考试结果',
      keepAlive: false,
    },
  },
  {
    path: ':couId/section/question/:olId/answer',
    name: 'ClientCourseSectionQuestionAnswer',
    component: '/client/course/section/question/answer',
    meta: {
      title: '问卷',
      keepAlive: true,
      cacheName: 'ClientCourseSectionQuestionAnswer',
    },
  },
  {
    path: ':couId/section/question/:olId/result',
    name: 'ClientCourseSectionQuestionResult',
    component: '/client/course/section/question/result',
    meta: {
      title: '问卷结果',
      keepAlive: false,
    },
  },
]

/**
 * 客户端根路由
 */
export const clientRoutes: AppRouteRecord = {
  path: '/client',
  name: 'Client',
  component: RoutesAlias.ClientLayout,
  meta: {
    title: '客户端',
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
      path: 'user',
      name: 'ClientUser',
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
        title: '课程',
        keepAlive: false,
      },
      children: [{
        path: 'detail/:couId',
        name: 'ClientCourseDetail',
        component: '/client/course/detail',
        meta: {
          title: '课程详情',
          keepAlive: false,
        },
      }, ...SectionRoutes,

      // ////////
      {
        path: 'list',
        name: 'ClientCourseList',
        component: '/client/course/list',
        meta: {
          title: '报名的课程',
          keepAlive: false,
        },
      }],
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

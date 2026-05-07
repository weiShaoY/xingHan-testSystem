// 题库
import type { AppRouteRecord } from '@/types/router'

export const Question: AppRouteRecord = {
  path: 'question',
  name: 'Question',
  component: '',
  redirect: {
    name: 'AdminQuestionList',
  },
  meta: {
    title: '题库管理',
    icon: 'ri:file-text-line',
    keepAlive: true,
    sort: 0,
  },
  children: [
    {
      path: 'list',
      name: 'AdminQuestionList',
      component: '/admin/question/list',
      meta: {
        title: '题库列表',
        icon: 'ri:align-item-left-fill',
        keepAlive: true,
        sort: 0,
      },
    },
    {
      path: 'edit/:id',
      name: 'AdminQuestionEdit',
      component: '/admin/question/edit',
      meta: {
        title: '题库编辑',
        icon: 'ri:add-line',
        keepAlive: true,
        sort: 1,
        isHide: true,
      },
    },
    {
      path: 'detail/:id',
      name: 'AdminQuestionDetail',
      component: '/admin/question/detail',
      meta: {
        title: '题库详情',
        icon: 'ri:eye-line',
        keepAlive: true,
        sort: 1,
        isHide: true,
      },
    },
    {
      path: 'create',
      name: 'AdminQuestionCreate',
      component: '/admin/question/create',
      meta: {
        title: '题库创建',
        icon: 'ri:add-line',
        keepAlive: true,
        sort: 1,
        isHide: true,
      },
    },
  ],
}

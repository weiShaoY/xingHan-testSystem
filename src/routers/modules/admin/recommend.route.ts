// 题库
import type { AppRouteRecord } from '@/types/router'

export const RecommendRoute: AppRouteRecord = {
  path: 'recommend',
  name: 'Recommend',
  component: '',
  redirect: '/admin/recommend/list',
  meta: {
    title: '报名管理',
    icon: 'ri:file-text-line',
    keepAlive: true,
    sort: 5,
  },
  children: [
    {
      path: 'list',
      name: 'AdminRecommendList',
      component: '/admin/recommend/list',
      meta: {
        title: '报名列表',
        icon: 'ri:align-item-left-fill',
        keepAlive: false,
        sort: 0,
      },
    },
  ],
}

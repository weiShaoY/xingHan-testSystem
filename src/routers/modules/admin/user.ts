// 个人中心
import type { AppRouteRecord } from '@/types/router'

export const AdminUser: AppRouteRecord = {
  path: 'user',
  name: 'AdminUser',
  component: '',
  redirect: '/admin/user/document',
  meta: {
    title: '个人中心',
    icon: 'ri:file-text-line',
    keepAlive: true,
    sort: 5,
  },
  children: [
    {
      path: 'document',
      name: 'AdminUserDocument',
      component: '/admin/user/document',
      meta: {
        title: '我的文档',
        icon: 'ri:align-item-left-fill',
        keepAlive: true,
        sort: 1,
      },
    },
    {
      path: 'video',
      name: 'AdminUserVideo',
      component: '/admin/user/video',
      meta: {
        title: '我的视频',
        icon: 'ri:align-item-left-fill',
        keepAlive: true,
        sort: 2,
      },
    },
    {
      path: 'trash',
      name: 'AdminUserTrash',
      component: '/admin/user/trash',
      meta: {
        title: '回收站',
        icon: 'ri:align-item-left-fill',
        keepAlive: true,
        sort: 3,
      },
    },

  ],
}

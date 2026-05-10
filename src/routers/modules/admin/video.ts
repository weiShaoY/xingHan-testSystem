// 视频管理
import type { AppRouteRecord } from '@/types/router'

export const AdminVideo: AppRouteRecord = {
  path: 'video',
  name: 'AdminVideo',
  component: '',
  redirect: '/admin/video/list',
  meta: {
    title: '视频管理',
    icon: 'ri:file-text-line',
    keepAlive: true,
    sort: 5,
  },
  children: [
    {
      path: 'list',
      name: 'AdminVideoList',
      component: '/admin/video/list',
      meta: {
        title: '视频列表',
        icon: 'ri:align-item-left-fill',
        keepAlive: true,
        sort: 1,
      },
    },

  ],
}

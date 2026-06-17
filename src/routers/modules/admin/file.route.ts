// 文件管理
import type { AppRouteRecord } from '@/types/router'

export const AdminUserFile: AppRouteRecord = {
  path: 'file',
  name: 'AdminFile',
  component: '',
  redirect: '/admin/file/document',
  meta: {
    title: '文件管理',
    icon: 'ri:file-text-line',
    keepAlive: false,
    sort: 5,
  },
  children: [
    {
      path: 'document',
      name: 'AdminFileDocument',
      component: '/admin/file/document',
      meta: {
        title: '文档',
        icon: 'ri:align-item-left-fill',
        sort: 1,
      },
    },
    {
      path: 'video',
      name: 'AdminFileVideo',
      component: '/admin/file/video',
      meta: {
        title: '视频',
        icon: 'ri:align-item-left-fill',
        sort: 2,
      },
    },
    {
      path: 'recycling',
      name: 'AdminFileRecycling',
      component: '/admin/file/recycling',
      meta: {
        title: '回收站',
        icon: 'ri:align-item-left-fill',
        sort: 3,
      },
    },

  ],
}

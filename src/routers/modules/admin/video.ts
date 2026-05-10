// 视频管理
import type { AppRouteRecord } from '@/types/router'

export const AdminVideo: AppRouteRecord = {
  path: 'video',
  name: 'Video',
  component: '',
  redirect: '/admin/video/list',
  meta: {
    title: '视频管理',
    icon: 'ri:file-text-line',
    keepAlive: true,
    sort: 0,
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
    {
      path: 'pricing',
      name: 'Pricing',
      component: '/admin/video/pricing',
      meta: {
        title: 'menus.template.pricing',
        icon: 'ri:money-cny-box-line',
        keepAlive: true,
        isFullPage: true,
        sort: 1,
      },
    },

    // {
    //   path: 'create',
    //   name: 'AdminVideoCreate',
    //   component: '/admin/video/editor',
    //   meta: {
    //     title: '创建视频',
    //     icon: 'ri:add-line',
    //     keepAlive: true,
    //     sort: 1,
    //     isHide: true,
    //     activePath: '/admin/question/list',

    //   },
    // },
    // {
    //   path: 'edit/:id',
    //   name: 'AdminVideoEdit',
    //   component: '/admin/video/editor',
    //   meta: {
    //     title: '视频编辑',
    //     icon: 'ri:edit-line',
    //     keepAlive: true,
    //     sort: 1,
    //     isHide: true,
    //     activePath: '/admin/question/list',
    //   },
    // },
    // {
    //   path: 'detail/:id',
    //   name: 'AdminVideoDetail',
    //   component: '/admin/video/detail',
    //   meta: {
    //     title: '视频详情',
    //     icon: 'ri:eye-line',
    //     keepAlive: true,
    //     sort: 1,
    //     isHide: true,
    //     activePath: '/admin/question/list',

    //   },
    // },
  ],
}

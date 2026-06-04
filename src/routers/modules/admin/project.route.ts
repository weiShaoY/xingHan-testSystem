import type { AppRouteRecord } from '@/types/router'

export const Project: AppRouteRecord = {
  path: 'project',
  name: 'Project',
  component: '',
  redirect: {
    name: 'AdminProjectList',
  },
  meta: {
    title: '项目管理',
    icon: 'ri:armchair-line',
    keepAlive: true,
    sort: 2,
  },
  children: [
    {
      path: 'list',
      name: 'AdminProjectList',
      component: '/admin/project/list',
      meta: {
        title: '项目列表',
        icon: 'ri:list-check',
        keepAlive: false,
        sort: 0,
      },
    },
    {
      path: 'detail/:id',
      name: 'AdminProjectDetail',
      component: '/admin/project/detail',
      meta: {
        title: '项目详情',
        icon: 'ri:eye-line',
        keepAlive: true,
        sort: 1,
        isHide: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'AdminProjectEdit',
      component: '/admin/project/edit',
      meta: {
        title: '项目编辑',
        icon: 'ri:pencil-line',
        keepAlive: true,
        sort: 2,
        isHide: true,
      },
    },
  ],
}

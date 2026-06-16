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
      path: 'create',
      name: 'AdminProjectCreate',
      component: '/admin/project/editor',
      meta: {
        title: '项目创建',
        icon: 'ri:add-line',
        keepAlive: true,
        sort: 3,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },

    {
      path: 'edit/:projId',
      name: 'AdminProjectEdit',
      component: '/admin/project/editor',
      meta: {
        title: '项目编辑',
        icon: 'ri:pencil-line',
        keepAlive: true,
        multiTab: true,
        sort: 2,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },

    {
      path: 'detail/:projId',
      name: 'AdminProjectDetail',
      component: '/admin/project/detail',
      meta: {
        title: '项目详情',
        icon: 'ri:eye-line',
        keepAlive: false,
        multiTab: true,
        sort: 1,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },
  ],
}

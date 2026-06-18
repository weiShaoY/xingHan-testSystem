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
      path: 'setting/:projId',
      name: 'AdminProjectSetting',
      component: '/admin/project/editor',
      meta: {
        title: '项目设置',
        icon: 'ri:pencil-line',
        keepAlive: true,
        multiTab: true,
        sort: 2,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },

    {
      path: 'stages/:projId',
      name: 'AdminProjectStages',
      component: '/admin/project/stages',
      meta: {
        title: '项目阶段列表',
        icon: 'ri:eye-line',
        keepAlive: false,
        multiTab: true,
        sort: 1,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },
    {
      path: 'stages/:projId/edit',
      name: 'AdminProjectStageEditor',
      component: '/admin/project/stage-editor/index',
      meta: {
        title: '项目阶段编辑',
        icon: 'ri:pencil-line',
        keepAlive: true,
        multiTab: true,
        sort: 4,
        isHide: true,
        activePath: '/admin/project/list',
      },
    },
  ],
}

import type { AppRouteRecord } from '@/types/router'

const sectionRouteConfigs = [
  {
    type: 'document',
    name: 'Document',
    title: '文档',
    icon: 'ri:file-word-line',
    component: '/admin/course/section/document',
  },
  {
    type: 'video',
    name: 'Video',
    title: '视频',
    icon: 'ri:file-video-line',
    component: '/admin/course/section/video',
  },
  {
    type: 'exam',
    name: 'Exam',
    title: '考试',
    icon: 'ri:file-text-line',
    component: '/admin/course/section/exam',
  },
  {
    type: 'survey',
    name: 'Survey',
    title: '问卷',
    icon: 'ri:file-text-line',
    component: '/admin/course/section/survey',
  },
]

const createSectionRoutes: AppRouteRecord[] = sectionRouteConfigs.map((item, index) => ({
  path: `:couId/section/${item.type}/create`,
  name: `AdminCourseSection${item.name}Create`,
  component: item.component,
  meta: {
    title: `添加${item.title}小节`,
    icon: item.icon,
    keepAlive: true,
    sort: 4 + index,
    isHide: true,
    activePath: '/admin/course/list',

  },
}))

const editSectionRoutes: AppRouteRecord[] = sectionRouteConfigs.map((item, index) => ({
  path: `:couId/section/${item.type}/:sectionId/edit`,
  name: `AdminCourseSection${item.name}Edit`,
  component: item.component,
  meta: {
    title: `编辑${item.title}小节`,
    icon: item.icon,
    keepAlive: true,
    sort: 8 + index,
    isHide: true,
    activePath: '/admin/course/list',

  },
}))

export const Course: AppRouteRecord = {
  path: 'course',
  name: 'Course',
  component: '',
  redirect: '/admin/course/list',
  meta: {
    title: '课程管理',
    icon: 'ri:ancient-pavilion-line',
    keepAlive: true,
    sort: 1,
  },
  children: [
    {
      path: 'list',
      name: 'AdminCourseList',
      component: '/admin/course/list',
      meta: {
        title: '课程列表',
        icon: 'ri:file-text-line',
        keepAlive: false,
        sort: 0,
      },
    },
    {
      path: 'create',
      name: 'AdminCourseCreate',
      component: '/admin/course/editor',
      meta: {
        title: '课程创建',
        icon: 'ri:add-line',
        keepAlive: true,
        sort: 3,
        isHide: true,
        activePath: '/admin/course/list',

      },
    },
    {
      path: 'edit/:couId',
      name: 'AdminCourseEdit',
      component: '/admin/course/editor',
      meta: {
        title: '课程编辑',
        icon: 'ri:edit-line',
        keepAlive: true,
        multiTab: true,
        sort: 2,
        isHide: true,
        activePath: '/admin/course/list',

      },
    },

    {
      path: 'detail/:couId',
      name: 'AdminCourseDetail',
      component: '/admin/course/detail',
      meta: {
        title: '课程详情',
        icon: 'ri:eye-line',
        keepAlive: false,
        multiTab: true,
        sort: 1,
        isHide: true,
        activePath: '/admin/course/list',
      },
    },
    ...createSectionRoutes,
    ...editSectionRoutes,
  ],
}

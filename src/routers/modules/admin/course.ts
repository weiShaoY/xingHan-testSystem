import { AppRouteRecord } from '@/types/router'

export const Course: AppRouteRecord = {
  path: 'course',
  name: 'Course',
  component: '',
  redirect: {
    name: 'AdminCourseList'
  },
  meta: {
    title: '我的课程',
    icon: 'ri:armchair-line',
    keepAlive: true,
    sort: 0
  },
  children: [
    {
      path: 'list',
      name: 'AdminCourseList',
      component: '/admin/course/list',
      meta: {
        title: '课程列表',
        icon: 'ri:file-text-line',
        keepAlive: true,
        sort: 0
      }
    },
    {
      path: 'detail/:id',
      name: 'AdminCourseDetail',
      component: '/admin/course/detail',
      meta: {
        title: '课程详情',
        icon: 'ri:eye-line',
        keepAlive: true,
        sort: 1,
        isHide: true
      }
    },
    {
      path: 'edit/:id',
      name: 'AdminCourseEdit',
      component: '/admin/course/edit',
      meta: {
        title: '课程编辑',
        icon: 'ri:edit-line',
        keepAlive: true,
        sort: 2,
        isHide: true
      }
    },
    {
      path: 'create',
      name: 'AdminCourseCreate',
      component: '/admin/course/create',
      meta: {
        title: '课程创建',
        icon: 'ri:add-line',
        keepAlive: true,
        sort: 3
      }
    }
  ]
}

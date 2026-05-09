import type { AppRouteRecord } from '@/types/router'

export const Course: AppRouteRecord = {
  path: 'course',
  name: 'Course',
  component: '',
  redirect: '/admin/course/list',
  meta: {
    title: '我的课程',
    icon: 'ri:ancient-pavilion-line',
    keepAlive: true,
    sort: 0,
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
        sort: 0,
      },
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
        isHide: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'AdminCourseEdit',
      component: '/admin/course/editor',
      meta: {
        title: '课程编辑',
        icon: 'ri:edit-line',
        keepAlive: true,
        sort: 2,
        isHide: true,
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
      },
    },

    // 添加课程小节 ( 文档 视频 考试 问卷 四种类型)
    // 添加小节（四种类型）
    {
      path: 'section-video',
      name: 'AdminCourseSectionVideo',
      component: '/admin/course/section-video',
      meta: {
        title: '添加视频小节',
        icon: 'ri:file-video-line',
        keepAlive: true,
        sort: 4,
        isHide: true,
      },
    },
    {
      path: 'section-document',
      name: 'AdminCourseSectionDocument',
      component: '/admin/course/section-document',
      meta: {
        title: '添加文档小节',
        icon: 'ri:file-word-line',
        keepAlive: true,
        sort: 5,
        isHide: true,
      },
    },
    {
      path: 'section-exam',
      name: 'AdminCourseSectionExam',
      component: '/admin/course/section-exam',
      meta: {
        title: '添加考试小节',
        icon: 'ri:file-text-line',
        keepAlive: true,
        sort: 6,
        isHide: true,
      },
    },
    {
      path: 'section-question',
      name: 'AdminCourseSectionQuestion',
      component: '/admin/course/section-question',
      meta: {
        title: '添加问卷小节',
        icon: 'ri:file-text-line',
        keepAlive: true,
        sort: 7,
        isHide: true,
      },
    },
  ],
}

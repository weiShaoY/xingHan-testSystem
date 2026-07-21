import type { AppRouteRecordRaw } from '@/utils/router'

/**
 * 静态路由配置（不需要权限就能访问的路由）
 *
 * 属性说明：
 * isHideTab: true 表示不在标签页中显示
 *
 * 注意事项：
 * 1、path、name 不要和动态路由冲突，否则会导致路由冲突无法访问
 * 2、静态路由不管是否登录都可以访问
 */
export const staticRoutes: AppRouteRecordRaw[] = [

  {
    path: '/admin/auth/login',
    name: 'AdminLogin',
    component: () => import('@views/admin/auth/login/index.vue'),
    meta: {
      title: 'menus.login.title',
      isHideTab: true,
    },
  },
  {
    path: '/admin/auth/register',
    name: 'Register',
    component: () => import('@views/admin/auth/register/index.vue'),
    meta: {
      title: 'menus.register.title',
      isHideTab: true,
    },
  },
  {
    path: '/admin/auth/forget-password',
    name: 'ForgetPassword',
    component: () => import('@views/admin/auth/forget-password/index.vue'),
    meta: {
      title: 'menus.forgetPassword.title',
      isHideTab: true,
    },
  },

  // /////////////////////////// 客户端 路由 ////////////////////////////////////////

  {
    path: '/client/auth/login',
    name: 'ClientLogin',
    component: () => import('@views/client/auth/login/index.vue'),
    meta: {
      title: 'menus.login.title',
      isHideTab: true,
    },
  },
  {
    path: '/client/auth/register',
    name: 'ClientRegister',
    component: () => import('@views/client/auth/register/index.vue'),
    meta: {
      title: 'menus.register.title',
      isHideTab: true,
    },
  },
  {
    path: '/client/auth/forget-password',
    name: 'ClientForgetPassword',
    component: () => import('@views/client/auth/forget-password/index.vue'),
    meta: {
      title: 'menus.forgetPassword.title',
      isHideTab: true,
    },
  },

  // /////////////////////////// 其他路由 ////////////////////////////////////////
  {
    path: '/403',
    name: 'Exception403',
    component: () => import('@views/exception/403/index.vue'),
    meta: {
      title: '403',
      isHideTab: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Exception404',
    component: () => import('@views/exception/404/index.vue'),
    meta: {
      title: '404',
      isHideTab: true,
    },
  },
  {
    path: '/500',
    name: 'Exception500',
    component: () => import('@views/exception/500/index.vue'),
    meta: {
      title: '500',
      isHideTab: true,
    },
  },
  {
    path: '/outside',
    component: () => import('@views/index/index.vue'),
    name: 'Outside',
    meta: {
      title: 'menus.outside.title',
    },
    children: [
      // iframe 内嵌页面
      {
        path: '/outside/iframe/:path',
        name: 'Iframe',
        component: () => import('@/views/outside/Iframe.vue'),
        meta: {
          title: 'iframe',
        },
      },
    ],
  },
]

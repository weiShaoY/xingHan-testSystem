import type { AppRouteRecord } from '@/types/router'

export const widgetsRoutes: AppRouteRecord = {
  path: 'widgets',
  name: 'Widgets',
  component: '',
  meta: {
    title: 'menus.widgets.title',
    icon: 'ri:apps-2-add-line',
  },
  children: [
    {
      path: 'icon',
      name: 'Icon',
      component: '/admin/widgets/icon',
      meta: {
        title: 'menus.widgets.icon',
        icon: 'ri:palette-line',
        keepAlive: true,
      },
    },
    {
      path: 'image-crop',
      name: 'ImageCrop',
      component: '/admin/widgets/image-crop',
      meta: {
        title: 'menus.widgets.imageCrop',
        icon: 'ri:screenshot-line',
        keepAlive: true,
      },
    },
    {
      path: 'excel',
      name: 'Excel',
      component: '/admin/widgets/excel',
      meta: {
        title: 'menus.widgets.excel',
        icon: 'ri:download-2-line',
        keepAlive: true,
      },
    },
    {
      path: 'video',
      name: 'Video',
      component: '/admin/widgets/video',
      meta: {
        title: 'menus.widgets.video',
        icon: 'ri:vidicon-line',
        keepAlive: true,
      },
    },
    {
      path: 'count-to',
      name: 'CountTo',
      component: '/admin/widgets/count-to',
      meta: {
        title: 'menus.widgets.countTo',
        icon: 'ri:anthropic-line',
        keepAlive: false,
      },
    },
    {
      path: 'wang-editor',
      name: 'WangEditor',
      component: '/admin/widgets/wang-editor',
      meta: {
        title: 'menus.widgets.wangEditor',
        icon: 'ri:t-box-line',
        keepAlive: true,
      },
    },
    {
      path: 'watermark',
      name: 'Watermark',
      component: '/admin/widgets/watermark',
      meta: {
        title: 'menus.widgets.watermark',
        icon: 'ri:water-flash-line',
        keepAlive: true,
      },
    },
    {
      path: 'context-menu',
      name: 'ContextMenu',
      component: '/admin/widgets/context-menu',
      meta: {
        title: 'menus.widgets.contextMenu',
        icon: 'ri:menu-2-line',
        keepAlive: true,
      },
    },
    {
      path: 'qrcode',
      name: 'Qrcode',
      component: '/admin/widgets/qrcode',
      meta: {
        title: 'menus.widgets.qrcode',
        icon: 'ri:qr-code-line',
        keepAlive: true,
      },
    },
    {
      path: 'drag',
      name: 'Drag',
      component: '/admin/widgets/drag',
      meta: {
        title: 'menus.widgets.drag',
        icon: 'ri:drag-move-fill',
        keepAlive: true,
      },
    },
    {
      path: 'text-scroll',
      name: 'TextScroll',
      component: '/admin/widgets/text-scroll',
      meta: {
        title: 'menus.widgets.textScroll',
        icon: 'ri:input-method-line',
        keepAlive: true,
      },
    },
    {
      path: 'fireworks',
      name: 'Fireworks',
      component: '/admin/widgets/fireworks',
      meta: {
        title: 'menus.widgets.fireworks',
        icon: 'ri:magic-line',
        keepAlive: true,
        showTextBadge: 'Hot',
      },
    },
    {
      path: 'outside/iframe/elementui',
      name: 'ElementUI',
      component: '',
      meta: {
        title: 'menus.widgets.elementUI',
        icon: 'ri:apps-2-line',
        keepAlive: false,
        link: 'https://element-plus.org/zh-CN/component/overview.html',
        isIframe: true,
      },
    },
  ],
}

import type { AppRouteRecord } from '@/types/router'

export const templateRoutes: AppRouteRecord = {
  path: 'template',
  name: 'Template',
  component: '',
  meta: {
    title: 'menus.template.title',
    icon: 'ri:apps-2-line',
  },
  children: [
    {
      path: 'cards',
      name: 'Cards',
      component: '/admin/template/cards',
      meta: {
        title: 'menus.template.cards',
        icon: 'ri:wallet-line',
        keepAlive: false,
      },
    },
    {
      path: 'banners',
      name: 'Banners',
      component: '/admin/template/banners',
      meta: {
        title: 'menus.template.banners',
        icon: 'ri:rectangle-line',
        keepAlive: false,
      },
    },
    {
      path: 'charts',
      name: 'Charts',
      component: '/admin/template/charts',
      meta: {
        title: 'menus.template.charts',
        icon: 'ri:bar-chart-box-line',
        keepAlive: false,
      },
    },
    {
      path: 'map',
      name: 'Map',
      component: '/admin/template/map',
      meta: {
        title: 'menus.template.map',
        icon: 'ri:map-pin-line',
        keepAlive: true,
      },
    },
    {
      path: 'chat',
      name: 'Chat',
      component: '/admin/template/chat',
      meta: {
        title: 'menus.template.chat',
        icon: 'ri:message-3-line',
        keepAlive: true,
      },
    },
    {
      path: 'calendar',
      name: 'Calendar',
      component: '/admin/template/calendar',
      meta: {
        title: 'menus.template.calendar',
        icon: 'ri:calendar-2-line',
        keepAlive: true,
      },
    },
  ],
}

import type { FastEnterConfig } from '@/types/config'

/**
 * 快速入口配置
 * 包含：应用列表、快速链接等配置
 */
import { WEB_LINKS } from '@/utils/constants'

const fastEnterConfig: FastEnterConfig = {
  // 显示条件（屏幕宽度）
  minWidth: 1200,

  // 应用列表
  applications: [
    {
      name: '官方文档',
      description: '使用指南与开发文档',
      icon: 'ri:bill-line',
      iconColor: '#ffb100',
      enabled: true,
      order: 5,
      link: WEB_LINKS.DOCS,
    },
  ],

  // 快速链接
  quickLinks: [
    {
      name: '登录',
      enabled: true,
      order: 1,
      routeName: 'AdminLogin',
    },
    {
      name: '注册',
      enabled: true,
      order: 2,
      routeName: 'Register',
    },
    {
      name: '忘记密码',
      enabled: true,
      order: 3,
      routeName: 'ForgetPassword',
    },
    {
      name: '个人中心',
      enabled: true,
      order: 5,
      routeName: 'UserCenter',
    },
  ],
}

export default Object.freeze(fastEnterConfig)

import type { AppRouteRecord } from '@/types/router'

import request from '@/apis/http'

// 获取用户列表
export function fetchGetUserList(params: any) {
  return request.get({
    url: '/api/user/list',
    params,
  })
}

// 获取角色列表
export function fetchGetRoleList(params: any) {
  return request.get({
    url: '/api/role/list',
    params,
  })
}

// 获取菜单列表
export function fetchGetMenuList(authPath?: string) {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus',
    authPath,
  })
}

import request from '@/apis/http'

/**
 *  获取管理端公钥
 */
export function fetchAdminGetPublicKey() {
  return request.get<AdminApi.Auth.PublicKey>({
    url: '/admin/auth/key',
  })
}

/**
 *  管理端登录
 */
export function fetchAdminLogin(data: AdminApi.Auth.LoginParams) {
  return request.post<AdminApi.Auth.LoginResponse>({
    url: '/admin/auth/login',
    data,
  })
}

/**
 * 获取管理端用户信息
 * @returns 用户信息
 */
export function fetchAdminGetUserInfo() {
  return request.get<{
    userInfo: AdminApi.Auth.UserInfo
  }>({
    url: '/admin/auth/userInfo',
  })
}

import request from '@/apis/http'

/**
 *  获取客户端公钥
 */
export function fetchClientGetPublicKey() {
  return request.get<AdminApi.Auth.PublicKey>({
    url: '/client/auth/key',
  })
}

/**
 *  客户端登录
 */
export function fetchClientLogin(params: AdminApi.Auth.LoginParams) {
  return request.post<AdminApi.Auth.LoginResponse>({
    url: '/client/auth/login',
    data: params,
  })
}

/**
 * 获取客户端用户信息
 * @returns 用户信息
 */
export function fetchClientGetUserInfo(authPath?: string) {
  return request.get<{
    userInfo: AdminApi.Auth.UserInfo
  }>({
    url: '/client/auth/userinfo',
    authPath,
  })
}

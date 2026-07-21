import request from '@/apis/http'

/**
 *  获取客户端公钥
 */
export function fetchClientGetPublicKey() {
  return request.get<ClientApi.Auth.PublicKey>({
    url: '/client/auth/key',
  })
}

/**
 *  客户端登录
 */
export function fetchClientLogin(params: ClientApi.Auth.LoginParams) {
  return request.post<ClientApi.Auth.LoginResponse>({
    url: '/client/auth/login',
    data: params,
  })
}

/**
 * 获取客户端用户信息
 * @returns 用户信息
 */
export function fetchClientGetUserInfo() {
  return request.get<{
    userInfo: ClientApi.Auth.UserInfo
  }>({
    url: '/client/auth/userInfo',
  })
}

import request from '@/apis/http'

/**
 *  获取公钥
 */
export function fetchGetPublicKey() {
  return request.get<AdminApi.Auth.PublicKey>({
    url: '/admin/auth/key',
  })
}

/**
 *  管理端登录
 */
export function fetchAdminLogin(params: AdminApi.Auth.LoginParams) {
  return request.post<AdminApi.Auth.LoginResponse>({
    url: '/admin/auth/login',
    data: params,
  })
}

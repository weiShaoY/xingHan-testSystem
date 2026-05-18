import request from '@/apis/http'

/**
 *  管理端登录
 */
export function fetchAdminLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/admin/auth/login',
    params,
  })
}

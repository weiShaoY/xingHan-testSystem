/**
 * 上传文件
 */
export function uploadFile(data: FormData) {
  return request.post<ClientApi.Auth.LoginResponse>({
    url: '/client/auth/login',
    data: params,
  })
}

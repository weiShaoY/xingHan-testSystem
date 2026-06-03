import request from '@/apis/http'

/**
 * 上传文件
 */
export function uploadFile(data: FormData) {
  return request.post<FileApi.UploadFileResponse>({
    url: '/file/upload',
    data,
  })
}

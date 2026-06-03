import request from '@/apis/http'

/**
 * 上传文件
 */
export function fetchAdminUploadFile(data: FormData) {
  return request.post<FileApi.UploadFileResponse>({
    url: '/admin/file/upload',
    data,
  })
}

/**
 *  获取后台管理附件列表
 */
export function fetchAdminFileList(params: FileApi.FileListParams) {
  const {
    name,
    type,
    ...restParams
  } = params

  return request.post<FileApi.FileListResponse>({
    url: '/admin/file/list',
    data: {
      ...restParams,
      ...(name.trim()
        ? {
            name: name.trim(),
          }
        : {
          }),
      type: type === 'document' ? 1 : 2,
    },
  })
}

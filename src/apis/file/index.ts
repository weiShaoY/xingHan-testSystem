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
  return request.post<FileApi.FileListResponse>({
    url: '/admin/file/list',
    data: {
      ...params,
      type: params.type === 'document' ? 1 : 2,
    },
  })
}

/**
 *  获取附件返回资源文件流
 *  @param asId 附件ID
 */
export function fetchAdminFileAttachment(asId: number) {
  return request.get<FileApi.FileAttachmentResponse>({
    url: '/admin/file/getAttachment',
    params: {
      asId,
    },
  })
}

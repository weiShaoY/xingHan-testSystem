import request from '@/apis/http'

/**
 *  获取客户端 课程大纲列表
 *  @param couId 课程ID
 */
export function fetchClientCourseOutlineList(couId: number) {
  return request.post<ClientApi.Course.CourseOutlineListResponse>({
    url: '/client/learningtask/outlinelist',
    authPath: '/client',
    data: {
      couId,
    },
  })
}

/**
 * 获取客户端 文档信息
 * @param olId 小节ID
 */
export function fetchClientCourseDocumentInfo(olId: number) {
  return request.get<ClientApi.Course.CourseDocumentInfoResponse>({
    url: '/client/pdf/getPdfInfo',
    authPath: '/client',
    params: {
      olId,
    },
  })
}

/**
 * 获取客户端 文档文件流
 * @param asId 附件ID
 */
export function fetchClientCourseDocumentFile(asId: number) {
  return request.get<Blob>({
    url: '/client/pdf/getPdf',
    authPath: '/client',
    responseType: 'blob',
    params: {
      asId,
    },
  })
}

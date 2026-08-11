import request from '@/apis/http'

/**
 *  获取客户端 课程大纲列表
 *  @param couId 课程ID
 */
// export function fetchClientCourseOutlineList(couId: number) {
//   return request.post<ClientApi.Course.CourseOutlineListResponse>({
//     url: '/client/learningtask/outlinelist',
//     authPath: '/client',
//     data: {
//       couId,
//     },
//   })
// }

/**
 *  获获取课程学习记录
 *  @param couId 课程ID
 */
export function fetchClientGetCourseProgress(couId: number) {
  return request.get<ClientApi.Course.CourseProgressResponse>({
    url: '/client/learning/getCourseProgress',
    authPath: '/client',
    params: {
      couId,
    },
  })
}

// / /////////// ////////////////////////  2026-08-10---15:45---星期一  ////////////////////////

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

/**
 *  获取客户端 视频信息
 */
export function fetchClientCourseVideoInfo(olId: number) {
  return request.get<ClientApi.Course.CourseVideoInfoResponse>({
    url: '/client/video/getVideoInfo',
    authPath: '/client',
    params: {
      olId,
    },
  })
}

/**
 * 获取客户端 视频文件流
 * @param asId 附件ID
 */
export function fetchClientCourseVideoFile(asId: number) {
  return request.get<Blob>({
    url: '/client/video/getVideo',
    authPath: '/client',
    responseType: 'blob',
    params: {
      asId,
    },
  })
}

// # / //// ////////////////////////  2026-08-11---14:07---星期二  ////////////////////////

/**
 *  记录视频学习记录
 */
export function fetchClientCourseVideoRecordProgress(data: ClientApi.Course.CourseVideoRecordProgressParams) {
  return request.post<boolean>({
    url: '/client/learning/videoRecordProgress',
    authPath: '/client',
    data,
  })
}

/**
 * 记录完成视频记录
 */
export function fetchClientCourseVideoRecordPlayback(data: ClientApi.Course.CourseVideoRecordPlaybackParams) {
  return request.post<boolean>({
    url: '/client/learning/recordVideoPlayback',
    authPath: '/client',
    data,
  })
}

import request from '@/apis/http'

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

// / /////////// ////////////////////////  文档  ////////////////////////

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
 *  提交文档
 */
export function fetchClientCourseDocumentSubmit(data: ClientApi.Course.CourseDocumentSubmitParams) {
  return request.post<boolean>({
    url: '/client/learning/pdfRecordProgress',
    authPath: '/client',
    data,
  })
}

// # / //// ////////////////////////  视频  ////////////////////////

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

/**
 *  提交视频
 */
export function fetchClientCourseVideoSubmit(data: ClientApi.Course.CourseVideoSubmitParams) {
  return request.post<boolean>({
    url: '/client/learning/videoRecordProgress',
    authPath: '/client',
    data,
  })
}

// $ / //// ////////////////////////  考试  ////////////////////////

/**
 *  获取客户端 考试信息
 */
export function fetchClientCourseExamInfo(olId: number) {
  return request.get<ClientApi.Course.CourseExamInfoResponse>({
    url: '/client/testpaper/getTestPaperInfo',
    authPath: '/client',
    params: {
      olId,
    },
  })
}

/**
 *  提交考试
 */
export function fetchClientCourseExamSubmit(data: ClientApi.Course.CourseExamSubmitParams) {
  return request.post<boolean>({
    url: '/client/learning/submitExam',
    authPath: '/client',
    data,
  })
}

/**
 *  获取客户端 考试结果
 */
export function fetchClientCourseExamResult(examId: number) {
  return request.get<ClientApi.Course.CourseExamResultResponse>({
    url: '/client/learning/getExamCorrectAnswers',
    authPath: '/client',
    params: {
      examId,
    },
  })
}

// % / //// ////////////////////////  问卷  ////////////////////////

/**
 *  获取客户端 问卷信息
 */
export function fetchClientCourseQuestionInfo(olId: number) {
  return request.get<ClientApi.Course.CourseQuestionInfoResponse>({
    url: '/client/questionpaper/getQuestionPaperInfo',
    authPath: '/client',
    params: {
      olId,
    },
  })
}

/**
 *  提交问卷
 */
export function fetchClientCourseQuestionSubmit(data: ClientApi.Course.CourseQuestionSubmitParams) {
  return request.post<boolean>({
    url: '/client/learning/submitQuestionnaire',
    authPath: '/client',
    data,
  })
}

/**
 *  获取客户端 问卷结果
 */
export function fetchClientCourseQuestionResult(questionId: number) {
  return request.get<ClientApi.Course.CourseQuestionResultResponse>({
    url: '/client/learning/getUserQuestionAnswers',
    authPath: '/client',
    params: {
      questionId,
    },
  })
}

import request from '@/apis/http'

/**
 *  获取学习课程历史
 */
export function fetchClientCourseHistory() {
  return request.get<ClientApi.History.HistoryCourseResponse>({
    url: '/client/learning/getUserLearningHistory',
    authPath: '/client',
  })
}

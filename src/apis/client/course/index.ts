import request from '@/apis/http'

/**
 *  获取客户端 课程大纲列表
 *  @param couId 课程ID
 */
export function fetchClientCourseOutlineList(couId: number) {
  return request.post<ClientApi.Course.CourseOutlineListResponse>({
    url: '/client/learningtask/outlinelist',
    data: {
      couId,
    },
  })
}

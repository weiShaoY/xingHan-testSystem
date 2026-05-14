import request from './http'

/**
 * 获取课程列表
 */
export function getCourseList(params: Partial<Api.Course.CourseListParams> = {
}) {
  return request.post<Api.Course.CourseListResponse>({
    url: '/admin/course/list',
    data: {
      currentPage: 1,
      pageSize: 10,
      orderBy: '',
      isAsc: 0,
      ...params,
    },
  })
}

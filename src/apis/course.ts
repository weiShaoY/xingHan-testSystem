import request from '@/apis/http'

/**
 * 获取课程列表
 */
export function getCourseList(params: Partial<AdminApi.Course.CourseListParams> = {
}) {
  return request.post<AdminApi.Course.CourseListResponse>({
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

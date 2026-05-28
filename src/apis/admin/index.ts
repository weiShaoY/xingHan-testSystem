import request from '@/apis/http'

/**
 *  获取管理端公钥
 */
export function fetchAdminGetPublicKey() {
  return request.get<AdminApi.Auth.PublicKey>({
    url: '/admin/auth/key',
  })
}

/**
 *  管理端登录
 */
export function fetchAdminLogin(params: AdminApi.Auth.LoginParams) {
  return request.post<AdminApi.Auth.LoginResponse>({
    url: '/admin/auth/login',
    data: params,
  })
}

/**
 * 获取管理端用户信息
 * @returns 用户信息
 */
export function fetchAdminGetUserInfo(authPath?: string) {
  return request.get<{
    userInfo: AdminApi.Auth.UserInfo
  }>({
    url: '/admin/auth/userInfo',
    authPath,
  })
}

// / //////////////////////////////////////////////  课程  //////////////////////////////////////////////

/**
 * 获取课程列表
 */
export function fetchAdminCourseList(params: AdminApi.Course.CourseListParams) {
  return request.post<AdminApi.Course.CourseListResponse>({
    url: '/admin/course/list',
    data: params,
  })
}

/**
 *  获取课程详情
 *  @param courseId 课程ID
 */
export function fetchAdminCourseDetail(courseId: number) {
  return request.get<AdminApi.Course.CourseDetailResponse>({
    url: '/admin/course/getCourse',
    params: {
      courseId,
    },
  })
}

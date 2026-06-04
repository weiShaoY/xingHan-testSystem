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
export function fetchAdminLogin(data: AdminApi.Auth.LoginParams) {
  return request.post<AdminApi.Auth.LoginResponse>({
    url: '/admin/auth/login',
    data,
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
export function fetchAdminCourseList(data: AdminApi.Course.CourseListParams) {
  return request.post<AdminApi.Course.CourseListResponse>({
    url: '/admin/course/list',
    data,
  })
}

/**
 *  新增课程
 */

export function fetchAdminCreateCourse(data: AdminApi.Course.CourseEditor) {
  return request.post<boolean>({
    url: '/admin/course/addCourse',
    data,
  })
}

/**
 *  获取课程详情
 *  @param couId 课程ID
 */
export function fetchAdminCourseDetail(couId: string) {
  return request.get<AdminApi.Course.CourseEditor>({
    url: '/admin/course/getCourse',
    params: {
      couId,
    },
  })
}

/**
 *  编辑课程
 */
export function fetchAdminUpdateCourse(data: AdminApi.Course.CourseEditor) {
  return request.post<boolean>({
    url: '/admin/course/updateCourse',
    data,
  })
}

/**
 *  获取课程设置
 */
export function fetchAdminCourseSetting(couId: string) {
  return request.get<AdminApi.Course.CourseSettingResponse>({
    url: '/admin/course/getCourseSetting',
    params: {
      couId,
    },
  })
}

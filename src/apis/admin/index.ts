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

export function fetchAdminCourseCreate(data: AdminApi.Course.CourseEditor) {
  return request.post<boolean>({
    url: '/admin/course/addCourse',
    data,
  })
}

/**
 *  获取课程详情
 *  @param couId 课程ID
 */
export function fetchAdminCourseDetail(couId: number) {
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
export function fetchAdminCourseUpdate(data: AdminApi.Course.CourseEditor) {
  return request.post<boolean>({
    url: '/admin/course/updateCourse',
    data,
  })
}

/**
 *  删除课程
 *  @param couId 课程ID
 */
export function fetchAdminCourseDelete(couId: number) {
  return request.post<boolean>({
    url: '/admin/course/deleteCourse',
    data: {
      couId,
    },
  })
}

/**
 *  获取后台管理课程章节列表
 *  @param couId 课程ID
 */
export function fetchAdminCourseOutlineList(couId: number) {
  return request.post<AdminApi.Course.CourseOutlineListResponse>({
    url: '/admin/outline/list',
    data: {
      couId,
    },
  })
}

/**
 * 新增课程章节或小节
 */
export function fetchAdminCourseOutlineAdd(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/addChapter',
    data,
  })
}

/**
 *  编辑课程章节或者小节
 */
export function fetchAdminCourseOutlineUpdate(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/updateChapter',
    data,
  })
}

/**
 *  删除课程章节或者小节
 *  @param chapterId 章节ID
 */
export function fetchAdminCourseOutlineDelete(chapterId: number) {
  return request.post<boolean>({
    url: '/admin/outline/deleteChapter',
    data: {
      chapterId,
    },
  })
}

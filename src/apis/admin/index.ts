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

// ! /////////////////////////////////////////////////////   课程章节  /////////////////////////////////////////////////////

/**
 *  新增 课程章节
 */
export function fetchAdminCourseOutlineChapterAdd(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/addChapter',
    data,
  })
}

/**
 *  删除 课程章节
 *  @param olId 章节ID
 */
export function fetchAdminCourseOutlineChapterDelete(olId: number) {
  return request.post<boolean>({
    url: '/admin/outline/deleteChapter',
    data: {
      olId,
    },
  })
}

/**
 *  获取课程 章节详情
 *  @param olId 章节ID
 */
export function fetchAdminCourseOutlineChapterDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineDetail>({
    url: '/admin/outline/getChapter',
    params: {
      olId,
    },
  })
}

/**
 *  编辑 课程章节
 */
export function fetchAdminCourseOutlineChapterUpdate(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/updateChapter',
    data,
  })
}

// / /////////////////////////////////////////////////////   课程小节  /////////////////////////////////////////////////////
/**
 * 新增 课程小节
 */
export function fetchAdminCourseOutlineSectionAdd(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/addSection',
    data,
  })
}

/**
 *  删除 课程小节
 */
export function fetchAdminCourseOutlineSectionDelete(olId: number) {
  return request.post<boolean>({
    url: '/admin/outline/deleteSection',
    data: {
      olId,
    },
  })
}

/**
 *  获取课程 小节详情
 *  @param olId 小节ID
 */
export function fetchAdminCourseSectionDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineDetail>({
    url: '/admin/outline/getSection',
    params: {
      olId,
    },
  })
}

/**
 *  编辑 课程小节
 */
export function fetchAdminCourseOutlineSectionUpdate(data: AdminApi.Course.CourseOutlineEditor) {
  return request.post<boolean>({
    url: '/admin/outline/updateSection',
    data,
  })
}

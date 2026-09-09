import request from '@/apis/http'

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

export function fetchAdminCourseAdd(data: AdminApi.Course.CourseEditor) {
  return request.post<boolean>({
    url: '/admin/course/addCourse',
    data,
  })
}

/**
 *  获取课程设置
 *  @param couId 课程ID
 */
export function fetchAdminCourseSetting(couId: number) {
  return request.get<AdminApi.Course.CourseEditor>({
    url: '/admin/course/getCourse',
    params: {
      couId,
    },
  })
}

/**
 *  更新课程设置
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
 *  获取后台管理课程大纲列表
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
 *  保存后台管理课程大纲列表
 */
export function fetchAdminCourseOutlineListUpdate(nodes: AdminApi.Course.CourseOutlineListNodesItem[]) {
  return request.post<boolean>({
    url: '/admin/outline/orderOutlineList',
    data: {
      nodes,
    },
  })
}

// ! /////////////////////////////////////////////////////   课程章节  /////////////////////////////////////////////////////

/**
 *  新增 课程章节
 */
export function fetchAdminCourseOutlineChapterAdd(data: AdminApi.Course.CourseOutlineChapterEditor) {
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
  return request.get<AdminApi.Course.CourseOutlineChapterEditor>({
    url: '/admin/outline/getChapter',
    params: {
      olId,
    },
  })
}

/**
 *  编辑 课程章节
 */
export function fetchAdminCourseOutlineChapterUpdate(data: AdminApi.Course.CourseOutlineChapterEditor) {
  return request.post<boolean>({
    url: '/admin/outline/updateChapter',
    data,
  })
}

// / /////////////////////////////////////////////////////   课程小节  /////////////////////////////////////////////////////

/**
 *  删除 课程小节
 *  @param olId 小节ID
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
 *  新增文档小节
 */
export function fetchAdminCourseOutlineSectionDocumentAdd(data: AdminApi.Course.CourseOutlineSectionDocumentEditor) {
  return request.post<boolean>({
    url: '/admin/outline/addPdfSection',
    data,
  })
}

/**
 *  获取文档小节
 *  @param olId 小节ID
 */
export function fetchAdminCourseOutlineSectionDocumentDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineSectionDocumentEditor>({
    url: '/admin/outline/getPdfSection',
    params: {
      olId,
    },
  })
}

/**
 *  修改文档小节
 */
export function fetchAdminCourseOutlineSectionDocumentUpdate(data: AdminApi.Course.CourseOutlineSectionDocumentEditor) {
  return request.post<boolean>({
    url: '/admin/outline/updatePdfSection',
    data,
  })
}

/**
 *  新增视频小节
 */
export function fetchAdminCourseOutlineSectionVideoAdd(data: AdminApi.Course.CourseOutlineSectionVideoEditor) {
  return request.post<boolean>({
    url: '/admin/video/addVideoSection',
    data,
  })
}

/**
 *  获取视频小节
 *  @param olId 小节ID
 */
export function fetchAdminCourseOutlineSectionVideoDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineSectionVideoEditor>({
    url: '/admin/video/getVideoSection',
    params: {
      olId,
    },
  })
}

/**
 *  修改视频小节
 */
export function fetchAdminCourseOutlineSectionVideoUpdate(data: AdminApi.Course.CourseOutlineSectionVideoEditor) {
  return request.post<boolean>({
    url: '/admin/video/updateVideoSection',
    data,
  })
}

/**
 *  新增考试小节
 */
export function fetchAdminCourseOutlineSectionExamAdd(data: AdminApi.Course.CourseOutlineSectionExamEditor) {
  return request.post<boolean>({
    url: '/admin/testpaper/addTestPaper',
    data,
  })
}

/**
 *  获取考试小节
 *  @param olId 小节ID
 */
export function fetchAdminCourseOutlineSectionExamDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineSectionExamEditor>({
    url: '/admin/testpaper/getTestPaper',
    params: {
      olId,
    },
  })
}

/**
 *  修改考试小节
 */
export function fetchAdminCourseOutlineSectionExamUpdate(data: AdminApi.Course.CourseOutlineSectionExamEditor) {
  return request.post<boolean>({
    url: '/admin/testpaper/updateTestPaper',
    data,
  })
}

/**
 *  获取考试小节 题库下拉列表
 */
export function fetchAdminCourseOutlineSectionExamQuestionBank() {
  return request.get<AdminApi.Course.CourseOutlineSectionExamQuestionBankItem[]>({
    url: '/admin/testpaper/getQuestionBank',
  })
}

/**
 *  获取考试小节 题目列表
 */
export function fetchAdminCourseOutlineSectionExamQuestionList(data: AdminApi.Course.CourseOutlineSectionExamQuestionListParams) {
  return request.post<AdminApi.Course.CourseOutlineSectionExamQuestionListResponse>({
    url: '/admin/testpaper/getQuestionList',
    data,
  })
}

/**
 * 新增问卷小节
 */
export function fetchAdminCourseOutlineSectionQuestionAdd(data: AdminApi.Course.CourseOutlineSectionQuestionEditor) {
  return request.post<boolean>({
    url: '/admin/questionpaper/addQuestionPaper',
    data,
  })
}

/**
 *  获取问卷小节
 * @param olId 小节ID
 */
export function fetchAdminCourseOutlineSectionQuestionDetail(olId: number) {
  return request.get<AdminApi.Course.CourseOutlineSectionQuestionEditor>({
    url: '/admin/questionpaper/getQuestionPaper',
    params: {
      olId,
    },
  })
}

/**
 *  修改问卷小节
 */
export function fetchAdminCourseOutlineSectionQuestionUpdate(data: AdminApi.Course.CourseOutlineSectionQuestionEditor) {
  return request.post<boolean>({
    url: '/admin/questionpaper/updateQuestionPaper',
    data,
  })
}

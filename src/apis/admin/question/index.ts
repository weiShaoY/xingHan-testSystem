import request from '@/apis/http'

/**
 *  获取后台管理题库列表
 */
export function fetchAdminQuestionList(data: AdminApi.Question.QuestionListParams) {
  return request.post<AdminApi.Question.QuestionListResponse>({
    url: '/admin/questionbank/list',
    data,
  })
}

/**
 *  新增题库
 */
export function fetchAdminQuestionAdd(data: AdminApi.Question.QuestionEditor) {
  return request.post<boolean> ({
    url: '/admin/questionbank/addQuestionBank',
    data,
  })
}

/**
 *  获取题库设置
 *  @param qbId 题库ID
 */
export function fetchAdminQuestionSetting(qbId: number) {
  return request.get<AdminApi.Question.QuestionEditor>({
    url: '/admin/questionbank/getQuestionBank',
    params: {
      qbId,
    },
  })
}

/**
 * 修改题库设置
 */
export function fetchAdminQuestionUpdate(data: AdminApi.Question.QuestionEditor) {
  return request.post<boolean>({
    url: '/admin/questionbank/updateQuestionBank',
    data,
  })
}

/**
 *  批量导入题库
 */
export function fetchAdminQuestionImport(data: AdminApi.Question.QuestionImportParams) {
  return request.post<boolean>({
    url: '/admin/questionbank/importQuestions',
    data,
  })
}

/**
 *  下载题库模板
 */
export function fetchAdminQuestionTemplate() {
  return request.get<FileApi.FileAttachmentResponse>({
    url: '/admin/questionbank/downloadTemplate',
    responseType: 'blob',
  })
}

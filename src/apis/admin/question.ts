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

import request from '@/apis/http'

/**
 *  获取后台管理题库列表
 */
export function fetchAdminQuestionList(data: AdminApi.Question.QuestionListParams) {
  return request.post<AdminApi.Question.QuestionListResponse>({
    url: '/admin/question/list',
    data,
  })
}

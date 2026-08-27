import request from '@/apis/http'

/**
 *  管理端 获取待审批报名列表
 */
export function fetchAdminRecommendList(data: AdminApi.Recommend.RecommendListParams) {
  return request.post<AdminApi.Recommend.RecommendListResponse>({
    url: '/admin/recommend/getPendingApplyList',
    data,
  })
}

/**
 *  管理端 审批报名
 */
export function fetchAdminRecommendApply(data: AdminApi.Recommend.RecommendApplyParams) {
  return request.post({
    url: '/admin/recommend/approveApply',
    data,
  })
}

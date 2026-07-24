import request from '@/apis/http'

/**
 * 获取客户端项目学习阶段列表
 * @param projId 项目ID
 */
export function fetchClientProjectStagesList(projId: number) {
  return request.post<ClientApi.Project.ProjectStagesListResponse>({
    url: '/client/learningtask/getLearningTaskAppPreview',
    authPath: '/client',
    data: {
      projId,
    },
  })
}

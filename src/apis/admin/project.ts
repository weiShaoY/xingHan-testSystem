import request from '@/apis/http'

/**
 * 获取项目列表
 */
export function fetchAdminProjectList(data: AdminApi.Project.ProjectListParams) {
  return request.post<AdminApi.Project.ProjectListResponse>({
    url: '/admin/project/list',
    data,
  })
}

/**
 * 删除项目
 * @param projId 项目ID
 */
export function fetchAdminProjectDelete(projId: number) {
  return request.post<boolean>({
    url: '/admin/project/delete',
    data: {
      projId,
    },
  })
}

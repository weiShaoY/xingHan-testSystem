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
 *  新增项目
 */
export function fetchAdminProjectAdd(data: AdminApi.Project.ProjectEditor) {
  return request.post<boolean>({
    url: '/admin/project/addProject',
    data,
  })
}

/**
 *  获取项目设置
 *  @param projId 项目ID
 */
export function fetchAdminProjectSetting(projId: number) {
  return request.get<AdminApi.Project.ProjectEditor>({
    url: '/admin/project/getProject',
    params: {
      projId,
    },
  })
}

/**
 *  更新项目设置
 */
export function fetchAdminProjectUpdate(data: AdminApi.Project.ProjectEditor) {
  return request.post<boolean>({
    url: '/admin/project/updateProject',
    data,
  })
}

/**
 * 删除项目
 * @param projId 项目ID
 */
export function fetchAdminProjectDelete(projId: number) {
  return request.post<boolean>({
    url: '/admin/project/deleteProject',
    data: {
      projId,
    },
  })
}

// / //// ////////////////////////   项目学习阶段  ////////////////////////
/**
 * 获取后台管理项目学习阶段列表
 * @param projId 项目ID
 */
export function fetchAdminProjectStageList(projId: number) {
  return request.post<AdminApi.Project.ProjectStageListEditor>({
    url: '/admin/project/getStageDetail',
    data: {
      projId,
    },
  })
}

/**
 *  保存项目学习阶段信息
 */
export function fetchAdminProjectStageListUpdate(data: AdminApi.Project.ProjectStageListEditor) {
  return request.post<boolean>({
    url: '/admin/learningstage/updateStagesWithCourses',
    data,
  })
}

import request from '@/apis/http'

// / //////////////////////////////////////////////  分配  //////////////////////////////////////////////

/**
 * 获取分配用户的组织树
 */
export function fetchAdminGetOrganizationTreeWithAllUsers() {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/organization/getOrganizationTreeWithAllUsers',
  })
}

/**
 *  分配项目或课程
 */
export function fetchAdminAssignmentCreateAssignment(data: AdminApi.Organization.AssignmentCreateAssignmentRequest) {
  return request.post({
    url: '/admin/assignment/createAssignment',
    data,
  })
}

/**
 *  获取已经分配的组织架构树形(包含用户)
 */
export function fetchAdminAssignmentGetPartialOrganizationTree(
  data: AdminApi.Organization.AssignmentGetPartialOrganizationTreeRequest,
) {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/assignment/getPartialOrganizationTree',
  })
}

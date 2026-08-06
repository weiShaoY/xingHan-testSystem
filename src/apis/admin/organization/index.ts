import request from '@/apis/http'

// / //////////////////////////////////////////////  课程  //////////////////////////////////////////////

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

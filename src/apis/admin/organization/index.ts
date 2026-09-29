import request from '@/apis/http'

// / //////////////////////////////////////////////  分配  //////////////////////////////////////////////
/**
 *  分配项目或课程
 */
export function fetchAdminAssignmentCreateAssignment(data: AdminApi.Organization.AssignmentCreateAssignmentRequest) {
  return request.post({
    url: '/admin/assignment/createAssignment',
    data,
  })
}

// /////////////////////
/**
 *  获取佐敦已经分配的组织架构树形(包含用户)
 */
export function fetchAdminGetPartialOrganizationTreeJotun(
  data: AdminApi.Organization.AssignmentGetPartialOrganizationTreeRequest,
) {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/organization/getPartialOrganizationTreeJotun',
    params: data,
  })
}

/**
 *  组织佐敦架构树形(包含用户)
 */
export function fetchAdminGetOrganizationTreeWithAllUsersJotun() {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/organization/getOrganizationTreeWithAllUsersJotun',
  })
}

// / /////////////////////////// ////////////////////////  佐敦客户  ////////////////////////
/**
 *  获取佐敦客户已经分配的组织架构树形(包含用户)
 */
export function fetchAdminGetPartialOrganizationTreeCustomer(
  data: AdminApi.Organization.AssignmentGetPartialOrganizationTreeRequest,
) {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/organization/getPartialOrganizationTreeCustomer',
    params: data,
  })
}

/**
 *  组织佐敦客户架构树形(包含用户)
 */
export function fetchAdminGetOrganizationTreeWithAllUsersCustomer() {
  return request.get<AdminApi.Organization.OrganizationTreeWithAllUsersResponse>({
    url: '/admin/organization/getOrganizationTreeWithAllUsersCustomer',
  })
}

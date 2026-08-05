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

// export function fetchAdminGetOrganizationTree() {
//   return request.post<AdminApi.Organization.OrganizationTreeResponse>({
//     url: '/admin/organization/tree',
//   })
// }

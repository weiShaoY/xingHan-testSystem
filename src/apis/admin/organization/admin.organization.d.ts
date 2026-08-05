/**
 * 组织类型
 */
export namespace Organization {
  type UserNode = {

    /**
     * 公司id
     */
    companyId: number

    /**
     * 用户账号
     */
    userAccount: string

    /**
     * 用户id
     */
    userId: number

    /**
     * 用户名称
     */
    userName: string
  }

  type OrganizationTreeItem = {

    /**
     * 节点ID
     */
    id: string

    /**
     * 层级
     */
    levelIndex: number

    /**
     * 节点名称
     */
    name: string

    /**
     * 节点类型（J=部门组，C=客户公司）
     */
    nodeType: string

    /**
     * 原始ID（用于后续查询）
     */
    originalId?: number

    /**
     * 父节点ID
     */
    parentId: string

    /**
     * 用户个数
     */
    userCount: number

    /**
     *  子节点列表
     */
    children: OrganizationTreeItem[]

    users: UserNode[]
  }

  type OrganizationTreeWithAllUsersResponse = OrganizationTreeItem[]
}

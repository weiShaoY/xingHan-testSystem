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

  /**
   *  获取组织树（包含所有用户）
   */
  type OrganizationTreeWithAllUsersResponse = OrganizationTreeItem[]

  /**
   *  分配项目或课程请求参数
   */
  type AssignmentCreateAssignmentRequest = {

    /**
     * 目标ID（Proj_Id 或 Cou_Id）
     */
    targetId: number

    /**
     * 目标名称（冗余字段，便于显示）
     */
    targetName: string

    /**
     * 目标类型
     * @description 1=项目，2=课程
     */
    targetType: 1 | 2

    /**
     * 分配对象列表
     */
    recipients: OrganizationTreeWithAllUsersResponse
  }
}

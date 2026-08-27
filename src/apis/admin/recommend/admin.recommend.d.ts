/**
 * 客户端 历史类型
 */
export namespace Recommend {

  /**
   *  待审批报名列表参数
   */
  export type RecommendListParams = CommonApi.PaginationParams

  /**
   * 待审批报名列表项
   */
  export type RecommendListItem = {

    /**
     * 报名申请ID
     */
    applyId: number

    /**
     * 报名编号（唯一）
     */
    applyNo: string

    /**
     * 报名时间
     */
    applyTime: string

    /**
     * 报名类型
     * @description 1=课程报名，2=项目报名
     */
    applyType: 1 | 2

    /**
     * 报名类型名称（课程/项目）
     */
    applyTypeName: string

    /**
     * 审批状态
     * @description 0=待审批，1=已通过，2=已驳回，3=已撤回，4=已取消
     */
    approvalStatus: 0 | 1 | 2 | 3 | 4

    /**
     * 审批状态名称
     */
    approvalStatusName: string

    /**
     * 是否需要审批
     * @description 0=不需要，1=需要
     */
    needApproval: 0 | 1

    /**
     * 目标ID（课程ID或项目ID）
     */
    targetId: number

    /**
     * 目标名称（课程名称或项目名称）
     */
    targetName: string

    /**
     * 报名人账号
     */
    userAccount: string

    /**
     * 报名人姓名
     */
    userName: string
  }

  /**
   * 待审批报名列表响应
   */
  export type RecommendListResponse = RecommendListItem[]

  /**
   * 审批报名参数
   */
  export type RecommendApplyParams = {

    /**
     * 报名申请ID
     */
    applyId: number

    /**
     * 审批动作
     * @description 1=通过，2=驳回
     */
    approvalAction: 1 | 2

    /**
     * 审批意见/备注
     */
    approvalRemark: string
  }
}

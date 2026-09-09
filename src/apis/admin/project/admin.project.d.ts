/**
 * 管理端项目类型
 */
export namespace Project {

  /**
   * 项目列表请求参数
   */
  type ProjectListParams = CommonApi.PaginationParams & {

    /**
     * 项目名称
     */
    projName: string
  }

  /**
   * 项目列表项
   */
  type ProjectListItem = {

    /**
     * 数据状态
     * @description 0=删除，1=正常。
     */
    active: number

    /**
     * 公司ID
     */
    companyId: number

    /**
     * 创建人ID
     */
    creater: number

    /**
     * 创建时间
     */
    createTime: string

    /**
     * 报名介绍/说明
     */
    projApplyContent: string

    /**
     * 报名结束时间
     */
    projApplyEndTime: string

    /**
     * 报名信息模板（JSON格式，定义需要填写的字段）
     */
    projApplyInfoTemplate: string

    /**
     * 报名开始时间
     */
    projApplyStartTime: string

    /**
     * 自动审批条件（如：VIP用户自动通过，JSON格式定义规则）
     */
    projAutoApproveCondition: string

    /**
     * 取消报名截止天数（开课前多少天内不允许取消）
     */
    projCancelDeadline_Days: number

    /**
     * 项目封面图地址
     */
    projCover: string

    /**
     * 当前报名人数（冗余统计）
     */
    projCurrentApply_Count: number

    /**
     * 项目ID（主键，自增）
     */
    projId: number

    /**
     * 项目简介
     */
    projIntro: string

    /**
     * 是否需要报名
     * @description 0=不需要，1=需要。
     */
    projIsApply: number

    /**
     * 是否需要人工审批
     * @description 0=不需要，1=需要。
     */
    projIsApplyApproval: number

    /**
     * 是否允许取消报名
     * @description 0=不允许，1=允许。
     */
    projIsCancel: number

    /**
     * 是否限制报名人数
     * @description 0=不限制，1=限制。
     */
    projIsRestrict: number

    /**
     * 是否限制报名时间
     * @description 0=不限制，1=限制。
     */
    projIsRestrictTime: number

    /**
     * 是否启用
     * @description 0=禁用，1=启用。
     */
    projIsUse: number

    /**
     * 项目名称
     */
    projName: string

    /**
     * 限制报名人数上限
     */
    projRestrictCount: number

    /**
     * 排序号（升序）
     */
    projSort: number

    /**
     * 学习人数（报名人数统计）
     */
    projStudentSum: number

    /**
     * 项目浏览/点击数
     */
    projViewNum: number

    /**
     * 主学科ID
     */
    sbjID: number

    /**
     * 最后修改人ID
     */
    updater: number

    /**
     * 最后修改时间
     */
    updateTime: string

    /**
     * 项目阶段数量
     */
    projStage: string

    /**
     * 项目课程数量
     */
    projStageCourse: string
  }

  /**
   * 项目列表响应
   */
  type ProjectListResponse = CommonApi.PaginatedResponse<ProjectListItem>

  /**
   * 项目新增或者编辑参数
   */
  type ProjectEditor = {

    /**
     * 项目ID（主键，自增）
     */
    projId?: number

    /**
     * 项目名称
     */
    projName: string

    /**
     * 项目简介
     */
    projIntro?: string

    /**
     * 是否启用
     * @description 0=禁用，1=启用
     */
    projIsUse?: 0 | 1

    /**
     * 项目封面图
     */
    asId?: number

    /**
     * 项目封面图地址
     */
    projCover: string
  }

  // / ///////// ////////////////////////  项目学习阶段  ////////////////////////

  /**
   *  项目下学习阶段列表项
   */
  type ProjectStageListItem = {

    /**
     * 数据状态
     * @description 0=删除，1=正常。
     */
    active: number

    /**
     * 公司ID
     */
    companyId: number

    /**
     * 阶段下课程
     */
    course: AdminApi.Course.CourseListItem[]

    /**
     * 创建人ID
     */
    creater: number

    /**
     * 创建时间
     */
    createTime: string

    /**
     * 前置阶段ID（完成此阶段后才能学习下一阶段，自关联到Stage_Id）
     */
    prerequisiteStage_Id: number

    /**
     * 所属项目ID
     */
    projId: number

    /**
     * 阶段排序（学习顺序，升序）
     */
    sortOrder: number

    /**
     * 阶段ID（主键，自增）
     */
    stageId: number

    /**
     * 阶段介绍/学习目标
     */
    stageIntro: string

    /**
     * 阶段名称（如：第一阶段：Java基础）
     */
    stageName: string

    /**
     * 阶段类型（1=必修阶段，2=选修阶段）
     */
    stageType: number

    /**
     * 最后修改人ID
     */
    updater: number

    /**
     * 最后修改时间
     */
    updateTime: string

  }

  /**
   * 项目下学习阶段列表响应
   */
  type ProjectStageListEditor = {

    /**
     * 项目Id
     */
    projId: number

    /**
     * 项目名称
     */
    projName: string

    /**
     * 课程数量
     */
    projStageCourse: number

    /**
     * 小节数量
     */
    projSectionCount: number

    /**
     * 展示方式
     * @description 0=展开 1=折叠
     */
    displayMethod: 0 | 1

    /**
     * 是否设置多个学习阶段
     * @description 0=否，1=是。
     */
    isLearningStages: 0 | 1

    /**
     * 解锁条件
     * @description 0=按学习阶段解锁 1=按课程解锁 2=不限定学习顺序
     */
    unlockConditions: 0 | 1 | 2

    /**
     *  时长
     */
    allDuration: number

    nodes: ProjectStageListItem[]
  }
}

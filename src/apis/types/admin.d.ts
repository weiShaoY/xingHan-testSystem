/**
 *  管理端接口类型
 */
declare namespace AdminApi {

  /**
   * 认证类型
   */
  namespace Auth {

    /** 公钥 */
    type PublicKey = {

      /**
       * hash值
       */
      hash: string

      /**
       * 加密公钥
       */
      key: string
    }

    /** 登录参数 */
    type LoginParams = {

      /**
       * 登录和修改密码的数据
       */
      data: string

      /**
       * SM2密钥 redis键
       */
      key: string
    }

    /** 登录响应 */
    type LoginResponse = {

      /**
       * 登录凭证
       */
      token: string

      /**
       * 刷新凭证凭证
       */
      refreshToken: string

      /**
       * 是否是首次登录
       */
      isFirstLogin: string
    }

    /** 用户信息 */
    type UserInfo = {

      /**
       * 权限按钮编码列表
       */
      buttons: string[]

      /**
       * 用户角色编码列表
       */
      roles: string[]

      /**
       * 用户ID
       */
      userId: number

      /**
       * 用户名
       */
      userName: string

      /**
       * 邮箱
       */
      email: string

      /**
       * 头像地址
       */
      avatar: string
    }
  }

  /**
   * 课程类型
   */
  namespace Course {

    /**
     * 课程列表请求参数
     */
    type CourseListParams = CommonApi.PaginationParams & {

      /**
       * 课程名称
       */
      name: string
    }

    /**
     * 课程列表项
     */
    type CourseListItem = {

      /**
       * 数据状态
       * @description 0=删除，1=正常。
       */
      active: 0 | 1

      /**
       * 公司ID
       */
      companyId: number

      /**
       * 学习内容（可理解为课程大纲）
       */
      couContent: string

      /**
       * 课程ID（主键，自增）
       */
      couId: number

      /**
       * 课程介绍
       */
      couIntro: string

      /**
       * 是否启用
       * @description 0=禁用，1=启用。
       */
      couIsUse: 0 | 1

      /**
       * 课程难度等级
       * @description 1=初级，2=中级，3=高级。
       */
      couLevel: 1 | 2 | 3

      /**
       * 课程展示图片地址
       */
      couLogo: string

      /**
       * 课程缩略图地址
       */
      couLogoSmall: string

      /**
       * 课程名称
       */
      couName: string

      /**
       * 排序号（升序）
       */
      couTax: number

      /**
       * 课程报名名称
       */
      couTitle: string

      /**
       * 课程类型
       */
      couType: number

      /**
       * 课程拥有者/创建者用户ID
       */
      couUID: number

      couViewNum: number

      /**
       * 创建人ID
       */
      creater: number

      /**
       * 创建时间
       */
      createTime: string

      /**
       * 学科名称
       */
      sbjName: string

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
     * 课程列表响应
     */
    type CourseListResponse = CommonApi.PaginatedResponse<CourseListItem>

    /**
     * 课程新增或编辑请求参数
     * @description 新增和编辑课程时的参数
     */
    type CourseEditor = {

      /**
       * 课程名称
       */
      couName: string

      /**
       * 课程介绍
       */
      couIntro: string

      /**
       * 课程报名名称
       */
      couTitle: string

      /**
       * 是否限制报名人数
       * @description 0=不限制，1=限制。
       */
      couIsRestrict: 0 | 1

      /**
       * 限制报名人数上限
       */
      couRestrictCount: number

      /**
       * 是否限制报名时间
       * @description 0=不限制，1=限制。
       */
      couIsRestrictTime: 0 | 1

      /**
       * 报名开始时间
       */
      couApplyStartTime: string

      /**
       * 报名结束时间
       */
      couApplyEndTime: string

      /**
       * 是否需要人工审批
       * @description 0=不需要，1=需要。
       */
      couIsApplyApproval: 0 | 1

      /**
       * 是否允许取消报名
       * @description 0=不允许，1=允许。
       */
      couIsCancel: 0 | 1

      /**
       * 报名介绍/说明
       */
      couApplyContent: string

      /**
       * 章节解锁方式
       * @description 1=顺序解锁，2=进度解锁，3=章节测试解锁。
       */
      couUnlockMethod: 1 | 2 | 3

      /**
       * 是否展示学习学员信息
       * @description 0=不展示，1=展示。
       */
      couIsStudyInfo: 0 | 1

      /**
       * 是否限制学习总时长
       * @description 0=不限制，1=限制。
       */
      couIsLimitTime: 0 | 1

      /**
       * 学习总时长（小时）
       */
      couLimitTime: number

      // ==================== 可选字段 ====================

      /**
       * 公司ID
       */
      companyId?: number

      /**
       * 是否自动审批
       * @description 0=需人工审批，1=自动通过。
       */
      couApplyAutoApprove?: 0 | 1

      /**
       * 报名需要填写的信息模板
       */
      couApplyInfo?: string

      /**
       * 报名信息模板（JSON格式）
       */
      couApplyInfoTemplate?: string

      /**
       * 报名是否需要填写信息
       * @description 0=否，1=是。
       */
      couApplyNeedInfo?: 0 | 1

      /**
       * 学习内容（可理解为课程大纲）
       */
      couContent?: string

      /**
       * 是否有考试
       * @description 0=无，1=有。
       */
      couExistExam?: 0 | 1

      /**
       * 是否需要报名
       * @description 0=不需要，1=需要。
       */
      couIsApply?: 0 | 1

      /**
       * 是否章节结束时弹出评价
       * @description 0=不弹出，1=弹出。
       */
      couIsEvaluate?: 0 | 1

      /**
       * 是否展示序列号
       * @description 0=不展示，1=展示。
       */
      couIsNumber?: 0 | 1

      /**
       * 是否单节模式
       * @description 0=否，1=是。
       */
      couIsSingle?: 0 | 1

      /**
       * 是否启用
       * @description 0=禁用，1=启用。
       */
      couIsUse?: 0 | 1

      /**
       * 课程难度等级
       * @description 1=初级，2=中级，3=高级。
       */
      couLevel?: 1 | 2 | 3

      /**
       * 课程展示图片地址
       */
      couLogo?: string

      /**
       * 课程缩略图地址
       */
      couLogoSmall?: string

      /**
       * 每人最多报名次数
       * @description 0=不限制，其他值为限制次数。
       */
      couMaxApplyCount?: number

      /**
       * 课程ID
       */
      courseId?: number

      /**
       * 学习人数（选课人数统计）
       */
      couStudentSum?: number

      /**
       * 排序号（升序）
       */
      couTax?: number

      /**
       * 课程类型
       */
      couType?: number

      /**
       * 课程拥有者/创建者用户ID
       */
      couUID?: number

      /**
       * 视频课时数量
       */
      couVideoCount?: number

      /**
       * 课程浏览/点击数
       */
      couViewNum?: number

      /**
       * 部门中文名称
       */
      depCnName?: string

      /**
       * 部门ID
       */
      depId?: number

      /**
       * 学科名称
       */
      sbjName?: string
    }

    /**
     * 小节类型定义
     */
    type Section = {

      /**
       *  小节 ID
       */
      id: number

      /**
       *  小节名称
       */
      name: string

      /**
       *  小节序号
       */
      order?: number

      /**
       *  小节描述
       */
      description: string

      /**
       * 小节学习人数
       */
      participantCount: number

      /**
       * 小节内容类型
       * @description 0=文档，1=视频，2=考试，3=问卷。
       */
      sectionType: 0 | 1 | 2 | 3

      /**
       * 内容项类型标识
       * @description section 小节，chapter 章节。
       */
      itemType: 'section'
    }

    /**
     * 章节类型定义
     */
    type Chapter = {

      /**
       *  章节 ID
       */
      id: number

      /**
       *  章节名称
       */
      name: string

      /**
       *  章节描述
       */
      description: string

      /**
       *  章节是否对学员可见
       * @description 0=不可见，1=可见。
       */
      isVisible: 0 | 1

      /**
       * 内容项类型标识
       * @description section 小节，chapter 章节。
       */
      itemType: 'chapter'

      /** 章节下的小节列表 */
      sectionList: Section[]
    }

    /**
     * 章节或小节的列表项。
     */
    type CourseOutlineListItem = Chapter | Section

    /**
     * 课程章节列表响应
     */
    type CourseOutlineListResponse = CourseOutlineListItem[]

    /**
     * 课程大纲节点新增或编辑请求参数
     * @description 用于创建或编辑课程章节、小节节点。
     */
    type CourseOutlineEditor = {

      /**
       * 课程ID
       * @description 当前大纲节点所属课程。
       */
      couId: number

      /**
       * 节点类型
       * @description 1=章节，2=小节。
       */
      olType: 1 | 2

      /**
       * 节点深度
       * @description 章节固定为1；小节可为1或2。
       */
      olLevel: 1 | 2

      /**
       * 节点名称
       * @description 章节或小节的展示名称。
       */
      olName: string

      /**
       * 节点简介
       * @description 章节或小节的简介内容。
       */
      olIntro: string

      /**
       * 是否对学员可见
       * @description 0=不可见，1=可见；仅章节类型需要。
       */
      olIsUse?: 0 | 1

      /**
       * 父级节点ID
       * @description 创建章节下的小节时填写父级章节ID；仅小节类型需要。
       */
      olPID?: number

      /**
       * 附件ID
       * @description 小节关联的附件ID；仅小节类型需要。
       */
      asId?: number

    }

    /**
     * 课程章节或小节详情响应
     */
    type CourseOutlineDetail = {

      /**
       * 课程ID
       * @description 当前大纲节点所属课程。
       */
      couId: number

      /**
       * 节点类型
       * @description 1=章节，2=小节。
       */
      olType: 1 | 2

      /**
       * 节点深度
       * @description 章节固定为1；小节可为1或2。
       */
      olLevel: 1 | 2

      /**
       * 节点名称
       * @description 章节或小节的展示名称。
       */
      olName: string

      /**
       * 节点简介
       * @description 章节或小节的简介内容。
       */
      olIntro: string

      /**
       * 是否对学员可见
       * @description 0=不可见，1=可见；仅章节类型需要。
       */
      olIsUse?: 0 | 1

      /**
       * 父级节点ID
       * @description 创建章节下的小节时填写父级章节ID；仅小节类型需要。
       */
      olPID?: number

      /**
       * 附件ID
       * @description 小节关联的附件ID；仅小节类型需要。
       */
      asId?: number

      /**
       * 小节序号
       * @description 小节在章节下的排序号。
       */
      olTax: number
    }

  }
}

/**
 *  管理端接口类型
 */
declare namespace AdminApi {

  /** 认证类型 */
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

  /** 课程类型 */
  namespace Course {

    /** 课程列表请求参数 */
    type CourseListParams = CommonApi.PaginationParams

    /** 课程列表项 */
    type CourseListItem = {

      /**
       * 数据状态（0=删除，1=正常）
       */
      active: number

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
      couID: number

      /**
       * 课程介绍
       */
      couIntro: string

      /**
       * 是否启用（0=禁用，1=启用）
       */
      couIsUse: number

      /**
       * 课程难度等级（1=初级，2=中级，3=高级）
       */
      couLevel: number

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
       * 学科ID
       */
      sbjID: number

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

    /** 课程列表响应 */
    type CourseListResponse = CommonApi.PaginatedResponse<CourseListItem>

    /**
     *  新增课程参数
     */
    type AddCourseParams = {

      /**
       * 公司ID
       */
      companyId: number

      /**
       * 是否自动审批（1=自动通过，0=需人工审批）
       */
      couApplyAutoApprove: number

      /**
       * 报名介绍/说明
       */
      couApplyContent: string

      /**
       * 报名结束时间
       */
      couApplyEndTime: string

      /**
       * 报名需要填写的信息模板
       */
      couApplyInfo: string

      /**
       * 报名信息模板（JSON格式）
       */
      couApplyInfoTemplate: string

      /**
       * 报名是否需要填写信息（1=是，0=否）
       */
      couApplyNeedInfo: number

      /**
       * 报名开始时间
       */
      couApplyStartTime: string

      /**
       * 学习内容（可理解为课程大纲）
       */
      couContent: string

      /**
       * 是否有考试（0=无，1=有）
       */
      couExistExam: number

      /**
       * 课程介绍
       */
      couIntro: string

      /**
       * 是否需要报名（0=不需要，1=需要）
       */
      couIsApply: number

      /**
       * 是否需要人工审批（0=不需要，1=需要）
       */
      couIsApplyApproval: number

      /**
       * 是否允许取消报名（0=不允许，1=允许）
       */
      couIsCancel: number

      /**
       * 是否章节结束时弹出评价（0=不弹出，1=弹出）
       */
      couIsEvaluate: number

      /**
       * 是否限制学习总时长（0=不限制，1=限制）
       */
      couIsLimitTime: number

      /**
       * 是否展示序列号（0=不展示，1=展示）
       */
      couIsNumber: number

      /**
       * 是否限制报名人数（0=不限制，1=限制）
       */
      couIsRestrict: number

      /**
       * 是否限制报名时间（0=不限制，1=限制）
       */
      couIsRestrictTime: number

      /**
       * 是否单节模式（0=否，1=是）
       */
      couIsSingle: number

      /**
       * 是否展示学习学员信息（0=不展示，1=展示）
       */
      couIsStudyInfo: number

      /**
       * 是否启用（0=禁用，1=启用）
       */
      couIsUse: number

      /**
       * 课程难度等级（1=初级，2=中级，3=高级）
       */
      couLevel: number

      /**
       * 学习总时长（小时）
       */
      couLimitTime: number

      /**
       * 课程展示图片地址
       */
      couLogo: string

      /**
       * 课程缩略图地址
       */
      couLogoSmall: string

      /**
       * 每人最多报名次数（0或不限制）
       */
      couMaxApplyCount: number

      /**
       * 课程名称
       */
      couName: string

      /**
       * 限制报名人数上限
       */
      couRestrictCount: number

      /**
       * 课程ID（主键，自增）
       */
      courseId: number

      /**
       * 学习人数（选课人数统计）
       */
      couStudentSum: number

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

      /**
       * 章节解锁方式（1=顺序解锁，2=进度解锁，3=章节测试解锁）
       */
      couUnlockMethod: number

      /**
       * 视频课时数量
       */
      couVideoCount: number

      /**
       * 课程浏览/点击数
       */
      couViewNum: number

      /**
       * 部门中文名称
       */
      depCnName: string

      /**
       * 部门ID
       */
      depId: number

      /**
       * 学科ID
       */
      sbjID: number

      /**
       * 学科名称
       */
      sbjName: string
    }

    /** 课程详情请求参数 */
    type CourseDetailParams = {

      /**
       * 课程ID
       */
      courseId: number
    }

    /** 课程设置响应 */
    type CourseSettingResponse = {

      /**
       * 公司ID
       */
      companyId: number

      /**
       * 报名信息模板（JSON格式）
       */
      cou_Apply_Info_Template: string

      /**
       * 是否自动审批（1=自动通过，0=需人工审批）
       */
      couApplyAutoApprove: number

      /**
       * 报名介绍/说明
       */
      couApplyContent: string

      /**
       * 报名结束时间
       */
      couApplyEndTime: Date

      /**
       * 报名需要填写的信息模板
       */
      couApplyInfo: string

      /**
       * 报名是否需要填写信息（1=是，0=否）
       */
      couApplyNeedInfo: number

      /**
       * 报名开始时间
       */
      couApplyStartTime: Date

      /**
       * 学习内容（可理解为课程大纲）
       */
      couContent: string

      /**
       * 是否有考试（0=无，1=有）
       */
      couExistExam: number

      /**
       * 课程介绍
       */
      couIntro: string

      /**
       * 是否需要报名（0=不需要，1=需要）
       */
      couIsApply: number

      /**
       * 是否需要人工审批（0=不需要，1=需要）
       */
      couIsApplyApproval: number

      /**
       * 是否允许取消报名（0=不允许，1=允许）
       */
      couIsCancel: number

      /**
       * 是否章节结束时弹出评价（0=不弹出，1=弹出）
       */
      couIsEvaluate: number

      /**
       * 是否限制学习总时长（0=不限制，1=限制）
       */
      couIsLimitTime: number

      /**
       * 是否展示序列号（0=不展示，1=展示）
       */
      couIsNumber: number

      /**
       * 是否限制报名人数（0=不限制，1=限制）
       */
      couIsRestrict: number

      /**
       * 是否限制报名时间（0=不限制，1=限制）
       */
      couIsRestrictTime: number

      /**
       * 是否单节模式（0=否，1=是）
       */
      couIsSingle: number

      /**
       * 是否展示学习学员信息（0=不展示，1=展示）
       */
      couIsStudyInfo: number

      /**
       * 是否启用（0=禁用，1=启用）
       */
      couIsUse: number

      /**
       * 课程难度等级（1=初级，2=中级，3=高级）
       */
      couLevel: number

      /**
       * 学习总时长（小时）
       */
      couLimitTime: number

      /**
       * 课程展示图片地址
       */
      couLogo: string

      /**
       * 课程缩略图地址
       */
      couLogoSmall: string

      /**
       * 每人最多报名次数（0或不限制）
       */
      couMaxApplyCount: number

      /**
       * 课程名称
       */
      couName: string

      /**
       * 限制报名人数上限
       */
      couRestrictCount: number

      /**
       * 课程ID（主键，自增）
       */
      courseId: number

      /**
       * 学习人数（选课人数统计）
       */
      couStudentSum: number

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

      /**
       * 章节解锁方式（1=顺序解锁，2=进度解锁，3=章节测试解锁）
       */
      couUnlockMethod: number

      /**
       * 视频课时数量
       */
      couVideoCount: number

      /**
       * 课程浏览/点击数
       */
      couViewNum: number

      /**
       * 部门中文名称
       */
      depCnName: string

      /**
       * 部门ID
       */
      depId: number

      /**
       * 学科ID
       */
      sbjID: number

      /**
       * 学科名称
       */
      sbjName: string
    }

    /**
     * 课程详情响应
     */
    type CourseDetailResponse = {

    }
  }
}

/**
 *  管理端类型
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
      avatar?: string
    }
  }

  /** 课程类型 */
  namespace Course {

    /** 课程列表请求参数 */
    type CourseListParams = {

      /**
       * 当前页码
       */
      currentPage: number

      /**
       * 每页数量
       */
      pageSize: number

      /**
       * 排序字段
       */
      orderBy: string

      /**
       * 是否升序（1=升序，0=降序）
       */
      isAsc: number
    }

    /** 课程列表项 */
    type CourseListItem = {

      /**
       * 数据状态（0=删除，1=正常）
       */
      active?: number

      /**
       * 公司ID
       */
      companyId?: number

      /**
       * 学习内容（可理解为课程大纲）
       */
      couContent?: null | string

      /**
       * 课程ID（主键，自增）
       */
      couId?: number

      /**
       * 课程介绍
       */
      couIntro?: null | string

      /**
       * 是否启用（0=禁用，1=启用）
       */
      couIsUse?: number

      /**
       * 课程难度等级（1=初级，2=中级，3=高级）
       */
      couLevel?: number

      /**
       * 课程展示图片地址
       */
      couLogo?: null | string

      /**
       * 课程缩略图地址
       */
      couLogoSmall?: null | string

      /**
       * 课程名称
       */
      couName?: null | string

      /**
       * 排序号（升序）
       */
      couTax?: number

      /**
       * 课程报名名称
       */
      couTitle?: null | string

      /**
       * 课程类型
       */
      couType?: number

      /**
       * 课程拥有者/创建者用户ID
       */
      couUID?: number
      couViewNum?: number

      /**
       * 创建人ID
       */
      creater?: number

      /**
       * 创建时间
       */
      createTime?: Date

      /**
       * 学科ID
       */
      sbjID?: number

      /**
       * 学科名称
       */
      sbjName?: null | string

      /**
       * 最后修改人ID
       */
      updater?: number | null

      /**
       * 最后修改时间
       */
      updateTime?: Date | null
    }

    /** 课程列表响应 */
    type CourseListResponse = Api.Common.PaginatedResponse<CourseListItem>

  }
}

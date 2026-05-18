/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { userName: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {

  /** 通用类型 */
  namespace Common {

    /** 分页参数 */
    type PaginationParams = {

      /** 当前页码 */
      current: number

      /** 每页条数 */
      size: number

      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>

    /** 分页响应基础结构 */
    type PaginatedResponse<T = any> = {
      records: T[]
      current: number
      size: number
      total: number
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 系统管理类型 */
  namespace SystemManage {

    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    type UserListItem = {
      id: number
      avatar: string
      status: string
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 用户搜索参数 */
    type UserSearchParams = Partial<
      Pick<UserListItem, 'id' | 'userName' | 'userGender' | 'userPhone' | 'userEmail' | 'status'>
      & Api.Common.CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    type RoleListItem = {
      roleId: number
      roleName: string
      roleCode: string
      description: string
      enabled: boolean
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'>
      & Api.Common.CommonSearchParams & {
        startTime: string | null
        endTime: string | null
      }
    >
  }

  /** 课程类型 */
  namespace Course {

    /** 课程列表请求参数 */
    type CourseListParams = {
      currentPage: number
      pageSize: number
      orderBy: string
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

  /** 认证类型 */
  namespace Auth {

    /** 登录参数 */
    type LoginParams = {
      userName: string
      password: string
    }

    /** 登录响应 */
    type LoginResponse = {
      token: string
      refreshToken: string
    }

    /** 用户信息 */
    type UserInfo = {
      buttons: string[]
      roles: string[]
      userId: number
      userName: string
      email: string
      avatar?: string
    }
  }
}

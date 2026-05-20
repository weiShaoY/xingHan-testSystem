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
 * const response: Api.Auth.UserInfo = await fetchAdminGetUserInfo()
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

      /** 数据列表 */
      records: T[]

      /** 当前页码 */
      current: number

      /** 每页条数 */
      size: number

      /** 总条数 */
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

      /** 用户ID */
      id: number

      /** 用户头像 */
      avatar: string

      /** 用户状态 */
      status: string

      /** 用户名 */
      userName: string

      /** 用户性别 */
      userGender: string

      /** 用户昵称 */
      nickName: string

      /** 手机号码 */
      userPhone: string

      /** 邮箱地址 */
      userEmail: string

      /** 用户角色列表 */
      userRoles: string[]

      /** 创建人 */
      createBy: string

      /** 创建时间 */
      createTime: string

      /** 更新人 */
      updateBy: string

      /** 更新时间 */
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

      /** 角色ID */
      roleId: number

      /** 角色名称 */
      roleName: string

      /** 角色编码 */
      roleCode: string

      /** 角色描述 */
      description: string

      /** 是否启用 */
      enabled: boolean

      /** 创建时间 */
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'>
      & Api.Common.CommonSearchParams & {

        /** 开始时间 */
        startTime: string | null

        /** 结束时间 */
        endTime: string | null
      }
    >
  }

}

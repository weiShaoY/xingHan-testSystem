/**
 * 认证类型
 */
export namespace Auth {

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

    /**
     * 手机号
     */
    mobile: string
  }
}

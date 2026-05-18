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

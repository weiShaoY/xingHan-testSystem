/**
 * 开发环境登录绕过配置。
 *
 * 仅在 `import.meta.env.DEV` 且 `VITE_APP_DEV_SKIP_AUTH=true` 时生效。
 */

/** 是否开启开发环境登录绕过。 */
export const isDevSkipAuthEnabled = import.meta.env.DEV
  && import.meta.env.VITE_APP_DEV_SKIP_AUTH === 'true'

/** 开发环境管理端用户信息。 */
export const devAdminUserInfo: AdminApi.Auth.UserInfo = {
  buttons: ['add', 'edit', 'delete', 'export', 'view', 'publish', 'config', 'manage'],
  roles: ['R_SUPER', 'R_ADMIN', 'R_USER'],
  userId: 1,
  userName: 'Dev Admin',
  email: 'dev-admin@example.com',
  avatar: '',
}

/** 开发环境客户端用户信息。 */
export const devClientUserInfo: ClientApi.Auth.UserInfo = {
  buttons: ['add', 'edit', 'delete', 'export', 'view', 'publish', 'config', 'manage'],
  roles: ['R_SUPER', 'R_ADMIN', 'R_USER'],
  userId: 2,
  userName: 'Dev Client',
  email: 'dev-client@example.com',
  avatar: '',
}

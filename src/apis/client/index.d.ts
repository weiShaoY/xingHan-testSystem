import { Auth as AuthNamespace } from './auth/auth.d'

declare global {
  namespace ClientApi {
    export import Auth = AuthNamespace

  }
}

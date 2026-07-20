import { Auth as AuthNamespace } from './auth/auth.d'
import { Task as TaskNamespace } from './task/task.d'

declare global {
  namespace ClientApi {
    export import Auth = AuthNamespace
    export import Task = TaskNamespace
  }
}

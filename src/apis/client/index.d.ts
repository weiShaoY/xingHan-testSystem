import { Auth as AuthNamespace } from './auth/client.auth'

import { Course as CourseNamespace } from './course/client.course'

import { Project as ProjectNamespace } from './project/client.project'

import { Task as TaskNamespace } from './task/client.task'

declare global {
  namespace ClientApi {
    export import Auth = AuthNamespace
    export import Project = ProjectNamespace
    export import Task = TaskNamespace
    export import Course = CourseNamespace
  }
}

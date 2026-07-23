import { Auth as AuthNamespace } from './auth/admin.auth'

import { Course as CourseNamespace } from './course/admin.course'

import { Project as ProjectNamespace } from './project/admin.project.d'

import { Question as QuestionNamespace } from './question/admin.question'

declare global {
  namespace AdminApi {
    export import Auth = AuthNamespace
    export import Course = CourseNamespace
    export import Project = ProjectNamespace
    export import Question = QuestionNamespace
  }
}

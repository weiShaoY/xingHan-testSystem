import { Auth as AuthNamespace } from './auth/auth.d'

import { Course as CourseNamespace } from './course/course.d'

import { Project as ProjectNamespace } from './project/project.d'

import { Question as QuestionNamespace } from './question/question.d'

declare global {
  namespace AdminApi {
    export import Auth = AuthNamespace
    export import Course = CourseNamespace
    export import Project = ProjectNamespace
    export import Question = QuestionNamespace
  }
}

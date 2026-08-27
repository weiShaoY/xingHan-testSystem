import { Auth as AuthNamespace } from './auth/admin.auth'

import { Course as CourseNamespace } from './course/admin.course'

import { Organization as OrganizationNamespace } from './organization/admin.organization'

import { Project as ProjectNamespace } from './project/admin.project.d'

import { Question as QuestionNamespace } from './question/admin.question'

import { Recommend as RecommendNamespace } from './recommend/admin.recommend'

declare global {
  namespace AdminApi {
    export import Auth = AuthNamespace
    export import Course = CourseNamespace
    export import Project = ProjectNamespace
    export import Question = QuestionNamespace
    export import Organization = OrganizationNamespace
    export import Recommend = RecommendNamespace
  }
}

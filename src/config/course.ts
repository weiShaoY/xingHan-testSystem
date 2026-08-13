/**
 * 小节内容类型：0 文档，1 视频，2 考试，3 问卷
 */
export type SectionType = 0 | 1 | 2 | 3

/**
 * 小节类型配置
 */
export type SectionTypeConfig = {
  sectionType: SectionType
  sectionTypeName: string
  sectionIcon: string
  sectionIconBgColor: string
}

/**
 * 小节类型元数据
 */
type SectionTypeMeta = SectionTypeConfig & {
  adminCreateRoute: string
  adminCreateRouteTitle: string
  adminEditRoute: string
  adminEditRouteTitle: string
  clientRoute: string
}

/**
 * 小节类型映射
 */
const sectionTypeMap: Record<SectionType, SectionTypeMeta> = {
  0: {
    sectionType: 0,
    sectionTypeName: '文档',
    sectionIcon: 'ri:article-line',
    sectionIconBgColor: '#fcbd2c',
    adminCreateRoute: 'AdminCourseSectionDocumentCreate',
    adminCreateRouteTitle: '新增文档小节',
    adminEditRoute: 'AdminCourseSectionDocumentEdit',
    adminEditRouteTitle: '编辑文档小节',
    clientRoute: 'ClientCourseSectionDocument',
  },
  1: {
    sectionType: 1,
    sectionTypeName: '视频',
    sectionIcon: 'ri:vidicon-line',
    sectionIconBgColor: '#ff2814',
    adminCreateRoute: 'AdminCourseSectionVideoCreate',
    adminCreateRouteTitle: '新增视频小节',
    adminEditRoute: 'AdminCourseSectionVideoEdit',
    adminEditRouteTitle: '编辑视频小节',
    clientRoute: 'ClientCourseSectionVideo',
  },
  2: {
    sectionType: 2,
    sectionTypeName: '考试',
    sectionIcon: 'ri:medal-line',
    sectionIconBgColor: '#673ab8',
    adminCreateRoute: 'AdminCourseSectionExamCreate',
    adminCreateRouteTitle: '新增考试小节',
    adminEditRoute: 'AdminCourseSectionExamEdit',
    adminEditRouteTitle: '编辑考试小节',
    clientRoute: 'ClientCourseSectionExam',
  },
  3: {
    sectionType: 3,
    sectionTypeName: '问卷',
    sectionIcon: 'ri:question-line',
    sectionIconBgColor: '#2cb870',
    adminCreateRoute: 'AdminCourseSectionQuestionCreate',
    adminCreateRouteTitle: '新增问卷小节',
    adminEditRoute: 'AdminCourseSectionQuestionEdit',
    adminEditRouteTitle: '编辑问卷小节',
    clientRoute: 'ClientCourseSectionQuestion',
  },
}

/**
 * 小节类型配置映射
 */
export const sectionTypeConfigMap: Record<SectionType, SectionTypeConfig> = {
  0: sectionTypeMap[0],
  1: sectionTypeMap[1],
  2: sectionTypeMap[2],
  3: sectionTypeMap[3],
}

/**
 * 小节类型选项列表
 */
export const sectionTypeOptions: SectionTypeConfig[] = Object.values(sectionTypeConfigMap)

/**
 * 获取小节类型对应的图标配置
 */
export function getSectionTypeConfig(sectionType: SectionType) {
  return sectionTypeMap[sectionType]
}

/**
 * 获取管理端 小节创建页路由
 */
export function getAdminSectionCreateRoute(sectionType: SectionType) {
  return sectionTypeMap[sectionType].adminCreateRoute
}

/**
 * 获取管理端 小节创建页路由标题
 */
export function getAdminSectionCreateRouteTitle(sectionType: SectionType) {
  return sectionTypeMap[sectionType].adminCreateRouteTitle
}

/**
 * 获取管理端 小节编辑页路由
 */
export function getAdminSectionEditRoute(sectionType: SectionType) {
  return sectionTypeMap[sectionType].adminEditRoute
}

/**
 * 获取管理端 小节编辑页路由标题
 */
export function getAdminSectionEditRouteTitle(sectionType: SectionType) {
  return sectionTypeMap[sectionType].adminEditRouteTitle
}

/**
 * 获取客户端 小节路由
 */
export function getClientSectionRoute(sectionType: SectionType) {
  return sectionTypeMap[sectionType].clientRoute
}

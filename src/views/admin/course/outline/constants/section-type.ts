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
  createRoute: string
  createRouteTitle: string
  editRoute: string
  editRouteTitle: string
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
    createRoute: 'AdminCourseSectionDocumentCreate',
    createRouteTitle: '新增文档小节',
    editRoute: 'AdminCourseSectionDocumentEdit',
    editRouteTitle: '编辑文档小节',
  },
  1: {
    sectionType: 1,
    sectionTypeName: '视频',
    sectionIcon: 'ri:vidicon-line',
    sectionIconBgColor: '#ff2814',
    createRoute: 'AdminCourseSectionVideoCreate',
    createRouteTitle: '新增视频小节',
    editRoute: 'AdminCourseSectionVideoEdit',
    editRouteTitle: '编辑视频小节',
  },
  2: {
    sectionType: 2,
    sectionTypeName: '考试',
    sectionIcon: 'ri:medal-line',
    sectionIconBgColor: '#673ab8',
    createRoute: 'AdminCourseSectionExamCreate',
    createRouteTitle: '新增考试小节',
    editRoute: 'AdminCourseSectionExamEdit',
    editRouteTitle: '编辑考试小节',
  },
  3: {
    sectionType: 3,
    sectionTypeName: '问卷',
    sectionIcon: 'ri:survey-line',
    sectionIconBgColor: '#2cb870',
    createRoute: 'AdminCourseSectionSurveyCreate',
    createRouteTitle: '新增问卷小节',
    editRoute: 'AdminCourseSectionSurveyEdit',
    editRouteTitle: '编辑问卷小节',
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
 * 获取小节创建页路由
 */
export function getSectionCreateRoute(sectionType: SectionType) {
  return sectionTypeMap[sectionType].createRoute
}

/**
 * 获取小节创建页路由标题
 */
export function getSectionCreateRouteTitle(sectionType: SectionType) {
  return sectionTypeMap[sectionType].createRouteTitle
}

/**
 * 获取小节编辑页路由
 */
export function getSectionEditRoute(sectionType: SectionType) {
  return sectionTypeMap[sectionType].editRoute
}

/**
 * 获取小节编辑页路由标题
 */
export function getSectionEditRouteTitle(sectionType: SectionType) {
  return sectionTypeMap[sectionType].editRouteTitle
}

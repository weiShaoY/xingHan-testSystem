/**
 * 小节内容类型：0 文档，1 视频，2 考试，3 问卷
 */
export type SectionType = 0 | 1 | 2 | 3

/**
 * 小节类型配置
 */
export type SectionTypeConfig = {

  /** 小节内容类型 */
  sectionType: SectionType

  /** 小节类型名称 */
  sectionTypeName: string

  /** 小节类型图标 */
  sectionIcon: string

  /** 小节类型图标背景色 */
  sectionIconBgColor: string
}

/**
 * 小节类型配置映射
 */
export const sectionTypeConfigMap: Record<SectionType, SectionTypeConfig> = {
  0: {
    sectionType: 0,
    sectionTypeName: '文档',
    sectionIcon: 'ri:article-line',
    sectionIconBgColor: '#fcbd2c',
  },
  1: {
    sectionType: 1,
    sectionTypeName: '视频',
    sectionIcon: 'ri:vidicon-line',
    sectionIconBgColor: '#ff2814',
  },
  2: {
    sectionType: 2,
    sectionTypeName: '考试',
    sectionIcon: 'ri:medal-line',
    sectionIconBgColor: '#673ab8',
  },
  3: {
    sectionType: 3,
    sectionTypeName: '问卷',
    sectionIcon: 'ri:survey-line',
    sectionIconBgColor: '#2cb870',
  },
}

/**
 * 创建小节路由映射
 */
const createSectionRouteMap: Record<SectionType, string> = {
  0: 'AdminCourseSectionDocumentCreate',
  1: 'AdminCourseSectionVideoCreate',
  2: 'AdminCourseSectionExamCreate',
  3: 'AdminCourseSectionSurveyCreate',
}

/**
 * 编辑小节路由映射
 */
const editSectionRouteMap: Record<SectionType, string> = {
  0: 'AdminCourseSectionDocumentEdit',
  1: 'AdminCourseSectionVideoEdit',
  2: 'AdminCourseSectionExamEdit',
  3: 'AdminCourseSectionSurveyEdit',
}

/**
 * 小节类型选项列表
 */
export const sectionTypeOptions = Object.values(sectionTypeConfigMap)

/**
 * 获取小节类型对应的图标配置
 */
export function getSectionTypeConfig(sectionType: SectionType) {
  return sectionTypeConfigMap[sectionType]
}

/**
 *  获取小节创建页路由
 */
export function getSectionCreateRoute(sectionType: SectionType) {
  return createSectionRouteMap[sectionType]
}

/**
 *  获取小节编辑页路由
 */
export function getSectionEditRoute(sectionType: SectionType) {
  return editSectionRouteMap[sectionType]
}

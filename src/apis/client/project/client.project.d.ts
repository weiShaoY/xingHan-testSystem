/**
 * 客户端 项目类型
 */
export namespace Project {

  /**
   *  项目下阶段列表项
   */
  type ProjectStageListItem = {

    /**
     * 阶段ID
     */
    stageId: number

    /**
     * 阶段名称
     */
    stageName: string

    /**
     * 阶段介绍
     */
    stageIntro: string

    /**
     * 阶段下课程数量
     */
    projStageCourseCount: number

    /**
     * 阶段时长
     */
    duration: number

    /**
     * 阶段下课程列表
     */
    stageCourse: AdminApi.Course.CourseListItem[]

  }

  /**
   * 项目下学习阶段列表响应
   */
  type ProjectStagesListResponse = {

    /**
     * 项目Id
     */
    projId: number

    /**
     *  项目名称
     */
    projName: string

    /**
     *  项目介绍
     */
    projIntro: string

    /**
     *  项目封面
     */
    projCover: string

    /**
     *  阶段数量
     */
    projStage: 0

    /**
     *  阶段课程总数
     */
    projStageCourseCount: 0

    /**
     *  学习进度
     */
    learningProgress: string

    /**
     *  项目阶段数组
     */
    projectDirectory: ProjectStageListItem[]

  }
}

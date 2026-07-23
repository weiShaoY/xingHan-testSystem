/** 客户端任务类型 */
export namespace Task {

  /** 任务列表参数 */
  export type TaskListParams = {

    /**
     *  学习类型
     *  @description 0: 所有 1: 项目 2: 课程
     */
    learningType: 0 | 1 | 2
  }

  /**
   * 任务列表项
   */
  type TaskListItem = {

    /**
     * 任务ID
     */
    taskId: number

    /**
     * 项目ID
     */
    projId: number

    /**
     * 项目名称
     */
    projName: string

    /**
     * 项目学习阶段
     */
    projStage: number

    /**
     * 项目学习阶段课程
     */
    projStageCourse: number

    /**
     *  学习类型
     *  @description  1: 项目 2: 课程
     */
    learningType: 1 | 2

    /**
     * 项目学习进度
     */
    learningProgress: string
  }

  /** 任务列表响应 */
  type TaskListResponse = TaskListItem[]

}

/** 客户端任务类型 */
export namespace Task {
  /**
   * 任务列表项
   */
  type TaskListItem = {
    /**
     * 任务ID
     */
    taskId: number,
    /**
     * 项目ID
     */
    projId: number,
    /**
     * 项目名称
     */
    projName: string,
    /**
     * 项目学习阶段
     */
    projStage: number,
    /**
     * 项目学习阶段课程
     */
    projStageCourse: number,
    /**
     * 项目学习进度
     */
    learningProgress: string,
  }
  /** 任务列表响应 */
  type TaskListResponse = TaskListItem[]

}

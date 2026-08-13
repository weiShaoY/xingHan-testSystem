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

  /** 任务列表 课程项 */
  type TaskListResponseCourseListItem = {

    /**
     * 课程ID
     */
    couId: number

    /**
     * 课程名称
     */
    couName: string

    /**
     * 课程小节数量
     */
    couOutlineCount: number

    /**
     * 学习进度
     */
    learningProgress: number
  }

  /** 任务列表 项目项 */
  type TaskListResponseProjectListItem = {

    /**
     * 学习进度
     */
    learningProgress: number

    /**
     * 项目ID
     */
    projId: number

    /**
     * 项目名称
     */
    projName: string

    /**
     * 阶段数量
     */
    projStage: number

    /**
     * 课程数量
     */
    projStageCourse: number
  }

  /** 任务列表响应 */
  type TaskListResponse = {
    courseList: TaskListResponseCourseListItem[]
    projectList: TaskListResponseProjectListItem[]
  }

}

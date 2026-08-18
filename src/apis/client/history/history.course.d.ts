/**
 * 客户端 历史类型
 */
export namespace History {

  /**
   *  学习历史项
   */
  export type HistoryCourseResponseItem = {

    /**
     * 完成时间
     */
    completeTime: string

    /**
     * 完成时间文本
     */
    completeTimeText: string

    /**
     * 是否完成
     */
    isCompleted: boolean

    /**
     * 最后学习时间
     */
    lastStudyTime: string

    /**
     * 最后学习时间文本
     */
    lastStudyTimeText: string

    /**
     * 学习进度百分比
     */
    progress: number

    /**
     * 进度文本
     */
    progressText: string

    /**
     * 开始学习时间
     */
    startTime: string

    /**
     * 状态颜色
     */
    statusColor: string

    /**
     * 状态文本
     */
    statusText: string

    /**
     * 学习时长（秒）
     */
    studySeconds: number

    /**
     * 学习时长文本
     */
    studyTimeText: string

    /**
     * 目标ID（课程ID或项目ID）
     */
    targetId: number

    /**
     * 目标名称
     */
    targetName: string

    /**
     * 目标类型名称
     */
    targetType: string

    /**
     * 目标类型值
     * @description 1=项目，2=课程
     */
    targetTypeValue: 1 | 2
  }

  /**
   *  学习课程历史
   */
  export type HistoryCourseResponse = {

    /**
     * 已完成数量
     */
    completedCount: number

    /**
     * 学习中数量
     */
    learningCount: number

    /**
     * 总记录数
     */
    totalCount: number

    /**
     * 总学习时长（秒）
     */
    totalStudySeconds: number

    /**
     * 总学习时长文本
     */
    totalStudyTimeText: string

    /**
     * 学习历史列表
     */
    items: HistoryCourseResponseItem[]
  }
}

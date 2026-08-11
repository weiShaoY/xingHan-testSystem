/**
 * 客户端 项目类型
 */
export namespace Course {

  /**
   * 课程章节列表响应
   */
  type ChaptersItem = {

    /**
     * 子节点列表
     */
    children?: ChaptersItem[]

    /**
     * 章节是否已完成
     */
    isCompleted: boolean

    /**
     * 学习进度（页数/具体位置）
     */
    learningProgressSpecific: number

    /**
     * 章节ID
     */
    olId: number

    /**
     * 章节层级
     */
    olLevel: number

    /**
     * 章节名称
     */
    olName: string

    /**
     * 父章节ID
     */
    olPID: number

    /**
     * 章节类型：1=章节，2=小节
     */
    olType: number

    /**
     * 学习进度百分比（0-100）
     */
    progress: number

    /**
     * 学习状态（0=未开始，1=学习中，2=已完成，3=已跳过）
     */
    status: number

    /**
     * 本章累计学习时长（秒）
     */
    totalLearningTime: number

    /**
     * 视频播放进度百分比（0-100）
     */
    videoProgress: number

    /**
     * 视频播放进度（秒）
     */
    videoTime: number

    /**
     * 附件类型（0=文档，1=视频，2=考试，3=问卷）
     */
    olIsAccessory: 0 | 1 | 2 | 3
  }

  /**
   *  客户端 课程学习进度响应
   */
  type CourseProgressResponse = {

    /**
     * 已完成章节数量
     */
    completedChapters: number

    /**
     * 课程ID
     */
    courseId: number

    /**
     * 课程名称
     */
    courseName: string

    /**
     * 课程是否已完成
     */
    isCompleted: boolean

    /**
     * 整体学习进度百分比（0-100）
     */
    overallProgress: number

    /**
     * 课程总章节数量
     */
    totalChapters: number

    /**
     * 累计学习时长（秒）
     */
    totalStudyTime: number

    /**
     * 章节进度
     */
    currentChapter: {

      /**
       * 章节是否已完成
       */
      isCompleted?: boolean

      /**
       * 学习进度（页数/具体位置）
       */
      learningProgressSpecific?: number

      /**
       * 章节ID
       */
      olId?: number

      /**
       * 章节层级
       */
      olLevel?: number

      /**
       * 章节名称
       */
      olName?: null | string

      /**
       * 父章节ID
       */
      olPID?: number

      /**
       * 章节类型：1=章节，2=小节
       */
      olType?: number

      /**
       * 学习进度百分比（0-100）
       */
      progress?: number

      /**
       * 学习状态（0=未开始，1=学习中，2=已完成，3=已跳过）
       */
      status?: number

      /**
       * 本章累计学习时长（秒）
       */
      totalLearningTime?: number

      /**
       * 视频播放进度百分比（0-100）
       */
      videoProgress?: number | null

      /**
       * 视频播放进度（秒）
       */
      videoTime?: number | null
    }

    /**
     * 所有章节的学习进度列表
     */
    chapters: ChaptersItem[]

  }

  /**
   * 客户端 文档信息响应
   */
  type CourseDocumentInfoResponse = {

    /**
     * 附件id
     */
    accessoryId: number

    /**
     * 课程id
     */
    couId: number

    /**
     * 课程名称
     */
    couName: string

    /**
     * 当前小节ID
     */
    currentOlId: number

    /**
     * 下一篇小节ID
     */
    nextOlId: number

    /**
     * 文档学习页码
     */
    pdfStudyPage: number

    /**
     * 上一小节ID
     */
    previousOlId: number

    /**
     * 学习数量
     */
    studyCount: number

    /**
     * 当前课程目录
     */
    nodes: NodeBase[]

  }

  /**
   *  客户端视频信息响应
   */
  type CourseVideoInfoResponse = {

    /**
     * 附件id
     */
    accessoryId: number

    /**
     * 课程id
     */
    couId: number

    /**
     * 课程名称
     */
    couName: string

    /**
     * 当前小节ID
     */
    currentOlId: number

    /**
     * 下一篇小节ID
     */
    nextOlId: number

    /**
     * 上一小节ID
     */
    previousOlId: number

    /**
     * 学习人数
     */
    studyCount: number

    /**
     *  当前学习进度秒数
     */
    videoStudyTime: number

    /**
     *  下一小节信息
     */
    nextNode: {

      /**
       * 备注
       */
      description: string

      /**
       * Id
       */
      id: number

      /**
       * 节点类型
       */
      itemType: string

      /**
       * 名称
       */
      name: string
    }

    /**
     * 当前课程目录
     */
    nodes: NodeBase[]

  }

  /**
   *  记录视频学习记录
   */
  type CourseVideoRecordProgressParams = {

    /**
     * 课程ID
     */
    couId: number

    /**
     * 小节ID
     */
    olId: number

    /**
     * 是否完成
     */
    isCompleted: boolean

    /**
     * 小节总共学习时间
     */
    totalLearningTime: number

    /**
     * 小节视频总时长
     */
    totalVideoTime?: number | null

    /**
     * 小节视频播放时间
     */
    videoTime: number
  }

  /**
   * 记录完成视频记录
   */
  type CourseVideoRecordPlaybackParams = {

    /**
     * 课程ID
     */
    couId: number

    /**
     * 持续播放时间
     */
    durationSeconds: number

    /**
     * 播放结束进度
     */
    endProgress: number

    /**
     * 是否有效
     */
    isValid: boolean

    /**
     * 小节ID
     */
    olId: number

    /**
     * 播放速度
     */
    playbackSpeed: number

    /**
     * 播放开始进度
     */
    startProgress: number

    /**
     * 视频播放开始的世界时间
     */
    startTime: string

    /**
     * 视频结束时间
     */
    endTime: string
  }
}

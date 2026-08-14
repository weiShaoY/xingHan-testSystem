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
   *  课程学习进度响应
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
   * 上一小节或下一小节信息
   */
  type PreviousNodeOrNextNode = {

    /**
     * 小节ID
     */
    olId: number

    /**
     * 小节类型（0=文档，1=视频，2=考试，3=问卷）
     */
    olType: 0 | 1 | 2 | 3
  }

  /**
   * 文档信息响应
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
     * 小节名称
     */
    olName: string

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
     * pdf学习到的页码
     */
    pdfStudyPage: number

    /**
     *  上一小节信息
     */
    previousNode: PreviousNodeOrNextNode

    /**
     *  下一小节信息
     */
    nextNode: PreviousNodeOrNextNode

    /**
     * 当前课程目录
     */
    nodes: NodeBase[]

  }

  /**
   *  频信息响应
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
     * 小节名称
     */
    olName: string

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
     *  上一小节信息
     */
    previousNode: PreviousNodeOrNextNode

    /**
     *  下一小节信息
     */
    nextNode: PreviousNodeOrNextNode

    /**
     * 当前课程目录
     */
    nodes: NodeBase[]

  }

  /**
   *  提交视频
   */
  type CourseVideoSubmitParams = {

    /**
     * 课程ID
     */
    couId: number

    /**
     * 小节ID
     */
    olId: number

    /**
     * 小节总共学习时间
     */
    totalLearningTime: number

    /**
     * 小节视频总时长
     */
    totalVideoTime: number

    /**
     * 小节视频播放时间
     */
    videoTime: number

    /**
     * 是否完成
     */
    isCompleted: boolean

  }

  /**
   * 提交视频播放记录参数
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

  /**
   * 提交文档
   */
  type CourseDocumentSubmitParams = {

    /**
     * 课程ID
     */
    couId: number

    /**
     * 小节ID
     */
    olId: number

    /**
     * 当前学习到的页码
     */
    progressSpecific: number

    /**
     * 总页码数
     */
    totalPages: number

    /**
     * 小节总共学习时间
     */
    totalLearningTime: number

    /**
     *  是否已完成
     */
    isCompleted: boolean
  }

  type CourseExamInfoResponseQuestionsItem = {

    /**
     * 难度
     */
    qusDiff: number

    /**
     * 题目解析
     */
    qusExplain: string

    /**
     * 题目Id
     */
    qusId: number

    /**
     * 分数
     */
    qusScore: number

    /**
     * 题干
     */
    qusTitle: string

    /**
     * 题目类型
     */
    qusType: number

    /**
     * 题目选项
     */
    qusItems: AnswerItemDto[]
  }

  /**
   *  考试信息响应
   */
  type CourseExamInfoResponse = {

    /**
     * 课程ID
     */
    couId?: number

    /**
     * 问卷ID
     */
    examId: number

    /**
     *  考试名称
     */
    examName: string

    /**
     * 试卷名称
     */
    testPaperName: string

    nextNode: PreviousNodeOrNextNode

    previousNode: PreviousNodeOrNextNode

    /**
     * 题目列表
     */
    questions: AdminApi.Question.Question[]

    /**
     * 课程树形
     */
    nodes: NodeBase[]
  }

  type CourseExamSubmitParamsAnswersItem = {

    /**
     * 答题状态（0=未做，1=已做，2=标记待定）
     */
    answerStatus: number

    /**
     * 本题答题耗时（秒）
     */
    answerTime: number

    /**
     * 题目ID
     */
    qusId: number

    /**
     * 用户作答的答案
     */
    userAnswer: string
  }

  /**
   *  提交考试请求参数
   */
  type CourseExamSubmitParams = {

    /**
     * 考试用时（秒）
     */
    durationSeconds: number

    /**
     * 考试ID
     */
    examId: number

    /**
     * 当前学习小节ID
     */
    olId: number

    /**
     * 课程ID
     */
    couId: number

    /**
     * 答题记录列表
     */
    answers: CourseExamSubmitParamsAnswersItem[]
  }

  /**
   *  问卷信息响应
   */
  type CourseQuestionInfoResponse = {

    /**
     * 课程ID
     */
    couId?: number

    /**
     * 问卷ID
     */
    examId: number

    /**
     * 当前学习小节ID
     */
    examId: number

    /**
     *  考试名称
     */
    examName: string

    /**
     * 问卷名称
     */
    testPaperName: string

    nextNode: PreviousNodeOrNextNode

    previousNode: PreviousNodeOrNextNode

    /**
     * 课程树形
     */
    nodes: NodeBase[]

    /**
     * 题目列表
     */
    questions: AdminApi.Question.Question[]
  }
  type CourseQuestionSubmitParamsAnswersItem = {

    /**
     * 题目ID
     */
    qusId: number

    /**
     * 用户作答的答案
     */
    userAnswer: string
  }

  /**
   *  提交问卷请求参数
   */
  type CourseQuestionSubmitParams = {

    /**
     * 问卷ID
     */
    examId: number

    /**
     * 当前学习小节ID
     */
    olId: number

    /**
     * 课程ID
     */
    couId: number

    /**
     * 答题记录列表
     */
    answers: CourseQuestionSubmitParamsAnswersItem[]
  }

  type CourseQuestionResultResponseUserQuestionAnswerItem = {

    /**
     * 答题状态（0=未做，1=已做，2=标记待定）
     */
    answerStatus: number

    /**
     * 答题耗时（秒）
     */
    answerTime: number

    /**
     * 正确答案
     */
    correctAnswer: string

    /**
     * 是否正确
     */
    isCorrect: boolean

    /**
     * 题目分值
     */
    questionScore: number

    /**
     * 题目难度
     */
    qusDiff: number

    /**
     * 题目解析
     */
    qusExplain: string

    /**
     * 题目ID
     */
    qusId: number

    /**
     * 题目题干
     */
    qusTitle: string

    /**
     * 题目类型（1=单选，2=多选，3=判断，4=填空，5=问答）
     */
    qusType: number

    /**
     * 本题得分
     */
    score: number

    /**
     * 排序（第几题）
     */
    sortOrder: number

    /**
     * 用户答案
     */
    userAnswer: string

    /**
     * 题目选项
     */
    qusItems: AdminApi.Question.QuestionOption[]
  }

  /**
   *  问卷 结果页响应
   */
  type CourseQuestionResultResponse = {

    /**
     *   /**
     * 用户问卷答题数目
     */
    answersCount: number

    /**
     * 问卷提交次数
     */
    submissionCount: number

    /**
     * 问卷总题数目
     */
    totalCount: number

    /**
     * 用户问卷答题列表
     */
    userQuestionAnswers: CourseQuestionResultResponseUserQuestionAnswerItem[]
  }
}

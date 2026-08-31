/**
 *  题库类型
 */
export namespace Question {

  /**
   * 项目列表请求参数
   */
  type QuestionListParams = CommonApi.PaginationParams & {

    /**
     * 题库名称
     */
    qbName?: string
  }

  /**
   *  题库列表项
   */
  type QuestionListItem = {

    /**
     * 公司ID
     */
    companyId: number

    /**
     * 课程ID
     */
    couId: number

    /**
     * 创建人ID
     */
    creater: number

    /**
     * 创建时间
     */
    createTime: string

    /**
     * 多选题个数
     */
    multipleChoiceQuestionsCount: number

    /**
     * 父级题库ID
     */
    parentId: number

    /**
     * 父级题库名称
     */
    parentName: string

    /**
     * 项目ID
     */
    projId: number

    /**
     * 题库编码
     */
    qbCode: string

    /**
     * 题库描述
     */
    qbDesc: string

    /**
     * 题库ID
     */
    qbId: number

    /**
     * 题库名称
     */
    qbName: string

    /**
     * 题库类型
     */
    qbType: number

    /**
     * 题库类型名称
     */
    qbTypeName: string

    /**
     * 学科ID
     */
    sbjId: number

    /**
     * 单选题个数
     */
    singleChoiceQuestionCount: number

    /**
     * 最后修改时间
     */
    updateTime: string
  }

  /**
   *  题库列表响应
   */
  type QuestionListResponse = CommonApi.PaginatedResponse<QuestionListItem>

  /**
   *  题目选项
   */
  type QuestionOption = {

    /**
     *  选项ID
     */
    ansId?: number

    /**
     *  题目ID
     */
    qusId?: number

    qusUid?: string

    /**
     * 选项内容
     */
    ansContext: string

    /**
     * 是否为正确答案
     */
    ansIsCorrect: boolean
  }

  /**
   *  题目列表 单个题目
   */
  type Question = {

    /**
     *  题目ID
     */
    qusId?: number

    /**
     * 题目标题
     */
    qusTitle: string

    /**
     * 题目类型
     * @description 1=单选，2=多选，3=判断，4=填空，5=问答
     */
    qusType: 1 | 2 | 3 | 4 | 5

    /**
     *  题目分数
     */
    qusScore: number

    /**
     *  题目说明
     */
    qusExplain: string

    /**
     *  题目难度
     * @description 1=简单，2=中等，3=困难
     */
    qusDiff: 1 | 2 | 3

    /**
     * 题目选项列表
     */
    qusItems: QuestionOption[]
  }

  /**
   * 题库新增或编辑请求参数
   * @description 新增和编辑题库时的参数
   */
  type QuestionEditor = {

    /**
     * 题库ID
     */
    qbId?: number

    /**
     * 题库名称
     */
    qbName: string

    /**
     * 题目列表
     */
    questions: Question[]
  }

  /**
   *  批量导入题库请求参数
   */
  type QuestionImportParams = {

    /**
     * 题库ID（0表示新建题库，大于0表示追加到已有题库）
     */
    qbId: number

    /**
     * Excel文件
     */
    file: string

  }
}

/**
 * 客户端 项目类型
 */
export namespace Course {

  /**
   * 课程章节列表响应
   */
  type CourseOutlineListResponse = AdminApi.Course.CourseOutlineListResponse

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
}

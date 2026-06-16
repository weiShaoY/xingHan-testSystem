/**
 * 文件 API
 */
declare namespace FileApi {

  /**
   * 上传文件参数
   */
  type UploadFileParams = {

    /**
     * 文件
     */
    file: File
  }

  /**
   * 上传文件响应
   */
  type UploadFileResponse = {

    /**
     * 文件URL
     */
    fileUrl: string
  }

  /**
   * 获取后台管理附件列表参数
   */
  type FileListParams = CommonApi.PaginationParams & {

    /**
     * 文件类型
     */
    type: 'document' | 'video'

    /**
     * 文件名称
     */
    name: string
  }

  /**
   *  获取后台管理附件列表项
   */
  type FileListItem = {

    /**
     * 时长或文件页数（视频时长秒数/PDF页数）
     */
    asDuration: number

    /**
     * 文件后缀（如.mp4、.pdf）
     */
    asExtension: string

    /**
     * 文件路径/存储路径
     */
    asFileName: string

    /**
     * 附件ID（主键，自增）
     */
    asId: number

    /**
     * 文件显示名称
     */
    asName: string

    /**
     * 文件大小（字节）
     */
    asSize: number

    /**
     * 附件类型（如：video、audio、document、image）
     */
    asType: 'document' | 'video'

    /**
     * 附件略缩图
     */
    asThumbnailPath: string

    /**
     *  创建时间
     */
    createTime: string

    /**
     * 创建人ID
     */
    creater: number

    /**
     * 最后修改人ID
     */
    updater: number

    /**
     * 最后修改时间
     */
    updateTime: string
  }

  /**
   * 获取后台管理附件列表响应
   */
  type FileListResponse = CommonApi.PaginatedResponse<FileListItem>

  /**
   *  获取附件返回资源文件流响应
   */
  type FileAttachmentResponse = Blob

}

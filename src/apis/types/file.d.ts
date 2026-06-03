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
    asDuration?: number | null

    /**
     * 文件后缀（如.mp4、.pdf）
     */
    asExtension?: null | string

    /**
     * 文件路径/存储路径
     */
    asFileName?: null | string

    /**
     * 附件ID（主键，自增）
     */
    asId?: number

    /**
     * 文件显示名称
     */
    asName?: null | string

    /**
     * 文件大小（字节）
     */
    asSize?: number

    /**
     * 附件类型（如：video、audio、document、image）
     */
    asType?: null | string
  }

  /**
   * 获取后台管理附件列表响应
   */
  type FileListResponse = CommonApi.PaginatedResponse<FileListItem>

}

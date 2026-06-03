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
}

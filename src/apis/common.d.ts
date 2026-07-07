/**
 *  通用接口类型
 */
declare namespace CommonApi {

  /** 分页参数 */
  type PaginationParams = {

    /** 当前页码 */
    currentPage: number

    /** 分页条数 */
    pageSize: number

    /** 排序字段 */
    orderBy?: string

    /** 是否升序（1=升序，0=降序） */
    isAsc?: number
  }

  /** 分页响应基础结构 */
  type PaginatedResponse<T = any> = {

    /** 数据列表 */
    rows: T[]

    /** 总条数 */
    totals: number
  }

  /** 通用搜索参数 */
  type SearchParams = Pick<PaginationParams, 'currentPage' | 'pageSize'>
}

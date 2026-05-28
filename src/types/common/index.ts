/**
 * 通用基础类型模块。
 *
 * 集中维护跨模块复用的轻量类型，主要用于描述 UI 状态、基础枚举、
 * 键值结构、时间范围、文件元信息、坐标尺寸、主题语言和运行环境等。
 *
 * ## 类型放置约定
 *
 * - 只放与具体业务域无关、可被多处复用的类型。
 * - 后端接口类型优先放在 `src/apis/types` 或 `src/types/api`。
 * - 组件私有类型优先就近定义，复用范围扩大后再提升到本模块。
 * - 类型值需要和后端枚举严格一致时，应优先在对应 API 类型中声明。
 *
 * ## 使用示例
 *
 * ```ts
 * const status: Status = 1
 * const range: TimeRange = { startTime: '2026-01-01', endTime: '2026-01-31' }
 * ```
 *
 * @module types/common/index
 * @author Art Design Pro Team
 */

/**
 * 导出通用响应结构类型。
 *
 * 响应相关类型单独维护在 `response` 模块中，避免当前基础类型文件过大。
 */
export * from './response'

/**
 * 启用状态。
 *
 * - `0`：禁用
 * - `1`：启用
 */
export type Status = 0 | 1

/**
 * 性别标识。
 *
 * `unknown` 用于未填写、未公开或无法识别的场景。
 */
export type Gender = 'male' | 'female' | 'unknown'

/**
 * 排序方向。
 *
 * 通常用于 Element Plus 表格排序事件中的排序值。
 */
export type SortOrder = 'ascending' | 'descending'

/**
 * 常见资源操作类型。
 *
 * 适合权限按钮、操作日志、弹窗上下文等通用场景。
 */
export type ActionType = 'create' | 'update' | 'delete' | 'view'

/**
 * 字符串键对象类型。
 *
 * 适合描述字段名不固定的对象，例如动态表单、查询参数、扩展配置等。
 *
 * @typeParam T 对象属性值类型。
 */
export type Recordable<T = any> = Record<string, T>

/**
 * 通用键值选项。
 *
 * 适合下拉选项、枚举映射、轻量字典项等场景。
 *
 * @typeParam T 选项值类型。
 */
export type KeyValue<T = any> = {

  /** 唯一键名，通常用于内部识别或列表渲染 key。 */
  key: string

  /** 绑定值，可为字符串、数字、布尔值或业务对象。 */
  value: T

  /** 展示文本；未提供时可由调用方使用 `key` 或 `value` 兜底。 */
  label?: string
}

/**
 * 时间范围。
 *
 * 字符串格式由具体业务约定，例如日期、日期时间或 ISO 字符串。
 */
export type TimeRange = {

  /** 开始时间。 */
  startTime: string

  /** 结束时间。 */
  endTime: string
}

/**
 * 文件元信息。
 *
 * 用于描述已上传文件、待上传文件预览或远程文件资源。
 */
export type FileInfo = {

  /** 文件名，通常包含扩展名。 */
  name: string

  /** 文件访问地址，可以是远程 URL、对象 URL 或相对路径。 */
  url: string

  /** 文件大小，单位为字节。 */
  size: number

  /** MIME 类型或业务自定义文件类型。 */
  type: string

  /** 最后修改时间戳，通常来自浏览器 `File.lastModified`。 */
  lastModified?: number
}

/**
 * 二维坐标。
 *
 * 默认表示像素坐标；若使用其他单位，应在具体业务处补充说明。
 */
export type Position = {

  /** 横坐标。 */
  x: number

  /** 纵坐标。 */
  y: number
}

/**
 * 二维尺寸。
 *
 * 默认表示像素尺寸；若使用百分比、rem 等单位，应在具体业务处补充说明。
 */
export type Size = {

  /** 宽度。 */
  width: number

  /** 高度。 */
  height: number
}

/**
 * 响应式断点标识。
 *
 * 具体断点宽度由样式系统或布局配置决定。
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * 主题模式。
 *
 * - `light`：浅色模式
 * - `dark`：深色模式
 * - `auto`：跟随系统或应用自动策略
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 应用语言标识。
 *
 * 与项目国际化资源文件保持一致。
 */
export type Language = 'zh-CN' | 'en-US'

/**
 * 常见表单弹窗模式。
 *
 * 用于区分新增和编辑场景下的标题、默认值、提交逻辑等。
 */
export type DialogType = 'add' | 'edit'

/**
 *  表格分页参数
 */
export type TablePaginationParams = {

  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number

  /** 总条数 */
  total: number
}

/**
 *  表格分页响应基础结构
 */
export type TablePaginatedResponse<T = any> = {

  /** 分页记录列表 */
  records: T[]

  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number

  /** 总条数 */
  total: number
}

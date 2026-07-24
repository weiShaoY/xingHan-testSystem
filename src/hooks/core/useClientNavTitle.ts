/**
 * 客户端顶部导航自定义标题。
 *
 * 默认情况下，客户端 Layout 的 VanNavBar 标题来自当前路由的 `meta.title`。
 * 当某些页面需要在接口返回后展示动态标题时，可以通过这个响应式状态临时覆盖默认标题。
 */
const customClientNavTitle = ref('')

/**
 * 客户端顶部导航标题管理。
 *
 * @returns 客户端导航标题状态与操作方法。
 */
export function useClientNavTitle() {
  /**
   * 设置客户端顶部导航标题。
   *
   * 传入空字符串、纯空格或 `undefined` 时，会清空自定义标题，
   * Layout 会自动回退显示当前路由的 `meta.title`。
   *
   * @param title 自定义导航标题。
   */
  function setClientNavTitle(title?: string) {
    customClientNavTitle.value = title?.trim() || ''
  }

  /**
   * 清空客户端顶部导航自定义标题。
   *
   * 通常在页面卸载时调用，避免动态标题影响后续页面。
   */
  function clearClientNavTitle() {
    customClientNavTitle.value = ''
  }

  return {
    customClientNavTitle,
    setClientNavTitle,
    clearClientNavTitle,
  }
}

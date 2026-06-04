/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @param fixed 保留小数位数，默认 1
 * @returns 格式化后的字符串，如 1.2 KB、256 MB、3.5 GB
 */
export function formatFileSize(size?: number | null, fixed = 1): string {
  // 修复：使用 Number.isNaN 符合 eslint 规则
  if (size === undefined || size === null || Number.isNaN(size) || size < 0) {
    return '-'
  }

  if (size === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']

  let index = 0

  let fileSize = size

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024
    index++
  }

  return fileSize % 1 === 0
    ? `${fileSize} ${units[index]}`
    : `${fileSize.toFixed(fixed)} ${units[index]}`
}

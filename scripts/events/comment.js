/**
 * Capitalize the first letter of comment name
 */

hexo.extend.filter.register('before_generate', () => {
  const themeConfig = hexo.theme.config
  let { use } = themeConfig.comments
  if (!use) return
  // 确保 use 是一个阵列
  use = Array.isArray(use) ? use : use.split(',')
  // 将 use 中的每一项首字母大写
  themeConfig.comments.use = use.map(item =>
    item.trim().toLowerCase().replace(/\b[a-z]/g, s => s.toUpperCase())
  )
})

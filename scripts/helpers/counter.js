'use strict'

// 计数脚本来源。vercount 是不蒜子的兼容替代，两者共用同一套 DOM id 约定：
//   busuanzi_value_<key> / busuanzi_container_<key>  (key ∈ site_pv, page_pv, site_uv)
//   vercount_value_<key> / vercount_container_<key>
// 模板因此必须输出上述 id，脚本才能回填数字。
const PROVIDER_SCRIPT = {
  vercount: 'https://events.vercount.one/js',
  busuanzi: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
}

function resolveScriptUrl(theme) {
  const busuanzi = (theme && theme.busuanzi) || {}
  // 显式覆盖优先级最高：CDN.option.busuanzi 或历史上直接配置的 asset.busuanzi
  if (theme && theme.asset && theme.asset.busuanzi) return theme.asset.busuanzi
  if (busuanzi.provider === 'custom') return busuanzi.cdn || null
  return PROVIDER_SCRIPT[busuanzi.provider] || PROVIDER_SCRIPT.vercount
}

function resolveHost(url) {
  if (!url) return null
  try {
    const normalized = url.indexOf('//') === 0 ? 'https:' + url : url
    return '//' + new URL(normalized).host
  } catch (e) {
    return null
  }
}

hexo.extend.helper.register('counter_script_url', function () {
  return resolveScriptUrl(this.theme)
})

hexo.extend.helper.register('counter_host', function () {
  return resolveHost(resolveScriptUrl(this.theme))
})

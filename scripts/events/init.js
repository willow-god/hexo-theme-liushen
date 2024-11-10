hexo.extend.filter.register('before_generate', () => {
  // Get first two digits of the Hexo version number
  const { version, log, locals } = hexo
  const hexoVer = version.replace(/(^.*\..*)\..*/, '$1')

  if (hexoVer < 5.3) {
    log.error('Please update Hexo to V5.3.0 or higher!')
    log.error('请升级 Hexo 至 V5.3.0 或更高版本！')
    process.exit(-1)
  }

  if (locals.get) {
    const data = locals.get('data')
    if (data && data.butterfly) {
      log.error("'liushen.yml' is deprecated. Please use '_config.liushen.yml'")
      log.error("'liushen.yml' 已经弃用，请使用 '_config.liushen.yml'")
      process.exit(-1)
    }
  }
})

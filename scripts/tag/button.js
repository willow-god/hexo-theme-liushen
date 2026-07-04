/**
 * Button
 * {% btn url text %}
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

const btn = args => {
  const [url = '', text = '', icon = ''] = args.join(' ').split(',').map(arg => arg.trim())

  const iconHTML = icon ? `<i class="${icon}"></i>` : ''
  const textHTML = text ? `<span>${text}</span>` : ''

  return `<a class="btn-beautify" href="${urlFor(url)}" title="${text}">${iconHTML}${textHTML}</a>`
}

hexo.extend.tag.register('btn', btn, { ends: false })

/**
 * note 外挂标签，分为警告、错误、问题、信息，比原版更加简单，样式更加漂亮
 * by: LiuShen
 * 参考: https://blog.zhilu.cyou/
 */

'use strict'

const postNote = (args, content) => {
  // 定义五种类型及其对应的 Font Awesome 图标
  const types = {
    warning: 'fa-circle-dot',          // 警告
    error: 'fa-circle-xmark',          // 错误
    question: 'fa-circle-question',    // 问题
    info: 'fa-circle-check',           // 信息
  };

  // 获取标签类型和标题
  const type = args[0] || 'info'; // 如果未提供类型，默认为 info
  const title = args.slice(1).join(' ') || '附加信息'; // 提取标题，默认为 "提示"
  const icon = types[type] || types.info; // 如果类型未定义，使用 info 类型的图标

  // 判断标签类型是否在 types 中定义
  if (!types[type]) {
    console.warn(`\`${type}\` 类型未定义，已自动切换为 \`info\` 类型`);
    type = 'info';
    title = '附加信息';
    icon = types.info;
  }

  // 返回 HTML 结构
  return `
    <div class="note note-${type}">
      <div class="note-header">
        <i class="note-icon fa-regular ${icon}"></i>
        <span class="note-title">${title}</span>
      </div>
      <div class="note-content">
        ${hexo.render.renderSync({ text: content, engine: 'markdown' })}
      </div>
    </div>
  `;
};

// 注册自定义标签
hexo.extend.tag.register('note', postNote, { ends: true });

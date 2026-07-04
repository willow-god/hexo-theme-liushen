<div align="center">
  <h1 style="background: linear-gradient(to right, #76CBEC, #F7A137); -webkit-background-clip: text; color: transparent; font-size: 4.4rem">hexo-theme-LiuShen</h1>
</div>

<p align="center">
  一个基于 hexo-theme-butterfly 的定制化 Hexo 博客主题，具有卡片式布局、丰富组件和多种可选增强功能，保持可爱、轻量和易自定义。
</p>

<p align="center">
  <img src="https://fastly.jsdelivr.net/gh/god-willow/pic@main/pic/202411102327875.webp" alt="hexo-theme-LiuShen">
</p>

hexo-theme-liushen 是一个基于 [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 深度调整的 Hexo 主题。主题保留 Butterfly 的核心使用体验，同时整理了卡片式布局、首页轮播、侧栏组件、评论系统、内容标签、搜索、暗色模式和若干视觉增强功能。

> 当前项目仍在整理和稳定阶段，暂不计划发布 npm 包或镜像版本。推荐通过本地主题目录安装，待结构、文档和版本稳定后，再考虑 npm、镜像或其他分发方式。

## 状态说明

- 当前版本仍属于开源前整理阶段，配置项和部分自定义页面可能继续调整。
- 主题默认配置会尽量保持干净，不内置作者私人站点、私有接口、图床 token 或个人页面链接。
- 第三方服务均需要用户自行启用并填写配置，例如评论、统计、搜索、广告、说说、诗句卡片等。
- 若你需要最稳定的基础体验，可以先关闭高级组件，只启用导航、文章、归档、标签、分类、搜索和评论等常规功能。

## 功能概览

### 基础布局

- 响应式页面布局，支持桌面端与移动端访问。
- 首页文章列表支持多种排版方式。
- 首页顶部文章轮播，可配置显示数量、切换速度和自动播放间隔。
- 文章页支持目录、阅读进度、版权声明、上一篇/下一篇和相关文章。
- 支持归档页、标签页、分类页、普通页面和 404 页面。

### 视觉与交互

- 卡片式 UI，支持圆角样式和暗色模式。
- 代码块支持多主题、复制按钮、语言显示、高度限制、自动换行和全屏查看。
- 支持 lazyload、lightbox、PJAX、Pangu 中英文空格、Snackbar 通知。
- 可选加载动画、页面过渡、鼠标点击特效、canvas ribbon、canvas nest 等视觉增强。

### 侧栏组件

- 作者卡片。
- 公告卡片。
- 最近文章。
- 最新评论。
- 分类、标签、归档。
- 文章系列。
- 站点信息。
- 欢迎卡片和诗句卡片。
- 自定义顶部/底部侧栏内容。

### 搜索与内容增强

- 支持本地搜索。
- 支持 Algolia 搜索。
- 支持 DocSearch。
- 支持 Mermaid 图表。
- 支持 ABCJS 乐谱渲染。
- 支持系列文章标签、按钮、标签、隐藏内容、图库、时间线、聊天气泡、链接卡片等自定义标签插件。

### 评论与统计

主题集成多种评论系统模板，按需开启：

- Disqus / DisqusJS
- Gitalk
- Valine
- Waline
- Twikoo
- Artalk
- Giscus
- Utterances
- Remark42
- Facebook Comments
- Livere

统计与分析按需开启：

- Busuanzi
- Google Analytics
- Cloudflare Web Analytics
- Microsoft Clarity
- Umami

### 第三方扩展

- 分享：Share.js、AddToAny。
- 音乐：APlayer / Meting。
- 聊天入口：Chatra、Tidio、DaoVoice、Crisp。
- 广告：Google AdSense、自定义广告位。
- PWA：可配合 `hexo-offline` 等插件启用。

## 环境要求

建议环境：

- Node.js 18 或更高版本。
- Hexo 6 或更高版本。
- 已安装 Pug 与 Stylus 渲染器。

在 Hexo 站点根目录安装渲染器：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

如需启用字数统计、搜索、PWA、站点地图等功能，请按自己的站点需求安装对应 Hexo 插件。

## 本地安装

进入 Hexo 站点根目录，将主题克隆到 `themes/liushen`：

```bash
git clone https://github.com/willow-god/hexo-theme-liushen.git themes/liushen
```

然后修改 Hexo 根目录的 `_config.yml`：

```yaml
theme: liushen
```

清理并重新生成：

```bash
hexo clean
hexo generate
hexo server
```

## 暂不支持 npm 安装

当前主题暂无 npm 包发布计划，因此不建议使用：

```bash
npm install hexo-theme-liushen
```

后续会在主题结构、配置兼容性、文档和版本号稳定后，再考虑发布 npm 包、镜像包或其他分发形式。

## 推荐配置方式

建议不要直接大量修改主题目录内的 `_config.yml`。更推荐在 Hexo 站点根目录创建主题覆盖配置：

```yaml
# _config.liushen.yml
```

然后将需要覆盖的主题配置写入 `_config.liushen.yml`。这样升级主题时更容易合并变更。

如果你习惯直接修改主题配置，也可以编辑：

```text
themes/liushen/_config.yml
```

但升级前请先备份自己的改动。

## 配置入口

主题主要配置集中在 `_config.yml`。常用配置块如下：

| 配置项 | 说明 |
| --- | --- |
| `nav` | 导航栏 logo、站点名、右侧快捷入口 |
| `menu` | 顶部导航菜单 |
| `social` | 社交链接 |
| `avatar` | 站点头像 |
| `cover` | 文章封面显示规则 |
| `index_swiper` | 首页轮播 |
| `toc` | 文章目录 |
| `post_copyright` | 文章版权 |
| `aside` | 侧栏与卡片组件 |
| `search` | 搜索 |
| `comments` | 评论系统选择 |
| `artalk` / `waline` / `twikoo` 等 | 对应评论系统配置 |
| `share` | 分享功能 |
| `darkmode` | 暗色模式 |
| `lazyload` | 图片懒加载 |
| `CDN` | 静态资源来源 |
| `inject` | 自定义 head/body 注入 |

## 基础配置示例

```yaml
nav:
  logo:
  site_name:
  display_title: true
  fixed: true
  right_items:
    # - id: random
    #   link: javascript:randomPost()
    #   title: 随机文章
    #   icon: fa-solid fa-shuffle fa-fw
    #   class: site-page
    #   raw_link: true

menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open

social:
  fab fa-github: https://github.com/example || GitHub || "#24292e"
  fas fa-rss: /atom.xml || RSS || "#ee802f"
```

## 评论配置

先选择评论系统：

```yaml
comments:
  use: Artalk
  text: true
  lazyload: false
  count: false
  card_post_count: false
```

再填写对应服务配置。例如 Artalk：

```yaml
artalk:
  server: https://artalk.example.com
  site: your-site-name
  visitor: false
  option:
```

主题只保留 Artalk 的基础初始化、PJAX 销毁、暗色模式切换和评论图片灯箱支持。图片上传、鉴权、图床、表情包、邮件通知等能力请在 Artalk 服务端或站点自定义脚本中自行配置，主题内不会内置作者私有上传接口或 token。

## 搜索配置

本地搜索示例：

```yaml
search:
  use: local_search
  placeholder: 搜索文章
  local_search:
    preload: false
    top_n_per_article: 1
    unescape: false
    CDN:
```

Algolia 和 DocSearch 需要自行申请服务并填写 `appId`、`apiKey`、`indexName` 等配置。

## 第三方接口说明

主题默认不会启用作者个人接口。以下功能如需使用，需要自行填写接口地址：

- `subtitle.api`：首页副标题接口。
- `location_api.api`：欢迎卡片定位接口。
- `poem_card.api`：诗句卡片接口。
- `shuoshuo.api`：说说页面数据接口。
- `shuoshuo.meting_api`：音乐解析接口。

如果配置为空，相关功能应保持关闭或回退到静态内容。

## 目录结构

```text
.
├── _config.yml                 # 主题默认配置
├── languages/                  # 多语言文本
├── layout/                     # Pug 模板
│   ├── includes/               # 页面局部模板
│   ├── page.pug                # 普通页面入口
│   ├── post.pug                # 文章页入口
│   └── index.pug               # 首页入口
├── scripts/                    # Hexo 扩展脚本、过滤器、标签插件、辅助函数
├── source/                     # 静态资源
│   ├── css/                    # Stylus 样式
│   ├── img/                    # 主题图片
│   └── js/                     # 前端脚本
├── plugins.yml                 # CDN 资源映射
├── package.json                # 包信息与渲染器依赖
└── README.md                   # 项目说明
```

## 常用页面

主题包含多种页面模板，使用时通常需要在 Hexo 的 `source/` 下创建对应页面，并在 front-matter 中指定类型。

示例：

```yaml
---
title: 友链
type: flink
---
```

常见类型包括：

- `tags`
- `categories`
- `flink`
- `about`
- `devices`
- `rewards`
- `shuoshuo`
- `404`

具体页面依赖的数据文件和字段会继续整理，建议开源初期按需启用。

## 自定义建议

- 私人导航、社交链接、备案、统计 ID、评论密钥、搜索密钥等都应放在站点自己的配置中。
- 不建议把个人 token、上传接口、私有图床、邮箱密钥提交到主题仓库。
- 如需自定义 Artalk 上传，可通过 Artalk 官方配置、服务端配置或站点注入脚本实现。
- 如需自定义 CSS/JS，优先使用 `inject` 或站点自己的静态资源目录，减少直接改主题源码的成本。

## 开发命令

在 Hexo 站点根目录中测试主题：

```bash
hexo clean
hexo generate
hexo server
```

如果需要查看依赖：

```bash
npm ls --depth 0
```

## 开源前检查清单

- 默认配置不包含作者私人域名、私人页面、私有接口或 token。
- README 不提供不可用的 npm 安装方式。
- 评论、搜索、统计、广告等第三方功能默认关闭或需要用户自行配置。
- Issue 模板可直接被 GitHub 识别。
- 主题可以通过本地 `themes/liushen` 目录安装使用。

## 许可证

本项目基于 Apache-2.0 许可证开源。主题基于 hexo-theme-butterfly 调整开发，感谢原项目及相关开源项目。

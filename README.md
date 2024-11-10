<div align="center">
  <h1 style="background: linear-gradient(to right, #76CBEC, #F7A137); -webkit-background-clip: text; color: transparent; font-size: 4.4rem">hexo-theme-LiuShen</h1>
</div>

<p align="center">
  一个基于 hexo-theme-butterfly 的定制化 Hexo 博客主题，具有独特的风格和各种各样的功能，可爱又不臃肿，漂亮而不奢华！
</p>

<p align="center">
  <img src="https://fastly.jsdelivr.net/gh/god-willow/pic@main/pic/202411102327875.webp" alt="hexo-theme-LiuShen">
</p>

## 🚧 正在开发

目前此主题仍在开发中，功能尚未完善，可能无法正常使用。如对 Hexo 主题配置不熟悉，请暂勿使用。

---

## 说明

hexo-theme-LiuShen 是基于 [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly.git) 的个性化改进版本。除了延续 Butterfly 的设计风格，本主题加入了更多样化的视觉效果和功能，适合喜爱极简设计又注重功能性的用户。

### 💻 安装方法

#### Git 安装（推荐）

在博客根目录中，执行以下命令，安装最新版本：

```bash
git clone https://github.com/willow-god/hexo-theme-liushen.git themes/liushen
```

#### npm 安装（仅支持 Hexo 5.0.0 以上版本）

在博客根目录中执行：

```bash
npm i hexo-theme-liushen
```

### ⚙ 应用主题

1. 打开 Hexo 的配置文件 `_config.yml`
2. 将 `theme` 字段修改为 `liushen`：

   ```yaml
   theme: liushen
   ```

> 注意：请确保已安装 pug 和 stylus 渲染器，执行以下命令进行安装：
>
> ```bash
> npm install hexo-renderer-pug hexo-renderer-stylus --save
> ```

---

## 🎉 主题特色功能

### 设计风格

- **卡片化设计**：支持卡片式排版，使内容层次更清晰。
- **自定义圆角/直角设计**：用户可以自由选择卡片样式，以适配不同审美。
- **响应式布局**：支持 PC 和移动端自适应，体验一致。
- **支持暗黑模式**：自动或手动切换夜间模式，保护眼睛。

### 页面布局

- **双栏布局**：双栏内容展示，方便浏览和导航。
- **二级目录支持**：支持复杂文章目录层级，适合长文结构化展示。
- **动态文章封面**：展示文章封面，提升视觉吸引力。

### 内容展示

- **多样化代码高亮配色**：支持 darker、pale night、light、ocean 等多种代码主题风格，满足不同的审美需求。
- **文章阅读模式**：增强文章阅读体验，加入 TOC 目录、字数统计等小功能。
- **简繁体切换**：支持简体、繁体内容切换。
- **过期文章提醒**：可自定义设置过期提示，确保信息有效性。

### 功能扩展

- **搜索功能**：提供 Algolia 搜索、本地搜索等多种选择，帮助用户快速找到内容。
- **评论系统**：集成 Disqus、Gitalk、Valine 等多种评论工具，并支持双评论系统。
- **社交分享**：支持 Sharejs、Addtoany 等多种分享选项，提升内容传播。
- **访客统计**：集成不蒜子访客统计，实时记录站点访客情况。

### 特效和交互

- **动态背景**：提供静态和彩带、Canvas Nest 动态背景，让网页更具趣味性。
- **鼠标点击特效**：多种鼠标点击效果，如烟花、爱心等，提升互动体验。
- **加载动画**：内置 Preloader 动画和 pace.js 加载动画条，提升网页加载视觉体验。

### 工具与增强

- **PWA 支持**：支持 Progressive Web App，提升移动端访问体验。
- **SEO 优化**：支持站长验证及优化的 SEO 配置。
- **多种图表支持**：内置 Mermaid 图表展示、照片墙等插件，适合丰富的内容展示场景。

---

## 🔧 常见问题

### 如何切换暗黑模式？

进入 `_config.yml` 配置文件，找到 `dark_mode` 配置项，选择 `true` 即可开启夜间模式：

```yaml
dark_mode: true
```

### 如何更改主题配色？

LiuShen 主题允许通过配置文件 `_config.yml` 更改站点的整体配色。找到 `theme_color` 项，填写所需颜色值：

```yaml
theme_color: "#FF6B6B"  # 示例颜色
```

---

## 📝 常见问题与支持

1. **主题不完整或功能缺失**  
   由于主题仍在开发中，部分功能可能尚未完善，如遇到问题可在 GitHub 提交 Issue。

2. **代码高亮或特效异常**  
   若部分特效或代码高亮异常，可尝试在配置文件中关闭或选择其他模式。

3. **其他问题**  
   如有其他问题，建议查看 [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly.git) 的文档，本主题基于 Butterfly，许多配置方法通用。

---

### 📜 版权与声明

- 本项目基于 Butterfly 开发，但保留部分独有功能。
- 若引用请遵循开源协议注明来源。
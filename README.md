# 静态电子相册

一个纯静态的生日电子相册：深色画框式网格 + 沉浸式灯箱，无框架、无构建工具、无 CDN，双击 `index.html` 即可离线浏览。

## 目录结构

```
静态电子相册/
├── index.html          页面结构
├── style.css           全部样式（含响应式）
├── script.js           图片数据 + 全部交互逻辑
├── README.md           本文档
└── images/
    ├── placeholder.svg 图片加载失败时的占位图
    ├── 01-candlelight.jpg   … 09-champagne.jpg   原图（示例）
    └── thumbs/
        └── 01-candlelight.jpg … 09-champagne.jpg 缩略图（示例）
```

## 如何使用

直接双击 `index.html`，或用任意静态服务器打开：

```bash
# 任选一种，在项目目录中执行
python -m http.server 8000
npx serve .
```

然后访问 `http://localhost:8000`。

## 如何添加图片（唯一需要改代码的地方）

1. 把原图放进 `images/`（建议长边 1600px 左右、JPEG 质量 80–90）。
2. 把缩略图放进 `images/thumbs/`（建议宽 600–800px，比例与原图一致）。
3. 打开 `script.js`，在顶部的 `photos` 数组末尾追加一项：

```js
{
  src: 'images/10-my-photo.jpg',        // 必填：原图路径
  thumb: 'images/thumbs/10-my-photo.jpg', // 选填：缩略图路径，不填则直接用 src
  title: '照片标题',                     // 选填：卡片与灯箱底部显示
  desc: '一句想说的话……'                 // 选填：灯箱底部的描述
}
```

保存刷新即可，不需要改动 HTML / CSS。若暂未制作缩略图，删掉 `thumb` 一行也能正常运行（只是网格会加载原图）。

> 路径均相对于 `index.html`，请使用 `/` 分隔，不要使用 `file:///...` 绝对路径。

## 功能一览

| 功能 | 实现 |
| --- | --- |
| F1 相册网格 | CSS Grid，桌面 4 列 / 平板 2 列 / 手机 1 列 |
| F2 大图查看 | 灯箱显示原图，左右箭头切换、右上角关闭、点击遮罩关闭 |
| F3 键盘操作 | `←` / `→` 切换，`Esc` 关闭（另支持 `Home` / `End`） |
| F4 触摸滑动 | 移动端左右滑动切换，向下滑动关闭 |
| F5 图片说明 | 灯箱底部显示标题 + 描述，卡片上显示标题 |
| F6 加载状态 | 缩略图 `loading="lazy"`；骨架微光 → 淡入；失败自动换成 `images/placeholder.svg` |
| 图片完整显示 | 缩略图与大图均使用 `object-fit: contain`，任意宽高比都不裁剪、不变形 |
| 无障碍 | 语义化按钮、焦点锁定、`aria-live` 切换播报、跳转链接、`prefers-reduced-motion` |

## 关于「不裁剪」的布局说明

- 缩略图使用固定 `aspect-ratio: 4 / 3` 的画框 + `object-fit: contain`，不同比例的图片完整显示，空余部分由深色画框背景填充。
- 灯箱大图同时受 `max-width` / `max-height` 限制并 `object-fit: contain`，横图、竖图、全景图都能完整呈现。
- 因此无需为了排版而裁剪任何图片。

## 部署

纯静态文件，把整个目录上传即可：

- **GitHub Pages**：推送到仓库，Settings → Pages 选择分支根目录。
- **Netlify / Vercel / Cloudflare Pages**：直接拖拽目录，无需构建命令。
- **任意 Web 服务器 / 对象存储**：上传后保证目录层级（`images/`、`images/thumbs/`）不变即可。

## 兼容性

- Chrome / Edge / Firefox / Safari 现代版本（支持 CSS Grid、`aspect-ratio`、`object-fit`、`loading="lazy"`）。
- 部分旧版 Safari（< 15）不支持 `aspect-ratio`，网格仍可用，但缩略图画框高度会由图片本身撑开，不影响查看与灯箱。
- 不依赖网络：字体使用系统字体，图标为内联 SVG，图片全部本地。

## 自定义

- **配色**：修改 `style.css` 顶部 `:root` 中的 CSS 变量（`--gold`、`--bg` 等）。
- **网格比例**：修改 `.card__media` 的 `aspect-ratio`。
- **标题/文案**：直接改 `index.html` 中的页头与页脚文字。

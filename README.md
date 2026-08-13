# 极简视频站

基于 Astro 的极简视频网站。Markdown 管理视频数据，HLS 负责视频播放，静态生成优先。

## 快速开始

```bash
pnpm install
pnpm dev       # 开发（已带 --host，局域网可访问）
pnpm build     # 构建
pnpm preview   # 预览构建产物（已带 --host）
pnpm check     # 类型检查
```

包管理器使用 **pnpm**（`packageManager: pnpm@11`）。依赖构建脚本（esbuild / sharp）已在 `pnpm-workspace.yaml` 的 `allowBuilds` 中放行。

## 内容发布

1. 准备视频，用 FFmpeg / 转码服务转成 HLS（多码率可选）
2. 上传 HLS 与封面图片到 `public/media/` 或外部 CDN
3. 在 `src/content/videos/` 创建 Markdown：

```md
---
title: "示例视频"
slug: "example"
tags:
  - 动画
  - 科幻
cover: "/media/example/cover.webp"
description: "视频简介"
publishedAt: "2026-08-12"
episodes:
  - id: "01"
    title: "第一集"
    source: "/media/example/01/index.m3u8"
  - id: "02"
    title: "第二集"
    source: "https://cdn.example.com/02/index.m3u8"
---

## 简介

Markdown 正文。
```

4. 构建：`npm run build`。缺少必填字段、slug / Episode ID 重复、非法媒体 URL 会在构建阶段报错。

## 站点配置

`src/site.config.ts` 集中管理全站配置：

```ts
export const siteConfig = {
  title: "极简视频站", // 站名（Header Logo / 页脚）
  footer: "极简视频站", // 页脚站名（末尾会自动追加指向 https://astro.build/ 的 Astro 链接）
  defaultTheme: "dark", // 默认主题：未手动选择时使用 dark（暗色），可改为 "light"
  fontFamily: "'Noto Serif SC Variable', 'Source Han Serif SC', ...", // 全局字体（思源宋体）
};
```

- 修改 `defaultTheme` 即可切换默认亮色/暗色模式
- 修改 `fontFamily` 即可替换全局字体，例如换成思源黑体：`"'Noto Sans SC Variable', ..."`
- 思源宋体（Noto Serif SC Variable）通过 npm 包 `@fontsource-variable/noto-serif-sc` 自托管，构建后按 unicode-range 分片，浏览器按需加载

## 页面

| 路由 | 说明 |
| --- | --- |
| `/` | 首页视频列表 |
| `/tag/[slug]` | 标签页 |
| `/search?q=xxx` | 搜索页（客户端索引搜索） |
| `/video/[slug]` | 视频详情页 |
| `/watch/[slug]/[episode]` | 播放页（HLS.js / 原生 HLS） |
| `/404` | 内容不存在 |

## 媒体约定

- 封面：`jpg / jpeg / png / webp / avif`，本地或外部 URL，推荐 16:9 WebP / AVIF
- HLS：`.m3u8`，本地（`/media/...`）或外部 URL
- 大型 HLS 文件不要提交到 Git，可放在 CDN / 对象存储 / Nginx 静态目录
- 外部 HLS 必须允许跨域（GET / HEAD / OPTIONS）

## 项目结构

```
src/
├── components/   # Header, VideoCard, VideoGrid, VideoMeta, EpisodeList, VideoPlayer
├── content/videos/  # 视频 Markdown
├── layouts/
├── lib/          # videos.ts, tags.ts, search.ts, slug.ts
├── pages/        # 首页 / 标签 / 搜索 / 详情 / 播放 / 404
├── styles/
└── types/
```

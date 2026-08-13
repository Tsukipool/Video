Astro 极简视频网站 — 开发技术规格

1. 项目概述

使用 Astro 开发一个极简视频网站，核心功能为：

视频浏览

标签浏览

视频搜索

视频详情

Episode 选集

HLS 视频播放

Markdown 视频内容管理

本地 / 外部图片

本地 / 外部 HLS

Light / Dark 模式


整体风格以纯色、简洁、干净、低干扰为主。

第一版不使用数据库，不提供用户系统。


---

2. 技术栈

Astro
TypeScript
Astro Content Collections / Content Layer
原生 CSS
CSS Variables
HLS.js
HTML5 Video
Markdown

原则：

Astro 原生组件优先

尽量减少客户端 JavaScript

不使用 React/Vue 等前端框架，除非实际开发中确有必要

网站以静态生成优先



---

3. 页面结构

网站只包含以下用户页面：

/
├── 首页
│
├── /tag/[slug]
│   └── 标签页
│
├── /search?q=xxx
│   └── 搜索页
│
├── /video/[slug]
│   └── 视频详情页
│
└── /watch/[slug]/[episode]
    └── 视频播放页

系统页面：

/404

不提供其他业务页面。


---

4. 用户流程

统一的视频观看流程：

首页
 ↓
视频详情页
 ↓
选择 Episode
 ↓
视频播放页

所有视频都按照这个流程。

单集视频：

首页
 ↓
/video/example
 ↓
/watch/example/01

多集视频：

首页
 ↓
/video/example
 ↓
选择 Episode
 ↓
/watch/example/02

视频卡片禁止直接跳转到播放页面。


---

5. 首页

路由：

/

首页展示视频列表。

Video Card 包含：

视频封面

视频标题

标签

Episode 数量


示例：

┌─────────────────────┐
│                     │
│       COVER         │
│                     │
└─────────────────────┘

示例视频

#动画 #科幻

12 集

点击整个卡片进入：

/video/[slug]

首页只加载图片，不加载 HLS。


---

6. 视频详情页

路由：

/video/[slug]

页面显示：

视频封面

视频标题

标签

视频简介

Markdown 正文

Episode 列表


示例：

┌──────────────────────────────────┐
│                                  │
│              COVER               │
│                                  │
└──────────────────────────────────┘

示例视频

#动画  #科幻  #冒险

视频简介……

选集

01  第一集
02  第二集
03  第三集

所有视频都必须拥有详情页。

单集视频也显示：

选集

01 第一集

点击 Episode 后进入播放页。


---

7. 视频播放页

路由：

/watch/[slug]/[episode]

页面包含：

1. 视频播放器


2. 视频标题


3. 标签


4. Episode 列表


5. 当前 Episode


6. 上一集 / 下一集



示例：

← 返回视频详情

┌──────────────────────────────────┐
│                                  │
│              VIDEO               │
│                                  │
└──────────────────────────────────┘

示例视频

#动画 #科幻

选集：

01  02  03  04

Episode 点击后直接切换 URL：

/watch/example/03

而不是只修改播放器内部状态。


---

8. Episode

所有视频统一使用：

episodes[]

即使视频只有一集，也必须使用 Episode。

单集：

episodes:
  - id: "01"
    title: "第一集"
    source: "/media/example/01/index.m3u8"

多集：

episodes:
  - id: "01"
    title: "第一集"
    source: "/media/example/01/index.m3u8"

  - id: "02"
    title: "第二集"
    source: "/media/example/02/index.m3u8"

不设计单独的 singleVideo 或 source 字段。


---

9. Episode 切换

播放页面必须提供 Episode 列表。

例如：

01  02  03  04  05

当前 Episode 需要有明显状态。

点击：

03

进入：

/watch/example/03

上一集 / 下一集根据当前 Episode 自动计算。

第一集隐藏“上一集”。

最后一集隐藏“下一集”。


---

10. Markdown 内容系统

视频数据存放在：

src/content/videos/

例如：

src/content/videos/
├── example.md
├── another-video.md
└── documentary.md

Markdown 使用 YAML Frontmatter。


---

11. Video Schema

推荐完整结构：

---
title: "示例视频"

slug: "example"

tags:
  - 动画
  - 科幻
  - 冒险

cover: "/media/example/cover.webp"

description: "这是一个示例视频。"

publishedAt: "2026-08-12"

updatedAt: "2026-08-12"

episodes:
  - id: "01"
    title: "第一集"
    source: "/media/example/01/index.m3u8"

  - id: "02"
    title: "第二集"
    source: "https://cdn.example.com/example/02/index.m3u8"
---

## 视频介绍

这里是视频详细介绍。

可以使用正常 Markdown。


---

12. 字段定义

字段	类型	必填

title	string	是
slug	string	是
tags	string[]	是
cover	string	是
description	string	否
publishedAt	string	否
updatedAt	string	否
episodes	Episode[]	是


Episode：

字段	类型	必填

id	string	是
title	string	是
source	string	是



---

13. 内容校验

使用 Astro Content Schema 对 Markdown 进行严格校验。

以下情况必须在构建阶段报错：

缺少 title

缺少 slug

缺少 tags

缺少 cover

缺少 episodes

Episode 缺少 id

Episode 缺少 title

Episode 缺少 source

Episode ID 重复

Video slug 重复

非法媒体 URL



---

14. Markdown 正文

Frontmatter 后面的内容作为视频详情页的正文。

例如：

---
title: "示例视频"
...
---

## 简介

这是视频介绍。

## 制作信息

这里可以继续填写内容。

支持标准 Markdown。

Markdown 渲染需要进行 HTML 安全处理，避免执行任意脚本。


---

15. 图片

所有图片支持本地和外部 URL。

本地：

cover: "/media/example/cover.webp"

外部：

cover: "https://cdn.example.com/example.webp"

支持：

jpg
jpeg
png
webp
avif

推荐优先使用 WebP / AVIF。


---

16. 视频

视频统一使用 HLS。

Episode：

source: "/media/example/01/index.m3u8"

或者：

source: "https://cdn.example.com/example/01/index.m3u8"

支持：

本地 HLS

外部 HLS

.m3u8

多码率 HLS


网站本身不负责视频转码。


---

17. HLS 播放器

使用：

HTML5 Video
+
HLS.js

播放逻辑：

检测浏览器
 ↓
浏览器原生支持 HLS？
 ├── 是 → 原生 Video
 └── 否 → HLS.js

播放器至少支持：

播放

暂停

音量

进度

全屏

HLS

多清晰度

加载状态

播放错误提示



---

18. HLS CORS

外部 HLS 必须允许跨域访问。

CDN / 视频服务器需要正确处理：

GET
HEAD
OPTIONS

并允许 .m3u8 和视频分片资源跨域访问。


---

19. 播放错误

HLS 加载失败时不能出现空白区域。

显示：

视频加载失败

请稍后重试

需要处理：

m3u8 不存在

Segment 不存在

CORS 错误

网络中断

视频格式错误

播放器初始化失败



---

20. 图片加载失败

提供默认封面：

/public/default-cover.webp

图片加载失败时使用默认封面。


---

21. 标签系统

视频：

tags:
  - 动画
  - 科幻
  - 冒险

自动生成标签列表。

标签 URL：

/tag/[slug]

例如：

/tag/scifi

标签页显示该标签下的所有视频。


---

22. 标签 Slug

标签名称和 URL 分离。

例如：

中文：
科幻

URL：
/tag/scifi

需要提供统一的 slug 生成 / 映射逻辑。


---

23. 搜索

搜索页面：

/search?q=关键词

搜索内容：

title

tags

description


不搜索：

HLS URL

图片 URL

文件路径


搜索要求：

不区分英文大小写

支持中文包含匹配

无结果显示友好提示



---

24. 搜索实现

第一版不使用数据库和搜索服务器。

构建阶段读取所有 Markdown，生成搜索索引：

Video Data
 ↓
Search Index
 ↓
浏览器搜索

搜索规模较小时使用客户端搜索即可。


---

25. 主题

支持：

Light
Dark

使用 CSS Variables：

:root {
  --background: #ffffff;
  --foreground: #111111;
  --surface: #f7f7f7;
  --border: #e5e5e5;
  --muted: #666666;
}

[data-theme="dark"] {
  --background: #111111;
  --foreground: #ffffff;
  --surface: #181818;
  --border: #2a2a2a;
  --muted: #999999;
}

用户主题选择保存到 localStorage。

首次访问可以读取系统主题。

避免主题切换时出现明显闪烁。


---

26. UI 风格

设计关键词：

纯色
极简
干净
克制
留白
低干扰

避免：

大量渐变

复杂阴影

玻璃拟态

复杂动画

花哨装饰



---

27. 页面布局

推荐最大内容宽度：

1200px ~ 1440px

视频卡片封面：

16:9

播放器：

aspect-ratio: 16 / 9
width: 100%


---

28. 响应式

桌面：

4 ~ 5 列视频

平板：

2 ~ 3 列

手机：

1 ~ 2 列

使用 CSS Grid 自适应，不要大量写死宽度。

Episode 列表在手机上可以横向滚动。


---

29. Header

桌面：

Logo
首页
标签
搜索
主题切换

移动端保持简洁，只保留核心导航。

不增加其他业务入口。


---

30. 性能

核心原则：

Astro 静态生成优先

尽量减少 JS

首页不加载 HLS

图片使用 lazy loading

播放页才初始化 HLS

视频使用 poster

图片设置固定比例

HLS 和图片可以使用 CDN

不把大型视频文件放入 Git



---

31. 视频预加载

默认不要自动加载完整视频。

推荐：

preload="metadata"

或者：

preload="none"

不要在首页预加载 HLS。

不默认自动播放。


---

32. 项目结构

project/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── ThemeToggle.astro
│   │   ├── VideoCard.astro
│   │   ├── VideoGrid.astro
│   │   ├── VideoMeta.astro
│   │   ├── EpisodeList.astro
│   │   └── VideoPlayer.astro
│   │
│   ├── content/
│   │   └── videos/
│   │       ├── example.md
│   │       └── another.md
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── search.astro
│   │   ├── tag/
│   │   │   └── [slug].astro
│   │   ├── video/
│   │   │   └── [slug].astro
│   │   └── watch/
│   │       └── [slug]/
│   │           └── [episode].astro
│   │
│   ├── lib/
│   │   ├── videos.ts
│   │   ├── tags.ts
│   │   ├── search.ts
│   │   └── slug.ts
│   │
│   ├── types/
│   │   └── video.ts
│   │
│   └── styles/
│       └── global.css
│
├── public/
│   ├── default-cover.webp
│   └── media/
│
├── astro.config.ts
├── tsconfig.json
├── package.json
└── README.md


---

33. 核心组件

Header

负责：

Logo

首页

标签

搜索入口

主题切换


VideoCard

负责：

封面

标题

标签

Episode 数量


EpisodeList

负责：

Episode 列表

当前 Episode 状态

Episode 跳转


VideoPlayer

负责：

HTML5 Video

HLS.js

HLS 初始化

播放错误

播放状态


VideoMeta

负责：

标题

标签

简介



---

34. 核心工具

src/lib/videos.ts

负责：

获取全部视频

获取指定视频

获取指定 Episode


src/lib/tags.ts

负责：

获取全部标签

获取标签对应视频

标签 slug


src/lib/search.ts

负责：

创建搜索索引

搜索视频


src/lib/slug.ts

负责：

slug 生成

slug 处理



---

35. 404

以下情况返回 404：

/video/不存在
/watch/不存在/01
/watch/example/不存在
/tag/不存在

页面提供：

内容不存在

返回首页

搜索无结果不返回 404。


---

36. 内容存储

推荐结构：

Git
 │
 ├── Astro 源代码
 └── Markdown

媒体资源
 │
 ├── 图片
 └── HLS

大型 HLS 文件不要提交到 Git。

媒体可以存储于：

CDN

对象存储

独立服务器

Nginx 静态目录


Markdown 中只保存 URL。


---

37. 内容发布流程

准备视频
 ↓
转换 HLS
 ↓
上传 HLS
 ↓
准备封面
 ↓
创建 .md
 ↓
填写视频信息
 ↓
填写 Episode
 ↓
Build
 ↓
Deploy

不实现在线 Markdown 上传后台。


---

38. 视频转码

网站不负责：

MP4 → HLS

视频转码由外部工具或服务完成。

推荐流程：

原始视频
 ↓
FFmpeg / 转码服务
 ↓
HLS
 ↓
CDN
 ↓
网站播放


---

39. 安全

媒体 URL 只允许：

https://
http://
/

禁止：

javascript:
data:
file:

Markdown 渲染必须进行 HTML Sanitization。


---

40. 无障碍

至少保证：

图片有 alt

按钮有明确名称

链接可键盘访问

搜索使用 <input type="search">

足够的颜色对比度

播放器有明确的可访问名称



---

41. 不包含的功能

第一版不实现：

用户注册
用户登录
个人中心
评论
点赞
收藏
弹幕
播放历史
关注
会员
支付
广告
推荐算法
排行榜
社交功能
数据库
在线 CMS
在线视频上传
在线视频转码


---

42. 开发阶段

Phase 1

Astro 项目
TypeScript
全局 CSS
Layout
主题系统

Phase 2

Markdown Content
Schema
Video / Episode 类型

Phase 3

首页
VideoCard
VideoGrid

Phase 4

标签
标签页

Phase 5

搜索
搜索索引
搜索页

Phase 6

视频详情页
EpisodeList

Phase 7

播放页
VideoPlayer
HLS.js

Phase 8

响应式
错误处理
性能优化


---

43. 最终验收标准

必须满足：

[ ] 首页视频列表
[ ] 视频封面
[ ] 视频标题
[ ] 标签
[ ] Episode 数量
[ ] 标签页
[ ] 搜索
[ ] 视频详情页
[ ] 单集视频详情页
[ ] 多集视频详情页
[ ] Episode 列表
[ ] 播放页面
[ ] HLS.js
[ ] 本地 HLS
[ ] 外部 HLS
[ ] 本地图片
[ ] 外部图片
[ ] Light Mode
[ ] Dark Mode
[ ] Mobile
[ ] Desktop
[ ] 404
[ ] Markdown Schema 校验
[ ] 播放错误处理
[ ] 图片错误处理


---

44. 核心数据关系

Video
 │
 ├── title
 ├── slug
 ├── tags[]
 ├── cover
 ├── description
 │
 └── episodes[]
       │
       ├── id
       ├── title
       └── source

整个网站围绕这个数据结构实现。


---

45. 核心架构

Astro
                   │
        ┌──────────┴──────────┐
        │                     │
     Markdown              Components
        │                     │
        ▼                     ▼
     Video Data          页面 / UI
        │
        └──────────┬──────────┐
                   │          │
                 Image       HLS
                   │          │
                  CDN        CDN

最终原则：

> Markdown 管理视频数据，Astro 负责页面，HLS 负责视频播放，CDN 负责媒体资源，前端保持极简。

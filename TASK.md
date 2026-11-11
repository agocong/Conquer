# Website-Per — Prisma 创意工作室个人作品集网站

> **当前阶段：** 已发布至 GitHub 并通过 Pages 上线，待内容填充
> **创建日期：** 2026-06-20
> **最近更新：** 2026-11-11
> **线上地址：** https://agocong.github.io/Conquer/ ｜ 仓库：https://github.com/agocong/Conquer

---

## 项目目标

一个名为 "Prisma — A Creative Studio" 的创意工作室个人作品集网站，定位为"全球视觉艺术家、电影制作人和故事讲述者网络"。

---

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18 + TypeScript | 前端框架 |
| Vite 6 | 构建工具 |
| Tailwind CSS 3 | 样式 |
| Framer Motion | 动画 |
| GSAP | 高级动画 |
| HLS.js | 视频播放 |
| Lucide React | 图标 |
| Almarai + Instrument Serif | 字体 |

---

## 已完成的工作

- [x] 5 个页面区块：Hero、About、Projects、Skills、Contact
- [x] 黑底白字视觉风格
- [x] dist/ 构建产物已生成
- [x] **动效大改造**（详见 `.trae/documents/animation-overhaul-plan.md`）：
  - `SectionHeader.tsx` 抽出为复用组件
  - `src/utils/splitText.ts` 文字拆分共享工具
  - `AnimatedBlock` 新增 `titleReveal` / `cardCascade` / `parallaxReveal` 模式
  - Hero GSAP 开场 timeline、About 数字计数器、各区块 cascade 入场
- [x] 附加组件：GooeyNav、GradientWaves、MagicRings、OptionWheel
- [x] 「可公开的情报」5 张自定义图 + 点击弹窗预览（Lightbox）
- [x] **部署**：GitHub 公开仓库 `agocong/Conquer` + GitHub Pages 自动部署（push main 触发），已修复子路径白屏并验证渲染

---

## 待完成的工作

- [ ] **项目内容填充**：Projects 区块的具体作品展示
- [ ] **视频内容集成**：HLS.js 已引入，视频源待配置
- [ ] **响应式优化**：确认移动端适配（动效降级验证）
- [x] **部署配置**：已上线 GitHub Pages（push main 自动构建部署）

---

## 迭代记录

| 日期 | 内容 |
|------|------|
| 2026-06-20 | 初始任务文档创建 |
| 2026-10-10 | **补记**：动效大改造实施完成（实际完成日期早于本条，此前遗漏记录），代码已验证落地 |
| 2026-10-10 | 文档刷新：本文件状态同步；清理 dist 旧构建并重新构建；初始化 git 仓库与 .gitignore；修复本机 PowerShell 执行策略 |
| 2026-10-10 | 修复 `vite.config.ts` 残留的 `framer-motion` 分包配置（依赖已移除导致 build 失败） |
| 2026-10-10 | Hero「可公开的情报」跑马灯首张卡片接入个人情报海报 `public/intel-poster.png`（用户确认方案：作为首张情报卡），重新构建通过 |
| 2026-10-10 | 「可公开的情报」全部卡片支持点击弹窗单独查看（Lightbox：点击遮罩/×/ESC 关闭，portal 至 body），构建通过 |
| 2026-10-10 | 情报海报压缩：PNG 6196KB → WebP 91KB（sharp, q82），替换引用 `public/intel-poster.webp` 并删除原 PNG，构建通过 |
| 2026-10-10 | 「可公开的情报」5 张卡片全部替换为用户新图（职业档案/篮球/旅游/游戏/照顾婴儿），存 `public/intel/*.webp`（合计 29MB→634KB），移除旧海报 `intel-poster.webp`，弹窗/预加载同步更新，构建通过 |
| 2026-11-10 | 发布 GitHub：安装 gh CLI 并登录（补 workflow scope），创建公开仓库 `agocong/Conquer`，推送 main，新增 Pages 部署工作流 `.github/workflows/deploy.yml`；首次部署因 Pages 启用晚于 run 而 404，重跑后上线 |
| 2026-11-10 | 修复线上白屏：`vite.config.ts` 增加 `base: '/Conquer/'`（Pages 子路径导致绝对资源路径 404），重新部署后浏览器验证渲染正常、资源无 404 |
| 2026-11-10 | 修复图片/视频全挂：`Hero.tsx` 中 public 资源路径（character-intro.jpg、hero-intro-video.mp4、character-menu.jpg、logo-conquer.png、intel/*.webp）统一加 `BASE_URL` 前缀——JS 字符串不会被 Vite 自动改写子路径；浏览器实测图片 naturalWidth、视频 readyState=4、弹窗均正常 |
| 2026-11-11 | 首屏性能瘦身：logo 1205KB PNG→37KB WebP（删除原图）；视频 preload auto→metadata（首屏少下约 900KB）；Three.js 改 React.lazy 懒加载 + Contact 滚动临近 200px 才挂载（vendor-three 486KB 彻底退出首屏 HTML 预载与带宽）；跑马灯 10 图预加载由挂载时推迟到视频阶段（首屏不再抢 5 个 picsum 外链带宽） |

# 动效大改造计划

## 概述

将现有网站从"淡入为主"的基础动画升级为**高端创意机构级别**的 cinematic 动效体验。以黑色为底、墨绿 (#2D6A4F) 为品牌点缀，所有动画使用 GSAP + ScrollTrigger，节奏偏慢、缓动丝滑、拒绝廉价弹跳。

---

## 当前状态摘要

- 使用 GSAP + ScrollTrigger + Framer Motion 混合
- AnimatedBlock 提供 4 种基础模式 (slideUp / reveal / scaleIn / charReveal)
- SectionHeader 组件在 Projects / Skills / Contact 中重复定义
- Features 组件未在 App.tsx 中引用（展示型功能卡片）
- 动画均为简单淡入/滑动，缺乏 dramatic 视觉冲击力

---

## 设计方案

### 设计语言

- **风格定位**: 暗黑奢华、编辑主义、电影感
- **色调**: 纯黑底 (#000) + 墨绿 (#2D6A4F / #1B4332) + 纯白文字
- **字体**: 保留 Inter（干净现代），标题可稍加字重差异
- **动效节奏**: 缓入缓出为主，`power4.out` / `power3.inOut`，单段动画 0.8~1.4s
- **核心理念**: 每个 section 的标题先做强力视觉进场，卡牌再依次出现

---

## 变更清单

### 1. 重构 SectionHeader → 复用组件

**文件**: 新建 `src/components/SectionHeader.tsx`

- 提取 Projects、Skills、Contact 中重复的 SectionHeader 逻辑
- Props: `{ title: string; subtitle: string }`
- 内置 GSAP ScrollTrigger 动画：标题字符逐字 `y: 120% + rotateX: -30 → 0`，副标题 clip-path
- 移除 Projects、Skills、Contact 中的内联 SectionHeader

### 2. 增强 AnimatedBlock（新模式）

**文件**: `src/components/AnimatedBlock.tsx`

新增 3 种动画模式:

| 新模式 | 效果 | 参数 |
|---|---|---|
| `titleReveal` | 整行从右侧 clipPath 展开 + 轻微位移 | duration 1.2s, ease power4.out |
| `cardCascade` | 卡片从下方 + 右方交错入场（类似瀑布流），带 scale 0.95 | stagger 0.12s |
| `parallaxReveal` | 容器滚动时内容有细微 parallax 偏移（0~30px），搭配 clipPath 揭开 | 基于 scroll progress |

保留现有 4 种模式不动。

### 3. Hero 开场动画增强

**文件**: `src/components/Hero.tsx`

当前:
- mask-panel 上下滑开 → 视频 Ken Burns → 标题逐字 → 副标题 → 描述 → CTA

改造后:
1. **mask-panel 保留但加速**：上下滑出，duration 0.8s
2. **标题 "Conquer" 压缩归位**：标题先用 `scaleY: 1.4` + `y: -40` 压缩拉伸进场，再 `scaleY: 1` + `y: 0` 归位（ease: power3.inOut，持续 1.4s）
3. **背景视频 parallax**：视频在页面滚动时保持视差效果（通过 GSAP ScrollTrigger 将 `y` 与 scroll 关联）
4. **副标题 + 描述 + CTA stagger**：错开 0.2s 依次 clip-path 出现
5. **整体串联成一个完整的 GSAP Timeline**，总时长约 2.5s

### 4. About 部分增强

**文件**: `src/components/About.tsx`

- **标题**：从 `charReveal` 改为新的 `titleReveal` 模式 — 整行从右侧 clipPath 展开，更具冲击力
- **内容卡片**：保留 `reveal` 模式，增加 duration 到 1.4s
- **统计数字（4 个 stats）**：保留 `slideUp`，但 stagger 加大到 0.15s，同时添加数字从 0 归位的 GSAP 计数器效果（`gsap.to({ counter: 0 }, { counter: targetValue })`）

### 5. Projects / 工作经历 增强

**文件**: `src/components/Projects.tsx`

- **Section 标题**: 使用新版 SectionHeader 组件（字符逐字强力进场）
- **CAREER PATH 标签**: `reveal` → 改为侧向 clipPath 入场
- **4 张经历卡片**: 使用新版 `cardCascade` 模式（非简单 scaleIn），卡片从不同方向交错出现：
  - 卡片从上往下 + 从左往右交错
  - stagger 0.15s
  - 每张卡片内部元素（period → company → role → summary → 关键成果）做二次 stagger 子动画

### 6. Skills / 个人优势 增强

**文件**: `src/components/Skills.tsx`

- **Section 标题**: 使用新版 SectionHeader 组件
- **6 张能力卡片**: 使用 `cardCascade` 模式
  - 三列 grid 中，卡片按行依次从左下角入场
  - stagger 0.1s
  - 每张卡片内英文标签和标题有毫秒级的子项延迟动画

### 7. Contact 部分增强

**文件**: `src/components/Contact.tsx`

- **Section 标题**: 使用新版 SectionHeader 组件
- **中央文案区**: 保留 `reveal`，加大 duration 到 1.6s，配合更明显的 clipPath
- **2 张 info 卡片**: `cardCascade` 模式
- **Footer**: 保留 `slideUp`，增加来自底部的位移幅度（y: 80 → 0）

### 8. CSS 工具类补充

**文件**: `src/index.css`

新增:
```css
/* 图片/视频 reveal 遮罩 */
.img-reveal-mask {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.img-reveal-mask.revealed {
  clip-path: inset(0 0 0% 0);
}

/* 强制 GPU 合成 */
.gpu-layer {
  transform: translateZ(0);
  will-change: transform;
}
```

### 9. 性能优化

- 所有 GSAP 动画默认 `overwrite: 'auto'` 防止冲突
- 对大型 DOM（卡片 grid）使用 GSAP 的 `batch()` 或手动限制选择器范围
- 确保 `will-change` 只在动画过程中启用（GSAP 自动管理）
- MagicRings（Three.js）只在 Contact 视口可见时渲染，通过 ScrollTrigger 控制暂停/恢复

### 10. 文字拆分解耦

当前 Hero 和 SectionHeader 各自有一套文字拆分逻辑。计划改为共享工具函数:

**新建**: `src/utils/splitText.ts`
```typescript
export function splitIntoSpans(element: HTMLElement, wrapperClass?: string): HTMLSpanElement[]
```
Hero 和 SectionHeader 都调用此工具。

---

## 假设与决策

1. **放弃 Framer Motion 的 Features 组件**：未集成到 App.tsx，本次不改动
2. **保留 Hero 视频**：作为开场背景有冲击力，新增 scroll-based parallax
3. **不引入新字体**：Inter 在黑色背景下干净稳定，无需替换
4. **不新增外部依赖**：已有 GSAP + ScrollTrigger + Three.js，充分使用即可
5. **AnimatedBlock 保留原有 4 种模式**：仅新增 3 种，确保向后兼容

---

## 验证步骤

1. `npm run dev` 启动 dev server
2. 验证 Hero 开场动画: mask 滑出 → 标题压缩归位 → 内容 stagger
3. 滚动经过 About: 标题从右侧展开 → 内容 clipPath → 数字从 0 跳到目标值
4. 滚动经过 Projects: Section 标题强入场 → 卡片从不同方向 cascade 出现
5. 滚动经过 Skills: 标题入场 → 6 张卡片 cascade
6. 滚动经过 Contact: 标题入场 → 文案 clipPath → info 卡片 cascade
7. 检查 MagicRings 在 Contact 滚动进出时的暂停/恢复
8. 检查手机端所有动画正常降级（无 JS 错误）

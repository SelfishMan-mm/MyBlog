# 样式系统规范

## 设计令牌系统

### 颜色系统
- **主色调**: `color(primary)`, `color(primary-light)`, `color(primary-dark)`
- **背景色**: `color(bg-primary)`, `color(bg-secondary)`, `color(bg-card)`
- **文字颜色**: `color(text-primary)`, `color(text-secondary)`, `color(text-muted)`
- **边框颜色**: `color(border-primary)`, `color(border-secondary)`

### 字体系统
- **字体族**: `map-get($font-family, primary)`, `map-get($font-family, code)`
- **字体大小**: `font-size(xs)` 到 `font-size(6xl)`
- **字体粗细**: `font-weight(light)` 到 `font-weight(extrabold)`
- **行高**: `map-get($line-heights, tight|normal|relaxed|loose)`

### 间距系统
- **间距**: `spacing(0)` 到 `spacing(64)`
- **边框半径**: `border-radius(none)` 到 `border-radius(full)`
- **阴影**: `shadow(sm)` 到 `shadow(2xl)`, `shadow(card)`, `shadow(glow)`

## 组件样式规范

### 命名约定
1. **BEM 方法论**: 使用 Block__Element--Modifier 命名
2. **组件前缀**: 每个组件使用唯一的类名前缀
3. **状态类**: 使用 `is-` 前缀表示状态 (如 `is-active`, `is-loading`)
4. **工具类**: 使用语义化名称 (如 `text-center`, `bg-primary`)

### 组件结构
```scss
.component-name {
  // 基础样式
  @include card-style; // 使用混合器
  
  // 元素样式
  &__element {
    color: color(text-primary);
    font-size: font-size(base);
  }
  
  // 修饰符
  &--variant {
    background: color(bg-secondary);
  }
  
  // 状态
  &.is-active {
    color: color(primary);
  }
  
  // 响应式
  @include respond-to(md) {
    padding: spacing(6);
  }
}
```

## 混合器使用指南

### 布局混合器
- `@include flex-center` - 水平垂直居中
- `@include flex-between` - 两端对齐
- `@include flex-column-center` - 垂直居中列布局

### 响应式混合器
- `@include respond-to(md)` - 中等屏幕及以上
- `@include respond-below(lg)` - 大屏幕以下
- `@include respond-between(sm, lg)` - 指定范围

### 视觉效果混合器
- `@include card-style` - 卡片样式
- `@include hover-lift` - 悬浮提升效果
- `@include hover-glow` - 悬浮发光效果

### 动画混合器
- `@include fade-in` - 淡入动画
- `@include slide-up` - 上滑动画
- `@include scale-in` - 缩放动画

## 最佳实践

### 1. 优先使用设计令牌
```scss
// ✅ 推荐
color: color(text-primary);
font-size: font-size(lg);
margin: spacing(4);

// ❌ 避免
color: #fff;
font-size: 18px;
margin: 16px;
```

### 2. 使用混合器提高复用性
```scss
// ✅ 推荐
@include flex-center;
@include respond-to(md);

// ❌ 避免
display: flex;
align-items: center;
justify-content: center;
@media (min-width: 768px) { ... }
```

### 3. 保持样式层次清晰
```scss
.component {
  // 1. 定位和布局
  position: relative;
  display: flex;
  
  // 2. 盒模型
  width: 100%;
  padding: spacing(4);
  margin: spacing(2);
  
  // 3. 视觉样式
  background: color(bg-card);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  
  // 4. 文字样式
  color: color(text-primary);
  font-size: font-size(base);
  
  // 5. 其他
  transition: all transition(base);
}
```

### 4. 响应式设计原则
- 移动优先设计
- 使用相对单位 (rem, em, %)
- 合理使用断点
- 避免过多的断点

### 5. 性能优化
- 避免深层嵌套选择器 (最多3层)
- 使用高效的选择器
- 合理使用 CSS 变量
- 避免重复的样式代码
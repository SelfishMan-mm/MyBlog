<template>
  <div class="markdown-wrapper">
    <!-- 目录导航 -->
    <div v-if="showToc && tocItems.length > 0" class="table-of-contents">
      <h4 class="toc-title">目录</h4>
      <ul class="toc-list">
        <li
          v-for="item in tocItems"
          :key="item.anchor"
          :class="['toc-item', `toc-level-${item.level}`, { active: activeHeading === item.anchor }]"
        >
          <a :href="`#${item.anchor}`" @click.prevent="scrollToHeading(item.anchor)">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
    
    <!-- Markdown 内容 -->
    <div class="markdown-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

interface TocItem {
  anchor: string
  text: string
  level: number
}

const props = withDefaults(defineProps<{
  content: string
  showToc?: boolean
}>(), {
  showToc: true
})

const activeHeading = ref('')
const tocItems = ref<TocItem[]>([])

// 配置 MarkdownIt
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        // 添加复制按钮
        return `<div class="code-block-wrapper">
          <div class="code-header">
            <span class="code-lang">${lang}</span>
            <button class="copy-btn" onclick="copyCode(this)" title="复制代码">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="m5 15-4-4 4-4"></path>
              </svg>
            </button>
          </div>
          <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
        </div>`
      } catch (__) {}
    }
    return `<div class="code-block-wrapper">
      <div class="code-header">
        <button class="copy-btn" onclick="copyCode(this)" title="复制代码">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="m5 15-4-4 4-4"></path>
          </svg>
        </button>
      </div>
      <pre><code>${md.utils.escapeHtml(str)}</code></pre>
    </div>`
  }
})

// 自定义渲染器，为标题添加锚点
const defaultHeadingOpen = md.renderer.rules.heading_open || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.heading_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const level = parseInt(token.tag.slice(1))
  const nextToken = tokens[idx + 1]
  
  if (nextToken && nextToken.type === 'inline') {
    const text = nextToken.content
    const anchor = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
    token.attrSet('id', anchor)
    
    // 收集目录项
    if (level >= 1 && level <= 3) {
      tocItems.value.push({
        anchor,
        text,
        level
      })
    }
  }
  
  return defaultHeadingOpen(tokens, idx, options, env, renderer)
}

const renderedContent = computed(() => {
  // 重置目录项
  tocItems.value = []
  return md.render(props.content)
})

// 滚动到指定标题
const scrollToHeading = (anchor: string) => {
  const element = document.getElementById(anchor)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeHeading.value = anchor
  }
}

// 监听滚动，更新活跃标题
const handleScroll = () => {
  const headings = tocItems.value.map(item => ({
    ...item,
    element: document.getElementById(item.anchor)
  })).filter(item => item.element)

  let current = ''
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    if (heading.element && heading.element.offsetTop <= scrollTop + 100) {
      current = heading.anchor
      break
    }
  }

  activeHeading.value = current
}

// 全局复制代码函数
const setupCopyFunction = () => {
  (window as any).copyCode = function(button: HTMLElement) {
    const codeBlock = button.closest('.code-block-wrapper')?.querySelector('code')
    if (codeBlock) {
      const text = codeBlock.textContent || ''
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML
        button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>`
        button.style.color = '#67C23A'
        
        setTimeout(() => {
          button.innerHTML = originalText
          button.style.color = ''
        }, 2000)
      }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        const originalText = button.innerHTML
        button.innerHTML = '已复制'
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      })
    }
  }
}

onMounted(() => {
  setupCopyFunction()
  nextTick(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化活跃标题
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  delete (window as any).copyCode
})
</script>

<style lang="scss" scoped>
.markdown-wrapper {
  display: flex;
  gap: spacing(6);
  
  @include respond-to(mobile) {
    flex-direction: column;
  }
}

// 目录导航样式
.table-of-contents {
  flex-shrink: 0;
  width: 250px;
  background: color(bg-secondary);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  padding: spacing(4);
  height: fit-content;
  position: sticky;
  top: spacing(4);
  
  @include respond-to(mobile) {
    width: 100%;
    position: static;
    order: -1;
  }
  
  .toc-title {
    font-size: font-size(lg);
    font-weight: font-weight(semibold);
    color: color(text-primary);
    margin: 0 0 spacing(3) 0;
    padding-bottom: spacing(2);
    border-bottom: 1px solid color(border-primary);
  }
  
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    .toc-item {
      margin: spacing(1) 0;
      
      &.toc-level-1 {
        margin-left: 0;
        
        a {
          font-weight: font-weight(medium);
          font-size: font-size(sm);
        }
      }
      
      &.toc-level-2 {
        margin-left: spacing(3);
        
        a {
          font-size: font-size(sm);
        }
      }
      
      &.toc-level-3 {
        margin-left: spacing(6);
        
        a {
          font-size: font-size(xs);
        }
      }
      
      &.active {
        a {
          color: color(primary);
          font-weight: font-weight(medium);
        }
      }
      
      a {
        display: block;
        padding: spacing(1) spacing(2);
        color: color(text-secondary);
        text-decoration: none;
        border-radius: border-radius(sm);
        transition: all 0.2s ease;
        line-height: 1.4;
        
        &:hover {
          color: color(primary);
          background: rgba(64, 158, 255, 0.1);
        }
      }
    }
  }
}

// Markdown 内容样式
.markdown-content {
  flex: 1;
  min-width: 0;
  padding: spacing(4);
  line-height: 1.75;
  font-family: 'CaskaydiaCove', 'CaskaydiaCove Nerd Font', 'Consolas', 'Monaco', 'Courier New', monospace;
  color: color(text-primary);

  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    position: relative;
    scroll-margin-top: spacing(4);
    
    &:hover::before {
      content: '#';
      position: absolute;
      left: -spacing(6);
      color: color(primary);
      opacity: 0.6;
      font-weight: font-weight(normal);
    }
  }

  :deep(h1) {
    font-size: font-size(3xl);
    font-weight: font-weight(bold);
    color: color(text-primary);
    margin: spacing(6) 0 spacing(4) 0;
    
    @include respond-to(md) {
      font-size: font-size(4xl);
    }
  }

  :deep(h2) {
    font-size: font-size(2xl);
    font-weight: font-weight(semibold);
    color: color(text-primary);
    margin: spacing(5) 0 spacing(3) 0;
    
    @include respond-to(md) {
      font-size: font-size(3xl);
    }
  }

  :deep(h3) {
    font-size: font-size(xl);
    font-weight: font-weight(medium);
    color: color(text-primary);
    margin: spacing(4) 0 spacing(2) 0;
    
    @include respond-to(md) {
      font-size: font-size(2xl);
    }
  }

  :deep(p) {
    margin: spacing(4) 0;
    color: color(text-secondary);
    line-height: 1.75;
  }

  // 代码块样式
  :deep(.code-block-wrapper) {
    position: relative;
    margin: spacing(4) 0;
    background: color(bg-secondary);
    border: 1px solid color(border-primary);
    border-radius: border-radius(lg);
    overflow: hidden;
    
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: spacing(2) spacing(4);
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid color(border-primary);
      
      .code-lang {
        font-size: font-size(xs);
        color: color(text-muted);
        font-weight: font-weight(medium);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .copy-btn {
        background: none;
        border: none;
        color: color(text-muted);
        cursor: pointer;
        padding: spacing(1);
        border-radius: border-radius(sm);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: color(text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    pre {
      margin: 0;
      padding: spacing(4);
      background: transparent;
      overflow-x: auto;
      @include custom-scrollbar;
      
      code {
        background: transparent;
        padding: 0;
        border-radius: 0;
        font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: font-size(sm);
        line-height: 1.6;
      }
    }
  }

  :deep(code) {
    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    background: color(bg-secondary);
    padding: spacing(1) spacing(2);
    border-radius: border-radius(sm);
    font-size: 0.9em;
    color: color(primary);
    border: 1px solid color(border-primary);
  }

  :deep(a) {
    color: color(primary);
    text-decoration: none;
    transition: color transition(base);

    &:hover {
      color: color(primary-light);
      text-decoration: underline;
    }
  }

  :deep(ul), :deep(ol) {
    margin: spacing(4) 0;
    padding-left: spacing(6);
    
    li {
      margin: spacing(2) 0;
      color: color(text-secondary);
      
      &::marker {
        color: color(primary);
      }
    }
  }

  :deep(blockquote) {
    padding: spacing(4) spacing(6);
    margin: spacing(6) 0;
    border-left: 4px solid color(primary);
    background: color(bg-secondary);
    border-radius: border-radius(md);
    position: relative;
    
    &::before {
      content: '"';
      position: absolute;
      top: spacing(2);
      left: spacing(4);
      font-size: font-size(3xl);
      color: color(primary);
      opacity: 0.3;
      line-height: 1;
    }
    
    p {
      margin: 0;
      font-style: italic;
      color: color(text-secondary);
      padding-left: spacing(4);
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: spacing(6) 0;
    background: color(bg-secondary);
    border: 1px solid color(border-primary);
    border-radius: border-radius(lg);
    overflow: hidden;
    
    th, td {
      padding: spacing(3) spacing(4);
      text-align: left;
      border-bottom: 1px solid color(border-primary);
    }
    
    th {
      font-weight: font-weight(semibold);
      background: rgba(0, 0, 0, 0.2);
      color: color(text-primary);
    }
    
    td {
      color: color(text-secondary);
    }
    
    tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    
    tr:last-child {
      td {
        border-bottom: none;
      }
    }
  }

  // 图片样式
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: border-radius(lg);
    margin: spacing(4) 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  // 分割线样式
  :deep(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, color(border-primary), transparent);
    margin: spacing(8) 0;
  }
}

// 响应式优化
@include respond-to(mobile) {
  .markdown-content {
    padding: spacing(2);
    
    :deep(.code-block-wrapper) {
      .code-header {
        padding: spacing(2) spacing(3);
        
        .code-lang {
          font-size: font-size(xs);
        }
      }
      
      pre {
        padding: spacing(3);
        
        code {
          font-size: font-size(xs);
        }
      }
    }
  }
}
</style>

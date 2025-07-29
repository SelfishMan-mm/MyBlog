<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return '' // 使用默认的转义
  }
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style lang="scss" scoped>
.markdown-content {
  padding: spacing(4);
  line-height: 1.75;
  font-family: 'CaskaydiaCove', 'CaskaydiaCove Nerd Font', 'Consolas', 'Monaco', 'Courier New', monospace;
  color: color(text-primary);

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

  :deep(pre) {
    background: color(bg-secondary);
    padding: spacing(4);
    border-radius: border-radius(md);
    overflow-x: auto;
    margin: spacing(4) 0;
    @include custom-scrollbar;
    
    code {
      background: transparent;
      padding: 0;
      border-radius: 0;
    }
  }

  :deep(code) {
    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    background: color(bg-secondary);
    padding: spacing(1) spacing(2);
    border-radius: border-radius(sm);
    font-size: 0.9em;
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
    }
  }

  :deep(blockquote) {
    padding: spacing(4) spacing(6);
    margin: spacing(6) 0;
    border-left: 4px solid color(primary);
    background: color(bg-secondary);
    border-radius: border-radius(md);
    
    p {
      margin: 0;
      font-style: italic;
      color: color(text-secondary);
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: spacing(6) 0;
    
    th, td {
      padding: spacing(3) spacing(4);
      text-align: left;
      border-bottom: 1px solid color(border-primary);
    }
    
    th {
      font-weight: font-weight(semibold);
      background: color(bg-secondary);
      color: color(text-primary);
    }
    
    td {
      color: color(text-secondary);
    }
    
    tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }
  }
}
</style>

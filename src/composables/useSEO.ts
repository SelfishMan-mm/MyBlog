/**
 * SEO 组合式函数
 */

import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  setSEOMetadata, 
  setStructuredData, 
  PAGE_SEO_CONFIG, 
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  getCurrentPageUrl,
  type SEOMetadata 
} from '@/utils/seo'

export const useSEO = (customMetadata?: SEOMetadata) => {
  const route = useRoute()

  // 设置页面 SEO
  const setupPageSEO = () => {
    const routeName = route.name as string
    const pageConfig = PAGE_SEO_CONFIG[routeName] || PAGE_SEO_CONFIG.home
    
    // 合并自定义元数据
    const metadata: SEOMetadata = {
      ...pageConfig,
      ...customMetadata,
      url: getCurrentPageUrl()
    }

    // 设置 SEO 元数据
    setSEOMetadata(metadata)

    // 设置结构化数据
    if (routeName === 'home') {
      setStructuredData([
        generateWebsiteStructuredData(),
        generatePersonStructuredData()
      ])
    } else if (routeName === 'about') {
      setStructuredData(generatePersonStructuredData())
    } else {
      setStructuredData(generateWebsiteStructuredData())
    }
  }

  // 更新 SEO 元数据
  const updateSEO = (newMetadata: SEOMetadata) => {
    const currentConfig = PAGE_SEO_CONFIG[route.name as string] || PAGE_SEO_CONFIG.home
    const metadata: SEOMetadata = {
      ...currentConfig,
      ...newMetadata,
      url: getCurrentPageUrl()
    }
    
    setSEOMetadata(metadata)
  }

  // 监听路由变化
  watch(() => route.fullPath, setupPageSEO, { immediate: false })

  onMounted(() => {
    setupPageSEO()
  })

  return {
    updateSEO,
    setupPageSEO
  }
}

// 文章 SEO 组合式函数
export const useArticleSEO = (article: {
  title: string
  description?: string
  tags?: string[]
  publishedAt?: Date
  updatedAt?: Date
}) => {
  const { updateSEO } = useSEO()

  onMounted(() => {
    updateSEO({
      title: `${article.title} - meless的博客`,
      description: article.description || `meless分享的技术文章：${article.title}`,
      keywords: article.tags || ['技术文章', '编程', '博客'],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString()
    })

    // 设置文章结构化数据
    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description || `meless分享的技术文章：${article.title}`,
      author: {
        '@type': 'Person',
        name: 'meless',
        email: '2779279397@qq.com'
      },
      publisher: {
        '@type': 'Person',
        name: 'meless'
      },
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt?.toISOString(),
      keywords: article.tags?.join(', '),
      url: getCurrentPageUrl(),
      inLanguage: 'zh-CN'
    })
  })
}

// 项目 SEO 组合式函数
export const useProjectSEO = (project: {
  name: string
  description: string
  techStack: string[]
}) => {
  const { updateSEO } = useSEO()

  onMounted(() => {
    updateSEO({
      title: `${project.name} - meless的项目`,
      description: `${project.description} 技术栈：${project.techStack.join(', ')}`,
      keywords: ['项目展示', '开源项目', ...project.techStack],
      type: 'website'
    })
  })
}
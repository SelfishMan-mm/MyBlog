/**
 * SEO 优化工具
 */

import { AUTHOR_CONFIG, APP_CONFIG } from './config'

// SEO 元数据接口
export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

// 页面 SEO 配置
export const PAGE_SEO_CONFIG: Record<string, SEOMetadata> = {
  home: {
    title: `${AUTHOR_CONFIG.name} - ${AUTHOR_CONFIG.slogan}`,
    description: `${AUTHOR_CONFIG.name}的个人博客，专注于C++、Python、数据分析、WEB3技术分享。${AUTHOR_CONFIG.motto}`,
    keywords: ['个人博客', 'C++', 'Python', '数据分析', 'WEB3', 'AI-Agent', '前端开发'],
    type: 'website',
    author: AUTHOR_CONFIG.name
  },
  about: {
    title: `关于我 - ${AUTHOR_CONFIG.name}`,
    description: `了解${AUTHOR_CONFIG.name}的教育背景、技能专长和兴趣爱好。苏州经贸职业技术学院学生，热爱编程和技术创新。`,
    keywords: ['关于我', '个人简介', '教育经历', '技能专长', '苏州经贸职业技术学院'],
    type: 'profile',
    author: AUTHOR_CONFIG.name
  },
  projects: {
    title: `项目展示 - ${AUTHOR_CONFIG.name}`,
    description: `展示${AUTHOR_CONFIG.name}的代表性项目，包括cpp-chatroom、CryptoDash等开源项目，涵盖C++、Python、Web3等技术栈。`,
    keywords: ['项目展示', '开源项目', 'cpp-chatroom', 'CryptoDash', 'GitHub'],
    type: 'website',
    author: AUTHOR_CONFIG.name
  },
  blog: {
    title: `技术博客 - ${AUTHOR_CONFIG.name}`,
    description: `${AUTHOR_CONFIG.name}的技术博客，分享编程经验、算法学习、技术心得。包含快速幂、日期模拟、进制转换等技术文章。`,
    keywords: ['技术博客', '编程教程', '算法学习', '快速幂', '数据结构'],
    type: 'website',
    author: AUTHOR_CONFIG.name
  },
  contact: {
    title: `联系我 - ${AUTHOR_CONFIG.name}`,
    description: `与${AUTHOR_CONFIG.name}取得联系，欢迎技术交流与项目合作。可通过QQ邮箱、GitHub、哔哩哔哩等方式联系。`,
    keywords: ['联系方式', '技术交流', '项目合作', 'QQ邮箱', 'GitHub'],
    type: 'website',
    author: AUTHOR_CONFIG.name
  }
}

// 设置页面 SEO 元数据
export const setSEOMetadata = (metadata: SEOMetadata) => {
  // 设置页面标题
  if (metadata.title) {
    document.title = metadata.title
  }

  // 设置或更新 meta 标签
  const setMetaTag = (name: string, content: string, property = false) => {
    const attribute = property ? 'property' : 'name'
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
    
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attribute, name)
      document.head.appendChild(meta)
    }
    
    meta.content = content
  }

  // 基础 meta 标签
  if (metadata.description) {
    setMetaTag('description', metadata.description)
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    setMetaTag('keywords', metadata.keywords.join(', '))
  }

  if (metadata.author) {
    setMetaTag('author', metadata.author)
  }

  // Open Graph 标签
  if (metadata.title) {
    setMetaTag('og:title', metadata.title, true)
  }

  if (metadata.description) {
    setMetaTag('og:description', metadata.description, true)
  }

  if (metadata.type) {
    setMetaTag('og:type', metadata.type, true)
  }

  if (metadata.url) {
    setMetaTag('og:url', metadata.url, true)
  }

  if (metadata.image) {
    setMetaTag('og:image', metadata.image, true)
  }

  setMetaTag('og:site_name', APP_CONFIG.title, true)

  // Twitter Card 标签
  setMetaTag('twitter:card', 'summary_large_image', true)
  
  if (metadata.title) {
    setMetaTag('twitter:title', metadata.title, true)
  }

  if (metadata.description) {
    setMetaTag('twitter:description', metadata.description, true)
  }

  if (metadata.image) {
    setMetaTag('twitter:image', metadata.image, true)
  }

  // 文章相关的 meta 标签
  if (metadata.type === 'article') {
    if (metadata.author) {
      setMetaTag('article:author', metadata.author, true)
    }

    if (metadata.publishedTime) {
      setMetaTag('article:published_time', metadata.publishedTime, true)
    }

    if (metadata.modifiedTime) {
      setMetaTag('article:modified_time', metadata.modifiedTime, true)
    }
  }
}

// 获取当前页面的完整 URL
export const getCurrentPageUrl = (): string => {
  return window.location.href
}

// 生成文章 SEO 元数据
export const generateArticleSEO = (article: {
  title: string
  description?: string
  tags?: string[]
  publishedAt?: Date
  updatedAt?: Date
}): SEOMetadata => {
  return {
    title: `${article.title} - ${AUTHOR_CONFIG.name}的博客`,
    description: article.description || `${AUTHOR_CONFIG.name}分享的技术文章：${article.title}`,
    keywords: article.tags || ['技术文章', '编程', '博客'],
    type: 'article',
    author: AUTHOR_CONFIG.name,
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt?.toISOString(),
    url: getCurrentPageUrl()
  }
}

// 生成项目 SEO 元数据
export const generateProjectSEO = (project: {
  name: string
  description: string
  techStack: string[]
}): SEOMetadata => {
  return {
    title: `${project.name} - ${AUTHOR_CONFIG.name}的项目`,
    description: `${project.description} 技术栈：${project.techStack.join(', ')}`,
    keywords: ['项目展示', '开源项目', ...project.techStack],
    type: 'website',
    author: AUTHOR_CONFIG.name,
    url: getCurrentPageUrl()
  }
}

// 设置页面的结构化数据
export const setStructuredData = (data: any) => {
  // 移除现有的结构化数据
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // 添加新的结构化数据
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// 生成个人资料结构化数据
export const generatePersonStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_CONFIG.name,
    description: `${AUTHOR_CONFIG.slogan} - ${AUTHOR_CONFIG.motto}`,
    email: AUTHOR_CONFIG.email,
    url: getCurrentPageUrl(),
    sameAs: [
      AUTHOR_CONFIG.github,
      AUTHOR_CONFIG.bilibili
    ],
    jobTitle: '学生',
    affiliation: {
      '@type': 'EducationalOrganization',
      name: '苏州经贸职业技术学院'
    },
    knowsAbout: ['C++', 'Python', '数据分析', 'WEB3', 'AI-Agent', '前端开发'],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: '苏州经贸职业技术学院'
    }
  }
}

// 生成网站结构化数据
export const generateWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: APP_CONFIG.title,
    description: APP_CONFIG.description,
    url: window.location.origin,
    author: {
      '@type': 'Person',
      name: AUTHOR_CONFIG.name
    },
    inLanguage: 'zh-CN',
    copyrightHolder: {
      '@type': 'Person',
      name: AUTHOR_CONFIG.name
    }
  }
}

// 生成博客文章结构化数据
export const generateArticleStructuredData = (article: {
  title: string
  description: string
  publishedAt?: Date
  updatedAt?: Date
  tags?: string[]
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: AUTHOR_CONFIG.name,
      email: AUTHOR_CONFIG.email
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_CONFIG.name
    },
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    keywords: article.tags?.join(', '),
    url: getCurrentPageUrl(),
    inLanguage: 'zh-CN'
  }
}
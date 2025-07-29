/**
 * 站点地图生成器
 */

import { AUTHOR_CONFIG } from './config'

// 站点地图条目接口
export interface SitemapEntry {
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

// 获取基础 URL
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://meless.dev' // 替换为实际域名
}

// 生成站点地图条目
export const generateSitemapEntries = (): SitemapEntry[] => {
  const baseUrl = getBaseUrl()
  const currentDate = new Date().toISOString().split('T')[0]

  const entries: SitemapEntry[] = [
    // 主要页面
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/projects`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    }
  ]

  // 可以在这里添加博客文章的动态条目
  // TODO: 当实现动态博客系统时，添加文章 URL

  return entries
}

// 生成 XML 站点地图
export const generateSitemapXML = (): string => {
  const entries = generateSitemapEntries()
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  entries.forEach(entry => {
    xml += '  <url>\n'
    xml += `    <loc>${entry.url}</loc>\n`
    
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`
    }
    
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`
    }
    
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`
    }
    
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  
  return xml
}

// 生成 robots.txt 内容
export const generateRobotsTxt = (): string => {
  const baseUrl = getBaseUrl()
  
  return `User-agent: *
Allow: /

# 站点地图
Sitemap: ${baseUrl}/sitemap.xml

# 禁止访问的路径
Disallow: /admin/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /src/

# 爬取延迟（可选）
Crawl-delay: 1`
}

// 下载站点地图文件
export const downloadSitemap = () => {
  const xml = generateSitemapXML()
  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'sitemap.xml'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// 下载 robots.txt 文件
export const downloadRobotsTxt = () => {
  const txt = generateRobotsTxt()
  const blob = new Blob([txt], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'robots.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
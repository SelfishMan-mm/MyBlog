/**
 * 应用配置管理
 */

// 应用基础信息
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'meless - 独游的小船',
  description: import.meta.env.VITE_APP_DESCRIPTION || '苏州经贸职业技术学院学生，专注于C++、Python、数据分析、WEB3技术',
  keywords: import.meta.env.VITE_APP_KEYWORDS?.split(',') || ['个人博客', 'C++', 'Python', '数据分析', 'WEB3', 'AI-Agent'],
  version: __APP_VERSION__,
  isDev: __DEV__
} as const

// 个人信息配置
export const AUTHOR_CONFIG = {
  name: import.meta.env.VITE_AUTHOR_NAME || 'meless',
  slogan: import.meta.env.VITE_AUTHOR_SLOGAN || '独游的小船',
  motto: import.meta.env.VITE_AUTHOR_MOTTO || '走出平凡深渊',
  email: import.meta.env.VITE_AUTHOR_EMAIL || '2779279397@qq.com',
  github: import.meta.env.VITE_AUTHOR_GITHUB || 'https://github.com/SelfishMan-mm',
  bilibili: import.meta.env.VITE_AUTHOR_BILIBILI || 'https://space.bilibili.com/632873241'
} as const

// 功能开关配置
export const FEATURE_CONFIG = {
  enableParticles: import.meta.env.VITE_ENABLE_PARTICLES === 'true',
  enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
  enableConsoleLogs: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true'
} as const

// 性能配置
export const PERFORMANCE_CONFIG = {
  particlesCount: parseInt(import.meta.env.VITE_PARTICLES_COUNT || '60', 10),
  animationDuration: parseInt(import.meta.env.VITE_ANIMATION_DURATION || '250', 10)
} as const

// 开发环境配置
export const DEV_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
} as const

// 导出所有配置
export const CONFIG = {
  app: APP_CONFIG,
  author: AUTHOR_CONFIG,
  features: FEATURE_CONFIG,
  performance: PERFORMANCE_CONFIG,
  dev: DEV_CONFIG
} as const

// 类型导出
export type AppConfig = typeof APP_CONFIG
export type AuthorConfig = typeof AUTHOR_CONFIG
export type FeatureConfig = typeof FEATURE_CONFIG
export type PerformanceConfig = typeof PERFORMANCE_CONFIG
export type DevConfig = typeof DEV_CONFIG
export type Config = typeof CONFIG

// 工具函数
export const isDevelopment = () => import.meta.env.DEV
export const isProduction = () => import.meta.env.PROD

// 日志工具
export const logger = {
  log: (...args: unknown[]) => {
    if (FEATURE_CONFIG.enableConsoleLogs || isDevelopment()) {
     if (import.meta.env.DEV) console.log('[Blog]', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (FEATURE_CONFIG.enableConsoleLogs || isDevelopment()) {
      console.warn('[Blog]', ...args)
    }
  },
  error: (...args: unknown[]) => {
    console.error('[Blog]', ...args)
  }
}
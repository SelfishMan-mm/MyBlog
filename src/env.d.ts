/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型声明
interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_KEYWORDS: string
  
  // 个人信息
  readonly VITE_AUTHOR_NAME: string
  readonly VITE_AUTHOR_SLOGAN: string
  readonly VITE_AUTHOR_MOTTO: string
  readonly VITE_AUTHOR_EMAIL: string
  readonly VITE_AUTHOR_GITHUB: string
  readonly VITE_AUTHOR_BILIBILI: string
  
  // 功能开关
  readonly VITE_ENABLE_PARTICLES: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_ENABLE_CONSOLE_LOGS: string
  
  // 性能配置
  readonly VITE_PARTICLES_COUNT: string
  readonly VITE_ANIMATION_DURATION: string
  
  // 开发环境
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ENABLE_MOCK?: string
  readonly VITE_ENABLE_DEVTOOLS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 全局类型声明
declare const __APP_VERSION__: string
declare const __DEV__: boolean

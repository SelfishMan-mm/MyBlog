import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/global.scss'
import App from './App.vue'
import router from './router'
import { registerScrollAnimationDirectives } from '@/directives/scrollAnimation'

// 全局错误处理
const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
  // 在生产环境中，这里可以发送错误报告到监控系统
  if (import.meta.env.PROD) {
    // reportError(err, { component: vm, info })
  }
}

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Global warning:', msg, trace)
}

// 注册插件
app.use(ElementPlus)
app.use(router)

// 注册滚动动画指令
registerScrollAnimationDirectives(app)

// 挂载应用
app.mount('#app')

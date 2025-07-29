<template>
  <div class="particles-bg">
    <canvas ref="canvasRef" class="particles-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, reactive, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color?: string
}

// 配置类型定义
interface ParticleConfig {
  effectType: 'default' | 'stars' | 'network'
  enabled: boolean
  particleCount?: number
  particleSize?: [number, number]
  particleColor?: string | string[]
  particleSpeed?: number
  connectionDistance?: number
  connectionColor?: string
  isMobile?: boolean
}

// 配置校验和默认值
const DEFAULT_CONFIG: ParticleConfig = {
  effectType: 'default',
  enabled: true,
  particleCount: 50,
  particleSize: [0.5, 2],
  particleColor: '#ffffff',
  particleSpeed: 0.5,
  connectionDistance: 100,
  connectionColor: '#ffffff',
  isMobile: false
}

// 配置验证函数
function validateConfig(config: Partial<ParticleConfig>): ParticleConfig {
  const validated = { ...DEFAULT_CONFIG, ...config }
  
  // 检查并修正数值范围
  validated.particleCount = Math.min(Math.max(validated.particleCount || 50, 20), validated.isMobile ? 50 : 150)
  validated.particleSpeed = Math.min(Math.max(validated.particleSpeed || 0.5, 0.1), validated.isMobile ? 0.3 : 1.0)
  validated.connectionDistance = Math.min(Math.max(validated.connectionDistance || 100, 50), 200)
  
  // 验证颜色格式
  const isValidColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\([\d,.\s]+\)$/.test(color)
  
  if (Array.isArray(validated.particleColor)) {
    validated.particleColor = validated.particleColor.filter(isValidColor)
    if (validated.particleColor.length === 0) validated.particleColor = DEFAULT_CONFIG.particleColor
  } else if (!isValidColor(validated.particleColor as string)) {
    validated.particleColor = DEFAULT_CONFIG.particleColor
  }
  
  if (!isValidColor(validated.connectionColor)) {
    validated.connectionColor = DEFAULT_CONFIG.connectionColor
  }
  
  return validated
}

class ParticleSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private animationId: number | null = null
  private resizeHandler: () => void
  private config: ParticleConfig

  constructor(canvas: HTMLCanvasElement, config: Partial<ParticleConfig> = {}) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas')
    }
    this.ctx = ctx
    this.resizeHandler = () => this.resize()

    // 配置校验
    this.config = validateConfig({
      ...config,
      isMobile: window.innerWidth <= 768
    })

    this.resize();
    this.init();
    this.animate();
    window.addEventListener('resize', this.resizeHandler);
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  init() {
    this.particles = []
    
    // 根据配置和屏幕尺寸动态调整粒子数量
    const baseCount = Math.floor((this.canvas.width * this.canvas.height) / 20000)
    const particleCount = Math.min(Math.max(this.config.particleCount || baseCount, 20), 150)
    
    // 颜色处理
    const isColorArray = Array.isArray(this.config.particleColor);
    
    for (let i = 0; i < particleCount; i++) {
      // 随机颜色选择
      const color = isColorArray
        ? (this.config.particleColor as string[])[Math.floor(Math.random() * (this.config.particleColor as string[]).length)]
        : this.config.particleColor;
      
      // 根据效果类型设置不同属性
      let vx, vy, size, opacity;
      
      switch(this.config.effectType) {
        case 'stars':
          vx = (Math.random() - 0.5) * this.config.particleSpeed * 0.5;
          vy = (Math.random() - 0.5) * this.config.particleSpeed * 0.5;
          size = Math.random() * (this.config.particleSize[1] - this.config.particleSize[0]) + this.config.particleSize[0];
          opacity = Math.random() * 0.8 + 0.2;
          break;
        case 'network':
          vx = (Math.random() - 0.5) * this.config.particleSpeed * 0.3;
          vy = (Math.random() - 0.5) * this.config.particleSpeed * 0.3;
          size = Math.random() * (this.config.particleSize[1] - this.config.particleSize[0]) + this.config.particleSize[0];
          opacity = Math.random() * 0.5 + 0.1;
          break;
        default:
          vx = (Math.random() - 0.5) * this.config.particleSpeed;
          vy = (Math.random() - 0.5) * this.config.particleSpeed;
          size = Math.random() * (this.config.particleSize[1] - this.config.particleSize[0]) + this.config.particleSize[0];
          opacity = Math.random() * 0.4 + 0.1;
      }
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx,
        vy,
        size,
        opacity,
        color
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 更新和绘制粒子
    this.particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // 边界检测
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1
      
      // 绘制粒子
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color 
        ? `${particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba')}`
        : `rgba(255, 255, 255, ${particle.opacity})`
      this.ctx.fill()
      this.ctx.restore()
    })
    
    // 绘制连线
    this.drawConnections()
    
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  drawConnections() {
    if (this.config.effectType === 'stars') return; // 星星效果不绘制连线
    
    const maxDistance = this.config.connectionDistance || 100
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < maxDistance) {
          const opacity = (maxDistance - distance) / maxDistance * 0.2
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.strokeStyle = this.config.connectionColor.includes('rgba')
            ? this.config.connectionColor.replace(/([0-9.]+\))$/, `${opacity})`)
            : `rgba(255, 255, 255, ${opacity})`
          this.ctx.lineWidth = this.config.effectType === 'network' ? 0.3 : 0.5
          this.ctx.stroke()
        }
      }
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    window.removeEventListener('resize', this.resizeHandler)
  }
}

// 粒子配置
const particleConfig = reactive<Partial<ParticleConfig>>({
  effectType: 'default',
  enabled: import.meta.env.VITE_ENABLE_PARTICLES === 'true',
  particleCount: parseInt(import.meta.env.VITE_PARTICLES_COUNT || '60', 10),
  particleColor: '#ffffff',
  particleSpeed: 0.5
})

let particleSystem: ParticleSystem | null = null

onBeforeUnmount(() => {
  if (particleSystem) {
    particleSystem.destroy()
    particleSystem = null
  }
})

onMounted(() => {
  if (canvasRef.value && particleConfig.enabled) {
    try {
      particleSystem = new ParticleSystem(canvasRef.value, particleConfig)
    } catch (error) {
      console.error('Failed to initialize particle system:', error)
    }
  }
})

// 防抖函数
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 监听配置变化（使用防抖）
const updateParticleSystem = debounce((newConfig: Partial<ParticleConfig>) => {
  if (canvasRef.value) {
    if (particleSystem) {
      particleSystem.destroy()
      particleSystem = null
    }
    
    if (newConfig.enabled) {
      try {
        particleSystem = new ParticleSystem(canvasRef.value, {
          ...particleConfig,
          isMobile: window.innerWidth <= 768
        })
      } catch (error) {
        console.error('Failed to create particle system:', error)
      }
    }
  }
}, 200)  // 200ms 防抖延迟

watch(
  () => [particleConfig.enabled, particleConfig.effectType],
  ([enabled, effectType]) => {
    updateParticleSystem({ ...particleConfig, enabled, effectType })
  }
)

// 监听窗口大小变化，优化移动端性能
const handleResize = debounce(() => {
  const isMobile = window.innerWidth <= 768
  if (isMobile !== particleConfig.isMobile) {
    particleConfig.isMobile = isMobile
    updateParticleSystem(particleConfig)
  }
}, 200)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 提供配置控制接口（带验证）
defineExpose({
  setConfig: (config: Partial<ParticleConfig>) => {
    const validatedConfig = validateConfig({ ...particleConfig, ...config })
    Object.assign(particleConfig, validatedConfig)
  },
  toggle: (enabled: boolean) => {
    particleConfig.enabled = enabled
  },
  getConfig: () => ({ ...particleConfig })  // 提供只读配置访问
})

onBeforeUnmount(() => {
  if (particleSystem) {
    particleSystem.destroy()
  }
})
</script>

<style lang="scss" scoped>
.particles-bg {
  @include particles-container;
  @include hardware-acceleration;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
}

.particles-canvas {
  width: 100%;
  height: 100%;
  background: transparent;
  @include will-change(transform);
}
</style>

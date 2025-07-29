/**
 * 滚动动画组合式函数
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 动画配置接口
export interface ScrollAnimationOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  duration?: number
  easing?: string
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'custom'
  customAnimation?: {
    from: Record<string, string | number>
    to: Record<string, string | number>
  }
}

// 默认配置
const DEFAULT_OPTIONS: Required<Omit<ScrollAnimationOptions, 'customAnimation'>> = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  triggerOnce: true,
  delay: 0,
  duration: 600,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  animationType: 'fadeIn'
}

// 预定义动画样式
const ANIMATION_STYLES = {
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' }
  },
  slideUp: {
    from: { opacity: '0', transform: 'translateY(30px)' },
    to: { opacity: '1', transform: 'translateY(0)' }
  },
  slideDown: {
    from: { opacity: '0', transform: 'translateY(-30px)' },
    to: { opacity: '1', transform: 'translateY(0)' }
  },
  slideLeft: {
    from: { opacity: '0', transform: 'translateX(30px)' },
    to: { opacity: '1', transform: 'translateX(0)' }
  },
  slideRight: {
    from: { opacity: '0', transform: 'translateX(-30px)' },
    to: { opacity: '1', transform: 'translateX(0)' }
  },
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.8)' },
    to: { opacity: '1', transform: 'scale(1)' }
  },
  rotateIn: {
    from: { opacity: '0', transform: 'rotate(-10deg) scale(0.8)' },
    to: { opacity: '1', transform: 'rotate(0deg) scale(1)' }
  }
}

// 单个元素滚动动画
export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const hasAnimated = ref(false)
  
  let observer: IntersectionObserver | null = null
  
  const config = { ...DEFAULT_OPTIONS, ...options }
  
  // 应用动画样式
  const applyAnimation = (element: HTMLElement, visible: boolean) => {
    const animationStyle = config.animationType === 'custom' && options.customAnimation
      ? options.customAnimation
      : ANIMATION_STYLES[config.animationType]
    
    const styles = visible ? animationStyle.to : animationStyle.from
    
    // 设置过渡属性
    element.style.transition = `all ${config.duration}ms ${config.easing}`
    
    // 应用延迟
    if (visible && config.delay > 0) {
      element.style.transitionDelay = `${config.delay}ms`
    }
    
    // 应用样式
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, String(value))
    })
  }
  
  // 初始化观察器
  const initObserver = () => {
    if (!elementRef.value || !window.IntersectionObserver) return
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting
          
          if (isIntersecting && (!config.triggerOnce || !hasAnimated.value)) {
            isVisible.value = true
            hasAnimated.value = true
            applyAnimation(entry.target as HTMLElement, true)
          } else if (!config.triggerOnce && !isIntersecting) {
            isVisible.value = false
            applyAnimation(entry.target as HTMLElement, false)
          }
        })
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin
      }
    )
    
    observer.observe(elementRef.value)
  }
  
  // 手动触发动画
  const triggerAnimation = (visible = true) => {
    if (elementRef.value) {
      isVisible.value = visible
      applyAnimation(elementRef.value, visible)
      if (visible) hasAnimated.value = true
    }
  }
  
  // 重置动画
  const resetAnimation = () => {
    hasAnimated.value = false
    isVisible.value = false
    if (elementRef.value) {
      applyAnimation(elementRef.value, false)
    }
  }
  
  onMounted(async () => {
    await nextTick()
    if (elementRef.value) {
      // 设置初始状态
      applyAnimation(elementRef.value, false)
      // 初始化观察器
      initObserver()
    }
  })
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
  
  return {
    elementRef,
    isVisible,
    hasAnimated,
    triggerAnimation,
    resetAnimation
  }
}

// 多个元素滚动动画（交错动画）
export const useStaggeredScrollAnimation = (
  count: number,
  options: ScrollAnimationOptions & { staggerDelay?: number } = {}
) => {
  const elementsRef = ref<HTMLElement[]>([])
  const visibleElements = ref<boolean[]>(new Array(count).fill(false))
  const hasAnimatedElements = ref<boolean[]>(new Array(count).fill(false))
  
  let observers: IntersectionObserver[] = []
  
  const config = { 
    ...DEFAULT_OPTIONS, 
    ...options,
    staggerDelay: options.staggerDelay || 100
  }
  
  // 应用动画样式
  const applyAnimation = (element: HTMLElement, visible: boolean, index: number) => {
    const animationStyle = config.animationType === 'custom' && options.customAnimation
      ? options.customAnimation
      : ANIMATION_STYLES[config.animationType]
    
    const styles = visible ? animationStyle.to : animationStyle.from
    
    // 计算交错延迟
    const totalDelay = config.delay + (visible ? index * config.staggerDelay : 0)
    
    // 设置过渡属性
    element.style.transition = `all ${config.duration}ms ${config.easing}`
    element.style.transitionDelay = `${totalDelay}ms`
    
    // 应用样式
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, String(value))
    })
  }
  
  // 初始化观察器
  const initObservers = () => {
    elementsRef.value.forEach((element, index) => {
      if (!element) return
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isIntersecting = entry.isIntersecting
            
            if (isIntersecting && (!config.triggerOnce || !hasAnimatedElements.value[index])) {
              visibleElements.value[index] = true
              hasAnimatedElements.value[index] = true
              applyAnimation(entry.target as HTMLElement, true, index)
            } else if (!config.triggerOnce && !isIntersecting) {
              visibleElements.value[index] = false
              applyAnimation(entry.target as HTMLElement, false, index)
            }
          })
        },
        {
          threshold: config.threshold,
          rootMargin: config.rootMargin
        }
      )
      
      observer.observe(element)
      observers.push(observer)
    })
  }
  
  // 设置元素引用
  const setElementRef = (index: number) => (el: HTMLElement | null) => {
    if (el) {
      elementsRef.value[index] = el
    }
  }
  
  // 手动触发所有动画
  const triggerAllAnimations = (visible = true) => {
    elementsRef.value.forEach((element, index) => {
      if (element) {
        visibleElements.value[index] = visible
        applyAnimation(element, visible, index)
        if (visible) hasAnimatedElements.value[index] = true
      }
    })
  }
  
  // 重置所有动画
  const resetAllAnimations = () => {
    hasAnimatedElements.value.fill(false)
    visibleElements.value.fill(false)
    elementsRef.value.forEach((element, index) => {
      if (element) {
        applyAnimation(element, false, index)
      }
    })
  }
  
  onMounted(async () => {
    await nextTick()
    // 设置初始状态
    elementsRef.value.forEach((element, index) => {
      if (element) {
        applyAnimation(element, false, index)
      }
    })
    // 初始化观察器
    initObservers()
  })
  
  onUnmounted(() => {
    observers.forEach(observer => observer.disconnect())
    observers = []
  })
  
  return {
    elementsRef,
    visibleElements,
    hasAnimatedElements,
    setElementRef,
    triggerAllAnimations,
    resetAllAnimations
  }
}

// 滚动进度动画
export const useScrollProgress = (options: {
  target?: HTMLElement | Window
  onProgress?: (progress: number) => void
} = {}) => {
  const progress = ref(0)
  
  const updateProgress = () => {
    const target = options.target || window
    let scrollTop: number
    let scrollHeight: number
    let clientHeight: number
    
    if (target === window) {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop
      scrollHeight = document.documentElement.scrollHeight
      clientHeight = window.innerHeight
    } else {
      const element = target as HTMLElement
      scrollTop = element.scrollTop
      scrollHeight = element.scrollHeight
      clientHeight = element.clientHeight
    }
    
    const maxScroll = scrollHeight - clientHeight
    const currentProgress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
    
    progress.value = currentProgress
    options.onProgress?.(currentProgress)
  }
  
  onMounted(() => {
    const target = options.target || window
    target.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress() // 初始计算
  })
  
  onUnmounted(() => {
    const target = options.target || window
    target.removeEventListener('scroll', updateProgress)
  })
  
  return {
    progress
  }
}
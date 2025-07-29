/**
 * 滚动动画指令
 */

import type { Directive, DirectiveBinding } from 'vue'

interface ScrollAnimationOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  duration?: number
  easing?: string
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn'
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

// 默认配置
const DEFAULT_OPTIONS: Required<ScrollAnimationOptions> = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  triggerOnce: true,
  delay: 0,
  duration: 600,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  animationType: 'fadeIn'
}

// 存储元素的观察器和状态
const elementMap = new WeakMap<HTMLElement, {
  observer: IntersectionObserver
  hasAnimated: boolean
  options: Required<ScrollAnimationOptions>
}>()

// 应用动画样式
const applyAnimation = (
  element: HTMLElement, 
  visible: boolean, 
  options: Required<ScrollAnimationOptions>
) => {
  const animationStyle = ANIMATION_STYLES[options.animationType]
  const styles = visible ? animationStyle.to : animationStyle.from
  
  // 设置过渡属性
  element.style.transition = `all ${options.duration}ms ${options.easing}`
  
  // 应用延迟
  if (visible && options.delay > 0) {
    element.style.transitionDelay = `${options.delay}ms`
  } else {
    element.style.transitionDelay = '0ms'
  }
  
  // 应用样式
  Object.entries(styles).forEach(([property, value]) => {
    element.style.setProperty(property, String(value))
  })
}

// 创建观察器
const createObserver = (element: HTMLElement, options: Required<ScrollAnimationOptions>) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const elementData = elementMap.get(entry.target as HTMLElement)
        if (!elementData) return
        
        const isIntersecting = entry.isIntersecting
        
        if (isIntersecting && (!options.triggerOnce || !elementData.hasAnimated)) {
          elementData.hasAnimated = true
          applyAnimation(entry.target as HTMLElement, true, options)
        } else if (!options.triggerOnce && !isIntersecting) {
          applyAnimation(entry.target as HTMLElement, false, options)
        }
      })
    },
    {
      threshold: options.threshold,
      rootMargin: options.rootMargin
    }
  )
  
  return observer
}

// 解析指令值
const parseDirectiveValue = (value: any): Required<ScrollAnimationOptions> => {
  if (typeof value === 'string') {
    return {
      ...DEFAULT_OPTIONS,
      animationType: value as ScrollAnimationOptions['animationType'] || 'fadeIn'
    }
  }
  
  if (typeof value === 'object' && value !== null) {
    return { ...DEFAULT_OPTIONS, ...value }
  }
  
  return DEFAULT_OPTIONS
}

// 滚动动画指令
export const vScrollAnimation: Directive<HTMLElement, ScrollAnimationOptions | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 检查浏览器支持
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver is not supported, scroll animation disabled')
      return
    }
    
    const options = parseDirectiveValue(binding.value)
    
    // 设置初始状态
    applyAnimation(el, false, options)
    
    // 创建观察器
    const observer = createObserver(el, options)
    
    // 存储元素数据
    elementMap.set(el, {
      observer,
      hasAnimated: false,
      options
    })
    
    // 开始观察
    observer.observe(el)
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const elementData = elementMap.get(el)
    if (!elementData) return
    
    const newOptions = parseDirectiveValue(binding.value)
    
    // 如果配置发生变化，重新创建观察器
    if (JSON.stringify(elementData.options) !== JSON.stringify(newOptions)) {
      // 断开旧观察器
      elementData.observer.disconnect()
      
      // 创建新观察器
      const newObserver = createObserver(el, newOptions)
      
      // 更新元素数据
      elementMap.set(el, {
        observer: newObserver,
        hasAnimated: elementData.hasAnimated,
        options: newOptions
      })
      
      // 重新设置初始状态
      if (!elementData.hasAnimated) {
        applyAnimation(el, false, newOptions)
      }
      
      // 开始观察
      newObserver.observe(el)
    }
  },
  
  unmounted(el: HTMLElement) {
    const elementData = elementMap.get(el)
    if (elementData) {
      elementData.observer.disconnect()
      elementMap.delete(el)
    }
  }
}

// 批量滚动动画指令（用于列表项）
export const vScrollStagger: Directive<HTMLElement, ScrollAnimationOptions & { staggerDelay?: number }> = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!window.IntersectionObserver) return
    
    const options = { ...DEFAULT_OPTIONS, staggerDelay: 100, ...binding.value }
    const children = Array.from(el.children) as HTMLElement[]
    
    children.forEach((child, index) => {
      // 设置初始状态
      applyAnimation(child, false, options)
      
      // 创建观察器
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = options.delay + index * options.staggerDelay
              const childOptions = { ...options, delay }
              applyAnimation(entry.target as HTMLElement, true, childOptions)
            }
          })
        },
        {
          threshold: options.threshold,
          rootMargin: options.rootMargin
        }
      )
      
      observer.observe(child)
      
      // 存储观察器
      elementMap.set(child, {
        observer,
        hasAnimated: false,
        options
      })
    })
  },
  
  unmounted(el: HTMLElement) {
    const children = Array.from(el.children) as HTMLElement[]
    children.forEach(child => {
      const elementData = elementMap.get(child)
      if (elementData) {
        elementData.observer.disconnect()
        elementMap.delete(child)
      }
    })
  }
}

// 导出指令注册函数
export const registerScrollAnimationDirectives = (app: any) => {
  app.directive('scroll-animation', vScrollAnimation)
  app.directive('scroll-stagger', vScrollStagger)
}
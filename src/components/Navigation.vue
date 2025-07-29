<template>
  <nav class="navigation" :class="{ 'navigation--mobile-open': isMobileMenuOpen }">
    <!-- Logo/Brand -->
    <div class="navigation__brand">
      <router-link to="/" class="navigation__logo" @click="closeMobileMenu">
        <span class="navigation__logo-text">{{ brandName }}</span>
      </router-link>
    </div>

    <!-- Desktop Navigation -->
    <div class="navigation__desktop">
      <ul class="navigation__menu">
        <li 
          v-for="item in navigationItems" 
          :key="item.name"
          class="navigation__item"
        >
          <router-link 
            :to="item.path"
            class="navigation__link"
            :class="{ 'navigation__link--active': isActiveRoute(item.path) }"
            @click="handleNavClick(item)"
          >
            <i v-if="item.icon" :class="item.icon" class="navigation__icon"></i>
            <span class="navigation__text">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Mobile Menu Toggle -->
    <button 
      class="navigation__mobile-toggle"
      :class="{ 'navigation__mobile-toggle--active': isMobileMenuOpen }"
      @click="toggleMobileMenu"
      :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
      :aria-expanded="isMobileMenuOpen"
    >
      <span class="navigation__hamburger-line"></span>
      <span class="navigation__hamburger-line"></span>
      <span class="navigation__hamburger-line"></span>
    </button>

    <!-- Mobile Navigation -->
    <div 
      class="navigation__mobile"
      :class="{ 'navigation__mobile--open': isMobileMenuOpen }"
    >
      <ul class="navigation__mobile-menu">
        <li 
          v-for="item in navigationItems" 
          :key="`mobile-${item.name}`"
          class="navigation__mobile-item"
        >
          <router-link 
            :to="item.path"
            class="navigation__mobile-link"
            :class="{ 'navigation__mobile-link--active': isActiveRoute(item.path) }"
            @click="handleMobileNavClick(item)"
          >
            <i v-if="item.icon" :class="item.icon" class="navigation__mobile-icon"></i>
            <span class="navigation__mobile-text">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMobileMenuOpen"
      class="navigation__overlay"
      @click="closeMobileMenu"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AUTHOR_CONFIG } from '@/utils'

// 导航项接口
interface NavigationItem {
  name: string
  path: string
  label: string
  icon?: string
  anchor?: string
  external?: boolean
}

// Props
interface Props {
  brandName?: string
  items?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  brandName: AUTHOR_CONFIG.name,
  items: () => [
    { name: 'home', path: '/', label: '首页' },
    { name: 'about', path: '/about', label: '关于我' },
    { name: 'projects', path: '/projects', label: '项目' },
    { name: 'blog', path: '/blog', label: '博客' },
    { name: 'contact', path: '/contact', label: '联系' }
  ]
})

// 响应式数据
const isMobileMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()

// 计算属性
const navigationItems = computed(() => props.items)

// 方法
const isActiveRoute = (path: string): boolean => {
  return route.path === path
}

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  // 防止背景滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleNavClick = (item: NavigationItem): void => {
  if (item.anchor) {
    // 处理锚点跳转
    const element = document.querySelector(item.anchor)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  if (item.external) {
    // 处理外部链接
    window.open(item.path, '_blank')
  }
}

const handleMobileNavClick = (item: NavigationItem): void => {
  closeMobileMenu()
  handleNavClick(item)
}

// 监听窗口大小变化，自动关闭移动菜单
const handleResize = (): void => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// 监听 ESC 键关闭移动菜单
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // 清理样式
})

// 监听路由变化，自动关闭移动菜单
router.afterEach(() => {
  closeMobileMenu()
})
</script>

<style lang="scss" scoped>
.navigation {
  @include flex-center;
  width: 100%;
  height: 60px;
  padding: 0 spacing(4);
  background: color(bg-secondary);
  position: sticky;
  top: 0;
  z-index: z-index(sticky);
  border-bottom: 1px solid color(border-primary);
  
  @include respond-to(md) {
    padding: 0 spacing(8);
    justify-content: center;
  }
  
  // Brand/Logo
  &__brand {
    flex-shrink: 0;
    position: absolute;
    left: spacing(4);
    
    @include respond-to(md) {
      display: none; // 在桌面端隐藏品牌logo，让导航居中
    }
  }
  
  &__logo {
    @include nav-link;
    font-size: font-size(xl);
    font-weight: font-weight(bold);
    text-decoration: none;
    
    &:hover {
      color: color(primary);
    }
  }
  
  &__logo-text {
    background: linear-gradient(135deg, color(primary), color(primary-light));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  // Desktop Navigation
  &__desktop {
    display: none;
    
    @include respond-to(md) {
      display: block;
    }
  }
  
  &__menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: spacing(6);
  }
  
  &__item {
    position: relative;
  }
  
  &__link {
    @include nav-link;
    @include flex-center;
    gap: spacing(2);
    padding: spacing(2) spacing(3);
    border-radius: border-radius(md);
    transition: all transition(base);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      width: 0;
      height: 2px;
      background: color(primary);
      transition: all transition(base);
      transform: translateX(-50%);
    }
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
      color: color(primary);
      
      &::after {
        width: 80%;
      }
    }
    
    &--active {
      color: color(primary);
      
      &::after {
        width: 100%;
      }
    }
  }
  
  &__icon {
    font-size: font-size(base);
  }
  
  &__text {
    font-size: font-size(base);
    font-weight: font-weight(medium);
  }
  
  // Mobile Toggle Button
  &__mobile-toggle {
    @include button-reset;
    @include flex-center;
    flex-direction: column;
    width: 40px;
    height: 40px;
    gap: 4px;
    border-radius: border-radius(md);
    transition: all transition(base);
    position: absolute;
    right: spacing(4);
    
    @include respond-to(md) {
      display: none;
    }
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
    }
    
    &--active {
      .navigation__hamburger-line {
        &:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        &:nth-child(2) {
          opacity: 0;
        }
        
        &:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }
      }
    }
  }
  
  &__hamburger-line {
    width: 20px;
    height: 2px;
    background: color(text-primary);
    border-radius: border-radius(full);
    transition: all transition(base);
  }
  
  // Mobile Navigation
  &__mobile {
    position: fixed;
    top: 61px;
    right: -100%;
    width: 280px;
    height: calc(100vh - 61px);
    background: color(bg-card);
    border-left: 1px solid color(border-primary);
    transition: right transition(base);
    overflow-y: auto;
    @include custom-scrollbar;
    
    &--open {
      right: 0;
    }
  }
  
  &__mobile-menu {
    list-style: none;
    margin: 0;
    padding: spacing(4) 0;
  }
  
  &__mobile-item {
    border-bottom: 1px solid color(border-light);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  &__mobile-link {
    @include nav-link;
    @include flex-center;
    justify-content: flex-start;
    gap: spacing(3);
    padding: spacing(4) spacing(6);
    transition: all transition(base);
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
      color: color(primary);
    }
    
    &--active {
      background: rgba(64, 158, 255, 0.15);
      color: color(primary);
      border-right: 3px solid color(primary);
    }
  }
  
  &__mobile-icon {
    font-size: font-size(lg);
    width: 20px;
    text-align: center;
  }
  
  &__mobile-text {
    font-size: font-size(base);
    font-weight: font-weight(medium);
  }
  
  // Overlay
  &__overlay {
    position: fixed;
    top: 61px;
    left: 0;
    width: 100%;
    height: calc(100vh - 61px);
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
    @include backdrop-blur(2px);
  }
  
  // 动画
  &__mobile-item {
    opacity: 0;
    transform: translateX(20px);
    animation: slideInRight 0.3s ease-out forwards;
    
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
  }
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 移动端菜单打开时的样式
.navigation--mobile-open {
  .navigation__mobile-item {
    animation: slideInRight 0.3s ease-out forwards;
  }
}

// 高对比度支持
@media (prefers-contrast: high) {
  .navigation {
    border-bottom-width: 2px;
    
    &__link,
    &__mobile-link {
      border: 1px solid transparent;
      
      &:hover,
      &--active {
        border-color: currentColor;
      }
    }
  }
}

// 减少动画支持
@media (prefers-reduced-motion: reduce) {
  .navigation {
    &__link::after,
    &__mobile,
    &__hamburger-line,
    &__mobile-link {
      transition: none;
    }
    
    &__mobile-item {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
}
</style>
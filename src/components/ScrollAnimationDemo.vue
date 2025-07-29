<template>
  <div class="scroll-demo" v-if="isDev">
    <div class="demo-header">
      <h2>滚动动画演示</h2>
      <p>向下滚动查看各种动画效果</p>
    </div>
    
    <!-- 基础动画演示 -->
    <div class="demo-section">
      <h3>基础动画</h3>
      <div class="demo-grid">
        <div 
          class="demo-card"
          v-scroll-animation="'fadeIn'"
        >
          <h4>淡入动画</h4>
          <p>fadeIn</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'slideUp'"
        >
          <h4>上滑动画</h4>
          <p>slideUp</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'slideDown'"
        >
          <h4>下滑动画</h4>
          <p>slideDown</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'slideLeft'"
        >
          <h4>左滑动画</h4>
          <p>slideLeft</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'slideRight'"
        >
          <h4>右滑动画</h4>
          <p>slideRight</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'scaleIn'"
        >
          <h4>缩放动画</h4>
          <p>scaleIn</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="'rotateIn'"
        >
          <h4>旋转动画</h4>
          <p>rotateIn</p>
        </div>
      </div>
    </div>
    
    <!-- 交错动画演示 -->
    <div class="demo-section">
      <h3>交错动画</h3>
      <div 
        class="demo-stagger"
        v-scroll-stagger="{ 
          animationType: 'slideUp', 
          staggerDelay: 100,
          threshold: 0.2 
        }"
      >
        <div class="demo-item" v-for="i in 6" :key="i">
          <div class="demo-number">{{ i }}</div>
          <p>交错动画项目 {{ i }}</p>
        </div>
      </div>
    </div>
    
    <!-- 自定义配置演示 -->
    <div class="demo-section">
      <h3>自定义配置</h3>
      <div class="demo-grid">
        <div 
          class="demo-card"
          v-scroll-animation="{ 
            animationType: 'slideUp', 
            delay: 500, 
            duration: 1000,
            threshold: 0.5 
          }"
        >
          <h4>延迟动画</h4>
          <p>delay: 500ms</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="{ 
            animationType: 'scaleIn', 
            duration: 2000,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
          }"
        >
          <h4>弹性动画</h4>
          <p>bounce easing</p>
        </div>
        
        <div 
          class="demo-card"
          v-scroll-animation="{ 
            animationType: 'fadeIn', 
            triggerOnce: false 
          }"
        >
          <h4>重复触发</h4>
          <p>triggerOnce: false</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDevelopment } from '@/utils/config'

const isDev = isDevelopment()
</script>

<style lang="scss" scoped>
.scroll-demo {
  padding: spacing(8) spacing(4);
  max-width: 1200px;
  margin: 0 auto;
  background: color(bg-primary);
}

.demo-header {
  text-align: center;
  margin-bottom: spacing(12);
  
  h2 {
    font-size: font-size(3xl);
    color: color(text-primary);
    margin-bottom: spacing(4);
  }
  
  p {
    font-size: font-size(lg);
    color: color(text-secondary);
  }
}

.demo-section {
  margin-bottom: spacing(16);
  
  h3 {
    font-size: font-size(2xl);
    color: color(primary);
    margin-bottom: spacing(8);
    text-align: center;
  }
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: spacing(6);
  margin-bottom: spacing(8);
}

.demo-card {
  @include card-style;
  padding: spacing(6);
  text-align: center;
  
  h4 {
    font-size: font-size(lg);
    color: color(text-primary);
    margin-bottom: spacing(2);
  }
  
  p {
    color: color(text-secondary);
    font-size: font-size(sm);
  }
}

.demo-stagger {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: spacing(4);
}

.demo-item {
  @include card-style;
  padding: spacing(4);
  text-align: center;
  
  .demo-number {
    width: 40px;
    height: 40px;
    background: color(primary);
    color: color(text-primary);
    border-radius: border-radius(full);
    @include flex-center;
    font-weight: font-weight(bold);
    margin: 0 auto spacing(3) auto;
  }
  
  p {
    color: color(text-secondary);
    font-size: font-size(sm);
    margin: 0;
  }
}

// 响应式设计
@include respond-below(md) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-stagger {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include respond-below(sm) {
  .demo-stagger {
    grid-template-columns: 1fr;
  }
}
</style>
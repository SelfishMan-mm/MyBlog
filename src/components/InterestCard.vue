<template>
  <div 
    class="interest-card"
    :class="{ 'animate': isVisible }"
    :style="{ 'animation-delay': `${delay}s` }"
  >
    <div class="interest-icon-container">
      <div class="interest-icon">{{ interest.icon }}</div>
      <div class="interest-glow"></div>
    </div>
    
    <div class="interest-content">
      <h3 class="interest-title">{{ interest.title }}</h3>
      <p class="interest-subtitle">{{ interest.subtitle }}</p>
      <p class="interest-description" v-if="interest.description">
        {{ interest.description }}
      </p>
      
      <div class="interest-details" v-if="interest.details && interest.details.length">
        <div 
          v-for="detail in interest.details" 
          :key="detail"
          class="interest-detail"
        >
          {{ detail }}
        </div>
      </div>
      
      <div class="interest-tags" v-if="interest.tags && interest.tags.length">
        <span 
          v-for="tag in interest.tags" 
          :key="tag"
          class="interest-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Interest {
  icon: string
  title: string
  subtitle: string
  description?: string
  details?: string[]
  tags?: string[]
}

interface Props {
  interest: Interest
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0
})

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style lang="scss" scoped>
.interest-card {
  @include card-style;
  padding: spacing(6);
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &.animate {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: shadow(xl);
    
    .interest-icon-container {
      .interest-icon {
        transform: scale(1.1) rotate(5deg);
      }
      
      .interest-glow {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.interest-icon-container {
  position: relative;
  margin-bottom: spacing(4);
  display: inline-block;
}

.interest-icon {
  font-size: font-size(4xl);
  width: 80px;
  height: 80px;
  @include flex-center;
  background: rgba(64, 158, 255, 0.1);
  border: 2px solid rgba(64, 158, 255, 0.3);
  border-radius: border-radius(full);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  @include respond-to(md) {
    width: 100px;
    height: 100px;
    font-size: font-size(5xl);
  }
}

.interest-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.3), transparent 70%);
  border-radius: border-radius(full);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1;
  
  @include respond-to(md) {
    width: 140px;
    height: 140px;
  }
}

.interest-content {
  position: relative;
  z-index: 2;
}

.interest-title {
  font-size: font-size(xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  margin-bottom: spacing(2);
  
  @include respond-to(md) {
    font-size: font-size(2xl);
  }
}

.interest-subtitle {
  font-size: font-size(base);
  color: color(primary);
  font-weight: font-weight(medium);
  margin-bottom: spacing(3);
  
  @include respond-to(md) {
    font-size: font-size(lg);
  }
}

.interest-description {
  font-size: font-size(sm);
  color: color(text-secondary);
  line-height: 1.75;
  margin-bottom: spacing(4);
}

.interest-details {
  margin-bottom: spacing(4);
}

.interest-detail {
  font-size: font-size(sm);
  color: color(text-secondary);
  margin-bottom: spacing(1);
  padding: spacing(1) spacing(2);
  background: rgba(255, 255, 255, 0.05);
  border-radius: border-radius(base);
  display: inline-block;
  margin-right: spacing(2);
  margin-bottom: spacing(2);
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
  justify-content: center;
}

.interest-tag {
  display: inline-block;
  padding: spacing(1) spacing(2);
  background: rgba(64, 158, 255, 0.1);
  color: color(primary);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: border-radius(base);
  font-size: font-size(xs);
  font-weight: font-weight(medium);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(64, 158, 255, 0.2);
    transform: translateY(-1px);
  }
}
</style>
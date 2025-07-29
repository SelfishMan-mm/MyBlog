<template>
  <div class="education-timeline">
    <div class="timeline-container">
      <div 
        v-for="(item, index) in educationItems" 
        :key="index"
        class="timeline-item"
        :class="{ 'animate': isVisible }"
        :style="{ 'animation-delay': `${index * 0.2}s` }"
      >
        <div class="timeline-marker">
          <div class="timeline-dot"></div>
          <div class="timeline-line" v-if="index < educationItems.length - 1"></div>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-title">{{ item.school }}</h3>
            <span class="timeline-period">{{ item.period }}</span>
          </div>
          
          <div class="timeline-details">
            <p class="timeline-major" v-if="item.major">
              <strong>专业：</strong>{{ item.major }}
            </p>
            <p class="timeline-degree" v-if="item.degree">
              <strong>学历：</strong>{{ item.degree }}
            </p>
            <p class="timeline-description" v-if="item.description">
              {{ item.description }}
            </p>
            
            <div class="timeline-achievements" v-if="item.achievements && item.achievements.length">
              <h4>主要成就：</h4>
              <ul>
                <li v-for="achievement in item.achievements" :key="achievement">
                  {{ achievement }}
                </li>
              </ul>
            </div>
            
            <div class="timeline-courses" v-if="item.courses && item.courses.length">
              <h4>主要课程：</h4>
              <div class="courses-tags">
                <span 
                  v-for="course in item.courses" 
                  :key="course"
                  class="course-tag"
                >
                  {{ course }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface EducationItem {
  school: string
  period: string
  major?: string
  degree?: string
  description?: string
  achievements?: string[]
  courses?: string[]
}

interface Props {
  educationItems: EducationItem[]
}

defineProps<Props>()

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})
</script>

<style lang="scss" scoped>
.education-timeline {
  width: 100%;
}

.timeline-container {
  position: relative;
  padding-left: spacing(8);
  
  @include respond-to(md) {
    padding-left: spacing(12);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: spacing(8);
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    opacity: 1;
    transform: translateX(0);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -spacing(8);
  top: spacing(1);
  
  @include respond-to(md) {
    left: -spacing(12);
  }
}

.timeline-dot {
  width: 16px;
  height: 16px;
  background: color(primary);
  border: 3px solid color(bg-primary);
  border-radius: border-radius(full);
  position: relative;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: color(primary);
    border-radius: border-radius(full);
    animation: pulse 2s infinite;
  }
}

.timeline-line {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% + spacing(6));
  background: linear-gradient(to bottom, color(primary), rgba(64, 158, 255, 0.3));
  z-index: 1;
}

.timeline-content {
  background: color(bg-card);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  padding: spacing(6);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: spacing(3);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid color(border-primary);
  }
  
  &::after {
    content: '';
    position: absolute;
    left: -7px;
    top: spacing(3);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid color(bg-card);
  }
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: spacing(4);
  flex-wrap: wrap;
  gap: spacing(2);
}

.timeline-title {
  font-size: font-size(xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.timeline-period {
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  color: color(primary);
  background: rgba(64, 158, 255, 0.1);
  padding: spacing(1) spacing(3);
  border-radius: border-radius(base);
  white-space: nowrap;
}

.timeline-details {
  .timeline-major,
  .timeline-degree,
  .timeline-description {
    color: color(text-secondary);
    line-height: 1.75;
    margin-bottom: spacing(2);
    
    strong {
      color: color(text-primary);
    }
  }
  
  .timeline-description {
    font-style: italic;
    margin-bottom: spacing(4);
  }
}

.timeline-achievements,
.timeline-courses {
  margin-top: spacing(4);
  
  h4 {
    font-size: font-size(base);
    font-weight: font-weight(medium);
    color: color(text-primary);
    margin-bottom: spacing(2);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      color: color(text-secondary);
      line-height: 1.75;
      margin-bottom: spacing(1);
      position: relative;
      padding-left: spacing(4);
      
      &::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: color(primary);
        font-weight: font-weight(bold);
      }
    }
  }
}

.courses-tags {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.course-tag {
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

@keyframes pulse {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
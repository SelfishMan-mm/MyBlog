<template>
  <div 
    class="project-card"
    :class="{ 
      'project-card--featured': project.featured,
      'project-card--grid': layout === 'grid',
      'project-card--list': layout === 'list'
    }"
    @click="$emit('click', project)"
    tabindex="0"
  >
    <div class="project-image">
      <img 
        v-if="project.imageUrl" 
        :src="project.imageUrl" 
        :alt="project.name"
        class="project-img"
      />
      <div v-else class="project-placeholder">
        <i class="project-icon">{{ getProjectIcon(project.techStack[0]) }}</i>
      </div>
      
      <!-- 项目状态标签 -->
      <div v-if="project.status" class="project-status" :class="`status-${project.status}`">
        {{ getStatusText(project.status) }}
      </div>
      
      <!-- 特色项目标记 -->
      <div v-if="project.featured" class="featured-badge">
        <i class="badge-icon">⭐</i>
        精选
      </div>
    </div>
    
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-name">{{ project.name }}</h3>
        <div v-if="project.startDate" class="project-date">
          {{ formatDate(project.startDate) }}
        </div>
      </div>
      
      <p class="project-description">{{ project.description }}</p>
      
      <!-- 技术栈标签 -->
      <div class="project-tech">
        <span 
          v-for="tech in project.techStack" 
          :key="tech"
          class="tech-tag"
          :class="getTechTagClass(tech)"
        >
          {{ tech }}
        </span>
      </div>
      
      <!-- 项目链接 -->
      <div class="project-actions">
        <a 
          :href="project.githubUrl" 
          target="_blank" 
          class="project-link project-link--github"
          @click.stop
        >
          <i class="link-icon">🔗</i>
          GitHub
        </a>
        <a 
          v-if="project.demoUrl" 
          :href="project.demoUrl" 
          target="_blank" 
          class="project-link project-link--demo"
          @click.stop
        >
          <i class="link-icon">🚀</i>
          演示
        </a>
        <button 
          class="project-link project-link--details"
          @click.stop="$emit('showDetails', project)"
        >
          <i class="link-icon">📋</i>
          详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

export interface Project {
  id: string
  name: string
  description: string
  longDescription?: string
  techStack: string[]
  githubUrl: string
  demoUrl?: string
  imageUrl?: string
  screenshots?: string[]
  featured: boolean
  status?: 'completed' | 'in-progress' | 'planned'
  startDate?: Date
  endDate?: Date
}

interface Props {
  project: Project
  layout?: 'grid' | 'list'
}

interface Emits {
  (e: 'click', project: Project): void
  (e: 'showDetails', project: Project): void
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'grid'
})

defineEmits<Emits>()

// 获取项目图标
const getProjectIcon = (tech: string): string => {
  const iconMap: Record<string, string> = {
    'C++': '⚡',
    'Python': '🐍',
    'JavaScript': '🟨',
    'TypeScript': '🔷',
    'Vue': '💚',
    'React': '⚛️',
    'Node.js': '🟢',
    'Flask': '🌶️',
    'FastAPI': '⚡',
    'Web3': '🔗',
    'AI': '🤖',
    'Data': '📊',
    'default': '📁'
  }
  
  return iconMap[tech] || iconMap.default
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': '已完成',
    'in-progress': '进行中',
    'planned': '计划中'
  }
  return statusMap[status] || status
}

// 获取技术标签样式类
const getTechTagClass = (tech: string): string => {
  const techClassMap: Record<string, string> = {
    'C++': 'tech-cpp',
    'Python': 'tech-python',
    'JavaScript': 'tech-js',
    'TypeScript': 'tech-ts',
    'Vue': 'tech-vue',
    'React': 'tech-react',
    'Web3': 'tech-web3',
    'AI': 'tech-ai'
  }
  return techClassMap[tech] || 'tech-default'
}

// 格式化日期
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short'
  }).format(date)
}
</script>

<style lang="scss" scoped>
.project-card {
  @include card-style;
  overflow: hidden;
  transition: all transition(base);
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: shadow(xl);
  }
  
  &--featured {
    border: 2px solid rgba(64, 158, 255, 0.3);
    
    &:hover {
      border-color: rgba(64, 158, 255, 0.5);
      box-shadow: shadow(xl), 0 0 20px rgba(64, 158, 255, 0.2);
    }
  }
  
  &--list {
    display: flex;
    
    .project-image {
      width: 200px;
      height: 150px;
      flex-shrink: 0;
    }
    
    .project-content {
      flex: 1;
    }
  }
}

.project-image {
  height: 200px;
  background: color(bg-secondary);
  @include flex-center;
  border-bottom: 1px solid color(border-primary);
  position: relative;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform transition(base);
  
  .project-card:hover & {
    transform: scale(1.05);
  }
}

.project-placeholder {
  @include flex-center;
  width: 80px;
  height: 80px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: border-radius(full);
  
  .project-icon {
    font-size: font-size(3xl);
  }
}

.project-status {
  position: absolute;
  top: spacing(2);
  left: spacing(2);
  padding: spacing(1) spacing(2);
  border-radius: border-radius(base);
  font-size: font-size(xs);
  font-weight: font-weight(medium);
  
  &.status-completed {
    background: rgba(103, 194, 58, 0.2);
    color: color(success);
    border: 1px solid rgba(103, 194, 58, 0.3);
  }
  
  &.status-in-progress {
    background: rgba(230, 162, 60, 0.2);
    color: color(warning);
    border: 1px solid rgba(230, 162, 60, 0.3);
  }
  
  &.status-planned {
    background: rgba(144, 147, 153, 0.2);
    color: color(info);
    border: 1px solid rgba(144, 147, 153, 0.3);
  }
}

.featured-badge {
  position: absolute;
  top: spacing(2);
  right: spacing(2);
  background: rgba(64, 158, 255, 0.2);
  color: color(primary);
  border: 1px solid rgba(64, 158, 255, 0.3);
  padding: spacing(1) spacing(2);
  border-radius: border-radius(base);
  font-size: font-size(xs);
  font-weight: font-weight(medium);
  @include flex-center;
  gap: spacing(1);
  
  .badge-icon {
    font-size: font-size(xs);
  }
}

.project-content {
  padding: spacing(6);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: spacing(3);
  gap: spacing(3);
}

.project-name {
  font-size: font-size(xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  flex: 1;
}

.project-date {
  font-size: font-size(sm);
  color: color(text-muted);
  white-space: nowrap;
}

.project-description {
  color: color(text-secondary);
  line-height: map-get($line-heights, relaxed);
  margin-bottom: spacing(4);
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
  margin-bottom: spacing(6);
}

.tech-tag {
  @include tag-style(rgba(144, 147, 153, 0.1), color(info));
  font-size: font-size(xs);
  border: 1px solid rgba(144, 147, 153, 0.3);
  transition: all transition(base);
  
  &:hover {
    transform: translateY(-1px);
  }
  
  // 不同技术的颜色主题
  &.tech-cpp {
    background: rgba(0, 89, 156, 0.1);
    color: #0059C4;
    border-color: rgba(0, 89, 156, 0.3);
  }
  
  &.tech-python {
    background: rgba(55, 118, 171, 0.1);
    color: #3776AB;
    border-color: rgba(55, 118, 171, 0.3);
  }
  
  &.tech-js {
    background: rgba(240, 219, 79, 0.1);
    color: #F0DB4F;
    border-color: rgba(240, 219, 79, 0.3);
  }
  
  &.tech-ts {
    background: rgba(49, 120, 198, 0.1);
    color: #3178C6;
    border-color: rgba(49, 120, 198, 0.3);
  }
  
  &.tech-vue {
    background: rgba(79, 192, 141, 0.1);
    color: #4FC08D;
    border-color: rgba(79, 192, 141, 0.3);
  }
  
  &.tech-react {
    background: rgba(97, 218, 251, 0.1);
    color: #61DAFB;
    border-color: rgba(97, 218, 251, 0.3);
  }
  
  &.tech-web3 {
    background: rgba(245, 101, 101, 0.1);
    color: #F56565;
    border-color: rgba(245, 101, 101, 0.3);
  }
  
  &.tech-ai {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
    border-color: rgba(139, 92, 246, 0.3);
  }
}

.project-actions {
  display: flex;
  gap: spacing(3);
  flex-wrap: wrap;
}

.project-link {
  @include flex-center;
  gap: spacing(2);
  padding: spacing(2) spacing(4);
  border-radius: border-radius(md);
  text-decoration: none;
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  transition: all transition(base);
  border: none;
  cursor: pointer;
  
  .link-icon {
    font-size: font-size(base);
  }
  
  &--github {
    background: rgba(255, 255, 255, 0.1);
    color: color(text-primary);
    border: 1px solid color(border-primary);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
  }
  
  &--demo {
    background: color(primary);
    color: color(text-primary);
    
    &:hover {
      background: color(primary-dark);
      transform: translateY(-1px);
    }
  }
  
  &--details {
    background: rgba(103, 194, 58, 0.1);
    color: color(success);
    border: 1px solid rgba(103, 194, 58, 0.3);
    
    &:hover {
      background: rgba(103, 194, 58, 0.2);
      transform: translateY(-1px);
    }
  }
}

// 响应式优化
@include respond-below(md) {
  .project-card--list {
    flex-direction: column;
    
    .project-image {
      width: 100%;
      height: 200px;
    }
  }
  
  .project-actions {
    flex-direction: column;
    
    .project-link {
      justify-content: center;
    }
  }
}

// 卡片悬浮动画和交互效果
.project-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.3s ease;
  will-change: transform, box-shadow;
  
  &:hover, &:focus {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
  }

  &:focus-visible {
    outline: 2px solid color(primary);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
}
</style>
<template>
  <teleport to="body">
    <div 
      v-if="visible" 
      class="project-modal-overlay"
      @click="handleOverlayClick"
    >
      <div 
        class="project-modal"
        :class="{ 'project-modal--show': visible }"
        @click.stop
      >
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h2 class="modal-title">{{ project?.name }}</h2>
            <div v-if="project?.status" class="project-status" :class="`status-${project.status}`">
              {{ getStatusText(project.status) }}
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <i class="close-icon">✕</i>
          </button>
        </div>
        
        <!-- 模态框内容 -->
        <div class="modal-content">
          <!-- 项目图片/截图 -->
          <div v-if="project?.imageUrl || project?.screenshots?.length" class="project-gallery">
            <div class="main-image">
              <img 
                :src="currentImage" 
                :alt="project?.name"
                class="gallery-img"
              />
            </div>
            <div v-if="project?.screenshots?.length" class="image-thumbnails">
              <button
                v-for="(screenshot, index) in project.screenshots"
                :key="index"
                class="thumbnail"
                :class="{ 'thumbnail--active': currentImage === screenshot }"
                @click="currentImage = screenshot"
              >
                <img :src="screenshot" :alt="`${project?.name} 截图 ${index + 1}`" />
              </button>
            </div>
          </div>
          
          <!-- 项目信息 -->
          <div class="project-info">
            <!-- 基本信息 -->
            <div class="info-section">
              <h3 class="section-title">项目描述</h3>
              <p class="project-description">
                {{ project?.longDescription || project?.description }}
              </p>
            </div>
            
            <!-- 技术栈 -->
            <div class="info-section">
              <h3 class="section-title">技术栈</h3>
              <div class="tech-stack">
                <span 
                  v-for="tech in project?.techStack" 
                  :key="tech"
                  class="tech-tag"
                  :class="getTechTagClass(tech)"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <!-- 项目时间 -->
            <div v-if="project?.startDate" class="info-section">
              <h3 class="section-title">开发时间</h3>
              <div class="project-timeline">
                <span class="timeline-start">{{ formatDate(project.startDate) }}</span>
                <span class="timeline-separator">-</span>
                <span class="timeline-end">
                  {{ project.endDate ? formatDate(project.endDate) : '至今' }}
                </span>
              </div>
            </div>
            
            <!-- 项目特色 -->
            <div v-if="project?.featured" class="info-section">
              <h3 class="section-title">项目亮点</h3>
              <div class="project-highlights">
                <div class="highlight-item">
                  <i class="highlight-icon">⭐</i>
                  <span>精选项目</span>
                </div>
                <div class="highlight-item">
                  <i class="highlight-icon">🚀</i>
                  <span>技术创新</span>
                </div>
                <div class="highlight-item">
                  <i class="highlight-icon">💡</i>
                  <span>实用价值</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 模态框底部 -->
        <div class="modal-footer">
          <div class="project-actions">
            <a 
              v-if="project?.githubUrl"
              :href="project.githubUrl" 
              target="_blank" 
              class="action-button action-button--github"
            >
              <i class="button-icon">🔗</i>
              查看源码
            </a>
            <a 
              v-if="project?.demoUrl"
              :href="project.demoUrl" 
              target="_blank" 
              class="action-button action-button--demo"
            >
              <i class="button-icon">🚀</i>
              在线演示
            </a>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Project } from './ProjectCard.vue'

interface Props {
  visible: boolean
  project?: Project | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentImage = ref<string>('')

// 当项目变化时，设置默认图片
watch(() => props.project, (newProject) => {
  if (newProject) {
    currentImage.value = newProject.imageUrl || newProject.screenshots?.[0] || ''
  }
}, { immediate: true })

// 处理遮罩层点击
const handleOverlayClick = () => {
  emit('close')
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
    month: 'long'
  }).format(date)
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible) {
    emit('close')
  }
}

// 阻止背景滚动
const preventScroll = () => {
  if (props.visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => props.visible, preventScroll, { immediate: true })

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.project-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  @include flex-center;
  z-index: z-index(modal);
  @include backdrop-blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.project-modal {
  background: color(bg-card);
  border-radius: border-radius(2xl);
  box-shadow: shadow(2xl);
  border: 1px solid color(border-primary);
  max-width: 900px;
  max-height: 90vh;
  width: 90%;
  overflow: hidden;
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &--show {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.modal-header {
  @include flex-between;
  padding: spacing(6) spacing(8);
  border-bottom: 1px solid color(border-primary);
  background: color(bg-secondary);
}

.modal-title-section {
  @include flex-center;
  gap: spacing(3);
  flex: 1;
}

.modal-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  margin: 0;
}

.project-status {
  padding: spacing(1) spacing(3);
  border-radius: border-radius(base);
  font-size: font-size(sm);
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

.modal-close {
  @include button-reset;
  @include flex-center;
  width: 40px;
  height: 40px;
  border-radius: border-radius(full);
  background: rgba(255, 255, 255, 0.1);
  color: color(text-secondary);
  transition: all transition(base);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: color(text-primary);
    transform: scale(1.1);
  }
  
  .close-icon {
    font-size: font-size(lg);
  }
}

.modal-content {
  padding: spacing(8);
  max-height: 60vh;
  overflow-y: auto;
  @include custom-scrollbar;
}

.project-gallery {
  margin-bottom: spacing(8);
}

.main-image {
  margin-bottom: spacing(4);
  border-radius: border-radius(lg);
  overflow: hidden;
  background: color(bg-secondary);
  
  .gallery-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
}

.image-thumbnails {
  display: flex;
  gap: spacing(2);
  overflow-x: auto;
  padding: spacing(2) 0;
  @include custom-scrollbar;
}

.thumbnail {
  @include button-reset;
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: border-radius(md);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all transition(base);
  
  &--active {
    border-color: color(primary);
  }
  
  &:hover {
    border-color: color(primary-light);
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: spacing(6);
}

.info-section {
  .section-title {
    font-size: font-size(lg);
    font-weight: font-weight(semibold);
    color: color(text-primary);
    margin-bottom: spacing(3);
    @include flex-center;
    justify-content: flex-start;
    gap: spacing(2);
    
    &::before {
      content: '';
      width: 4px;
      height: 20px;
      background: color(primary);
      border-radius: border-radius(full);
    }
  }
}

.project-description {
  color: color(text-secondary);
  line-height: 1.75;
  font-size: font-size(base);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.tech-tag {
  @include tag-style(rgba(144, 147, 153, 0.1), color(info));
  font-size: font-size(sm);
  border: 1px solid rgba(144, 147, 153, 0.3);
  
  // 技术标签颜色（与 ProjectCard 保持一致）
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
  
  &.tech-vue {
    background: rgba(79, 192, 141, 0.1);
    color: #4FC08D;
    border-color: rgba(79, 192, 141, 0.3);
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

.project-timeline {
  @include flex-center;
  justify-content: flex-start;
  gap: spacing(3);
  font-size: font-size(base);
  color: color(text-secondary);
  
  .timeline-separator {
    color: color(text-muted);
  }
}

.project-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(3);
}

.highlight-item {
  @include flex-center;
  gap: spacing(2);
  padding: spacing(2) spacing(4);
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: border-radius(base);
  color: color(primary);
  font-size: font-size(sm);
  
  .highlight-icon {
    font-size: font-size(base);
  }
}

.modal-footer {
  padding: spacing(6) spacing(8);
  border-top: 1px solid color(border-primary);
  background: color(bg-secondary);
}

.project-actions {
  @include flex-center;
  justify-content: center;
  gap: spacing(4);
}

.action-button {
  @include flex-center;
  gap: spacing(2);
  padding: spacing(3) spacing(6);
  border-radius: border-radius(lg);
  text-decoration: none;
  font-size: font-size(base);
  font-weight: font-weight(medium);
  transition: all transition(base);
  
  .button-icon {
    font-size: font-size(lg);
  }
  
  &--github {
    background: rgba(255, 255, 255, 0.1);
    color: color(text-primary);
    border: 1px solid color(border-primary);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: shadow(md);
    }
  }
  
  &--demo {
    background: color(primary);
    color: color(text-primary);
    
    &:hover {
      background: color(primary-dark);
      transform: translateY(-2px);
      box-shadow: shadow(md);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 响应式优化
@include respond-below(md) {
  .project-modal {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: spacing(4) spacing(6);
    
    .modal-title {
      font-size: font-size(xl);
    }
  }
  
  .modal-content {
    padding: spacing(6);
  }
  
  .modal-footer {
    padding: spacing(4) spacing(6);
  }
  
  .project-actions {
    flex-direction: column;
    
    .action-button {
      width: 100%;
      justify-content: center;
    }
  }
  
  .main-image .gallery-img {
    height: 200px;
  }
}
</style>
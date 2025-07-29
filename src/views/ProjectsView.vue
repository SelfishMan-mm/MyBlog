<template>
  <div class="projects-container">
    <!-- 页面头部 -->
    <div 
      class="projects-header" 
      v-scroll-animation="{ animationType: 'fadeIn', delay: 0 }"
    >
      <h1 class="projects-title">我的项目</h1>
      <p class="projects-subtitle">展示一些我开发的代表性项目</p>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div 
      class="projects-controls" 
      v-scroll-animation="{ animationType: 'slideUp', delay: 200 }"
    >
      <!-- 搜索框 -->
      <div class="search-section">
        <div class="search-box">
          <i class="search-icon">🔍</i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索项目名称或技术栈..."
            class="search-input"
          />
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="search-clear"
          >
            ✕
          </button>
        </div>
      </div>
      
      <!-- 筛选器 -->
      <div class="filters-section">
        <!-- 状态筛选 -->
        <div class="filter-group">
          <label class="filter-label">状态：</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">全部</option>
            <option value="completed">已完成</option>
            <option value="in-progress">进行中</option>
            <option value="planned">计划中</option>
          </select>
        </div>
        
        <!-- 技术栈筛选 -->
        <div class="filter-group">
          <label class="filter-label">技术：</label>
          <select v-model="techFilter" class="filter-select">
            <option value="">全部技术</option>
            <option v-for="tech in allTechStacks" :key="tech" :value="tech">
              {{ tech }}
            </option>
          </select>
        </div>
        
        <!-- 布局切换 -->
        <div class="layout-toggle">
          <button 
            :class="{ 'active': layout === 'grid' }"
            @click="layout = 'grid'"
            class="layout-btn"
          >
            <i class="layout-icon">⊞</i>
          </button>
          <button 
            :class="{ 'active': layout === 'list' }"
            @click="layout = 'list'"
            class="layout-btn"
          >
            <i class="layout-icon">☰</i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 项目统计 -->
    <div 
      class="projects-stats" 
      v-scroll-animation="{ animationType: 'scaleIn', delay: 300 }"
    >
      <div class="stat-item">
        <span class="stat-number">{{ filteredProjects.length }}</span>
        <span class="stat-label">个项目</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ featuredCount }}</span>
        <span class="stat-label">精选项目</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ allTechStacks.length }}</span>
        <span class="stat-label">种技术</span>
      </div>
    </div>
    
    <!-- 项目列表 -->
    <div 
      class="projects-grid" 
      :class="{ 'projects-grid--list': layout === 'list' }"
      v-scroll-animation="{ animationType: 'slideUp', delay: 400 }"
    >
      <transition-group 
        name="project-fade" 
        tag="div" 
        class="projects-wrapper"
        v-scroll-stagger="{ 
          animationType: 'slideUp', 
          staggerDelay: 200,
          threshold: 0.1 
        }"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          :layout="layout"
          @click="handleProjectClick"
          @show-details="showProjectDetails"
        />
      </transition-group>
      
      <!-- 空状态 -->
      <div 
        v-if="filteredProjects.length === 0" 
        class="empty-state"
        v-scroll-animation="{ animationType: 'fadeIn', delay: 200 }"
      >
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">没有找到匹配的项目</h3>
        <p class="empty-description">
          尝试调整搜索条件或筛选器
        </p>
        <button @click="clearFilters" class="empty-action">
          清除筛选条件
        </button>
      </div>
    </div>
    
    <!-- 项目详情模态框 -->
    <ProjectModal
      :visible="modalVisible"
      :project="selectedProject"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProjectCard, { type Project } from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import { useSEO } from '@/composables/useSEO'

// SEO 优化
useSEO()

// 响应式数据
const isLoaded = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const techFilter = ref('')
const layout = ref<'grid' | 'list'>('grid')
const modalVisible = ref(false)
const selectedProject = ref<Project | null>(null)

// 项目数据
const projects = ref<Project[]>([
  {
    id: '1',
    name: 'cpp-chatroom',
    description: '基于 C++ 开发的多人聊天室系统，支持实时消息传输和用户管理功能。',
    longDescription: '这是一个完整的多人聊天室系统，采用 C++ 开发，支持多客户端同时连接。系统实现了用户注册登录、实时消息传输、私聊和群聊功能。使用了 Socket 编程实现网络通信，多线程技术处理并发连接，确保系统的稳定性和高性能。',
    techStack: ['C++', 'Socket编程', '多线程', 'Linux'],
    githubUrl: 'https://github.com/SelfishMan-mm/cpp-chatroom',
    featured: true,
    status: 'completed',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-15')
  },
  {
    id: '2',
    name: 'CryptoDash',
    description: '加密货币数据分析仪表板，提供实时价格监控和技术分析工具。',
    longDescription: '一个专业的加密货币数据分析平台，集成了多个交易所的实时数据，提供价格监控、技术指标分析、投资组合管理等功能。使用 Python Flask 作为后端，Web3 技术获取区块链数据，Chart.js 实现数据可视化。',
    techStack: ['Python', 'Flask', 'Web3', '数据分析', 'Chart.js'],
    githubUrl: 'https://github.com/SelfishMan-mm/CryptoDash',
    featured: true,
    status: 'completed',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-04-20')
  },
  {
    id: '3',
    name: '数据爬虫工具',
    description: '高效的网络数据爬取工具，支持多种网站和数据格式的自动化采集。',
    longDescription: '一个通用的网络数据爬取框架，支持多种网站的数据采集。集成了 Scrapy 框架的高性能爬取能力，BeautifulSoup 的灵活解析功能，以及 Selenium 的动态页面处理能力。数据存储支持 MongoDB，具有良好的扩展性。',
    techStack: ['Python', 'Scrapy', 'BeautifulSoup', 'Selenium', 'MongoDB'],
    githubUrl: 'https://github.com/SelfishMan-mm',
    featured: false,
    status: 'in-progress',
    startDate: new Date('2024-06-01')
  },
  {
    id: '4',
    name: 'AI-Agent 助手',
    description: '基于大语言模型的智能助手，支持自然语言交互和任务自动化。',
    longDescription: '一个智能的 AI 助手系统，基于大语言模型技术，支持自然语言理解和生成。使用 LangChain 框架构建智能对话流程，FastAPI 提供高性能的 API 服务，React 构建用户界面。具备任务自动化、知识问答、代码生成等多种功能。',
    techStack: ['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/SelfishMan-mm',
    featured: false,
    status: 'planned',
    startDate: new Date('2024-08-01')
  },
  {
    id: '5',
    name: '个人博客网站',
    description: '基于 Vue 3 的个人博客网站，展示技术文章和项目作品。',
    longDescription: '这是当前正在开发的个人博客网站，采用 Vue 3 + TypeScript + Vite 技术栈。网站具有黑白极简的科技风格，包含首页展示、关于我、项目展示、技术博客等模块。使用了粒子背景特效、响应式设计、Markdown 文章渲染等技术。',
    techStack: ['Vue 3', 'TypeScript', 'Vite', 'SCSS', 'Element Plus'],
    githubUrl: 'https://github.com/SelfishMan-mm',
    featured: true,
    status: 'in-progress',
    startDate: new Date('2024-12-01')
  }
])

// 计算属性
const allTechStacks = computed(() => {
  const techSet = new Set<string>()
  projects.value.forEach(project => {
    project.techStack.forEach(tech => techSet.add(tech))
  })
  return Array.from(techSet).sort()
})

const featuredCount = computed(() => {
  return projects.value.filter(project => project.featured).length
})

const filteredProjects = computed(() => {
  let filtered = projects.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.techStack.some(tech => tech.toLowerCase().includes(query))
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(project => project.status === statusFilter.value)
  }

  // 技术栈过滤
  if (techFilter.value) {
    filtered = filtered.filter(project => 
      project.techStack.includes(techFilter.value)
    )
  }

  return filtered
})

// 方法
const handleProjectClick = (project: Project) => {
  // 可以在这里添加项目点击的逻辑，比如跳转到详情页
  // 目前只是显示详情模态框，未来可以添加其他逻辑
}

const showProjectDetails = (project: Project) => {
  selectedProject.value = project
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedProject.value = null
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  techFilter.value = ''
}

// 生命周期
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 300)
})
</script>

<style lang="scss" scoped>
.projects-container {
  @include container(1200px);
  padding: spacing(8) spacing(4);
  min-height: 100vh;
  background: color(bg-primary);
}

// 页面头部
.projects-header {
  text-align: center;
  margin-bottom: spacing(8);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
}

.projects-title {
  font-size: font-size(4xl);
  font-weight: font-weight(bold);
  color: color(text-primary);
  margin-bottom: spacing(4);
  
  @include respond-to(md) {
    font-size: font-size(5xl);
  }
}

.projects-subtitle {
  font-size: font-size(lg);
  color: color(text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.75;
}

// 控制区域
.projects-controls {
  @include card-style;
  padding: spacing(6);
  margin-bottom: spacing(8);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-section {
  margin-bottom: spacing(6);
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: spacing(4);
  top: 50%;
  transform: translateY(-50%);
  color: color(text-muted);
  font-size: font-size(base);
}

.search-input {
  width: 100%;
  padding: spacing(3) spacing(12) spacing(3) spacing(12);
  background: color(bg-secondary);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  color: color(text-primary);
  font-size: font-size(base);
  transition: all transition(base);
  
  &:focus {
    outline: none;
    border-color: color(primary);
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  }
  
  &::placeholder {
    color: color(text-muted);
  }
}

.search-clear {
  @include button-reset;
  position: absolute;
  right: spacing(4);
  top: 50%;
  transform: translateY(-50%);
  color: color(text-muted);
  font-size: font-size(sm);
  padding: spacing(1);
  border-radius: border-radius(full);
  transition: all transition(base);
  
  &:hover {
    color: color(text-primary);
    background: rgba(255, 255, 255, 0.1);
  }
}

.filters-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(4);
  justify-content: center;
  
  @include respond-to(md) {
    justify-content: space-between;
  }
}

.filter-group {
  @include flex-center;
  gap: spacing(2);
}

.filter-label {
  font-size: font-size(sm);
  color: color(text-secondary);
  font-weight: font-weight(medium);
}

.filter-select {
  padding: spacing(2) spacing(3);
  background: color(bg-secondary);
  border: 1px solid color(border-primary);
  border-radius: border-radius(md);
  color: color(text-primary);
  font-size: font-size(sm);
  cursor: pointer;
  transition: all transition(base);
  
  &:focus {
    outline: none;
    border-color: color(primary);
  }
  
  option {
    background: color(bg-secondary);
    color: color(text-primary);
  }
}

.layout-toggle {
  @include flex-center;
  gap: spacing(1);
  background: color(bg-secondary);
  border-radius: border-radius(md);
  padding: spacing(1);
}

.layout-btn {
  @include button-reset;
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: border-radius(sm);
  color: color(text-muted);
  transition: all transition(base);
  
  &:hover {
    color: color(text-primary);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    color: color(primary);
    background: rgba(64, 158, 255, 0.1);
  }
  
  .layout-icon {
    font-size: font-size(base);
  }
}

// 统计区域
.projects-stats {
  @include flex-center;
  justify-content: center;
  gap: spacing(8);
  margin-bottom: spacing(8);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  @include respond-to(md) {
    gap: spacing(12);
  }
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: font-size(2xl);
    font-weight: font-weight(bold);
    color: color(primary);
    margin-bottom: spacing(1);
    
    @include respond-to(md) {
      font-size: font-size(3xl);
    }
  }
  
  .stat-label {
    font-size: font-size(sm);
    color: color(text-secondary);
  }
}

// 项目网格
.projects-grid {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
}

.projects-wrapper {
  display: grid;
  gap: spacing(8);
  
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to(lg) {
    gap: spacing(10);
  }
  
  .projects-grid--list & {
    grid-template-columns: 1fr;
    gap: spacing(6);
  }
}

// 项目动画
.project-fade-enter-active,
.project-fade-leave-active {
  transition: all 0.5s ease;
}

.project-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.project-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.project-fade-move {
  transition: transform 0.5s ease;
}

// 空状态
.empty-state {
  @include flex-column-center;
  padding: spacing(16) spacing(8);
  text-align: center;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: font-size(6xl);
  margin-bottom: spacing(4);
  opacity: 0.5;
}

.empty-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  margin-bottom: spacing(3);
}

.empty-description {
  font-size: font-size(base);
  color: color(text-secondary);
  margin-bottom: spacing(6);
  max-width: 400px;
}

.empty-action {
  @include button-reset;
  padding: spacing(3) spacing(6);
  background: color(primary);
  color: color(text-primary);
  border-radius: border-radius(lg);
  font-size: font-size(base);
  font-weight: font-weight(medium);
  transition: all transition(base);
  
  &:hover {
    background: color(primary-dark);
    transform: translateY(-2px);
    box-shadow: shadow(md);
  }
}

// 响应式优化
@include respond-below(md) {
  .projects-controls {
    padding: spacing(4);
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: spacing(3);
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .layout-toggle {
    align-self: center;
  }
  
  .projects-stats {
    gap: spacing(6);
  }
  
  .stat-item .stat-number {
    font-size: font-size(xl);
  }
}
</style>
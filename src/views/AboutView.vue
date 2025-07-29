<template>
  <div class="about-container">
    <div class="about-content">
      <!-- 页面标题 -->
      <div class="page-header" :class="{ 'animate': isLoaded }">
        <h1 class="about-title">关于我</h1>
        <p class="about-subtitle">了解更多关于 {{ authorInfo.name }} 的信息</p>
      </div>
      
      <!-- 个人信息卡片 -->
      <div 
        class="about-card" 
        v-scroll-animation="{ animationType: 'slideUp', delay: 200 }"
      >
        <div class="about-section">
          <h2 class="section-title">
            <span class="section-icon">👤</span>
            个人信息
          </h2>
          <div 
            class="info-grid"
            v-scroll-stagger="{ 
              animationType: 'slideLeft', 
              staggerDelay: 100,
              threshold: 0.3 
            }"
          >
            <div class="info-item">
              <div class="info-label">姓名</div>
              <div class="info-value">{{ authorInfo.name }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">座右铭</div>
              <div class="info-value">{{ authorInfo.motto }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">邮箱</div>
              <div class="info-value">
                <a :href="`mailto:${authorInfo.email}`" class="info-link">
                  {{ authorInfo.email }}
                </a>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">定位</div>
              <div class="info-value">{{ authorInfo.slogan }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 教育经历 -->
      <div 
        class="about-section" 
        v-scroll-animation="{ animationType: 'slideRight', delay: 100 }"
      >
        <h2 class="section-title">
          <span class="section-icon">🎓</span>
          教育经历
        </h2>
        <EducationTimeline :education-items="educationData" />
      </div>
      
      <!-- 技能专长 -->
      <div 
        class="about-section" 
        v-scroll-animation="{ animationType: 'slideUp', delay: 150 }"
      >
        <h2 class="section-title">
          <span class="section-icon">💻</span>
          技能专长
        </h2>
        <div 
          class="skills-container"
          v-scroll-stagger="{ 
            animationType: 'scaleIn', 
            staggerDelay: 200,
            threshold: 0.2 
          }"
        >
          <div 
            v-for="(categorySkills, category) in groupedSkills" 
            :key="category"
            class="skill-category"
          >
            <h3 class="skill-category-title">{{ getCategoryName(category) }}</h3>
            <div class="skill-list">
              <SkillProgress 
                v-for="(skill, index) in categorySkills" 
                :key="skill.name"
                :skill="skill"
                :delay="index * 100"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 兴趣爱好 -->
      <div 
        class="about-section" 
        v-scroll-animation="{ animationType: 'slideLeft', delay: 100 }"
      >
        <h2 class="section-title">
          <span class="section-icon">🎯</span>
          兴趣爱好
        </h2>
        <div 
          class="interests-grid"
          v-scroll-stagger="{ 
            animationType: 'slideUp', 
            staggerDelay: 150,
            threshold: 0.3 
          }"
        >
          <InterestCard 
            v-for="(interest, index) in interestsData" 
            :key="interest.title"
            :interest="interest"
            :delay="index * 0.2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AUTHOR_CONFIG } from '@/utils'
import EducationTimeline from '@/components/EducationTimeline.vue'
import SkillProgress from '@/components/SkillProgress.vue'
import InterestCard from '@/components/InterestCard.vue'
import { useSEO } from '@/composables/useSEO'

// SEO 优化
useSEO()

const authorInfo = AUTHOR_CONFIG
const isLoaded = ref(false)

// 教育经历数据
const educationData = [
  {
    school: '苏州经贸职业技术学院',
    period: '2023.6 - 2026.9',
    major: '计算机应用技术',
    degree: '专科',
    description: '专注于计算机技术和软件开发，积极参与各类技术项目和实践活动',
    achievements: [
      '积极参与编程竞赛和技术交流活动',
      '自主学习多种编程语言和开发框架',
      '完成多个个人项目和开源贡献'
    ],
    courses: [
      '数据结构与算法',
      'C++程序设计',
      'Python编程',
      '数据库原理',
      '计算机网络',
      'Web开发技术',
      '软件工程'
    ]
  }
]

// 技能数据
const skillsData = [
  // 编程语言
  { name: 'C++', level: 85, category: 'language', description: '熟练掌握面向对象编程，网络编程' },
  { name: 'Python', level: 90, category: 'language', description: '数据分析，爬虫开发，机器学习' },
  { name: 'JavaScript', level: 75, category: 'language', description: '前端开发，Node.js后端开发' },
  { name: 'TypeScript', level: 70, category: 'language', description: '类型安全的JavaScript开发' },
  
  // 工具和技术
  { name: 'Git', level: 85, category: 'tool', description: '版本控制系统' },
  { name: 'Docker', level: 60, category: 'tool', description: '容器化部署技术' },
  { name: 'Linux', level: 75, category: 'tool', description: '服务器运维和开发环境' },
  
  // 数据库
  { name: 'MySQL', level: 80, category: 'database', description: '关系型数据库管理' },
  { name: 'MongoDB', level: 40, category: 'database', description: 'NoSQL文档数据库' },
  
  // 其他技能
  { name: '数据爬取与分析', level: 88, category: 'other', description: '网络数据采集和处理' },
  { name: 'WEB3', level: 75, category: 'other', description: '区块链和去中心化应用' },
  { name: 'AI-Agent', level: 80, category: 'other', description: '智能代理和自动化' },
  { name: '数据可视化', level: 85, category: 'other', description: '数据图表和可视化展示' },
  { name: '数据清洗', level: 87, category: 'other', description: '数据预处理和质量控制' }
]

// 兴趣爱好数据
const interestsData = [
  {
    icon: '🎮',
    title: '游戏',
    subtitle: 'Apex Legends',
    description: '热爱竞技类射击游戏，享受团队协作和策略思考的乐趣',
    details: ['FPS游戏爱好者', '团队协作', '策略思维'],
    tags: ['Apex', '竞技游戏', '团队合作']
  },
  {
    icon: '🎵',
    title: '音乐',
    subtitle: '周杰伦',
    description: '喜欢华语流行音乐，特别是周杰伦的作品，音乐是编程时的最佳伴侣',
    details: ['华语流行', '经典歌曲', '编程BGM'],
    tags: ['周杰伦', '华语流行', '经典音乐']
  },
  {
    icon: '💻',
    title: '编程',
    subtitle: 'CODING',
    description: '热爱编程和技术创新，享受解决问题和创造价值的过程',
    details: ['算法学习', '开源贡献', '技术分享'],
    tags: ['编程', '开源', '技术创新']
  }
]

// 按分类分组技能
const groupedSkills = computed(() => {
  const groups: Record<string, typeof skillsData> = {}
  skillsData.forEach(skill => {
    if (!groups[skill.category]) {
      groups[skill.category] = []
    }
    groups[skill.category].push(skill)
  })
  return groups
})

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryNames: Record<string, string> = {
    language: '编程语言',
    tool: '开发工具',
    database: '数据库',
    other: '专业技能'
  }
  return categoryNames[category] || category
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 300)
})
</script>

<style lang="scss" scoped>
.about-container {
  @include container(1000px);
  padding: spacing(8) spacing(4);
  min-height: 100vh;
  background: color(bg-primary);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: spacing(12);
}

// 页面标题
.page-header {
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-title {
  font-size: font-size(4xl);
  font-weight: font-weight(bold);
  color: color(text-primary);
  margin-bottom: spacing(3);
  
  @include respond-to(md) {
    font-size: font-size(5xl);
  }
}

.about-subtitle {
  font-size: font-size(lg);
  color: color(text-secondary);
  line-height: 1.75;
  
  @include respond-to(md) {
    font-size: font-size(xl);
  }
}

// 通用部分样式
.about-section {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:nth-child(2) { transition-delay: 0.2s; }
  &:nth-child(3) { transition-delay: 0.4s; }
  &:nth-child(4) { transition-delay: 0.6s; }
  &:nth-child(5) { transition-delay: 0.8s; }
}

.section-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: color(text-primary);
  margin-bottom: spacing(6);
  display: flex;
  align-items: center;
  gap: spacing(3);
  
  @include respond-to(md) {
    font-size: font-size(3xl);
    margin-bottom: spacing(8);
  }
  
  .section-icon {
    font-size: font-size(2xl);
    
    @include respond-to(md) {
      font-size: font-size(3xl);
    }
  }
}

// 个人信息卡片
.about-card {
  @include card-style;
  padding: spacing(8);
  
  @include respond-to(md) {
    padding: spacing(10);
  }
}

.info-grid {
  display: grid;
  gap: spacing(6);
  
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: spacing(8);
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.info-label {
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  color: color(text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  font-size: font-size(base);
  color: color(text-primary);
  font-weight: font-weight(medium);
  
  @include respond-to(md) {
    font-size: font-size(lg);
  }
}

.info-link {
  color: color(primary);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: lighten(color(primary), 10%);
    text-decoration: underline;
  }
}

// 技能部分
.skills-container {
  display: grid;
  gap: spacing(8);
  
  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
    gap: spacing(10);
  }
}

.skill-category {
  @include card-style;
  padding: spacing(6);
  
  @include respond-to(md) {
    padding: spacing(8);
  }
}

.skill-category-title {
  font-size: font-size(lg);
  font-weight: font-weight(semibold);
  color: color(primary);
  margin-bottom: spacing(4);
  text-align: center;
  
  @include respond-to(md) {
    font-size: font-size(xl);
    margin-bottom: spacing(6);
  }
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: spacing(1);
}

// 兴趣爱好网格
.interests-grid {
  display: grid;
  gap: spacing(6);
  
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: spacing(8);
  }
  
  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// 响应式优化
@include respond-to(sm) {
  .about-container {
    padding: spacing(6) spacing(3);
  }
  
  .about-content {
    gap: spacing(8);
  }
  
  .section-title {
    font-size: font-size(xl);
    margin-bottom: spacing(4);
  }
  
  .about-card {
    padding: spacing(6);
  }
  
  .skills-container {
    gap: spacing(6);
  }
  
  .skill-category {
    padding: spacing(4);
  }
  
  .interests-grid {
    gap: spacing(4);
  }
}
</style>
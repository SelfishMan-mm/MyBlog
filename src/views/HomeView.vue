<template>
  <div class="home-container">
    <ParticlesBg />
    
    <!-- 主要信息区域 - 左右分栏布局 -->
    <section id="hero" class="hero-section">
      <div class="hero-container" :class="{ 'loaded': isLoaded }">
        <!-- 左侧座右铭区域 -->
        <div class="motto-section">
          <div class="motto-content" :class="{ 'animate': isLoaded }">
            <div class="motto-text">
              {{ displayedText }}
            </div>
          </div>
        </div>
        
        <!-- 右侧个人信息区域 -->
        <div class="profile-section">
          <div class="profile-card" :class="{ 'animate': isLoaded }">
            <div class="avatar-box">
              <div class="avatar-placeholder" :class="{ 'animate': isLoaded }">
                <span>M</span>
                <div class="avatar-glow"></div>
              </div>
            </div>
            <div class="info-box">
              <h1 class="name" :class="{ 'animate': isLoaded }">meless</h1>
              <div class="desc" :class="{ 'animate': isLoaded }">
                热爱C++、Python、数据爬取与分析、WEB3。喜欢AI-Agent、大模型、后端网络开发。
              </div>
              
              <div class="contact" :class="{ 'animate': isLoaded }">
                <el-link href="mailto:2779279397@qq.com" target="_blank" class="contact-link">
                  <img src="@/assets/icons/email.svg" alt="邮箱" class="contact-icon" />
                  <span>QQ邮箱</span>
                </el-link>
                <el-link href="https://space.bilibili.com/632873241?spm_id_from=333.1007.0.0" target="_blank" class="contact-link">
                  <img src="@/assets/icons/bilibili.svg" alt="B站" class="contact-icon" />
                  <span>B站</span>
                </el-link>
                <el-link href="https://github.com/SelfishMan-mm" target="_blank" class="contact-link">
                  <img src="@/assets/icons/github.svg" alt="GitHub" class="contact-icon" />
                  <span>Github</span>
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ParticlesBg from '@/components/ParticlesBg.vue'
import { useSEO } from '@/composables/useSEO'

// SEO 优化
useSEO()

// 技能数据
type SkillColor = 'primary' | 'success' | 'warning' | 'danger' | 'info'
type SkillCategory = 'language' | 'tech' | 'field' | 'interest'

interface Skill {
  name: string
  category: SkillCategory
  level?: number
  color?: SkillColor
}

const skills = ref<Skill[]>([
  { name: '学生', category: 'field', color: 'info' },
  { name: 'C++', category: 'language', level: 85, color: 'success' },
  { name: 'Python', category: 'language', level: 90, color: 'success' },
  { name: '数据爬取与分析', category: 'tech', level: 88, color: 'primary' },
  { name: 'WEB3', category: 'tech', level: 75, color: 'warning' },
  { name: 'AI-Agent', category: 'interest', level: 80, color: 'danger' },
  { name: '大模型', category: 'interest', level: 78, color: 'danger' },
  { name: '后端网络开发', category: 'tech', level: 82, color: 'primary' },
  { name: '数据可视化', category: 'tech', level: 85, color: 'primary' },
  { name: '数据清洗', category: 'tech', level: 87, color: 'primary' }
])

const displayedSkills = ref<Skill[]>([])
const isLoaded = ref(false)

// 打字机效果相关状态
const displayedText = ref('')
const mottos = [
  '一路寒风深如絮，命海浮沉客独行',
  '独帜入渊身未知，身似浮萍命难持',
  '惊鸿四散鱼逃尽，唯有残帆傲此间'
]
const fullText = ref('')

// 存储定时器ID以便清理
const skillTimers: number[] = []
const typingTimers: number[] = []

// 打字机效果
const startTypingEffect = () => {
  // 清理之前的定时器
  typingTimers.forEach(timer => clearTimeout(timer))
  typingTimers.length = 0
  
  // 随机选择一个座右铭
  const randomIndex = Math.floor(Math.random() * mottos.length)
  fullText.value = mottos[randomIndex]
  
  // 重置状态
  displayedText.value = ''
  
  // 延迟开始打字效果
  const startTimer = setTimeout(() => {
    let index = 0
    const typeText = () => {
      if (index < fullText.value.length) {
        displayedText.value += fullText.value[index]
        index++
        const timer = setTimeout(typeText, 150)
        typingTimers.push(timer)
      }
    }
    typeText()
  }, 800)
  typingTimers.push(startTimer)
}

// 动态加载技能标签
const loadSkills = () => {
  displayedSkills.value = []
  // 清理之前的定时器
  skillTimers.forEach(timer => clearTimeout(timer))
  skillTimers.length = 0
  
  skills.value.forEach((skill, index) => {
    const timer = setTimeout(() => {
      displayedSkills.value.push(skill)
    }, index * 150)
    skillTimers.push(timer)
  })
}

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryNames: Record<string, string> = {
    language: '编程语言',
    tech: '技术栈',
    field: '身份',
    interest: '兴趣方向'
  }
  return categoryNames[category] || category
}

let typingInterval: number | undefined = undefined

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
    startTypingEffect()
    loadSkills()
    typingInterval = setInterval(() => {
      startTypingEffect()
    }, 10000)
  }, 500)
})

onBeforeUnmount(() => {
  // 清理所有定时器
  skillTimers.forEach(timer => clearTimeout(timer))
  skillTimers.length = 0
  typingTimers.forEach(timer => clearTimeout(timer))
  typingTimers.length = 0
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  position: relative;
  background: color(bg-primary);
  z-index: 1;
}

.hero-section {
  min-height: 100vh;
  @include flex-center;
  padding: spacing(8) spacing(4);
}

.hero-container {
  position: relative;
  z-index: 2;
  display: grid;
  gap: spacing(8);
  width: 100%;
  max-width: 1200px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }
  
  @include respond-to(md) {
    grid-template-columns: 1fr 1fr;
    gap: spacing(12);
    align-items: center;
  }
}

// 左侧座右铭区域
.motto-section {
  @include flex-center;
  flex-direction: column;
}

.motto-content {
  text-align: left;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  
  &.animate {
    opacity: 1;
    transform: translateX(0);
  }
}

.motto-text {
  font-family: 'KaiTi', '楷体', 'STKaiti', serif;
  font-size: font-size(2xl);
  color: color(text-primary);
  font-weight: font-weight(normal);
  line-height: 1.8;
  white-space: nowrap;
  
  @include respond-to(md) {
    font-size: font-size(3xl);
  }
  
  @include respond-to(lg) {
    font-size: font-size(4xl);
  }
}

// 右侧个人信息区域
.profile-section {
  @include flex-center;
}

.profile-card {
  @include card-style;
  padding: spacing(8);
  @include flex-column-center;
  width: 100%;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
  
  &.animate {
    opacity: 1;
    transform: translateX(0);
  }
  
  @include respond-to(md) {
    padding: spacing(10);
  }
}

.avatar-box {
  margin-bottom: spacing(6);
}

.avatar-placeholder {
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: border-radius(full);
  box-shadow: shadow(card);
  border: 2.5px solid color(border-secondary);
  background: linear-gradient(135deg, color(primary), color(primary-light));
  @include flex-center;
  overflow: hidden;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    transform: scale(1);
    opacity: 1;
  }
  
  span {
    font-size: font-size(4xl);
    font-weight: font-weight(bold);
    color: white;
    z-index: 2;
    position: relative;
  }
  
  .avatar-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, color(primary), transparent);
    animation: rotate 3s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    
    .avatar-glow {
      opacity: 0.3;
    }
  }
  
  @include respond-to(md) {
    width: 144px;
    height: 144px;
    
    span {
      font-size: font-size(5xl);
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.info-box {
  text-align: center;
}

.name {
  font-size: font-size(3xl);
  font-weight: font-weight(bold);
  letter-spacing: 2px;
  color: color(text-primary);
  margin-bottom: spacing(4);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  @include respond-to(md) {
    font-size: font-size(4xl);
  }
}

.desc {
  color: color(text-secondary);
  font-size: font-size(base);
  margin-bottom: spacing(6);
  line-height: 1.75;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  @include respond-to(md) {
    font-size: font-size(lg);
  }
}

// 技能专长区域样式
.skills-section {
  padding: spacing(16) spacing(4);
  background: color(bg-secondary);
  border-top: 1px solid color(border-primary);
}

.skills-container-wrapper {
  @include container(1200px);
  text-align: center;
}

.skills-container {
  display: grid;
  gap: spacing(6);
  
  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to(lg) {
    grid-template-columns: repeat(4, 1fr);
    gap: spacing(8);
  }
}

.skill-category {
  @include card-style;
  padding: spacing(6);
  
  .category-title {
    font-size: font-size(lg);
    font-weight: font-weight(semibold);
    color: color(primary);
    margin-bottom: spacing(4);
    text-align: center;
    letter-spacing: 1px;
    
    @include respond-to(md) {
      font-size: font-size(xl);
    }
  }
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  align-items: center;
}

.skill-tag {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: border-radius(base);
  padding: spacing(2) spacing(3);
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  }
  
  .skill-name {
    display: block;
    color: color(text-primary);
    margin-bottom: spacing(1);
  }
  
  .skill-level {
    display: flex;
    align-items: center;
    gap: spacing(2);
    font-size: font-size(xs);
  }
  
  .skill-bar {
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: border-radius(full);
    overflow: hidden;
  }
  
  .skill-progress {
    height: 100%;
    background: color(primary);
    border-radius: border-radius(full);
    transition: width 1s ease-out;
  }
  
  .skill-percent {
    color: color(text-muted);
    font-size: font-size(xs);
  }
  
  // 不同颜色主题
  &.skill-success {
    background: rgba(103, 194, 58, 0.1);
    border-color: rgba(103, 194, 58, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
    }
    
    .skill-progress {
      background: color(success);
    }
  }
  
  &.skill-warning {
    background: rgba(230, 162, 60, 0.1);
    border-color: rgba(230, 162, 60, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
    }
    
    .skill-progress {
      background: color(warning);
    }
  }
  
  &.skill-danger {
    background: rgba(245, 108, 108, 0.1);
    border-color: rgba(245, 108, 108, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
    }
    
    .skill-progress {
      background: color(danger);
    }
  }
  
  &.skill-info {
    background: rgba(144, 147, 153, 0.1);
    border-color: rgba(144, 147, 153, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(144, 147, 153, 0.2);
    }
    
    .skill-progress {
      background: color(info);
    }
  }
}

// 技能标签动画
.skill-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.contact {
  display: flex;
  gap: spacing(3);
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s;
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .contact-link {
    display: flex;
    align-items: center;
    gap: spacing(2);
    padding: spacing(2) spacing(3);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: border-radius(base);
    text-decoration: none;
    color: color(text-primary);
    font-size: font-size(sm);
    font-weight: font-weight(medium);
    transition: all 0.3s ease;
    
    .contact-icon {
      width: 18px;
      height: 18px;
      filter: brightness(0) invert(1);
      transition: all 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(64, 158, 255, 0.1);
      border-color: rgba(64, 158, 255, 0.3);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }
  }
}

.section-title {
  font-size: font-size(3xl);
  font-weight: font-weight(bold);
  color: color(text-primary);
  margin-bottom: spacing(12);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  @include respond-to(md) {
    font-size: font-size(4xl);
  }
}
</style>
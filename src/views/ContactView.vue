<template>
  <div class="contact-container">
    <div 
      class="contact-header"
      v-scroll-animation="{ animationType: 'fadeIn', delay: 0 }"
    >
      <h1 class="contact-title">联系与合作</h1>
      <p class="contact-subtitle">欢迎与我交流技术、合作机会，或在留言板留下您的想法</p>
    </div>
    
    <div class="contact-content">
      <!-- 关于合作部分 -->
      <div class="collaboration-section">
        <div 
          class="contact-card"
          v-scroll-animation="{ animationType: 'slideLeft', delay: 200 }"
        >
          <h2 class="contact-section-title">关于合作</h2>
          <div 
            class="collaboration-info"
            v-scroll-stagger="{ 
              animationType: 'slideRight', 
              staggerDelay: 100,
              threshold: 0.3 
            }"
          >
            <div class="collaboration-item">
              <h3>🤝 项目合作</h3>
              <p>欢迎讨论有趣的技术项目和开源贡献，可以是Web开发、AI应用、数据分析等领域</p>
            </div>
            <div class="collaboration-item">
              <h3>💡 技术交流</h3>
              <p>乐于分享和学习 C++、Python、Vue.js、Web3 等技术，一起探讨技术难题</p>
            </div>
            <div class="collaboration-item">
              <h3>📚 学习分享</h3>
              <p>可以分享学习经验、技术心得，或者一起参与技术社区活动</p>
            </div>
            <div class="collaboration-item">
              <h3>📧 联系方式</h3>
              <div class="contact-methods">
                <a :href="`mailto:${authorInfo.email}`" class="contact-link">
                  <img src="@/assets/icons/email.svg" alt="邮箱" />
                  {{ authorInfo.email }}
                </a>
                <a :href="authorInfo.github" target="_blank" class="contact-link">
                  <img src="@/assets/icons/github.svg" alt="GitHub" />
                  GitHub
                </a>
                <a :href="authorInfo.bilibili" target="_blank" class="contact-link">
                  <img src="@/assets/icons/bilibili.svg" alt="哔哩哔哩" />
                  哔哩哔哩
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 留言板部分 -->
      <div class="message-board-section">
        <!-- 发表留言 -->
        <div 
          class="contact-card"
          v-scroll-animation="{ animationType: 'slideRight', delay: 300 }"
        >
          <h2 class="contact-section-title">留言板</h2>
          <form 
            @submit.prevent="handleSubmit" 
            class="message-form"
            v-scroll-stagger="{ 
              animationType: 'slideUp', 
              staggerDelay: 100,
              threshold: 0.2 
            }"
          >
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">昵称 *</label>
                <input 
                  id="name"
                  v-model="form.name"
                  type="text" 
                  class="form-input"
                  placeholder="请输入您的昵称"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">邮箱</label>
                <input 
                  id="email"
                  v-model="form.email"
                  type="email" 
                  class="form-input"
                  placeholder="请输入您的邮箱（可选）"
                />
              </div>
            </div>
            
              <div class="form-group">
              <label for="message" class="form-label">
                留言内容 * 
                <span class="message-length" :class="{ 'text-warning': form.message.length > maxMessageLength }">
                  ({{ form.message.length }}/{{ maxMessageLength }})
                </span>
              </label>
              <textarea 
                id="message"
                v-model="form.message"
                class="form-textarea"
                placeholder="请输入您想说的话..."
                rows="4"
                required
              ></textarea>
            </div>            <button type="submit" class="form-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">发表留言</span>
              <span v-else>发表中...</span>
            </button>
          </form>
        </div>
        
        <!-- 留言列表 -->
        <div 
          class="contact-card messages-list"
          v-scroll-animation="{ animationType: 'slideUp', delay: 400 }"
        >
          <div class="messages-header">
            <h3>所有留言 ({{ messages.length }})</h3>
            <button @click="clearMessages" class="clear-btn" v-if="messages.length > 0">
              清空留言
            </button>
          </div>
          
          <div v-if="messages.length === 0" class="no-messages">
            <p>还没有留言，快来留下第一条留言吧！</p>
          </div>
          
          <div v-else class="messages-container">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message-item"
              v-scroll-animation="{ animationType: 'slideLeft', delay: 100 }"
            >
              <div class="message-header">
                <div class="message-author">
                  <div class="author-avatar">{{ message.name.charAt(0).toUpperCase() }}</div>
                  <div class="author-info">
                    <h4>{{ message.name }}</h4>
                    <time>{{ formatDate(message.createdAt) }}</time>
                  </div>
                </div>
                <button @click="deleteMessage(message.id)" class="delete-btn" title="删除留言">
                  ×
                </button>
              </div>
              <div class="message-content">
                <p>{{ message.message }}</p>
                <div class="message-actions">
                  <span class="message-length">{{ message.message.length }}字</span>
                  <button class="like-btn" :class="{ liked: message.isLiked }" @click="likeMessage(message)">
                    👍 {{ message.likes }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { AUTHOR_CONFIG } from '@/utils'
import { useSEO } from '@/composables/useSEO'

// SEO 优化
useSEO({
  title: '联系与合作 - meless',
  description: '欢迎与我交流技术、合作机会，或在留言板留下您的想法',
  keywords: ['联系', '合作', '留言板', '技术交流', 'meless']
})

const authorInfo = AUTHOR_CONFIG

// 留言接口定义
interface Message {
  id: string
  name: string
  email?: string
  message: string
  createdAt: Date
  likes: number
  isLiked?: boolean
}

// 表单数据
const form = reactive({
  name: '',
  email: '',
  message: ''
})

// 留言字数限制
const maxMessageLength = 200


// 状态管理
const isSubmitting = ref(false)
const messages = ref<Message[]>([])

// 本地存储键名
const STORAGE_KEY = 'meless_messages'

// 加载留言
const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedMessages = JSON.parse(stored)
      // 确保日期对象正确解析
      messages.value = parsedMessages.map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }))
      // 按时间倒序排列（最新的在前面）
      messages.value.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  } catch (error) {
    console.error('加载留言失败:', error)
    messages.value = []
  }
}

// 保存留言到本地存储
const saveMessages = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  } catch (error) {
    console.error('保存留言失败:', error)
  }
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 提交留言
const handleSubmit = async () => {
  if (!form.name.trim() || !form.message.trim()) {
    alert('请填写昵称和留言内容')
    return
  }
  if (form.message.length > maxMessageLength) {
    alert(`留言内容不能超过${maxMessageLength}字！`)
    return
  }

  isSubmitting.value = true
  
  try {
    // 创建新留言
    const newMessage: Message = {
      id: generateId(),
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      message: form.message.trim(),
      createdAt: new Date(),
      likes: 0,
      isLiked: false
    }
    
    // 添加到留言列表（最新的在前面）
    messages.value.unshift(newMessage)
    
    // 保存到本地存储
    saveMessages()
    
    // 重置表单
    Object.assign(form, {
      name: '',
      email: '',
      message: ''
    })
    
    // 显示成功提示
    alert('留言发表成功！')
  } catch (error) {
    console.error('发表留言失败:', error)
    alert('发表留言失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 删除留言
const deleteMessage = (id: string) => {
  if (confirm('确定要删除这条留言吗？')) {
    messages.value = messages.value.filter(msg => msg.id !== id)
    saveMessages()
  }
}

// 清空所有留言
const clearMessages = () => {
  if (confirm('确定要清空所有留言吗？此操作不可恢复！')) {
    messages.value = []
    saveMessages()
  }
}

// 格式化日期
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 点赞留言
const likeMessage = (message: Message) => {
  if (!message.isLiked) {
    message.likes++
    message.isLiked = true
    saveMessages()
  } else {
    message.likes--
    message.isLiked = false
    saveMessages()
  }
}

// 组件挂载时加载留言
onMounted(() => {
  loadMessages()
})
</script>

<style lang="scss" scoped>

.contact-container {
  padding: spacing(8) spacing(4);
  min-height: 100vh;
  @include container(1000px);
}

.contact-header {
  text-align: center;
  margin-bottom: spacing(12);
}

.contact-title {
  font-size: font-size(4xl);
  font-weight: font-weight(bold);
  color: color(text-primary);
  margin-bottom: spacing(4);
  
  @include respond-to(md) {
    font-size: font-size(5xl);
  }
}

.contact-subtitle {
  font-size: font-size(lg);
  color: color(text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.75;
}

.contact-content {
  display: grid;
  gap: spacing(8);
  
  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: spacing(12);
  }
}

.contact-card {
  @include card-style;
  padding: spacing(8);
}

.contact-section-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: color(primary);
  margin-bottom: spacing(6);
  border-bottom: 2px solid color(border-primary);
  padding-bottom: spacing(2);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.contact-method {
  display: flex;
  align-items: center;
  gap: spacing(4);
  padding: spacing(4);
  background: color(bg-secondary);
  border-radius: border-radius(lg);
  text-decoration: none;
  transition: all transition(base);
  
  &:hover {
    background: rgba(64, 158, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .contact-icon {
    font-size: font-size(2xl);
    width: 50px;
    height: 50px;
    @include flex-center;
    background: rgba(64, 158, 255, 0.1);
    border-radius: border-radius(full);
  }
  
  .contact-details {
    h3 {
      font-size: font-size(lg);
      font-weight: font-weight(medium);
      color: color(text-primary);
      margin-bottom: spacing(1);
    }
    
    p {
      color: color(text-secondary);
      font-size: font-size(sm);
    }
  }
}

.collaboration-info {
  display: flex;
  flex-direction: column;
  gap: spacing(6);
}

.collaboration-item {
  h3 {
    font-size: font-size(lg);
    font-weight: font-weight(medium);
    color: color(text-primary);
    margin-bottom: spacing(2);
  }
  
  p {
    color: color(text-secondary);
    line-height: 1.75;
  }
}

// 联系方式链接样式
.contact-methods {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  margin-top: spacing(3);
}

.contact-link {
  display: flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(2) spacing(3);
  background: color(bg-secondary);
  border-radius: border-radius(md);
  text-decoration: none;
  color: color(text-primary);
  font-size: font-size(sm);
  transition: all transition(base);
  
  &:hover {
    background: rgba(64, 158, 255, 0.1);
    color: color(primary);
  }
  
  img {
    width: 20px;
    height: 20px;
  }
}

// 留言板样式
.message-board-section {
  display: flex;
  flex-direction: column;
  gap: spacing(6);
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.form-row {
  display: grid;
  gap: spacing(4);
  
  @include respond-to(md) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.form-label {
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  color: color(text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-length {
  font-size: 12px;
  color: #888;
}
.message-length.text-warning {
  color: #e67e22;
}

.like-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  margin-left: 12px;
  transition: color 0.2s;
}
.like-btn.liked {
  color: #409EFF;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.form-input,
.form-textarea {
  padding: spacing(3) spacing(4);
  background: color(bg-secondary);
  border: 1px solid color(border-primary);
  border-radius: border-radius(md);
  color: color(text-primary);
  font-size: font-size(base);
  transition: border-color transition(base);
  
  &:focus {
    border-color: color(primary);
    outline: none;
  }
  
  &::placeholder {
    color: color(text-muted);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-submit {
  padding: spacing(3) spacing(6);
  background: color(primary);
  color: color(text-primary);
  border: none;
  border-radius: border-radius(md);
  font-size: font-size(base);
  font-weight: font-weight(medium);
  cursor: pointer;
  transition: all transition(base);
  
  &:hover:not(:disabled) {
    background: color(primary-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// 响应式优化
@include respond-below(md) {
  .contact-method {
    flex-direction: column;
    text-align: center;
    
    .contact-details {
      text-align: center;
    }
  }
}
</style>
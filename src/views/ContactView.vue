<template>
  <div class="contact-container">
    <div 
      class="contact-header"
      v-scroll-animation="{ animationType: 'fadeIn', delay: 0 }"
    >
      <h1 class="contact-title">联系我</h1>
      <p class="contact-subtitle">欢迎与我交流技术或合作机会</p>
    </div>
    
    <div class="contact-content">
      <div class="contact-info">
        <div 
          class="contact-card"
          v-scroll-animation="{ animationType: 'slideLeft', delay: 200 }"
        >
          <h2 class="contact-section-title">联系方式</h2>
          
          <div 
            class="contact-methods"
            v-scroll-stagger="{ 
              animationType: 'slideUp', 
              staggerDelay: 150,
              threshold: 0.3 
            }"
          >
            <a 
              :href="`mailto:${authorInfo.email}`"
              class="contact-method"
            >
              <div class="contact-icon"><img src="@/assets/icons/email.svg" alt="邮箱" style="width:32px;height:32px;" /></div>
              <div class="contact-details">
                <h3>邮箱</h3>
                <p>{{ authorInfo.email }}</p>
              </div>
            </a>
            
            <a 
              :href="authorInfo.github"
              target="_blank"
              class="contact-method"
            >
              <div class="contact-icon"><img src="@/assets/icons/github.svg" alt="GitHub" style="width:32px;height:32px;" /></div>
              <div class="contact-details">
                <h3>GitHub</h3>
                <p>查看我的开源项目</p>
              </div>
            </a>
            
            <a 
              :href="authorInfo.bilibili"
              target="_blank"
              class="contact-method"
            >
              <div class="contact-icon"><img src="@/assets/icons/bilibili.svg" alt="哔哩哔哩" style="width:32px;height:32px;" /></div>
              <div class="contact-details">
                <h3>哔哩哔哩</h3>
                <p>关注我的技术分享</p>
              </div>
            </a>
          </div>
        </div>
        
        <div 
          class="contact-card"
          v-scroll-animation="{ animationType: 'slideLeft', delay: 400 }"
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
              <p>欢迎讨论有趣的技术项目和开源贡献</p>
            </div>
            <div class="collaboration-item">
              <h3>💡 技术交流</h3>
              <p>乐于分享和学习 C++、Python、Web3 等技术</p>
            </div>
            <div class="collaboration-item">
              <h3>📚 学习分享</h3>
              <p>可以分享学习经验和技术心得</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contact-form-section">
        <div 
          class="contact-card"
          v-scroll-animation="{ animationType: 'slideRight', delay: 300 }"
        >
          <h2 class="contact-section-title">快速留言</h2>
          <form 
            @submit.prevent="handleSubmit" 
            class="contact-form"
            v-scroll-stagger="{ 
              animationType: 'slideUp', 
              staggerDelay: 100,
              threshold: 0.2 
            }"
          >
            <div class="form-group">
              <label for="name" class="form-label">姓名</label>
              <input 
                id="name"
                v-model="form.name"
                type="text" 
                class="form-input"
                placeholder="请输入您的姓名"
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
                placeholder="请输入您的邮箱"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="subject" class="form-label">主题</label>
              <input 
                id="subject"
                v-model="form.subject"
                type="text" 
                class="form-input"
                placeholder="请输入邮件主题"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="message" class="form-label">消息</label>
              <textarea 
                id="message"
                v-model="form.message"
                class="form-textarea"
                placeholder="请输入您想说的话..."
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" class="form-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">发送消息</span>
              <span v-else>发送中...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { AUTHOR_CONFIG } from '@/utils'
import { useSEO } from '@/composables/useSEO'

// SEO 优化
useSEO()

const authorInfo = AUTHOR_CONFIG

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // 构建邮件链接
    const subject = encodeURIComponent(form.subject)
    const body = encodeURIComponent(
      `姓名: ${form.name}\n邮箱: ${form.email}\n\n消息:\n${form.message}`
    )
    const mailtoLink = `mailto:${authorInfo.email}?subject=${subject}&body=${body}`
    
    // 打开邮件客户端
    window.location.href = mailtoLink
    
    // 重置表单
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    // 显示成功提示
    alert('邮件客户端已打开，请发送邮件！')
  } catch (error) {
    console.error('发送失败:', error)
    alert('发送失败，请直接发送邮件到 ' + authorInfo.email)
  } finally {
    isSubmitting.value = false
  }
}
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

.contact-form {
  display: flex;
  flex-direction: column;
  gap: spacing(6);
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
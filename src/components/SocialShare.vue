<template>
  <div class="social-share">
    <h3 class="share-title" v-if="showTitle">分享到</h3>
    <div class="share-buttons">
      <button 
        v-for="platform in platforms" 
        :key="platform.name"
        @click="shareToSocial(platform)"
        class="share-button"
        :class="`share-button--${platform.name}`"
        :title="`分享到${platform.label}`"
      >
        <i class="share-icon" v-html="platform.icon"></i>
        <span class="share-label" v-if="showLabels">{{ platform.label }}</span>
      </button>
      
      <button 
        @click="copyLink"
        class="share-button share-button--copy"
        title="复制链接"
      >
        <i class="share-icon">🔗</i>
        <span class="share-label" v-if="showLabels">复制链接</span>
      </button>
    </div>
    
    <!-- 复制成功提示 -->
    <div v-if="showCopySuccess" class="copy-success">
      链接已复制到剪贴板！
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCurrentPageUrl } from '@/utils/seo'

interface SharePlatform {
  name: string
  label: string
  icon: string
  url: string
}

interface Props {
  title?: string
  description?: string
  url?: string
  showTitle?: boolean
  showLabels?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  url: '',
  showTitle: true,
  showLabels: true,
  size: 'medium'
})

const showCopySuccess = ref(false)

// 获取分享内容
const shareContent = computed(() => ({
  title: props.title || document.title,
  description: props.description || document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
  url: props.url || getCurrentPageUrl()
}))

// 社交平台配置
const platforms = computed((): SharePlatform[] => [
  {
    name: 'weibo',
    label: '微博',
    icon: '🐦',
    url: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareContent.value.url)}&title=${encodeURIComponent(shareContent.value.title)}&pic=&appkey=`
  },
  {
    name: 'qq',
    label: 'QQ空间',
    icon: '🐧',
    url: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(shareContent.value.url)}&title=${encodeURIComponent(shareContent.value.title)}&desc=${encodeURIComponent(shareContent.value.description)}`
  },
  {
    name: 'wechat',
    label: '微信',
    icon: '💬',
    url: '' // 微信分享需要特殊处理
  },
  {
    name: 'twitter',
    label: 'Twitter',
    icon: '🐦',
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.value.title)}&url=${encodeURIComponent(shareContent.value.url)}`
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: '📘',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.value.url)}`
  }
])

// 分享到社交平台
const shareToSocial = (platform: SharePlatform) => {
  if (platform.name === 'wechat') {
    // 微信分享显示二维码或提示
    showWeChatShare()
    return
  }

  if (platform.url) {
    window.open(platform.url, '_blank', 'width=600,height=400')
  }
}

// 显示微信分享
const showWeChatShare = () => {
  // 这里可以显示二维码或复制链接提示
  copyLink()
  alert('请复制链接到微信分享')
}

// 复制链接
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareContent.value.url)
    showCopySuccess.value = true
    
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = shareContent.value.url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  }
}

// 原生分享 API（如果支持）
const nativeShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareContent.value.title,
        text: shareContent.value.description,
        url: shareContent.value.url
      })
    } catch (err) {
      console.log('分享取消或失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.social-share {
  margin: spacing(6) 0;
}

.share-title {
  font-size: font-size(base);
  font-weight: font-weight(medium);
  color: color(text-primary);
  margin-bottom: spacing(3);
  text-align: center;
}

.share-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: spacing(3);
  flex-wrap: wrap;
}

.share-button {
  @include button-reset;
  @include flex-center;
  gap: spacing(2);
  padding: spacing(2) spacing(3);
  background: color(bg-secondary);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  color: color(text-primary);
  font-size: font-size(sm);
  transition: all transition(base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: shadow(md);
  }
  
  // 不同平台的颜色主题
  &--weibo:hover {
    background: #ff6b6b;
    border-color: #ff6b6b;
  }
  
  &--qq:hover {
    background: #1890ff;
    border-color: #1890ff;
  }
  
  &--wechat:hover {
    background: #52c41a;
    border-color: #52c41a;
  }
  
  &--twitter:hover {
    background: #1da1f2;
    border-color: #1da1f2;
  }
  
  &--facebook:hover {
    background: #4267b2;
    border-color: #4267b2;
  }
  
  &--copy:hover {
    background: color(primary);
    border-color: color(primary);
  }
}

.share-icon {
  font-size: font-size(lg);
  line-height: 1;
}

.share-label {
  font-size: font-size(xs);
  font-weight: font-weight(medium);
  white-space: nowrap;
}

.copy-success {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: color(success);
  color: color(text-primary);
  padding: spacing(3) spacing(6);
  border-radius: border-radius(lg);
  font-size: font-size(sm);
  font-weight: font-weight(medium);
  z-index: z-index(toast);
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  10%, 90% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

// 尺寸变体
.social-share--small {
  .share-button {
    padding: spacing(1) spacing(2);
    font-size: font-size(xs);
  }
  
  .share-icon {
    font-size: font-size(base);
  }
}

.social-share--large {
  .share-button {
    padding: spacing(3) spacing(4);
    font-size: font-size(base);
  }
  
  .share-icon {
    font-size: font-size(xl);
  }
}

// 响应式设计
@include respond-below(md) {
  .share-buttons {
    gap: spacing(2);
  }
  
  .share-button {
    padding: spacing(2);
    min-width: 44px; // 触摸友好的最小尺寸
  }
  
  .share-label {
    display: none; // 移动端隐藏标签
  }
}
</style>
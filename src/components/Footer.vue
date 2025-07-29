<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 社交媒体图标 -->
      <div class="social-icons">
        <a href="mailto:2779279397@qq.com" target="_blank" class="social-icon" title="邮箱">
          <img src="@/assets/icons/email.svg" alt="邮箱" />
        </a>
        <a href="https://github.com/SelfishMan-mm" target="_blank" class="social-icon" title="GitHub">
          <img src="@/assets/icons/github.svg" alt="GitHub" />
        </a>
        <a href="https://space.bilibili.com/632873241" target="_blank" class="social-icon" title="B站">
          <img src="@/assets/icons/bilibili.svg" alt="B站" />
        </a>
        <a href="/blog" class="social-icon" title="博客">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </a>
        <a href="/projects" class="social-icon" title="项目">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </a>
        <a href="/about" class="social-icon" title="关于">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </a>
        <a href="/contact" class="social-icon" title="联系">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>

      </div>




      <!-- 版权信息 -->
      <div class="copyright">
        <p>&copy; {{ currentYear }} meless. All rights reserved.</p>
        <p>Built with ❤️ using Vue.js & TypeScript</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.footer {
  background: color(bg-secondary);
  border-top: 1px solid color(border-primary);
  padding: spacing(12) 0 spacing(6) 0;
  margin-top: auto;
}

.footer-container {
  @include container(1200px);
  padding: 0 spacing(4);
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: spacing(4);
  margin-bottom: spacing(8);
  flex-wrap: wrap;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: border-radius(full);
  @include flex-center;
  transition: all 0.3s ease;
  text-decoration: none;
  
  img, svg {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: color(primary);
    transform: translateY(-2px);
    
    img, svg {
      filter: brightness(0) invert(1);
    }
  }
}





.copyright {
  text-align: center;
  padding-top: spacing(6);
  border-top: 1px solid color(border-light);
  
  p {
    color: color(text-muted);
    font-size: font-size(sm);
    margin: spacing(1) 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 响应式优化
@include respond-below(md) {
  .social-icons {
    gap: spacing(3);
  }
  
  .social-icon {
    width: 36px;
    height: 36px;
    
    img, svg {
      width: 18px;
      height: 18px;
    }
  }
  

}


</style>
<template>
  <div class="blog-container">
    <!-- 博客头部 -->
    <div class="blog-header" v-scroll-animation="{ animationType: 'fadeIn', delay: 0 }">
      <h1>技术博客</h1>
      <p class="blog-subtitle">分享算法学习心得与编程实践</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="blog-controls" v-scroll-animation="{ animationType: 'slideUp', delay: 100 }">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章标题或内容..."
          :prefix-icon="Search"
          clearable
          class="search-input"
        />
      </div>
      
      <div class="filter-section">
        <div class="tag-filters">
          <el-tag
            v-for="tag in allTags"
            :key="tag"
            :type="selectedTags.includes(tag) ? 'primary' : 'info'"
            :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
            @click="toggleTag(tag)"
            class="tag-filter"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="view-toggle">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="list">列表视图</el-radio-button>
            <el-radio-button label="card">卡片视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-section" v-scroll-animation="{ animationType: 'slideUp', delay: 200 }">
      <div v-if="filteredArticles.length === 0" class="no-articles">
        <el-empty description="没有找到匹配的文章" />
      </div>
      
      <div v-else :class="['articles-container', `view-${viewMode}`]">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          :class="['article-item', { 'active': selectedArticle?.id === article.id }]"
          @click="selectArticle(article)"
        >
          <div class="article-preview">
            <div class="article-header">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <span class="article-date">
                  <el-icon><Calendar /></el-icon>
                  {{ formatDate(article.publishedAt) }}
                </span>
                <span class="read-time">
                  <el-icon><Clock /></el-icon>
                  {{ article.readTime }} 分钟阅读
                </span>
              </div>
            </div>
            
            <p class="article-summary">{{ article.summary }}</p>
            
            <div class="article-tags">
              <el-tag
                v-for="tag in article.tags"
                :key="tag"
                size="small"
                type="primary"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- 文章详情模态框 -->
    <el-dialog
      v-model="showArticleDetail"
      :title="selectedArticle?.title"
      width="90%"
      :show-close="true"
      class="article-dialog"
      @close="closeArticleDetail"
    >
      <div v-if="selectedArticle" class="article-detail">
        <div class="article-detail-header">
          <div class="article-meta">
            <span class="article-date">
              <el-icon><Calendar /></el-icon>
              发布于 {{ formatDate(selectedArticle.publishedAt) }}
            </span>
            <span class="read-time">
              <el-icon><Clock /></el-icon>
              预计阅读时间 {{ selectedArticle.readTime }} 分钟
            </span>
          </div>
          <div class="article-tags">
            <el-tag
              v-for="tag in selectedArticle.tags"
              :key="tag"
              type="primary"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="article-content">
          <MarkdownContent :content="selectedArticle.content" />
        </div>
        
        <div class="article-actions">
          <SocialShare 
            :title="selectedArticle.title"
            :description="selectedArticle.summary"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Calendar, Clock } from '@element-plus/icons-vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import SocialShare from '@/components/SocialShare.vue'
import { ElLoading } from 'element-plus'
import { useSEO } from '@/composables/useSEO'
import { formatDate } from '@/utils'

// 直接导入所有文章
import fastPowerMd from '@/assets/articles/fastPower.md?raw'
import dateSimMd from '@/assets/articles/dateSim.md?raw'
import baseConvertMd from '@/assets/articles/baseConvert.md?raw'
import highPrecisionMd from '@/assets/articles/highPrecision.md?raw'

// SEO 优化
const { updateSEO } = useSEO()

// 文章数据模型
interface Article {
  id: string
  title: string
  summary: string
  content: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  readTime: number
  featured: boolean
}

// 响应式数据
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const viewMode = ref<'list' | 'card'>('list')
const showArticleDetail = ref(false)
const selectedArticle = ref<Article | null>(null)

// 文章数据
const articles = ref<Article[]>([
  {
    id: 'fastPower',
    title: '快速幂算法详解',
    summary: '深入讲解快速幂算法的原理、实现和应用场景，通过位运算优化指数运算的时间复杂度。',
    content: '',
    tags: ['算法', '数学', '快速幂', 'C++', '编程技巧'],
    publishedAt: new Date('2025-04-10'),
    updatedAt: new Date('2025-04-10'),
    readTime: 8,
    featured: true
  },
  {
    id: 'dateSim',
    title: '日期模拟算法实现',
    summary: '详细介绍日期模拟算法的设计思路和实现方法，包括闰年判断和日期计算的核心逻辑。',
    content: '',
    tags: ['算法', '日期处理', '模拟', '编程实践', 'C++'],
    publishedAt: new Date('2025-03-27'),
    updatedAt: new Date('2025-03-27'),
    readTime: 6,
    featured: false
  },
  {
    id: 'baseConvert',
    title: '进制转换算法详解',
    summary: '全面解析各种进制转换算法，包括k进制转十进制和十进制转k进制的实现方法。',
    content: '',
    tags: ['算法', '进制转换', '数学', '编程基础', '数据结构'],
    publishedAt: new Date('2025-03-27'),
    updatedAt: new Date('2025-03-27'),
    readTime: 10,
    featured: true
  },
  {
    id: 'highPrecision',
    title: '高精度算法实现与应用',
    summary: '深入探讨高精度算法的实现原理，解决大数运算问题的核心思路和优化技巧。',
    content: '',
    tags: ['算法', '高精度', '大数运算', 'C++', '数学计算'],
    publishedAt: new Date('2025-04-03'),
    updatedAt: new Date('2025-04-03'),
    readTime: 12,
    featured: false
  }
])

// 计算属性
const allTags = computed(() => {
  const tags = new Set<string>()
  articles.value.forEach(article => {
    article.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const filteredArticles = computed(() => {
  let filtered = articles.value

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 标签过滤
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(article =>
      selectedTags.value.every(tag => article.tags.includes(tag))
    )
  }

  // 按发布时间排序
  return filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
})

// 方法
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const selectArticle = (article: Article) => {
  selectedArticle.value = article
  showArticleDetail.value = true
  
  // 更新 SEO
  updateSEO({
    title: `${article.title} - meless的博客`,
    description: article.summary,
    keywords: article.tags,
    type: 'article',
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString()
  })
}

const closeArticleDetail = () => {
  showArticleDetail.value = false
  selectedArticle.value = null
  
  // 恢复博客页面的 SEO
  updateSEO({
    title: '技术博客 - meless',
    description: '分享算法学习心得与编程实践，包含快速幂、日期模拟、进制转换、高精度算法等技术文章',
    keywords: ['技术博客', '算法', 'C++', '编程', '数据结构'],
    type: 'website'
  })
}

// 加载文章内容
const loadArticleContent = async () => {
  const contentMap = {
    fastPower: fastPowerMd,
    dateSim: dateSimMd,
    baseConvert: baseConvertMd,
    highPrecision: highPrecisionMd
  }

  articles.value.forEach(article => {
    article.content = contentMap[article.id as keyof typeof contentMap] || ''
  })
}

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载文章中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    await loadArticleContent()
    
    // 初始化博客页面的 SEO
    updateSEO({
      title: '技术博客 - meless',
      description: '分享算法学习心得与编程实践，包含快速幂、日期模拟、进制转换、高精度算法等技术文章',
      keywords: ['技术博客', '算法', 'C++', '编程', '数据结构'],
      type: 'website'
    })
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.close()
  }
})
</script>

<style lang="scss" scoped>
.blog-container {
  @include container(1200px);
  padding: spacing(8) spacing(4);
  background: color(bg-primary);
  color: color(text-primary);
  min-height: 100vh;
}

// 博客头部
.blog-header {
  text-align: center;
  margin-bottom: spacing(8);
  
  h1 {
    font-size: font-size(4xl);
    font-weight: font-weight(bold);
    color: color(text-primary);
    margin-bottom: spacing(3);
    
    @include respond-to(md) {
      font-size: font-size(5xl);
    }
  }
  
  .blog-subtitle {
    font-size: font-size(lg);
    color: color(text-secondary);
    margin: 0;
  }
}

// 搜索和筛选控制区域
.blog-controls {
  margin-bottom: spacing(8);
  
  .search-section {
    margin-bottom: spacing(6);
    
    .search-input {
      max-width: 500px;
      margin: 0 auto;
      
      :deep(.el-input__wrapper) {
        background: color(bg-secondary);
        border: 1px solid color(border-primary);
        border-radius: border-radius(lg);
        
        &:hover {
          border-color: color(primary);
        }
        
        &.is-focus {
          border-color: color(primary);
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
      
      :deep(.el-input__inner) {
        color: color(text-primary);
        
        &::placeholder {
          color: color(text-muted);
        }
      }
    }
  }
  
  .filter-section {
    display: flex;
    flex-direction: column;
    gap: spacing(4);
    align-items: center;
    
    @include respond-to(md) {
      flex-direction: row;
      justify-content: space-between;
    }
    
    .tag-filters {
      display: flex;
      flex-wrap: wrap;
      gap: spacing(2);
      justify-content: center;
      
      @include respond-to(md) {
        justify-content: flex-start;
      }
      
      .tag-filter {
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }
    }
    
    .view-toggle {
      :deep(.el-radio-group) {
        .el-radio-button__inner {
          background: color(bg-secondary);
          border-color: color(border-primary);
          color: color(text-secondary);
          
          &:hover {
            color: color(primary);
          }
        }
        
        .el-radio-button__original-radio:checked + .el-radio-button__inner {
          background: color(primary);
          border-color: color(primary);
          color: white;
        }
      }
    }
  }
}

// 文章列表区域
.articles-section {
  .no-articles {
    text-align: center;
    padding: spacing(12) 0;
    
    :deep(.el-empty) {
      .el-empty__description p {
        color: color(text-muted);
      }
    }
  }
  
  .articles-container {
    &.view-list {
      display: flex;
      flex-direction: column;
      gap: spacing(4);
    }
    
    &.view-card {
      display: grid;
      grid-template-columns: 1fr;
      gap: spacing(6);
      
      @include respond-to(md) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @include respond-to(lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
}

// 文章项样式
.article-item {
  background: color(bg-card);
  border: 1px solid color(border-primary);
  border-radius: border-radius(lg);
  padding: spacing(6);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: color(primary);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &.active {
    border-color: color(primary);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  .article-preview {
    .article-header {
      margin-bottom: spacing(4);
      
      .article-title {
        font-size: font-size(xl);
        font-weight: font-weight(semibold);
        color: color(text-primary);
        margin: 0 0 spacing(3) 0;
        line-height: 1.3;
        
        @include respond-to(md) {
          font-size: font-size(2xl);
        }
      }
      
      .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: spacing(4);
        font-size: font-size(sm);
        color: color(text-muted);
        
        .article-date,
        .read-time {
          display: flex;
          align-items: center;
          gap: spacing(1);
          
          .el-icon {
            font-size: font-size(sm);
          }
        }
      }
    }
    
    .article-summary {
      color: color(text-secondary);
      line-height: 1.6;
      margin: spacing(4) 0;
      font-size: font-size(base);
    }
    
    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: spacing(2);
      margin-top: spacing(4);
    }
  }
}

// 文章详情对话框
:deep(.article-dialog) {
  .el-dialog {
    background: color(bg-primary);
    border: 1px solid color(border-primary);
    
    .el-dialog__header {
      background: color(bg-secondary);
      border-bottom: 1px solid color(border-primary);
      
      .el-dialog__title {
        color: color(text-primary);
        font-weight: font-weight(semibold);
      }
      
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: color(text-secondary);
          
          &:hover {
            color: color(text-primary);
          }
        }
      }
    }
    
    .el-dialog__body {
      padding: spacing(6);
      max-height: 70vh;
      overflow-y: auto;
      @include custom-scrollbar;
    }
  }
}

.article-detail {
  .article-detail-header {
    margin-bottom: spacing(6);
    padding-bottom: spacing(4);
    border-bottom: 1px solid color(border-primary);
    
    .article-meta {
      display: flex;
      flex-wrap: wrap;
      gap: spacing(4);
      margin-bottom: spacing(4);
      font-size: font-size(sm);
      color: color(text-muted);
      
      .article-date,
      .read-time {
        display: flex;
        align-items: center;
        gap: spacing(1);
        
        .el-icon {
          font-size: font-size(sm);
        }
      }
    }
    
    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: spacing(2);
    }
  }
  
  .article-content {
    margin-bottom: spacing(6);
  }
  
  .article-actions {
    padding-top: spacing(4);
    border-top: 1px solid color(border-primary);
  }
}

// 响应式优化
@include respond-to(mobile) {
  .blog-container {
    padding: spacing(4) spacing(2);
  }
  
  .blog-header {
    h1 {
      font-size: font-size(3xl);
    }
    
    .blog-subtitle {
      font-size: font-size(base);
    }
  }
  
  .blog-controls {
    .filter-section {
      .tag-filters {
        justify-content: center;
      }
    }
  }
  
  .article-item {
    padding: spacing(4);
    
    .article-preview {
      .article-header {
        .article-title {
          font-size: font-size(lg);
        }
      }
    }
  }
}
</style>

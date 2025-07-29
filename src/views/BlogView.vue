<template>
  <div class="blog-container">
    <h1 v-scroll-animation="{ animationType: 'fadeIn', delay: 0 }">博客文章</h1>
    <el-tabs 
      v-model="activeTab"
      v-scroll-animation="{ animationType: 'slideUp', delay: 200 }"
    >
      <el-tab-pane label="快速幂" name="fastPower">
        <el-card class="blog-card">
          <div class="article-header">
            <h2 class="article-title">{{ articlesMetadata.fastPower.title }}</h2>
            <div class="article-meta">
              <span class="article-date">发布于 {{ formatDate(articlesMetadata.fastPower.publishedAt) }}</span>
              <div class="article-tags">
                <span v-for="tag in articlesMetadata.fastPower.tags" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <MarkdownContent :content="articles.fastPower" />
          <SocialShare 
            :title="articlesMetadata.fastPower.title"
            :description="articlesMetadata.fastPower.description"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="日期模拟" name="dateSim">
        <el-card class="blog-card">
          <div class="article-header">
            <h2 class="article-title">{{ articlesMetadata.dateSim.title }}</h2>
            <div class="article-meta">
              <span class="article-date">发布于 {{ formatDate(articlesMetadata.dateSim.publishedAt) }}</span>
              <div class="article-tags">
                <span v-for="tag in articlesMetadata.dateSim.tags" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <MarkdownContent :content="articles.dateSim" />
          <SocialShare 
            :title="articlesMetadata.dateSim.title"
            :description="articlesMetadata.dateSim.description"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="进制转换" name="baseConvert">
        <el-card class="blog-card">
          <div class="article-header">
            <h2 class="article-title">{{ articlesMetadata.baseConvert.title }}</h2>
            <div class="article-meta">
              <span class="article-date">发布于 {{ formatDate(articlesMetadata.baseConvert.publishedAt) }}</span>
              <div class="article-tags">
                <span v-for="tag in articlesMetadata.baseConvert.tags" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <MarkdownContent :content="articles.baseConvert" />
          <SocialShare 
            :title="articlesMetadata.baseConvert.title"
            :description="articlesMetadata.baseConvert.description"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="高精度算法" name="highPrecision">
        <el-card class="blog-card">
          <div class="article-header">
            <h2 class="article-title">{{ articlesMetadata.highPrecision.title }}</h2>
            <div class="article-meta">
              <span class="article-date">发布于 {{ formatDate(articlesMetadata.highPrecision.publishedAt) }}</span>
              <div class="article-tags">
                <span v-for="tag in articlesMetadata.highPrecision.tags" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <MarkdownContent :content="articles.highPrecision" />
          <SocialShare 
            :title="articlesMetadata.highPrecision.title"
            :description="articlesMetadata.highPrecision.description"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

const activeTab = ref('fastPower')

// 文章元数据
interface ArticleMetadata {
  title: string
  description: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
}

interface Articles {
  fastPower: string
  dateSim: string
  baseConvert: string
  highPrecision: string
}

const articles = ref<Articles>({
  fastPower: '',
  dateSim: '',
  baseConvert: '',
  highPrecision: ''
})

// 文章元数据配置
const articlesMetadata: Record<string, ArticleMetadata> = {
  fastPower: {
    title: '快速幂算法详解',
    description: '深入讲解快速幂算法的原理、实现和应用场景，包含完整的代码示例和复杂度分析。',
    tags: ['算法', '数学', '快速幂', 'C++', '编程技巧'],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  dateSim: {
    title: '日期模拟算法实现',
    description: '详细介绍日期模拟算法的设计思路和实现方法，解决日期计算相关的编程问题。',
    tags: ['算法', '日期处理', '模拟', '编程实践', 'C++'],
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  baseConvert: {
    title: '进制转换算法详解',
    description: '全面解析各种进制转换算法，包括二进制、八进制、十六进制之间的相互转换方法。',
    tags: ['算法', '进制转换', '数学', '编程基础', '数据结构'],
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  },
  highPrecision: {
    title: '高精度算法实现与应用',
    description: '深入探讨高精度算法的实现原理，包括大数加减乘除运算的具体实现和优化技巧。',
    tags: ['算法', '高精度', '大数运算', 'C++', '数学计算'],
    publishedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  }
}

const loadMarkdown = async (key: keyof Articles, content: string) => {
  articles.value[key] = content
}

// 更新当前文章的 SEO
const updateArticleSEO = (articleKey: string) => {
  const metadata = articlesMetadata[articleKey]
  if (metadata) {
    updateSEO({
      title: `${metadata.title} - meless的博客`,
      description: metadata.description,
      keywords: metadata.tags,
      type: 'article',
      publishedTime: metadata.publishedAt.toISOString(),
      modifiedTime: metadata.updatedAt.toISOString()
    })
  }
}

// 监听标签页切换，更新 SEO
watch(activeTab, (newTab) => {
  updateArticleSEO(newTab)
}, { immediate: true })

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载文章中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    await Promise.all([
      loadMarkdown('fastPower', fastPowerMd),
      loadMarkdown('dateSim', dateSimMd),
      loadMarkdown('baseConvert', baseConvertMd),
      loadMarkdown('highPrecision', highPrecisionMd)
    ])
    
    // 初始化当前文章的 SEO
    updateArticleSEO(activeTab.value)
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.close()
  }
})
</script>

<style lang="scss" scoped>
.blog-container {
  @include container(900px);
  padding: spacing(8) spacing(4);
  background: color(bg-primary);
  color: color(text-primary);
  min-height: 100vh;
  
  h1 {
    text-align: center;
    margin-bottom: spacing(8);
    color: color(text-primary);
  }
  
  :deep(.el-tabs) {
    .el-tabs__header {
      background: color(bg-secondary);
      border-radius: border-radius(lg);
      padding: spacing(2);
      margin-bottom: spacing(6);
    }
    
    .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }
    
    .el-tabs__item {
      color: color(text-secondary);
      border: none;
      
      &.is-active {
        color: color(primary);
      }
      
      &:hover {
        color: color(primary);
      }
    }
  }
}

.blog-card {
  :deep(.el-card) {
    background: color(bg-card);
    border: 1px solid color(border-primary);
    border-radius: border-radius(lg);
    
    .el-card__body {
      padding: spacing(6);
    }
  }
}

// 文章头部样式
.article-header {
  margin-bottom: spacing(6);
  padding-bottom: spacing(4);
  border-bottom: 1px solid color(border-primary);
}

.article-title {
  font-size: font-size(2xl);
  font-weight: font-weight(bold);
  color: color(text-primary);
  margin: 0 0 spacing(3) 0;
  line-height: 1.25;
  
  @include respond-to(md) {
    font-size: font-size(3xl);
  }
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  
  @include respond-to(md) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.article-date {
  font-size: font-size(sm);
  color: color(text-muted);
  font-weight: font-weight(medium);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.article-tag {
  display: inline-block;
  padding: spacing(1) spacing(2);
  background: rgba(64, 158, 255, 0.1);
  color: color(primary);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: border-radius(base);
  font-size: font-size(xs);
  font-weight: font-weight(medium);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(64, 158, 255, 0.2);
    transform: translateY(-1px);
  }
}
</style>

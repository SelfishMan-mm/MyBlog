import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import BlogView from '@/views/BlogView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView,
      meta: { title: '首页', transitionName: 'fade' }
    },
    { 
      path: '/about', 
      name: 'about', 
      component: AboutView,
      meta: { title: '关于我', transitionName: 'slide-right' }
    },
    { 
      path: '/projects', 
      name: 'projects', 
      component: ProjectsView,
      meta: { title: '项目展示', transitionName: 'slide-left' }
    },
    { 
      path: '/blog', 
      name: 'blog', 
      component: BlogView,
      meta: { title: '博客', transitionName: 'zoom' }
    },

    { 
      path: '/contact', 
      name: 'contact', 
      component: ContactView,
      meta: { title: '联系我', transitionName: 'flip' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
})

// 路由守卫 - 更新页面标题
router.beforeEach((to) => {
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} - meless`
  }
})

export default router

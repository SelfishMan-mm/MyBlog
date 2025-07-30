<template>
  <div class="app-container">
    <Navigation />
    <main class="app-main">
      <router-view></router-view>
    </main>
    <Footer />
    
    <!-- 全局音乐播放器 - APlayer版本 -->
    <APlayerMusic />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import APlayerMusic from '@/components/APlayerMusic.vue'
console.log('App.vue loaded')
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 0;
  background: #111;
  position: relative;
}
</style>
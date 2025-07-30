<template>
  <div class="aplayer-music-container">
    <!-- APlayer 容器 - 始终存在，不受Vue响应式控制 -->
    <div id="aplayer-container" style="display: none;"></div>
    
    <!-- 浮动音乐播放器按钮 -->
    <div
      :class="['floating-music-btn', { expanded: isExpanded }]"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @mousedown="handleMouseDown"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="togglePlayer"
    >
      <div class="music-icon">
        <el-icon :size="24">
          <Headset />
        </el-icon>
      </div>
      
      <!-- 展开状态显示当前播放信息 -->
      <div v-if="isExpanded && currentTrack" class="current-info">
        <div class="track-title">{{ currentTrack.title }}</div>
        <div class="track-artist">{{ currentTrack.artist }}</div>
      </div>
    </div>

    <!-- 音乐播放器面板 -->
    <div v-if="showPlayer" class="music-player-panel" @click.stop>
      <div class="panel-header">
        <h3>我的音乐</h3>
        <button class="close-btn" @click="closePlayer">
          <el-icon><Close /></el-icon>
        </button>
      </div>
      
      <!-- MetingJS/APlayer 播放器显示区域 -->
      <div class="meting-container">
        <!-- APlayer内容将通过JavaScript显示在这里 -->
        <div id="aplayer-display-area"></div>
      </div>
      
      <!-- 播放器说明 -->
      <div class="player-info">
        <p class="info-text">🎵 当前播放：Meless歌单</p>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="showPlayer" class="music-overlay" @click="closePlayer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Headset, Close } from '@element-plus/icons-vue'
import { customTracks } from '@/data/aplayerMusic'

// 响应式数据
const isExpanded = ref(false)
const showPlayer = ref(false)
const isDragging = ref(false)
const position = ref({ x: 100, y: 100 })
const dragOffset = ref({ x: 0, y: 0 })
const currentPlaylist = ref('qq')
const currentTrack = ref<{ title: string; artist: string } | null>(null)
let aplayerInstance: any = null

// 使用一个全局标记来跟踪APlayer是否已经初始化
const APLAYER_INITIALIZED_KEY = 'aplayer_initialized'

// 拖拽相关
const handleMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) return
  
  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const newPosition = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y
  }
  
  // 限制拖拽范围
  const maxX = window.innerWidth - 60
  const maxY = window.innerHeight - 60
  
  newPosition.x = Math.max(0, Math.min(maxX, newPosition.x))
  newPosition.y = Math.max(0, Math.min(maxY, newPosition.y))
  
  position.value = newPosition
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  // 保存位置
  localStorage.setItem('musicPlayerPosition', JSON.stringify(position.value))
}

// 悬停效果
const handleMouseEnter = () => {
  if (!isDragging.value) {
    isExpanded.value = true
  }
}

const handleMouseLeave = () => {
  isExpanded.value = false
}

const closePlayer = () => {
  showPlayer.value = false
  // 不销毁APlayer实例，只是隐藏播放器
  // 这样可以保持播放状态和进度
}

// 初始化 APlayer
const initAPlayer = () => {
  console.log('initAPlayer called')
  const container = document.getElementById('aplayer-container')
  console.log('Container found:', !!container)
  console.log('APlayer available:', !!window.APlayer)
  console.log('Custom tracks data:', customTracks)
  
  if (!container || !window.APlayer) {
    console.error('Container or APlayer not available')
    return
  }

  // 销毁现有实例
  if (aplayerInstance) {
    console.log('Destroying existing APlayer instance')
    aplayerInstance.destroy()
    aplayerInstance = null
  }

  try {
    // 创建新的 APlayer 实例
    console.log('Creating new APlayer instance with tracks:', customTracks.length)
    aplayerInstance = new window.APlayer({
      container: container,
      fixed: false,
      mini: false,
      autoplay: false,
      theme: '#409EFF',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: false,
      listMaxHeight: '300px',
      lrcType: 0,
      audio: customTracks
    })

    // 设置全局aplayer实例
    window.aplayer = aplayerInstance
    console.log('APlayer instance created successfully')
    console.log('APlayer container innerHTML:', container.innerHTML.substring(0, 500))
    console.log('APlayer list length:', aplayerInstance.list ? aplayerInstance.list.audios.length : 'No list')

    // 设置事件监听
    setupAPlayerEvents()
  } catch (error) {
    console.error('Error creating APlayer instance:', error)
  }
}

// 这个函数现在不需要了，直接使用 initAPlayer

// 监听 APlayer 事件
const setupAPlayerEvents = () => {
  if (!aplayerInstance) return

  // 监听播放事件
  aplayerInstance.on('play', () => {
    const audio = aplayerInstance.list.audios[aplayerInstance.list.index]
    if (audio) {
      currentTrack.value = {
        title: audio.name || '未知歌曲',
        artist: audio.artist || '未知艺术家'
      }
    }
  })
  
  // 监听暂停事件
  aplayerInstance.on('pause', () => {
    // 可以在这里处理暂停逻辑
  })
  
  // 监听歌曲切换事件
  aplayerInstance.on('listswitch', (index: number) => {
    const audio = aplayerInstance.list.audios[index]
    if (audio) {
      currentTrack.value = {
        title: audio.name || '未知歌曲',
        artist: audio.artist || '未知艺术家'
      }
    }
  })

  // 监听加载完成事件
  aplayerInstance.on('loadeddata', () => {
    console.log('APlayer loaded successfully')
  })
}

// 生命周期
onMounted(() => {
  // 恢复位置
  const savedPosition = localStorage.getItem('musicPlayerPosition')
  if (savedPosition) {
    position.value = JSON.parse(savedPosition)
  }
  
  // 等待 APlayer 库加载完成
  const checkAPlayerReady = () => {
    console.log('Checking APlayer availability:', !!window.APlayer)
    
    if (window.APlayer) {
      console.log('APlayer ready, waiting for user interaction...')
    } else {
      // 如果 APlayer 还没加载完成，继续等待
      setTimeout(checkAPlayerReady, 100)
    }
  }
  
  checkAPlayerReady()
})

// 播放器控制
const togglePlayer = () => {
  if (!isDragging.value) {
    const wasOpen = showPlayer.value
    showPlayer.value = !showPlayer.value
    
    // 如果是打开播放器
    if (showPlayer.value && !wasOpen) {
      console.log('Opening player...')
      
      // 使用 nextTick 确保 DOM 更新完成后再获取容器
      nextTick(() => {
        const container = document.getElementById('aplayer-container')
        console.log('Container element after nextTick:', container)
        
        if (container) {
          // 检查全局window.aplayer是否存在且有效
          const hasGlobalAPlayer = window.aplayer && typeof window.aplayer.play === 'function'
          
          console.log('Has global APlayer:', hasGlobalAPlayer)
          console.log('Local aplayerInstance:', !!aplayerInstance)
          
          // 获取显示区域
          const displayArea = document.getElementById('aplayer-display-area')
          
          // 如果已经有全局APlayer实例，说明播放器已经初始化过
          if (hasGlobalAPlayer && aplayerInstance) {
            console.log('APlayer already exists, recreating in display area')
            // 确保本地引用正确
            aplayerInstance = window.aplayer
            
            // 获取当前播放状态
            const currentIndex = aplayerInstance.list ? aplayerInstance.list.index : 0
            const currentTime = aplayerInstance.audio ? aplayerInstance.audio.currentTime : 0
            const isCurrentlyPlaying = aplayerInstance.audio ? !aplayerInstance.audio.paused : false
            const currentVolume = aplayerInstance.volume ? aplayerInstance.volume() : 0.7
            
            // 销毁旧实例
            aplayerInstance.destroy()
            
            // 在显示区域重新创建实例
            if (displayArea) {
              displayArea.innerHTML = ''
              
              aplayerInstance = new window.APlayer({
                container: displayArea,
                fixed: false,
                mini: false,
                autoplay: false,
                theme: '#409EFF',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: currentVolume,
                mutex: true,
                listFolded: false,
                listMaxHeight: '300px',
                lrcType: 0,
                audio: customTracks
              })
              
              // 设置全局实例和事件监听
              window.aplayer = aplayerInstance
              setupAPlayerEvents()
              
              // 恢复播放状态
              setTimeout(() => {
                if (currentIndex > 0) {
                  aplayerInstance.list.switch(currentIndex)
                }
                if (currentTime > 0) {
                  aplayerInstance.seek(currentTime)
                }
                if (isCurrentlyPlaying) {
                  aplayerInstance.play()
                }
              }, 500)
              
              console.log('APlayer recreated in display area with preserved state')
            }
            return
          }
          
          // 只有在没有实例时才初始化
          console.log('Initializing APlayer...')
          
          if (displayArea) {
            displayArea.innerHTML = ''
            
            setTimeout(() => {
              console.log('Creating APlayer in display area...')
              // 直接在显示区域初始化
              aplayerInstance = new window.APlayer({
                container: displayArea,
                fixed: false,
                mini: false,
                autoplay: false,
                theme: '#409EFF',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.7,
                mutex: true,
                listFolded: false,
                listMaxHeight: '300px',
                lrcType: 0,
                audio: customTracks
              })
              
              // 设置全局实例和事件监听
              window.aplayer = aplayerInstance
              setupAPlayerEvents()
              
              console.log('APlayer initialized in display area')
              
              // 同时将内容复制到隐藏容器，以便下次使用
              const hiddenContainer = document.getElementById('aplayer-container')
              if (hiddenContainer) {
                hiddenContainer.innerHTML = displayArea.innerHTML
              }
            }, 100)
          }
        } else {
          console.error('Container element not found!')
        }
      })
    }
  }
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// 显示备用UI
const showFallbackUI = () => {
  const container = document.getElementById('aplayer-container')
  if (container) {
    container.innerHTML = `
      <div class="fallback-ui">
        <div class="fallback-header">
          <h4>🎵 我的音乐歌单</h4>
          <p>由于API限制，无法直接播放，点击下方按钮前往QQ音乐</p>
        </div>
        <div class="fallback-content">
          <div class="playlist-info">
            <img src="/music/covers/default-cover.svg" alt="歌单封面" class="playlist-cover">
            <div class="playlist-details">
              <h5>meless的精选歌单</h5>
              <p>包含周杰伦、Galdive等艺术家的精选作品</p>
              <button class="open-qq-music-btn" onclick="window.open('https://i.y.qq.com/n2/m/share/details/taoge.html?id=9547514149', '_blank')">
                🎵 在QQ音乐中打开
              </button>
            </div>
          </div>
          <div class="song-list">
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=兰亭序%20周杰伦', '_blank')">
              <span class="song-name">兰亭序</span>
              <span class="song-artist">周杰伦</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=青花瓷%20周杰伦', '_blank')">
              <span class="song-name">青花瓷</span>
              <span class="song-artist">周杰伦</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=稻香%20周杰伦', '_blank')">
              <span class="song-name">稻香</span>
              <span class="song-artist">周杰伦</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=夜曲%20周杰伦', '_blank')">
              <span class="song-name">夜曲</span>
              <span class="song-artist">周杰伦</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=爱在西元前%20周杰伦', '_blank')">
              <span class="song-name">爱在西元前</span>
              <span class="song-artist">周杰伦</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=Cloud%20Galdive', '_blank')">
              <span class="song-name">Cloud</span>
              <span class="song-artist">Galdive</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=Crazy%20Driving%20Galdive', '_blank')">
              <span class="song-name">Crazy Driving</span>
              <span class="song-artist">Galdive</span>
              <span class="play-hint">🎵</span>
            </div>
            <div class="song-item" onclick="window.open('https://y.qq.com/n/ryqq/search?w=Wasted%20Murkish%20Remix', '_blank')">
              <span class="song-name">Wasted (Murkish Remix)</span>
              <span class="song-artist">Strangerboi24</span>
              <span class="play-hint">🎵</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// 声明全局类型
declare global {
  interface Window {
    APlayer: any
    aplayer: any
  }
}
</script>

<style lang="scss" scoped>
.aplayer-music-container {
  position: relative;
  z-index: 9999;
}

// 浮动音乐按钮
.floating-music-btn {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #79bbff);
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
  cursor: move;
  transition: all 0.3s ease;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(64, 158, 255, 0.4);
  }
  
  &.expanded {
    width: 200px;
    border-radius: 30px;
    justify-content: flex-start;
    padding: 0 15px;
    
    .music-icon {
      margin-right: 10px;
    }
  }
  
  .music-icon {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .current-info {
    flex: 1;
    min-width: 0;
    
    .track-title {
      font-size: 12px;
      font-weight: bold;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }
    
    .track-artist {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }
  }
}

// 音乐播放器面板
.music-player-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 10001;
  overflow: hidden;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #2a2a2a;
    border-bottom: 1px solid #333;
    
    h3 {
      color: #409EFF;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #333;
        color: white;
      }
    }
  }
  
  .meting-container {
    padding: 20px;
    
    // 自定义 APlayer 样式
    :deep(.aplayer) {
      background: transparent;
      border-radius: 8px;
      box-shadow: none;
      
      .aplayer-info {
        background: #2a2a2a;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
      }
      
      .aplayer-list {
        background: #2a2a2a;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
        
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-track {
          background: #333;
          border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: #409EFF;
          border-radius: 3px;
        }
      }
      
      .aplayer-list ol li {
        border-bottom: 1px solid #333;
        
        &:hover {
          background: #333;
        }
        
        &.aplayer-list-light {
          background: #409EFF;
        }
      }
      
      .aplayer-title {
        color: white;
      }
      
      .aplayer-author {
        color: #999;
      }

      // 优化音量条样式（更易拖动，视觉更自然）
      .aplayer-volume {
        height: 18px !important;
        display: flex;
        align-items: center;
      }
      .aplayer-volume-bar-wrap {
        height: 12px !important;
        display: flex;
        align-items: center;
        padding: 0 4px;
      }
      .aplayer-volume-bar {
        height: 4px !important;
        border-radius: 2px;
        background: #444;
        cursor: pointer;
      }
      .aplayer-volume-bar-inner {
        height: 4px !important;
        border-radius: 2px;
        background: #409EFF;
      }
      .aplayer-volume-dot {
        width: 12px !important;
        height: 12px !important;
        top: 50% !important;
        transform: translateY(-50%);
        background: #409EFF;
        border: 1.5px solid #fff;
        box-shadow: 0 1px 4px rgba(64,158,255,0.15);
        cursor: pointer;
        transition: box-shadow 0.2s;
      }
      .aplayer-volume-dot:hover {
        box-shadow: 0 2px 8px rgba(64,158,255,0.25);
      }
    }
  }
  
  .playlist-selector {
    padding: 0 20px 20px;
    
    h4 {
      color: white;
      margin: 0 0 15px 0;
      font-size: 16px;
    }
    
    .playlist-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .playlist-btn {
      padding: 8px 16px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 20px;
      color: #999;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      
      &:hover {
        border-color: #409EFF;
        color: #409EFF;
      }
      
      &.active {
        background: #409EFF;
        border-color: #409EFF;
        color: white;
      }
    }
  }
  
  .player-info {
    padding: 15px 20px;
    background: #2a2a2a;
    border-top: 1px solid #333;
    text-align: center;
    
    .info-text {
      color: #409EFF;
      font-size: 14px;
      font-weight: bold;
      margin: 0 0 5px 0;
    }
    
    .info-desc {
      color: #999;
      font-size: 12px;
      margin: 0;
      line-height: 1.4;
    }
  }
}

// 遮罩层
.music-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  backdrop-filter: blur(5px);
}

// 备用UI样式
:deep(.fallback-ui) {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  color: white;
  
  .fallback-header {
    text-align: center;
    margin-bottom: 20px;
    
    h4 {
      color: #409EFF;
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    
    p {
      color: #999;
      margin: 0;
      font-size: 14px;
    }
  }
  
  .fallback-content {
    .playlist-info {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      padding: 15px;
      background: #333;
      border-radius: 8px;
      
      .playlist-cover {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        background: #409EFF;
      }
      
      .playlist-details {
        flex: 1;
        
        h5 {
          color: white;
          margin: 0 0 5px 0;
          font-size: 16px;
        }
        
        p {
          color: #999;
          margin: 0 0 10px 0;
          font-size: 12px;
        }
        
        .open-qq-music-btn {
          background: #409EFF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
          
          &:hover {
            background: #79bbff;
            transform: scale(1.05);
          }
        }
      }
    }
    
    .song-list {
      .song-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #333;
        margin-bottom: 8px;
        border-radius: 6px;
        transition: all 0.3s ease;
        
        &:hover {
          background: #404040;
        }
        
        .song-name {
          color: white;
          font-weight: 500;
          font-size: 14px;
        }
        
        .song-artist {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .music-player-panel {
    width: 95vw;
    max-height: 85vh;
    
    .panel-header {
      padding: 15px;
      
      h3 {
        font-size: 16px;
      }
    }
    
    .meting-container {
      padding: 15px;
    }
    
    .playlist-selector {
      padding: 0 15px 15px;
      
      .playlist-options {
        flex-direction: column;
      }
      
      .playlist-btn {
        text-align: center;
      }
    }
  }
  
  .floating-music-btn {
    &.expanded {
      width: 180px;
      
      .current-info {
        .track-title {
          font-size: 11px;
        }
        
        .track-artist {
          font-size: 9px;
        }
      }
    }
  }
}
</style>
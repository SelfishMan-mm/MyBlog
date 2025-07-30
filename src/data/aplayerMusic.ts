/**
 * APlayer 音乐配置
 * 支持多种音乐源和自定义歌单
 */

export interface MusicTrack {
  name: string
  artist: string
  url: string
  cover: string
  lrc?: string
}

export interface PlaylistConfig {
  id: string
  name: string
  description: string
  server: 'netease' | 'qq' | 'custom'
  type: 'playlist' | 'song' | 'album'
  tracks?: MusicTrack[]
}

// 自定义歌单 - 使用本地音频文件
export const customTracks: MusicTrack[] = [
  {
    name: "兰亭序",
    artist: "周杰伦",
    url: "/music/audio/周杰伦-兰亭序.mp3",
    cover: "/music/covers/lan-ting-xu.jpg",
    lrc: "[00:00.00]兰亭序 - 周杰伦\n[00:20.00]兰亭临帖 行书如行云流水\n[00:25.00]月下门推 心细如你脚步碎\n[00:30.00]忙不迭 千年碑易拓却难拓你的美\n[00:35.00]真迹绝 是谁又在练王羲之的字体"
  },
  {
    name: "爱在西元前",
    artist: "周杰伦",
    url: "/music/audio/周杰伦 - 爱在西元前.mp3",
    cover: "/music/covers/ai-zai-xi-yuan-qian.jpg",
    lrc: "[00:00.00]爱在西元前 - 周杰伦\n[00:20.00]古巴比伦王颁布了汉摩拉比法典\n[00:25.00]刻在黑色的玄武岩距今已经三千七百多年\n[00:30.00]你在橱窗前凝视碑文的字眼\n[00:35.00]我却在旁静静欣赏你那张我深爱的脸"
  },
  {
    name: "Cloud",
    artist: "Galdive",
    url: "/music/audio/Cloud-Galdive.mp3",
    cover: "/music/covers/Cloud.jpg",
    lrc: "[00:00.00]Cloud - Galdive\n[00:20.00]Floating in the clouds above\n[00:25.00]Electronic dreams and love\n[00:30.00]Synthesized melodies flow\n[00:35.00]In this digital afterglow"
  },
  {
    name: "Crazy Driving",
    artist: "Galdive",
    url: "/music/audio/Crazy-Driving-Galdive.mp3",
    cover: "/music/covers/Crazy-Driving.jpg",
    lrc: "[00:00.00]Crazy Driving - Galdive\n[00:20.00]Racing through the neon night\n[00:25.00]Electronic beats so bright\n[00:30.00]Driving fast with no regret\n[00:35.00]This is a night I won't forget"
  },
  {
    name: "Wasted (Murkish Remix)",
    artist: "Strangerboi24 / Murkish",
    url: "/music/audio/Wasted-Murkish-Remix.mp3",
    cover: "/music/covers/electronic.jpg",
    lrc: "[00:00.00]Wasted (Murkish Remix) - Strangerboi24\n[00:20.00]Electronic beats and bass\n[00:25.00]Lost in this digital space\n[00:30.00]Remix takes me higher\n[00:35.00]Setting my soul on fire"
  }
]

// 预设歌单配置
export const playlistConfigs: PlaylistConfig[] = [
  {
    id: "netease_7452421335",
    name: "网易云精选",
    description: "来自网易云音乐的精选歌单",
    server: "netease",
    type: "playlist"
  },
  {
    id: "qq_9547514149", 
    name: "meless的精选歌单",
    description: "来自QQ音乐的个人精选歌单 - https://i.y.qq.com/n2/m/share/details/taoge.html?id=9547514149",
    server: "qq",
    type: "playlist"
  },
  {
    id: "custom_meless",
    name: "自定义歌单",
    description: "本地自定义音乐合集",
    server: "custom",
    type: "playlist",
    tracks: customTracks
  }
]

// MetingJS 配置生成器
export const generateMetingConfig = (playlist: PlaylistConfig) => {
  const baseConfig = {
    fixed: "false",
    mini: "false", 
    autoplay: "false",
    theme: "#409EFF",
    loop: "all",
    order: "random",
    preload: "auto",
    volume: "0.7",
    mutex: "true",
    lrctype: "0",
    listfolded: "false",
    listmaxheight: "400px",
    storagename: `meless_music_${playlist.server}`
  }

  if (playlist.server === 'custom') {
    return {
      ...baseConfig,
      server: "custom",
      type: "custom",
      audio: playlist.tracks || []
    }
  }

  return {
    ...baseConfig,
    server: playlist.server,
    type: playlist.type,
    id: playlist.id.split('_')[1] // 提取实际的ID
  }
}

// 音乐播放器主题配置
export const playerThemes = {
  default: "#409EFF",
  dark: "#2c3e50", 
  purple: "#9b59b6",
  green: "#27ae60",
  orange: "#e67e22"
}

// 播放模式配置
export const playModes = {
  list: "list",      // 列表循环
  order: "order",    // 顺序播放
  random: "random"   // 随机播放
}

// APlayer 全局配置
export const aplayerGlobalConfig = {
  container: '.aplayer-container',
  fixed: false,
  mini: false,
  autoplay: false,
  theme: playerThemes.default,
  loop: 'all',
  order: 'random',
  preload: 'auto',
  volume: 0.7,
  mutex: true,
  listFolded: false,
  listMaxHeight: '400px',
  lrcType: 0,
  audio: customTracks
}

export default {
  customTracks,
  playlistConfigs,
  generateMetingConfig,
  playerThemes,
  playModes,
  aplayerGlobalConfig
}
<!-- 视频播放器组件：https://h5player.bytedance.com/ -->
<script setup lang="ts">
import Player from 'xgplayer'

import Mobile from 'xgplayer/es/plugins/mobile'

import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'ArtVideoPlayer',
})

const props = withDefaults(defineProps<Props>(), {
  playerId: '',
  videoUrl: '',
  posterUrl: '',
  startTime: 0,
  autoplay: false,
  volume: 1,
  loop: false,
  muted: false,
  disableProgressDrag: false,
})

const emit = defineEmits<{

  /** 播放器准备完成时触发。 */
  ready: [player: Player]

  /** 视频开始播放时触发。 */
  play: [player: Player]

  /** 视频暂停时触发。 */
  pause: [player: Player]

  /** 视频播放结束时触发。 */
  ended: [player: Player]

  /** 播放器发生错误时触发。 */
  error: [error: unknown]

  /** 播放进度更新时触发，返回当前播放时间与视频总时长。 */
  timeupdate: [

    /** 播放进度信息。 */
    payload: {

      /** 当前播放时间，单位秒。 */
      currentTime: number

      /** 视频总时长，单位秒。 */
      duration: number
    },
  ]
}>()

type Props = {

  /** 播放器容器 ID */
  playerId?: string

  /** 视频源URL */
  videoUrl?: string

  /** 视频封面图URL */
  posterUrl?: string

  /** 初始播放时间，单位秒 */
  startTime?: number

  /** 是否自动播放 */
  autoplay?: boolean

  /** 音量大小(0-1) */
  volume?: number

  /** 可选的播放速率 */
  playbackRates?: number[]

  /** 是否循环播放 */
  loop?: boolean

  /** 是否静音 */
  muted?: boolean

  /** 自定义播放器样式 */
  commonStyle?: VideoPlayerStyle

  /** 是否禁用拖拽进度 */
  isDraggingSeek?: boolean

  /** 是否禁用拖拽进度 */
  disableProgressDrag?: boolean
}

const localPlayerId = `art-video-player-${Math.random()
  .toString(36)
  .slice(2, 10)}`

const resolvedPlayerId = computed(() => props.playerId || localPlayerId)

/**
   * 视频播放器实例引用
   */
const playerInstance = ref<Player | null>(null)

/**
   * 视频播放器样式接口定义
   */
type VideoPlayerStyle = {

  /** 进度条背景色 */
  progressColor?: string

  /** 已播放部分颜色 */
  playedColor?: string

  /** 缓存部分颜色 */
  cachedColor?: string

  /** 滑块按钮样式 */
  sliderBtnStyle?: Record<string, string>

  /** 音量控制器颜色 */
  volumeColor?: string
}

/**
   * 视频播放器默认样式配置
   */
const defaultStyle: VideoPlayerStyle = {
  progressColor: 'rgba(255, 255, 255, 0.3)',
  playedColor: '#00AEED',
  cachedColor: 'rgba(255, 255, 255, 0.6)',
  sliderBtnStyle: {
    width: '10px',
    height: '10px',
    backgroundColor: '#00AEED',
  },
  volumeColor: '#00AEED',
}

function destroyPlayer() {
  if (playerInstance.value) {
    playerInstance.value.destroy()
    playerInstance.value = null
  }
}

function initPlayer() {
  if (!props.videoUrl) {
    return
  }

  destroyPlayer()

  playerInstance.value = new Player({
    id: resolvedPlayerId.value,

    /** 设置界面语言为中文 */
    lang: 'zh',

    /** 音量大小(0-1) */
    volume: props.volume,

    /** 是否自动播放 */
    autoplay: props.autoplay,

    /** 启用截图功能 */
    screenShot: false,

    /** 视频源URL */
    url: props.videoUrl,

    /** 视频封面图URL */
    poster: props.posterUrl,

    /** 启用流式布局，自适应容器大小 */
    fluid: true,

    /** 启用移动端交互插件 */
    plugins: [Mobile],

    /** 可选的播放速率 */
    playbackRate: props.playbackRates,

    /** 是否循环播放 */
    loop: props.loop,

    /** 是否静音 */
    muted: props.muted,

    /** 初始播放时间 */
    currentTime: props.startTime,

    /** 自定义播放器样式 */
    commonStyle: {
      ...defaultStyle,
      ...props.commonStyle,
    },

    progress: {
      /** 关闭滑块拖拽seek，不能拖动小圆点 */
      closeMoveSeek: props.disableProgressDrag,

      /** 关闭点击进度条跳转 */
      isCloseClickSeek: props.disableProgressDrag,
    },
  })

  playerInstance.value.on('ready', () => {
    emit('ready', playerInstance.value as Player)
  })

  playerInstance.value.on('loadedmetadata', () => {
    seekToStartTime()
  })

  // 播放事件监听器
  playerInstance.value.on('play', () => {
    emit('play', playerInstance.value as Player)
  })

  // 暂停事件监听器
  playerInstance.value.on('pause', () => {
    emit('pause', playerInstance.value as Player)
  })

  playerInstance.value.on('ended', () => {
    emit('ended', playerInstance.value as Player)
  })

  playerInstance.value.on('timeupdate', () => {
    if (!playerInstance.value) {
      return
    }

    emit('timeupdate', {
      currentTime: playerInstance.value.currentTime || 0,
      duration: playerInstance.value.duration || 0,
    })
  })

  // 错误事件监听器
  playerInstance.value.on('error', (error) => {
    emit('error', error)
  })
}

/**
 * 跳转到初始播放位置。
 */
function seekToStartTime() {
  if (!playerInstance.value || !props.startTime) {
    return
  }

  playerInstance.value.currentTime = props.startTime
}

// 组件挂载时初始化播放器
onMounted(() => {
  initPlayer()
})

watch(
  () => props.videoUrl,
  async (videoUrl, prevVideoUrl) => {
    if (!videoUrl || videoUrl === prevVideoUrl) {
      return
    }

    await nextTick()
    initPlayer()
  },
)

// 组件卸载前清理播放器实例
onBeforeUnmount(() => {
  destroyPlayer()
})
</script>

<template>
  <div
    :id="resolvedPlayerId"
  />
</template>

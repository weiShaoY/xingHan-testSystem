<script setup lang="ts">
import type Player from 'xgplayer'

const props = withDefaults(defineProps<{

  /** 弹窗标题。 */
  title?: string

  /** 弹窗宽度。 */
  width?: string

  /** 是否正在加载视频。 */
  loading?: boolean

  /** 视频预览地址。 */
  source?: string

  /** 视频封面地址。 */
  posterUrl?: string

  /** 初始播放时间，单位秒。 */
  startTime?: number

  /** 是否自动播放。 */
  autoplay?: boolean

  /** 音量大小，范围 0-1。 */
  volume?: number

  /** 可选播放速率。 */
  playbackRates?: number[]

  /** 是否循环播放。 */
  loop?: boolean

  /** 是否静音。 */
  muted?: boolean

  /** 是否禁用拖拽进度。 */
  disableProgressDrag?: boolean
}>(), {
  title: '视频预览',
  width: 'min(960px, calc(100vw - 32px))',
  loading: false,
  source: '',
  posterUrl: '',
  startTime: 0,
  autoplay: false,
  volume: 0.7,
  playbackRates: () => [0.75, 1, 1.25, 1.5, 2],
  loop: false,
  muted: false,
  disableProgressDrag: false,
})

const emit = defineEmits<{
  ready: [player: Player]
  play: [player: Player]
  pause: [player: Player]
  ended: [player: Player]
  error: [error: unknown]
  timeupdate: [
    payload: {
      currentTime: number
      duration: number
    },
  ]
}>()

const visible = defineModel<boolean>({
  default: false,
})

const hasVideo = computed(() => Boolean(props.source))

const playerKey = computed(() => {
  return `${props.source}-${props.startTime}`
})

function handleReady(player: Player) {
  emit('ready', player)
}

function handlePlay(player: Player) {
  emit('play', player)
}

function handlePause(player: Player) {
  emit('pause', player)
}

function handleEnded(player: Player) {
  emit('ended', player)
}

function handleError(error: unknown) {
  emit('error', error)
}

function handleTimeUpdate(payload: { currentTime: number, duration: number }) {
  emit('timeupdate', payload)
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    :width="props.width"
    destroy-on-close
    class="[&_.el-dialog__body]:px-5 [&_.el-dialog__body]:pt-0 [&_.el-dialog__body]:pb-5 max-sm:[&_.el-dialog__body]:px-3 max-sm:[&_.el-dialog__body]:pb-3"
    align-center
  >
    <div
      class="min-h-80 overflow-hidden rounded-xl bg-[#0f172a]"
    >
      <div
        v-if="props.loading"
        class="flex min-h-80 flex-col items-center justify-center gap-3 text-3.5 text-white/70"
      >
        <van-loading
          color="#fff"
        />
        视频加载中...
      </div>

      <ArtVideoPlayer
        v-else-if="hasVideo"
        :key="playerKey"
        class="w-full overflow-hidden rounded-xl"
        :video-url="props.source"
        :poster-url="props.posterUrl"
        :start-time="props.startTime"
        :autoplay="props.autoplay"
        :volume="props.volume"
        :playback-rates="props.playbackRates"
        :loop="props.loop"
        :muted="props.muted"
        :disable-progress-drag="props.disableProgressDrag"
        @ready="handleReady"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @error="handleError"
        @timeupdate="handleTimeUpdate"
      />

      <van-empty
        v-else
        image="search"
        description="暂无视频内容"
        class="min-h-80 bg-white"
      />
    </div>
  </el-dialog>
</template>

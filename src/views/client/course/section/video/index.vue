<script setup lang="ts">

import { showFailToast } from 'vant'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

const DEFAULT_NAV_TITLE = '视频标题'

const route = useRoute()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

/**
 * 当前课程 ID。
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 当前小节 ID。
 */
const olId = computed(() => {
  return Number(route.params.olId || 0)
})

const loading = ref(false)

const loadError = ref('')

const videoUrl = ref('')

/** 当前播放的时间点，单位秒。 */
const currentTime = ref(0)

/** 视频是否播放完成。 */
const isVideoCompleted = ref(false)

/** 视频总时长，单位秒。 */
const totalVideoTime = ref(0)

/** 当前页面打开时长，单位秒。 */
const pageOpenTime = ref(0)

/**
   *  播放开始时间
   */
const startTime = ref(new Date().toISOString())

/**
   *  是否在播放中
   */
const isPlaying = ref(false)

const courseVideoInfo = ref<ClientApi.Course.CourseVideoInfoResponse>(createDefaultCourseVideoInfo())

/**
 * 记录视频学习进度的请求参数。
 */
const courseVideoRecordProgressParams = ref<ClientApi.Course.CourseVideoRecordProgressParams>({
  couId: couId.value,
  olId: olId.value,
  isCompleted: false,
  videoTime: 0,
  totalLearningTime: 0,
  totalVideoTime: 0,
})

/**
 * 是否存在可播放的视频地址。
 */
const hasVideo = computed(() => Boolean(videoUrl.value))

let requestSeq = 0

let pageOpenTimer: ReturnType<typeof setInterval> | undefined

let recordProgressTimer: ReturnType<typeof setInterval> | undefined

/**
 * 创建默认视频信息。
 */
function createDefaultCourseVideoInfo(): ClientApi.Course.CourseVideoInfoResponse {
  return {
    accessoryId: 0,
    couId: 0,
    couName: '',
    currentOlId: 0,
    nextOlId: 0,
    videoStudyTime: 0,
    previousOlId: 0,
    studyCount: 0,
    nodes: [],
    nextNode: {
      description: '',
      id: 0,
      itemType: '',
      name: '',
    },
  }
}

/**
 * 获取小节视频信息。
 */
async function getCourseVideoInfo(sectionId = olId.value) {
  if (!sectionId) {
    return
  }

  const currentRequestSeq = ++requestSeq

  loading.value = true
  loadError.value = ''
  currentTime.value = 0
  revokeVideoUrl()

  try {
    courseVideoInfo.value = await fetchClientCourseVideoInfo(sectionId)
    currentTime.value = courseVideoInfo.value.videoStudyTime || 0
    setNavTitle(courseVideoInfo.value.couName)

    await getCourseVideoFile(currentRequestSeq)
  }
  catch (error) {
    console.error(error)
    loadError.value = '视频加载失败，请稍后重试'
    showFailToast(loadError.value)
  }
  finally {
    if (currentRequestSeq === requestSeq) {
      loading.value = false
    }
  }
}

/**
 * 获取小节视频文件流。
 *
 * @param currentRequestSeq 当前请求序号，用于避免快速切换路由时旧响应覆盖新视频。
 */
async function getCourseVideoFile(currentRequestSeq: number) {
  if (!courseVideoInfo.value.accessoryId) {
    loadError.value = '暂无可播放的视频'

    return
  }

  const file = await fetchClientCourseVideoFile(courseVideoInfo.value.accessoryId)

  if (currentRequestSeq !== requestSeq) {
    return
  }

  setVideoUrl(file)
}

/**
 * 设置视频预览地址。
 *
 * 接口返回的是 Blob 文件流，播放器需要可访问的 URL，
 * 所以这里通过 URL.createObjectURL 转成本地临时地址。
 *
 * @param file 视频文件流。
 */
function setVideoUrl(file: Blob) {
  revokeVideoUrl()
  videoUrl.value = URL.createObjectURL(file)
}

/**
 * 释放当前视频临时地址。
 */
function revokeVideoUrl() {
  if (!videoUrl.value) { return }

  URL.revokeObjectURL(videoUrl.value)
  videoUrl.value = ''
}

/**
 * 设置顶部导航标题。
 *
 * 当前页面的 VanNavBar 在 client/layout 中统一渲染，
 * 这里通过响应式的客户端导航标题覆盖默认 route.meta.title。
 */
function setNavTitle(title?: string) {
  setClientNavTitle(title?.trim() || DEFAULT_NAV_TITLE)
}

/**
 * 记录播放器时间变化。
 *
 * @param payload 播放器时间信息。
 */
function handleVideoTimeUpdate(payload: { currentTime: number, duration: number }) {
  currentTime.value = payload.currentTime
  totalVideoTime.value = payload.duration
}

/**
 * 处理播放器错误。
 */
function handleVideoError() {
  loadError.value = '视频播放失败，请刷新后重试'
  showFailToast(loadError.value)
}

/**
 * 记录视频学习进度。
 */
async function recordVideoRecordProgress() {
  try {
    courseVideoRecordProgressParams.value = {
      couId: couId.value,
      olId: olId.value,
      isCompleted: isVideoCompleted.value,
      videoTime: currentTime.value,
      totalLearningTime: pageOpenTime.value,
      totalVideoTime: totalVideoTime.value,
    }

    await fetchClientCourseVideoRecordProgress(courseVideoRecordProgressParams.value)
  }
  catch (error) {
    console.error('记录视频学习记录失败', error)
  }
}

onMounted(() => {
  getCourseVideoInfo()

  pageOpenTimer = setInterval(() => {
    pageOpenTime.value += 1
  }, 1000)

  recordProgressTimer = setInterval(() => {
    if (isPlaying.value) {
      recordVideoRecordProgress()
    }
  }, 5000)
})

onBeforeUnmount(() => {
  revokeVideoUrl()
  clearClientNavTitle()

  if (pageOpenTimer !== undefined) {
    clearInterval(pageOpenTimer)
  }

  if (recordProgressTimer !== undefined) {
    clearInterval(recordProgressTimer)
  }
})

/** 处理视频播放开始事件。 */
function handleVideoPlay() {
  isPlaying.value = true
  startTime.value = new Date().toISOString()
}

/** 处理视频暂停事件。 */
function handleVideoPause() {
  isPlaying.value = false
  recordVideoRecordProgress()
}

/** 处理视频播放结束事件。 */
async function handleVideoEnded() {
  isPlaying.value = false
  isVideoCompleted.value = true
  recordVideoRecordProgress()

  // 播放完后 记录完成视频记录
  await fetchClientCourseVideoRecordPlayback({
    couId: couId.value,
    olId: olId.value,
    durationSeconds: pageOpenTime.value,
    isValid: true,
    playbackSpeed: 1,
    startProgress: 0,
    endProgress: currentTime.value,
    startTime: startTime.value,
    endTime: new Date().toISOString(),

  })
}
</script>

<template>
  <div
    class="h-full min-h-0 flex flex-1 flex-col gap-4 overflow-hidden pb-4"
  >
    <section
      class="min-h-0 flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgb(15_23_42/6%)]"
    >

      <div
        class="min-h-0 flex flex-1 items-center justify-center overflow-hidden  p-3"
      >
        <div
          v-if="loading"
          class="h-full min-h-80 w-full flex flex-col items-center justify-center gap-3 rounded-xl  text-3.5 text-white/70"
        >
          <van-loading
            color="#ffffff"
          />
          视频加载中...
        </div>

        <div
          v-else-if="loadError || !hasVideo"
          class="h-full min-h-80 w-full flex flex-col items-center justify-center gap-4 rounded-xl  px-6 text-center text-white/70"
        >
          <van-icon
            name="video-o"
            size="42"
            class="text-white/40"
          />

          <div
            class="text-3.5"
          >
            {{ loadError || '暂无视频内容' }}
          </div>

          <van-button
            v-if="loadError"
            size="small"
            type="primary"
            @click="getCourseVideoInfo"
          >
            重新加载
          </van-button>
        </div>

        <ArtVideoPlayer
          v-else
          :key="videoUrl"
          player-id="client-course-video-player"
          class="w-full overflow-hidden rounded-xl "
          :video-url="videoUrl"
          :start-time="courseVideoInfo.videoStudyTime"
          :autoplay="false"
          :volume="0.7"
          :playback-rates="[0.75, 1, 1.25, 1.5, 2]"
          :disable-progress-drag="true"
          @timeupdate="handleVideoTimeUpdate"
          @error="handleVideoError"
          @play="handleVideoPlay"
          @pause="handleVideoPause"
          @ended="handleVideoEnded"
        />
      </div>
    </section>
  </div>
</template>

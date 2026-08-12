<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import DocumentPdfViewer from './components/DocumentPdfViewer.vue'

const route = useRoute()

const loading = ref(false)

const loadError = ref('')

const pdfUrl = ref('')

const totalPages = ref(0)

const currentPage = ref(1)

/** 文档加载完成后需要恢复的学习页码。 */
const resumePage = ref(1)

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const DEFAULT_NAV_TITLE = '文档标题'

/** 当前页面打开时长，单位秒。 */
const pageOpenTime = ref(0)

/** PDF 已完成渲染，可以开始计时和记录学习进度。 */
const isPdfReady = ref(false)

let pageOpenTimer: ReturnType<typeof setInterval> | undefined

/**
 * 当前编辑的小节 ID
 */
const olId = computed(() => {
  return Number(route.params.olId || 0)
})

const courseDocumentInfo = ref<ClientApi.Course.CourseDocumentInfoResponse>({
  accessoryId: 0,
  couId: 0,
  couName: '',
  currentOlId: 0,
  olName: '',
  nextOlId: 0,
  pdfStudyPage: 0,
  previousOlId: 0,
  previousNode: {
    olId: 0,
    olType: 0,
  },
  nextNode: {
    olId: 0,
    olType: 0,
  },
  nodes: [],
})

const initialPage = computed(() => {
  const page = Number(resumePage.value || 1)

  return Number.isFinite(page) && page > 0 ? page : 1
})

const readingProgress = computed(() => {
  if (!totalPages.value) { return 0 }

  return Math.min(100, Math.round((currentPage.value / totalPages.value) * 100))
})

const completedPages = computed(() => {
  return Math.min(currentPage.value, totalPages.value || currentPage.value)
})

/**
 *  获取小节 文档信息
 */
async function getCourseDocumentInfo() {
  if (!olId.value) {
    loadError.value = '未找到可学习的文档'
    return
  }

  loading.value = true
  loadError.value = ''
  isPdfReady.value = false
  pageOpenTime.value = 0
  stopPageOpenTimer()
  revokePdfUrl()
  try {
    courseDocumentInfo.value = await fetchClientCourseDocumentInfo(olId.value)
    setNavTitle(courseDocumentInfo.value.couName)
    resumePage.value = normalizePage(courseDocumentInfo.value.pdfStudyPage)
    currentPage.value = resumePage.value
    await getCourseDocumentFile()
  }
  catch (error) {
    console.error(error)
    loadError.value = '文档加载失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}

/** 将接口返回的学习页码转换为有效页码。 */
function normalizePage(page: number) {
  const value = Number(page || 1)

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
}

/**
 *  获取小节 文档信息数据流
 */
async function getCourseDocumentFile() {
  if (!courseDocumentInfo.value.accessoryId) {
    loadError.value = '暂无可预览的文档'
    return
  }

  try {
    const res = await fetchClientCourseDocumentFile(courseDocumentInfo.value.accessoryId)

    setPdfUrl(res)
  }
  catch (error) {
    console.error(error)
    loadError.value = '文档文件加载失败，请稍后重试'
  }
}

/**
 * 设置 PDF 预览地址。
 *
 * 接口返回的是 Blob 文件流，VuePdfEmbed 需要可访问的 URL，
 * 所以这里通过 URL.createObjectURL 转成本地临时地址。
 *
 * @param file PDF 文件流。
 */
function setPdfUrl(file: Blob) {
  revokePdfUrl()
  pdfUrl.value = URL.createObjectURL(file)
}

/**
 * 释放当前 PDF 临时地址。
 */
function revokePdfUrl() {
  if (!pdfUrl.value) { return }

  URL.revokeObjectURL(pdfUrl.value)
  pdfUrl.value = ''
}

onBeforeUnmount(() => {
  revokePdfUrl()
})

function handlePdfPageChange(payload: { currentPage: number, totalPages: number }) {
  currentPage.value = payload.currentPage
  totalPages.value = payload.totalPages

  if (isPdfReady.value) {
    recordDocumentProgress()
  }
}

/** PDF 页面完成渲染后，开始统计本次有效阅读时长。 */
function handlePdfLoaded(payload: { currentPage: number, totalPages: number }) {
  currentPage.value = payload.currentPage
  totalPages.value = payload.totalPages
  isPdfReady.value = true
  startPageOpenTimer()
}

function startPageOpenTimer() {
  stopPageOpenTimer()
  pageOpenTimer = setInterval(() => {
    pageOpenTime.value += 1
  }, 1000)
}

function stopPageOpenTimer() {
  if (pageOpenTimer === undefined) { return }

  clearInterval(pageOpenTimer)
  pageOpenTimer = undefined
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
 * 记录文档学习进度。
 */
async function recordDocumentProgress() {
  if (!olId.value || !courseDocumentInfo.value.couId) { return }

  try {
    await fetchClientCourseDocumentRecordProgress({
      olId: olId.value,
      couId: courseDocumentInfo.value.couId,
      totalPages: totalPages.value,
      progressSpecific: currentPage.value,
      totalLearningTime: pageOpenTime.value,
    })
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getCourseDocumentInfo()
})

onBeforeUnmount(() => {
  clearClientNavTitle()

  stopPageOpenTimer()
})

</script>

<template>
  <div
    class="h-full min-h-0 flex flex-1 flex-col gap-4 overflow-hidden pb-4"
  >
    <section
      class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 via-white to-cyan-50 px-4 py-4 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
    >
      <div
        class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"
      >
        <van-icon
          name="description-o"
          size="16"
        />

        <span>
          {{ courseDocumentInfo.olName }}
        </span>
      </div>

      <div
        v-if="totalPages"
        class="mt-4"
      >
        <div
          class="mb-2 flex items-center justify-between text-3.25 text-slate-500"
        >
          <span>已阅读 {{ completedPages }} / {{ totalPages }} 页</span>

          <span
            class="text-teal-700 font-700"
          >{{ readingProgress }}%</span>
        </div>

        <van-progress
          :percentage="readingProgress"
          :show-pivot="false"
          stroke-width="7"
          color="#0f766e"
          track-color="#ccfbf1"
        />
      </div>
    </section>

    <DocumentPdfViewer
      v-if="!loadError || pdfUrl"
      :loading="loading"
      :source="pdfUrl"
      :initial-page="initialPage"
      @document-loaded="handlePdfLoaded"
      @page-change="handlePdfPageChange"
    />

    <van-empty
      v-else
      image="error"
      :description="loadError"
      class="min-h-0 flex-1 rounded-2xl bg-white"
    >
      <van-button
        size="small"
        type="primary"
        @click="getCourseDocumentInfo"
      >
        重新加载
      </van-button>
    </van-empty>
  </div>
</template>

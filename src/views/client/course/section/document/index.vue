<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import DocumentPdfViewer from './components/DocumentPdfViewer.vue'

const route = useRoute()

const router = useRouter()

const loading = ref(false)

const loadError = ref('')

const pdfUrl = ref('')

const totalPages = ref(0)

const currentPage = ref(1)

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const DEFAULT_NAV_TITLE = '文档标题'

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
  nextOlId: 0,
  pdfStudyPage: 0,
  previousOlId: 0,
  studyCount: 0,
  nodes: [],
})

const initialPage = computed(() => {
  const page = Number(courseDocumentInfo.value.pdfStudyPage || 1)

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
  revokePdfUrl()
  try {
    courseDocumentInfo.value = await fetchClientCourseDocumentInfo(olId.value)
    setNavTitle(courseDocumentInfo.value.couName)

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
}

function goBackToCourse() {
  if (courseDocumentInfo.value.couId) {
    router.push({
      name: 'ClientCourseDetail',
      params: {
        couId: courseDocumentInfo.value.couId,
      },
    })
    return
  }

  router.back()
}

onMounted(() => {
  getCourseDocumentInfo()
})

/**
 * 设置顶部导航标题。
 *
 * 当前页面的 VanNavBar 在 client/layout 中统一渲染，
 * 这里通过响应式的客户端导航标题覆盖默认 route.meta.title。
 */
function setNavTitle(title?: string) {
  setClientNavTitle(title?.trim() || DEFAULT_NAV_TITLE)
}

onBeforeUnmount(() => {
  clearClientNavTitle()
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
        class="flex items-start justify-between gap-3"
      >
        <div
          class="min-w-0"
        >
          <div
            class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"
          >
            <van-icon
              name="description-o"
              size="16"
            />
            课程文档
          </div>

          <h1
            class="m-0 truncate text-4.5 text-slate-900 font-700"
          >
            {{ courseDocumentInfo.couName || DEFAULT_NAV_TITLE }}
          </h1>
        </div>

        <van-button
          plain
          size="small"
          type="primary"
          icon="orders-o"
          @click="goBackToCourse"
        >
          课程目录
        </van-button>
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

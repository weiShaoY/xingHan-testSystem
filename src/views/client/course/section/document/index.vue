<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import DocumentPdfViewer from './components/DocumentPdfViewer.vue'

const route = useRoute()

const loading = ref(false)

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

/**
 *  获取小节 文档信息
 */
async function getCourseDocumentInfo() {
  loading.value = true
  try {
    courseDocumentInfo.value = await fetchClientCourseDocumentInfo(olId.value)
    setNavTitle(courseDocumentInfo.value.couName)

    await getCourseDocumentFile()
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

/**
 *  获取小节 文档信息数据流
 */
async function getCourseDocumentFile() {
  try {
    const res = await fetchClientCourseDocumentFile(courseDocumentInfo.value.accessoryId)

    setPdfUrl(res)
  }
  catch (error) {
    console.error(error)
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

    <DocumentPdfViewer
      :loading="loading"
      :source="pdfUrl"
      :initial-page="initialPage"
      @page-change="handlePdfPageChange"
    />
  </div>
</template>

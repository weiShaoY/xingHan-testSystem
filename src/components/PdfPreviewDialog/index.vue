<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

import 'vue-pdf-embed/dist/styles/annotationLayer.css'

import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = withDefaults(defineProps<{

  /** 弹窗标题。 */
  title?: string

  /** 弹窗宽度。 */
  width?: string

  /**
   * 是否正在加载文档。
   */
  loading?: boolean

  /**
   * PDF 预览地址。
   */
  source?: string

  /**
   * 初始显示页码。
   */
  initialPage?: number
}>(), {
  title: 'PDF 预览',
  width: 'min(1100px, calc(100vw - 32px))',
  loading: false,
  source: '',
  initialPage: 1,
})

const emit = defineEmits<{
  'document-loaded': [
    payload: {
      currentPage: number
      totalPages: number
    },
  ]
  'reached-last-page': [
    payload: {
      currentPage: number
      totalPages: number
    },
  ]
  'page-change': [
    payload: {
      currentPage: number
      totalPages: number
    },
  ]
}>()

const visible = defineModel<boolean>({
  default: false,
})

const MIN_ZOOM_SCALE = 0.75

const MAX_ZOOM_SCALE = 2

const ZOOM_SCALE_STEP = 0.25

const DEFAULT_PAGE_WIDTH = 760

const pageInput = ref('1')

/**
 * PDF 总页数。
 */
const totalPages = ref(0)

/**
 * 普通阅读模式下当前显示的页码。
 */
const currentPage = ref(1)

/**
 * 全屏阅读器根节点，用于页面内全屏时重置滚动位置。
 */
const fullscreenViewerRef = ref<HTMLElement>()

const viewerRef = ref<HTMLElement>()

/**
 * 当前是否处于全屏阅读模式。
 */
const isFullscreen = ref(false)

/**
 * PDF 缩放比例。
 */
const zoomScale = ref(1)

/**
 * PDF 页面基准宽度。
 */
const pageBaseWidth = ref(DEFAULT_PAGE_WIDTH)

/**
 * 是否存在可预览的 PDF 地址。
 */
const hasPdf = computed(() => Boolean(props.source))

/**
 * 当前缩放百分比文案。
 */
const zoomPercent = computed(() => {
  return `${Math.round(zoomScale.value * 100)}%`
})

/**
 * PDF 实际渲染宽度。
 */
const pageWidth = computed(() => {
  return Math.round(pageBaseWidth.value * zoomScale.value)
})

/**
 * 是否已经缩小到最小比例。
 */
const isMinZoom = computed(() => {
  return zoomScale.value <= MIN_ZOOM_SCALE
})

/**
 * 是否已经放大到最大比例。
 */
const isMaxZoom = computed(() => {
  return zoomScale.value >= MAX_ZOOM_SCALE
})

/**
 * 规范化初始页码，避免接口返回 0、空值或非法数字。
 */
const normalizedInitialPage = computed(() => {
  const page = Number(props.initialPage || 1)

  return Number.isFinite(page) && page > 0 ? page : 1
})

watch(
  () => props.source,
  () => {
    totalPages.value = 0
    currentPage.value = normalizedInitialPage.value
    pageInput.value = String(currentPage.value)
    zoomScale.value = 1
    pageBaseWidth.value = DEFAULT_PAGE_WIDTH
    emitPageChange()
  },
)

watch(
  normalizedInitialPage,
  (page) => {
    if (totalPages.value) {
      currentPage.value = Math.min(page, totalPages.value)
    }
    else {
      currentPage.value = page
    }

    pageInput.value = String(currentPage.value)
    emitPageChange()
  },
  {
    immediate: true,
  },
)

/**
 * PDF 加载完成后，定位到上次学习页。
 */
function handleDocumentLoad(document: { numPages?: number }) {
  totalPages.value = document.numPages || 0
  currentPage.value = Math.min(normalizedInitialPage.value, totalPages.value || normalizedInitialPage.value)
  pageInput.value = String(currentPage.value)
  emitPageChange()
  emit('document-loaded', {
    currentPage: currentPage.value,
    totalPages: totalPages.value,
  })
  checkReachedLastPage()
  nextTick(() => {
    updatePageBaseWidth()
  })
}

/**
 * 进入全屏后滚动到普通模式当前页，保持阅读位置一致。
 */
function scrollFullscreenToCurrentPage() {
  if (!fullscreenViewerRef.value) { return }

  const pages = fullscreenViewerRef.value.querySelectorAll<HTMLElement>('.vue-pdf-embed__page')

  const page = pages[currentPage.value - 1]

  if (!page) { return }

  fullscreenViewerRef.value.scrollTop = getPageScrollTop(page)
}

/**
 * 获取页面在全屏滚动容器中的滚动位置。
 *
 * 使用元素相对容器的真实位置计算，避免 offsetParent 变化导致页码偏移。
 *
 * @param page PDF 页面元素。
 */
function getPageScrollTop(page: HTMLElement) {
  if (!fullscreenViewerRef.value) { return 0 }

  const viewerRect = fullscreenViewerRef.value.getBoundingClientRect()

  const pageRect = page.getBoundingClientRect()

  return Math.max(fullscreenViewerRef.value.scrollTop + pageRect.top - viewerRect.top - 12, 0)
}

/**
 * 记录 100% 缩放时的页面宽度，用于后续通过 width 实现视觉缩放。
 */
function updatePageBaseWidth() {
  if (zoomScale.value !== 1) { return }

  const page = viewerRef.value?.querySelector<HTMLElement>('.document-pdf-panel .vue-pdf-embed__page')

  if (!page?.offsetWidth) { return }

  pageBaseWidth.value = page.offsetWidth
}

/**
 * 切换到上一页。
 */
function goToPreviousPage() {
  goToPage(currentPage.value - 1)
}

/**
 * 切换到下一页。
 */
function goToNextPage() {
  goToPage(currentPage.value + 1)
}

/** 跳转到指定页面，并在全屏模式保持阅读位置。 */
function goToPage(page: number) {
  const maxPage = totalPages.value || 1

  currentPage.value = Math.min(maxPage, Math.max(1, Math.round(page)))
  pageInput.value = String(currentPage.value)
  emitPageChange()
  checkReachedLastPage()

  if (isFullscreen.value) {
    nextTick(() => {
      scrollFullscreenToCurrentPage()
    })
  }
}

/** 校验手动输入的页码。 */
function handlePageInput() {
  const page = Number(pageInput.value)

  if (Number.isFinite(page) && page > 0) {
    goToPage(page)
  }
  else {
    pageInput.value = String(currentPage.value)
  }
}

/**
 * 放大 PDF。
 */
function zoomIn() {
  updateZoom(ZOOM_SCALE_STEP)
}

/**
 * 缩小 PDF。
 */
function zoomOut() {
  updateZoom(-ZOOM_SCALE_STEP)
}

/**
 * 更新 PDF 缩放比例。
 *
 * 全屏模式下缩放会重新渲染页面，渲染完成后重新定位到当前页。
 *
 * @param step 缩放步长，正数放大，负数缩小。
 */
function updateZoom(step: number) {
  const nextScale = Number((zoomScale.value + step).toFixed(2))

  zoomScale.value = Math.min(MAX_ZOOM_SCALE, Math.max(MIN_ZOOM_SCALE, nextScale))

  if (isFullscreen.value) {
    nextTick(() => {
      scrollFullscreenToCurrentPage()
    })
  }
}

/** 恢复默认阅读缩放。 */
function resetZoom() {
  zoomScale.value = 1
}

/** 切换浏览器原生全屏阅读。 */
async function toggleFullscreen() {
  const element = viewerRef.value

  if (!element) { return }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
    else {
      await element.requestFullscreen()
    }
  }
  catch (error) {
    console.error('切换全屏阅读失败', error)
  }
}

function handleFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === viewerRef.value

  if (isFullscreen.value) {
    nextTick(scrollFullscreenToCurrentPage)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!hasPdf.value || event.target instanceof HTMLInputElement) { return }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goToPreviousPage()
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goToNextPage()
  }
}

/**
 * 向父组件同步当前页码和总页数。
 */
function emitPageChange() {
  emit('page-change', {
    currentPage: currentPage.value,
    totalPages: totalPages.value,
  })
}

/**
 * 检查是否已阅读至文档最后一页。
 * 每次跳转至最后一页时通知父组件。
 */
function checkReachedLastPage() {
  if (!totalPages.value || currentPage.value < totalPages.value) { return }

  emit('reached-last-page', {
    currentPage: currentPage.value,
    totalPages: totalPages.value,
  })
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    :width="props.width"
    destroy-on-close
    class="pdf-viewer-dialog"
    align-center
  >
    <div
      ref="viewerRef"
      class="document-pdf-viewer h-[min(78vh,760px)] min-h-0 flex flex-1 flex-col gap-5 overflow-hidden"
    >
      <div
        v-if="hasPdf"
        class="document-pdf-toolbar flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div
          class="flex items-center gap-2"
        >
          <van-button
            plain
            size="small"
            type="primary"
            icon="arrow-left"
            :disabled="currentPage <= 1"
            @click="goToPreviousPage"
          />

          <div
            class="flex items-center gap-1 text-3.5 text-slate-600"
          >
            <input
              v-model="pageInput"
              class="h-8 w-11 border border-slate-200 rounded-lg bg-slate-50 px-1 text-center text-3.5 outline-none focus:border-teal-500"
              inputmode="numeric"
              aria-label="跳转页码"
              @change="handlePageInput"
              @keyup.enter="handlePageInput"
            >

            <span>/ {{ totalPages || 0 }}</span>
          </div>

          <van-button
            plain
            size="small"
            type="primary"
            icon="arrow"
            icon-position="right"
            :disabled="currentPage >= totalPages"
            @click="goToNextPage"
          />

          <van-button
            plain
            size="small"
            type="primary"
            icon="replay"
            aria-label="恢复默认缩放"
            @click="resetZoom"
          />

          <van-button
            plain
            size="small"
            type="primary"
            :icon="isFullscreen ? 'shrink' : 'expand-o'"
            :aria-label="isFullscreen ? '退出全屏阅读' : '全屏阅读'"
            @click="toggleFullscreen"
          />

        </div>

        <div
          class="flex items-center gap-2"
        >
          <van-button
            plain
            size="small"
            type="primary"
            icon="minus"
            :disabled="isMinZoom"
            @click="zoomOut"
          />

          <span
            class="min-w-12 text-center text-3.5 text-slate-600"
          >
            {{ zoomPercent }}
          </span>

          <van-button
            plain
            size="small"
            type="primary"
            icon="plus"
            :disabled="isMaxZoom"
            @click="zoomIn"
          />

        </div>

      </div>

      <div
        ref="fullscreenViewerRef"
        class="document-pdf-panel min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_10px_24px_rgb(15_23_42/6%)]"
      >
        <div
          v-if="props.loading"
          class="document-pdf-loading flex h-full min-h-[260px] flex-col items-center justify-center gap-3 bg-white text-3.5 text-slate-500"
        >
          <van-loading
            color="#0f766e"
          />
          文档加载中...
        </div>

        <div
          v-else-if="hasPdf"
          class="document-pdf-stage"
        >
          <VuePdfEmbed
            class="pdf-viewer flex-none bg-slate-100"
            annotation-layer
            text-layer
            :source="source"
            :page="currentPage"
            :width="pageWidth"
            @loaded="handleDocumentLoad"
          />
        </div>

        <van-empty
          v-else
          image="search"
          description="暂无文档内容"
          class="bg-white h-full"
        />
      </div>

    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.document-pdf-stage {
  display: flex;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  margin: 0 auto;
  padding: 16px 24px;
  box-sizing: border-box;
  justify-content: center;
}

.pdf-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  min-width: 100%;
  margin: 0 auto;

  :deep(.vue-pdf-embed__page) {
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 18px rgb(15 23 42 / 8%);
  }

  :deep(.vue-pdf-embed__page:not(:first-child)) {
    margin-top: 16px;
  }
}

.document-pdf-loading,
.van-empty {
  min-height: 100%;
}

.pdf-viewer-dialog {
  :deep(.el-dialog__body) {
    padding: 0 20px 20px;
  }
}

.document-pdf-viewer:fullscreen {
  gap: 12px;
  padding: 12px;
  background: #f1f5f9;
}

.document-pdf-viewer:fullscreen .document-pdf-panel {
  border-radius: 12px;
}

.document-pdf-panel {
  overscroll-behavior: contain;
}

@media (width <= 640px) {
  .pdf-viewer-dialog {
    :deep(.el-dialog__body) {
      padding: 0 12px 12px;
    }
  }
}
</style>

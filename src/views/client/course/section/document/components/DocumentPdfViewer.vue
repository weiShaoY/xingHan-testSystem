<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

import 'vue-pdf-embed/dist/styles/annotationLayer.css'

import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = withDefaults(defineProps<{

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
  loading: false,
  source: '',
  initialPage: 1,
})

const emit = defineEmits<{
  'page-change': [
    payload: {
      currentPage: number
      totalPages: number
    },
  ]
}>()

const MIN_ZOOM_SCALE = 0.75

const MAX_ZOOM_SCALE = 2

const ZOOM_SCALE_STEP = 0.25

const DEFAULT_PAGE_WIDTH = 760

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

/**
 * 当前是否处于全屏阅读模式。
 */
const isFullscreen = ref(false)

/**
 * 是否挂载全屏 PDF 实例。
 *
 * 退出全屏时先隐藏浮层，再延迟卸载全部页 PDF，
 * 避免重 DOM 销毁阻塞单页视图恢复。
 */
const isFullscreenMounted = ref(false)

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
    exitFullscreen()
    totalPages.value = 0
    currentPage.value = normalizedInitialPage.value
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

    emitPageChange()
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  clearFullscreenUnmountTimer()
})

let fullscreenUnmountTimer: number | undefined

/**
 * PDF 加载完成后，定位到上次学习页。
 */
function handleDocumentLoad(document: { numPages?: number }) {
  totalPages.value = document.numPages || 0
  currentPage.value = Math.min(normalizedInitialPage.value, totalPages.value || normalizedInitialPage.value)
  emitPageChange()
  nextTick(() => {
    updatePageBaseWidth()
  })
}

/**
 * 全屏 PDF 加载完成后，同步总页数。
 */
function handleFullscreenDocumentLoad(document: { numPages?: number }) {
  totalPages.value = document.numPages || totalPages.value
  emitPageChange()
  nextTick(() => {
    scrollFullscreenToCurrentPage()
  })
}

/**
 * 根据全屏阅读器的滚动位置同步当前页码。
 */
function handleFullscreenScroll() {
  if (!fullscreenViewerRef.value || !totalPages.value) { return }

  const pages = fullscreenViewerRef.value.querySelectorAll<HTMLElement>('.vue-pdf-embed__page')

  if (!pages.length) { return }

  const scrollTop = fullscreenViewerRef.value.getBoundingClientRect().top + 24

  let nearestPage = 0

  let nearestDistance = Number.POSITIVE_INFINITY

  pages.forEach((page, index) => {
    const distance = Math.abs(page.getBoundingClientRect().top - scrollTop)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestPage = index
    }
  })

  const nextPage = Math.min(nearestPage + 1, totalPages.value)

  if (nextPage !== currentPage.value) {
    currentPage.value = nextPage
    emitPageChange()
  }
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

  const page = document.querySelector<HTMLElement>('.document-pdf-viewer > .document-pdf-panel .vue-pdf-embed__page')

  if (!page?.offsetWidth) { return }

  pageBaseWidth.value = page.offsetWidth
}

/**
 * 切换到上一页。
 */
function goToPreviousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1)
  emitPageChange()
}

/**
 * 切换到下一页。
 */
function goToNextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
  emitPageChange()
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

/**
 * 切换页面内全屏状态。
 *
 * 这里不调用浏览器 Fullscreen API，避免浏览器窗口进入系统级全屏。
 * 普通单页 PDF 会一直保留，全屏 PDF 单独渲染全部页面。
 */
function toggleFullscreen() {
  if (isFullscreen.value) {
    exitFullscreen()

    return
  }

  enterFullscreen()
}

/**
 * 进入页面内全屏。
 */
function enterFullscreen() {
  clearFullscreenUnmountTimer()
  isFullscreenMounted.value = true

  nextTick(() => {
    isFullscreen.value = true

    nextTick(() => {
      scrollFullscreenToCurrentPage()
    })
  })
}

/**
 * 退出页面内全屏。
 */
function exitFullscreen() {
  if (!isFullscreen.value && !isFullscreenMounted.value) { return }

  isFullscreen.value = false
  clearFullscreenUnmountTimer()

  fullscreenUnmountTimer = window.setTimeout(() => {
    if (!isFullscreen.value) {
      isFullscreenMounted.value = false
    }
  }, 300)
}

/**
 * 处理键盘退出页面内全屏。
 *
 * 页面内全屏不是浏览器全屏，所以需要自行支持 Esc 退出。
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

/**
 * 清理全屏 PDF 延迟卸载计时器。
 */
function clearFullscreenUnmountTimer() {
  if (!fullscreenUnmountTimer) { return }

  window.clearTimeout(fullscreenUnmountTimer)
  fullscreenUnmountTimer = undefined
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
</script>

<template>
  <div
    class="document-pdf-viewer"
  >
    <div
      v-if="hasPdf"
      class="document-pdf-toolbar  flex flex-wrap items-center justify-center gap-4 p-3"
    >
      <van-button
        v-if="!isFullscreen && totalPages > 1"
        plain
        size="small"
        type="primary"
        icon="arrow-left"
        :disabled="currentPage <= 1"
        @click="goToPreviousPage"
      >
        上一页
      </van-button>

      <span
        class="text-3.5 text-slate-600"
      >
        <template
          v-if="isFullscreen"
        >
          共 {{ totalPages || 0 }} 页
        </template>

        <template
          v-else
        >
          {{ currentPage }} / {{ totalPages || 0 }}
        </template>
      </span>

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

      <van-button
        v-if="!isFullscreen && totalPages > 1"
        plain
        size="small"
        type="primary"
        icon="arrow"
        icon-position="right"
        :disabled="currentPage >= totalPages"
        @click="goToNextPage"
      >
        下一页
      </van-button>

      <van-button
        plain
        size="small"
        type="primary"
        :icon="isFullscreen ? 'shrink' : 'expand-o'"
        @click="toggleFullscreen"
      >
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </van-button>
    </div>

    <div
      class="document-pdf-panel overflow-auto rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_10px_24px_rgb(15_23_42/6%)]"
    >
      <div
        v-if="loading"
        class="h-90 flex flex-col items-center justify-center gap-3 bg-white text-3.5 text-slate-500"
      >
        <van-loading
          color="#0f766e"
        />
        文档加载中...
      </div>

      <VuePdfEmbed
        v-else-if="hasPdf"
        class="pdf-viewer bg-slate-100"
        annotation-layer
        text-layer
        :source="source"
        :page="currentPage"
        :width="pageWidth"
        @loaded="handleDocumentLoad"
      />

      <van-empty
        v-else
        image="search"
        description="暂无文档内容"
        class="bg-white"
      />
    </div>

    <div
      v-if="isFullscreenMounted"
      class="document-pdf-fullscreen"
      :class="{ 'is-active': isFullscreen }"
    >
      <div
        class="document-pdf-toolbar fixed bottom-4 left-0 right-0 z-10 flex flex-wrap items-center justify-center gap-4"
      >
        <span
          class="text-3.5 text-slate-600"
        >
          共 {{ totalPages || 0 }} 页
        </span>

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

        <van-button
          plain
          size="small"
          type="primary"
          icon="shrink"
          @click="toggleFullscreen"
        >
          退出全屏
        </van-button>
      </div>

      <div
        ref="fullscreenViewerRef"
        class="document-pdf-panel overflow-auto rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_10px_24px_rgb(15_23_42/6%)]"
        @scroll="handleFullscreenScroll"
      >
        <VuePdfEmbed
          v-if="hasPdf"
          class="pdf-viewer bg-slate-100"
          annotation-layer
          text-layer
          :source="source"
          :width="pageWidth"
          @loaded="handleFullscreenDocumentLoad"
        />
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.pdf-viewer {
  width: max-content;
  min-width: 100%;

  :deep(.vue-pdf-embed__page) {
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 18px rgb(15 23 42 / 8%);
  }
}

.document-pdf-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 3000;
  box-sizing: border-box;
  height: 100vh;
  padding: 12px 12px 72px;
  overflow: auto;
  overscroll-behavior: contain;
  visibility: hidden;
  background: #f1f5f9;
  opacity: 0;
  transition: opacity 0.16s ease;

  &.is-active {
    visibility: visible;
    opacity: 1;
  }

  .document-pdf-panel {
    height: 100%;
    border-radius: 12px;
  }

  .document-pdf-toolbar {
    position: fixed;
    right: 0;
    bottom: 16px;
    left: 0;
    z-index: 10;
  }

  .pdf-viewer {
    :deep(.vue-pdf-embed__page + .vue-pdf-embed__page) {
      margin-top: 12px;
    }
  }
}
</style>

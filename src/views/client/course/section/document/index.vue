<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

import 'vue-pdf-embed/dist/styles/annotationLayer.css'

import 'vue-pdf-embed/dist/styles/textLayer.css'

const route = useRoute()

const loading = ref(false)

const pdfUrl = ref('')

const hasPdf = computed(() => Boolean(pdfUrl.value))

const totalPages = ref(0)

const currentPage = ref(1)

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

/**
 * PDF 加载完成后，定位到上次学习页。
 */
function handleDocumentLoad(document: { numPages?: number }) {
  totalPages.value = document.numPages || 0
  currentPage.value = Math.min(initialPage.value, totalPages.value || initialPage.value)
}

function goToPreviousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function goToNextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

onMounted(() => {
  getCourseDocumentInfo()
})

</script>

<template>
  <div
    class="min-h-full flex flex-col gap-4 pb-4"
  >
    <div
      class="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 px-5 py-5 text-white shadow-[0_12px_28px_rgb(13_148_136/22%)]"
    >
      <div
        class="pointer-events-none absolute right--8 top--8 h-28 w-28 rounded-full bg-white/10"
      />

      <div
        class="pointer-events-none absolute bottom--10 right-10 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl"
      />

      <div
        class="relative z-1"
      >
        <div
          class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1 text-3 text-white/90 backdrop-blur"
        >
          <van-icon
            name="description-o"
            size="14"
          />
          文档学习
        </div>

        <h1
          class="m-0 wrap-break-word text-5.5 font-700 leading-1.35"
        >
          {{ courseDocumentInfo.couName || '课程文档' }}
        </h1>

        <div
          class="mt-5 flex items-center gap-5 text-3.5 text-white/90"
        >
          <span
            class="inline-flex items-center gap-1.5"
          >
            <van-icon
              name="eye-o"
              size="16"
            />
            已学习 {{ courseDocumentInfo.studyCount || 0 }} 次
          </span>

          <span
            class="inline-flex items-center gap-1.5"
          >
            <van-icon
              name="bookmark-o"
              size="16"
            />
            第 {{ currentPage }} 页
            <template
              v-if="totalPages"
            >
              / 共 {{ totalPages }} 页
            </template>
          </span>
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_10px_24px_rgb(15_23_42/6%)]"
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
        :source="pdfUrl"
        :page="currentPage"
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
      v-if="hasPdf && totalPages > 1"
      class="flex items-center justify-center gap-4"
    >
      <van-button
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
        {{ currentPage }} / {{ totalPages }}
      </span>

      <van-button
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
    </div>

  </div>
</template>

<style lang="scss" scoped>
.pdf-viewer {
  :deep(.vue-pdf-embed__page) {
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 8px 18px rgb(15 23 42 / 8%);
  }
}
</style>

<script setup lang="ts">
import { PDFViewer } from '@embedpdf/vue-pdf-viewer'

const route = useRoute()

const loading = ref(false)

/**
 * 当前编辑的小节 ID
 */
const olId = computed(() => {
  console.log('🚀 ~ file: index.vue:10 ~ olId:', olId)
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

/**
 *  获取小节 文档信息
 */
async function getCourseDocumentInfo() {
  loading.value = true
  try {
    courseDocumentInfo.value = await fetchClientCourseDocumentInfo(olId.value)
    console.log('🚀 ~ file: index.vue:29 ~ courseDocumentInfo.value:', courseDocumentInfo.value)
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

    console.log('🚀 ~ file: index.vue:45 ~ res:', res)
  }
  catch (error) {
    console.error(error)
  }
}

getCourseDocumentInfo()
</script>

<template>
  <div
    class=" h-full flex flex-col"
  >
    <div
      class=""
    >
      <div>
        {{ courseDocumentInfo.couName }}
      </div>

      <div>
        小节名称:aaa
      </div>
    </div>

    <PDFViewer
      class="flex-1"
      :config="{
        src: 'https://snippet.embedpdf.com/ebook.pdf',
        theme: { preference: 'light' },
        disabledCategories: ['annotation', 'form', 'redaction', 'zoom', 'document-print', 'document-export', 'panel'],
      }"
    />
  </div>
</template>

<!------  2026-05-10---05:14---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

const documentTable = ref<FileApi.FileListResponse>({
  rows: [],
  totals: 0,
})

const loading = ref(false)

const columns: ColumnOption<FileApi.FileListItem>[] = [
  {
    label: '文件名称',
    prop: 'asName',
    slotName: 'fileName',
    minWidth: 460,
    useSlot: true,
  },

  {
    label: '文件大小',
    prop: 'asSize',
    slotName: 'fileSize',
    minWidth: 140,
    useSlot: true,
  },
  {
    label: '操作',
    prop: 'operation',
    width: 160,
    fixed: 'right',
    useSlot: true,
  },
]

/**
   *  请求参数
   */
const params = reactive<FileApi.FileListParams>({
  name: '',
  type: 'document',
  pageSize: 10,
  currentPage: 1,
})

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: documentTable.value.totals,
}))

/**
   *  获取文档列表
   */
async function getDocumentList() {
  try {
    loading.value = true
    documentTable.value = await fetchAdminFileList(params)
  }
  finally {
    loading.value = false
  }
}

getDocumentList()

/**
 * 上传文档
 */
function handleUploadSuccess() {
  params.currentPage = 1
  getDocumentList()
}

function handleUploadError(error: Error) {
  console.log('上传失败:', error)
}

function downloadDocument(item: FileApi.FileListItem) {
  console.log('下载文档:', item)
}

function deleteDocument(_item: FileApi.FileListItem) {

}

function exportDocument(item: FileApi.FileListItem) {
  console.log('导出文档:', item)
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.pageSize = size
  params.currentPage = 1
  getDocumentList()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  getDocumentList()
}

/**
 * 搜索文档
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  getDocumentList()
}

/**
 * 重置搜索
 */
function handleResetSearch() {
  params.name = ''
  params.currentPage = 1
  getDocumentList()
}

/**
 * 格式化文件大小
 */
function formatFileSize(size?: number) {
  if (!size && size !== 0) {
    return '-'
  }

  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-sm:items-start"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          我的文档
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ documentTable.totals }} 个文档
        </p>
      </div>

      <div
        class="flex items-center gap-3"
      >
        <el-input
          v-model="params.name"
          class="min-w-56 w-56"
          placeholder="请输入文件名称"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template
            #append
          >
            <ArtSvgIcon
              icon="tdesign:search"
            />
          </template>
        </el-input>

        <AdminUpload
          upload-type="document"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />

      </div>

    </div>

    <!-- 文档表格 -->
    <ArtTable
      :loading="loading"
      :data="documentTable.rows"
      :columns="columns"
      :pagination="pagination"
      row-key="asId"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    >

      <template
        #fileName="{ row }"
      >
        <div
          class="min-w-0"
        >
          <div
            class="truncate text-sm font-medium text-g-900"
          >
            {{ row.asName || row.asFileName || `未命名文件${row.asExtension || ''}` }}
          </div>

        </div>
      </template>

      <template
        #fileSize="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ formatFileSize(row.asSize) }}
        </span>
      </template>

      <template
        #operation="{ row }"
      >
        <div
          class="flex items-center gap-2"
        >
          <ArtIconButton
            type="download"
            @click="downloadDocument(row)"
          />

          <ArtIconButton
            type="delete"
            tooltip="删除"
            @click="deleteDocument(row)"
          />

          <ArtIconButton
            type="export"
            tooltip="导出"
            @click="exportDocument(row)"
          />
        </div>
      </template>
    </ArtTable>
  </div>
</template>

<style lang="scss" scoped>
</style>

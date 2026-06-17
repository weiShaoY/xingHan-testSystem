<!------------------------------------  文档列表  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

/**
 * 加载状态
 */
const loading = ref(false)

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
 * 表格数据
 */
const table = ref<FileApi.FileListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 表格列配置
 */
const columns: ColumnOption<FileApi.FileListItem>[] = [
  {
    label: '文件名称',
    prop: 'asName',
    slotName: 'fileName',
    minWidth: 460,
    useSlot: true,
  },
  {
    label: '上传时间',
    prop: 'createTime',
    minWidth: 140,
    useSlot: true,
    sortable: true,
  },
  {
    label: '文件大小',
    prop: 'asSize',
    slotName: 'fileSize',
    minWidth: 140,
    useSlot: true,
    sortable: true,
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
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: table.value.totals,
}))

/**
 * 获取表格数据
 */
async function getTable() {
  loading.value = true

  try {
    table.value = await fetchAdminFileList(params)
  }
  finally {
    loading.value = false
  }
}

getTable()

/**
 * 上传成功
 */
function handleUploadSuccess() {
  params.currentPage = 1
  getTable()
}

/**
 * 上传失败
 */
function handleUploadError(error: Error) {
  console.log('上传失败:', error)
}

/**
 * 下载表格项
 */
async function downloadTableItem(item: FileApi.FileListItem) {
  loading.value = true

  try {
    const blob = await fetchAdminFileAttachment(item.asId)

    await fileDownload(blob, item.asName)
  }
  finally {
    loading.value = false
  }
}

/**
 * 删除表格项
 */
async function deleteTableItem(_item: FileApi.FileListItem) {
  loading.value = true
  try {
    await fetchAdminFileDelete(_item.asId)
    getTable()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.pageSize = size
  params.currentPage = 1
  getTable()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  getTable()
}

/**
 * 搜索
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  getTable()
}

</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
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
          共 {{ table.totals }} 个文档
        </p>
      </div>

      <div
        class="flex flex-1 items-center justify-end gap-3 max-md:w-full max-md:justify-start max-sm:flex-col"
      >
        <el-input
          v-model="params.name"
          class="max-w-110 max-md:max-w-none max-sm:w-full"
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

    <!-- 数据表格 -->
    <ArtTable
      :loading="loading"
      :data="table.rows"
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
          class="min-w-0 flex items-center gap-2"
        >
          <div
            class=""
          >
            <ArtPreviewImage
              :path="row.asThumbnailPath"
              class="w-15 h-20"
            />
          </div>

          <div
            class="truncate text-sm font-medium text-g-900"
          >
            {{ row.asName || '-' }}
          </div>

        </div>
      </template>

      <template
        #createTime="{ row }"
      >
        <span>
          {{ formatDateTime(row.createTime) }}
        </span>

      </template>

      <template
        #fileSize="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ fileSizeFormat(row.asSize) }}
        </span>
      </template>

      <template
        #operation="{ row }"
      >
        <div
          class="flex items-center gap-2"
        >
          <ArtButton
            type="delete"
            tooltip="删除"
            @click="deleteTableItem(row)"
          />

          <ArtButton
            type="download"
            @click="downloadTableItem(row)"
          />

        </div>
      </template>
    </ArtTable>
  </div>
</template>

<style lang="scss" scoped>
</style>

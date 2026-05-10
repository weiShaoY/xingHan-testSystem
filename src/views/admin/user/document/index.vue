<!------  2026-05-10---05:14---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

type DocumentStatus = 'available' | 'processing' | 'failed'

type UserDocument = {
  id: string
  name: string
  status: DocumentStatus
  uploadTime: string
  size: string
  previewLines: number[]
}

const documentList = ref<UserDocument[]>([
  {
    id: '1',
    name: 'proxy.txt',
    status: 'available',
    uploadTime: '2026-04-16 15:19:51',
    size: '578KB',
    previewLines: [18, 26, 14, 30, 22, 28, 16, 24, 20],
  },
  {
    id: '2',
    name: 'PackagePart.xlsx',
    status: 'available',
    uploadTime: '2025-10-09 10:13:30',
    size: '22.8KB',
    previewLines: [34],
  },
])

const columns: ColumnOption<UserDocument>[] = [
  {
    label: '文件名称',
    prop: 'name',
    minWidth: 460,
    useSlot: true,
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 120,
    useSlot: true,
  },
  {
    label: '上传时间',
    prop: 'uploadTime',
    minWidth: 220,
    sortable: true,
    useSlot: true,
  },
  {
    label: '文件大小',
    prop: 'size',
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

function getStatusText(status: DocumentStatus) {
  const statusMap: Record<DocumentStatus, string> = {
    available: '可用',
    processing: '处理中',
    failed: '不可用',
  }

  return statusMap[status]
}

/**
 * 上传文档
 */
function uploadDocument() {

}

function downloadDocument(item: UserDocument) {
  console.log('下载文档:', item)
}

function deleteDocument(item: UserDocument) {
  documentList.value = documentList.value.filter(document => document.id !== item.id)
}

function exportDocument(item: UserDocument) {
  console.log('导出文档:', item)
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
          共 {{ documentList.length }} 个文档
        </p>
      </div>

      <ArtIconButton
        type="add"
        @click="uploadDocument"
      >
        上传文档
      </ArtIconButton>
    </div>

    <!-- 文档表格 -->
    <ArtTable
      :data="documentList"
      :columns="columns"
      row-key="id"
    >
      <template
        #name="{ row }"
      >
        <div
          class="flex items-center gap-18 max-md:gap-5"
        >
          <div
            class="flex h-23 w-41 shrink-0 flex-col items-center justify-center gap-0.75 border border-g-300 bg-box"
          >
            <span
              v-for="(lineWidth, index) in row.previewLines"
              :key="index"
              class="block h-px bg-g-400"
              :style="{ width: `${lineWidth}px` }"
            />
          </div>

          <span
            class="min-w-0 truncate text-base text-g-900"
          >
            {{ row.name }}
          </span>
        </div>
      </template>

      <template
        #status="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ getStatusText(row.status) }}
        </span>
      </template>

      <template
        #uploadTime="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ row.uploadTime }}
        </span>
      </template>

      <template
        #size="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ row.size }}
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

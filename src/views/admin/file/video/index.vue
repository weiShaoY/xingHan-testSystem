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
  duration: string
  coverColor: string
}

const videoList = ref<UserDocument[]>([
  {
    id: '1',
    name: '前端工程化实践.mp4',
    status: 'available',
    uploadTime: '2026-04-16 15:19:51',
    size: '578MB',
    duration: '12:48',
    coverColor: 'bg-primary/15 text-primary',
  },
  {
    id: '2',
    name: 'Vue3 进阶训练.mp4',
    status: 'available',
    uploadTime: '2025-10-09 10:13:30',
    size: '228MB',
    duration: '08:36',
    coverColor: 'bg-secondary/15 text-secondary',
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
 * 上传视频
 */
function uploadVideo() {

}

function downloadVideo(item: UserDocument) {
  console.log('下载视频:', item)
}

function deleteVideo(item: UserDocument) {
  videoList.value = videoList.value.filter(video => video.id !== item.id)
}

function exportVideo(item: UserDocument) {
  console.log('导出视频:', item)
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
          我的视频
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ videoList.length }} 个视频
        </p>
      </div>

      <ArtIconButton
        type="add"
        @click="uploadVideo"
      >
        上传视频
      </ArtIconButton>
    </div>

    <!-- 视频表格 -->
    <ArtTable
      :data="videoList"
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
            class="relative flex h-23 w-41 shrink-0 items-center justify-center overflow-hidden rounded bg-g-200"
            :class="row.coverColor"
          >
            <ArtSvgIcon
              icon="ri:play-circle-line"
              class="text-8"
            />

            <span
              class="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white"
            >
              {{ row.duration }}
            </span>
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
            @click="downloadVideo(row)"
          />

          <ArtIconButton
            type="delete"
            tooltip="删除"
            @click="deleteVideo(row)"
          />

          <ArtIconButton
            type="export"
            tooltip="导出"
            @click="exportVideo(row)"
          />
        </div>
      </template>
    </ArtTable>
  </div>
</template>

<style lang="scss" scoped>
</style>

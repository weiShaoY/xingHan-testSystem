<!------------------------------------  视频列表  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import {
  h,
  onBeforeUnmount,
  watch,
} from 'vue'

import ArtPreviewImage from '@/components/core/media/art-preview-image/index.vue'

import ArtButton from '@/components/core/widget/art-button/index.vue'

import { useTable } from '@/hooks'

import FileUpload from '../components/file-upload/index.vue'

const DEFAULT_VIDEO_PREVIEW_TITLE = '视频预览'

/**
 * 是否显示播放弹窗
 */
const isShowVideoPreviewDialog = ref(false)

const videoPreview = ref({
  source: '',
  loading: false,
  title: DEFAULT_VIDEO_PREVIEW_TITLE,
})

let previewRequestId = 0

/** 视频列表搜索条件。 */
const searchFormState = ref({
  name: '',
  type: 'video' as const,
})

/** 下载或删除操作的加载状态。 */
const actionLoading = ref(false)

/**
 * 视频表格。
 */
const {
  columns,
  data,
  loading,
  pagination,
  getData,
  replaceSearchParams,
  handleSizeChange,
  handleCurrentChange,
  refreshCreate,
  refreshRemove,
} = useTable({
  core: {
    apiFn: fetchAdminFileList,
    apiParams: {
      name: '',
      type: 'video',
      pageSize: 10,
      currentPage: 1,
    },
    columnsFactory: (): ColumnOption<FileApi.FileListItem>[] => [
      {
        label: '文件名称',
        prop: 'asName',
        minWidth: 460,
        formatter: (row) => {
          return h('div', {
            class: 'min-w-0 flex items-center gap-2',
          }, [
            h(ArtPreviewImage, {
              path: row.asThumbnailPath,
              preview: false,
              class: 'h-20 w-15 shrink-0 cursor-pointer',
              onClick: () => playVideo(row),
            }),
            h('div', {
              class: 'truncate text-sm font-medium text-g-900',
            }, row.asName || '-'),
          ])
        },
      },
      {
        label: '上传时间',
        prop: 'createTime',
        minWidth: 140,
        sortable: true,
        formatter: row => formatDateTime(row.createTime),
      },
      {
        label: '文件大小',
        prop: 'asSize',
        minWidth: 140,
        sortable: true,
        formatter: row => fileSizeFormat(row.asSize),
      },
      {
        label: '操作',
        prop: 'operation',
        width: 160,
        fixed: 'right',
        formatter: row => h('div', {
          class: 'flex items-center gap-2',
        }, [
          h(ArtButton, {
            type: 'delete',
            tooltip: '删除',
            onClick: () => deleteTableItem(row),
          }),
          h(ArtButton, {
            type: 'download',
            onClick: () => downloadTableItem(row),
          }),
        ]),
      },
    ],
  },
  hooks: {
    onError: () => {
      ElNotification.error('获取视频列表失败')
    },
  },
})

/**
 * 上传成功
 */
function handleUploadSuccess() {
  void refreshCreate()
}

/**
 * 上传失败
 */
function handleUploadError(error: Error) {
  ElNotification.error(error.message || '上传失败')
}

/**
 * 下载表格项
 */
async function downloadTableItem(item: FileApi.FileListItem) {
  actionLoading.value = true

  try {
    const blob = await fetchAdminFileAttachment(item.asId)

    await fileDownload(blob, item.asName)
  }
  finally {
    actionLoading.value = false
  }
}

/**
 * 删除表格项
 */
async function deleteTableItem(_item: FileApi.FileListItem) {
  actionLoading.value = true
  try {
    await fetchAdminFileDelete(_item.asId)
    await refreshRemove()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
  finally {
    actionLoading.value = false
  }
}

/**
 * 搜索
 */
function handleSearch() {
  replaceSearchParams(searchFormState.value)
  void getData()
}

/**
 * 释放当前视频预览地址。
 */
function clearVideoPreviewSource() {
  if (!videoPreview.value.source) { return }

  URL.revokeObjectURL(videoPreview.value.source)
}

/**
 * 重置视频预览状态。
 */
function resetVideoPreview() {
  clearVideoPreviewSource()
  videoPreview.value.source = ''
  videoPreview.value.loading = false
  videoPreview.value.title = DEFAULT_VIDEO_PREVIEW_TITLE
}

/**
 * 播放视频
 */
async function playVideo(item: FileApi.FileListItem) {
  const requestId = ++previewRequestId

  resetVideoPreview()
  videoPreview.value.loading = true
  videoPreview.value.title = item.asName || DEFAULT_VIDEO_PREVIEW_TITLE
  isShowVideoPreviewDialog.value = true

  try {
    const blob = await fetchAdminFileAttachment(item.asId)

    const objectUrl = URL.createObjectURL(blob)

    if (requestId !== previewRequestId || !isShowVideoPreviewDialog.value) {
      URL.revokeObjectURL(objectUrl)

      return
    }

    videoPreview.value.source = objectUrl
  }
  catch (error) {
    if (requestId === previewRequestId) {
      console.error(error)
      ElNotification.error('播放视频失败')
      isShowVideoPreviewDialog.value = false
    }
  }
  finally {
    if (requestId === previewRequestId) {
      videoPreview.value.loading = false
    }
  }
}

watch(isShowVideoPreviewDialog, (visible) => {
  if (visible) { return }

  previewRequestId += 1
  resetVideoPreview()
})

onBeforeUnmount(() => {
  previewRequestId += 1
  resetVideoPreview()
})
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <VideoPreviewDialog
      v-model="isShowVideoPreviewDialog"
      :source="videoPreview.source"
      :loading="videoPreview.loading"
      :title="videoPreview.title"
      autoplay
      :volume="0.5"
    />

    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
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
          共 {{ pagination.total }} 个视频
        </p>
      </div>

      <div
        class="flex flex-1 items-center justify-end gap-3 max-md:w-full max-md:justify-start max-sm:flex-col"
      >
        <el-input
          v-model.trim="searchFormState.name"
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

        <FileUpload
          upload-type="video"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />

      </div>
    </div>

    <!-- 数据表格 -->
    <ArtTable
      :loading="loading || actionLoading"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      row-key="asId"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>

<!------------------------------------  文档列表  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

const loading = ref(false)

/**
   *  是否显示播放弹窗
   */
const isShowVideoPlayDialog = ref(false)

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
 *  请求参数
 */
const params = reactive<FileApi.FileListParams>({
  name: '',
  type: 'video',
  pageSize: 10,
  currentPage: 1,
})

/**
 * 视频列表
 */
const videoList = ref<FileApi.FileListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: videoList.value.totals,
}))

/**
   *  获取文档列表
   */
async function getDocumentList() {
  loading.value = true

  try {
    videoList.value = await fetchAdminFileList(params)
  }
  catch {
    loading.value = false
  }
  finally {
    loading.value = false
  }
}

getDocumentList()

/**
 * 上传成功
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
 * 搜索
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  getDocumentList()
}

/**
   *  视频播放地址
   */
const videoPlayUrl = ref('')

function resetVideoPlayer() {
  isShowVideoPlayDialog.value = false

  if (videoPlayUrl.value) {
    URL.revokeObjectURL(videoPlayUrl.value)
    videoPlayUrl.value = ''
  }
}

/**
 * 播放视频
 */
async function playVideo(item: FileApi.FileListItem) {
  console.log('播放视频:', item)

  try {
    resetVideoPlayer()
    videoPlayUrl.value = URL.createObjectURL(await fetchAdminFileAttachment(item.asId))
    isShowVideoPlayDialog.value = true
  }
  catch {
    ElNotification.error('播放视频失败')
  }
}

</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <el-dialog
      v-if="isShowVideoPlayDialog && videoPlayUrl"
      v-model="isShowVideoPlayDialog"
      title="播放视频"
      width="50%"
      @close="resetVideoPlayer"
    >
      <ArtVideoPlayer
        player-id="file-video-player"
        :video-url="videoPlayUrl"
        :autoplay="true"
        :volume="0.5"
      />

    </el-dialog>

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
          共 {{ videoList.totals }} 个文档
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
          upload-type="video"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />

      </div>
    </div>

    <!-- 视频表格 -->
    <ArtTable
      :loading="loading"
      :data="videoList.rows"
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
              :preview="false"
              @click="playVideo(row)"
            />
          </div>

          <div
            class="truncate text-sm font-medium text-g-900"
          >
            {{ row.asName || row.asFileName || `未命名文件${row.asExtension || ''}` }}
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

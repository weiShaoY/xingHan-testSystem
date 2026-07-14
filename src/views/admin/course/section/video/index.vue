<!------------------------------------  创建视频小节  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { h } from 'vue'

import ArtPreviewImage from '@/components/core/media/art-preview-image/index.vue'

import { useTable } from '@/hooks'

const route = useRoute()

const router = useRouter()

/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 当前编辑的小节 ID
 */
const olId = computed(() => {
  return Number(route.params.olId || 0)
})

/**
 * 新增小节时所属的章节 ID；为空时表示课程直属小节。
 */
const olPID = computed(() => {
  return Number(route.params.olPID || 0)
})

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(olId.value)
})

/**
 * 页面标题
 */
const pageTitle = computed(() => {
  return isEditMode.value ? '编辑视频' : '添加视频'
})

/** 页面详情加载状态。 */
const pageLoading = ref(false)

/**
 * 是否显示文件选择弹窗
 */
const isShowFileSelectDialog = ref(false)

/**
 * 是否显示上传区域
 */
const isShowUploadArea = ref(!isEditMode.value)

/** 视频列表搜索条件。 */
const searchFormState = ref({
  name: '',
  type: 'video' as const,
})

/**
 * 视频选择表格。
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
} = useTable({
  core: {
    apiFn: fetchAdminFileList,
    apiParams: {
      name: '',
      type: 'video',
      pageSize: 10,
      currentPage: 1,
    },
    immediate: false,
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
    ],
  },
  hooks: {
    onError: () => {
      ElNotification.error('获取视频列表失败')
    },
  },
})

/**
 * 表格当前选中的文件。只有点击“选择视频”后才会写入 formData。
 */
const selectedFile = ref<FileApi.FileListItem>()

/**
 * 小节表单数据
 */
const formData = ref<AdminApi.Course.CourseOutlineSectionVideoEditor>(createInitialFormData())

/**
 * 创建新增或编辑模式下的小节初始表单
 */
function createInitialFormData(): AdminApi.Course.CourseOutlineSectionVideoEditor {
  const baseFormData = {
    couId: couId.value,
    olName: '',
    olIntro: '',
    asId: 0,
    olIsAccessory: 1,
  } as const

  if (isEditMode.value) {
    return {
      ...baseFormData,
      olId: olId.value,
    }
  }

  return {
    ...baseFormData,
    olPID: olPID.value || 0,
    olLevel: olPID.value ? 2 : 1,
  }
}

/**
 * 清空表格当前选择
 */
function clearSelectedFile() {
  selectedFile.value = undefined
}

/** 翻页或切换每页条数时清空上一页的单选文件。 */
watch(
  () => [pagination.current, pagination.size],
  clearSelectedFile,
)

/**
 * 获取小节详情
 */
async function getSectionDetail() {
  if (!olId.value) {
    return
  }

  pageLoading.value = true

  try {
    const section = await fetchAdminCourseOutlineSectionVideoDetail(olId.value)

    formData.value = {
      ...formData.value,
      ...section,
    }
    selectedFile.value = section.accessory
  }
  catch {
    ElNotification.error('获取小节详情失败')
  }
  finally {
    pageLoading.value = false
  }
}

/**
 * 打开表格弹窗
 */
function handleOpenTableDialog() {
  isShowFileSelectDialog.value = true
  replaceSearchParams(searchFormState.value)
  void getData()
}

/**
 * 选择表格行
 */
function handleTableCurrentChange(row?: FileApi.FileListItem) {
  selectedFile.value = row
}

/**
 * 确认选择
 */
function confirmSelectFile() {
  if (!selectedFile.value) {
    return
  }

  formData.value = {
    ...formData.value,
    asId: selectedFile.value.asId,
  }

  isShowFileSelectDialog.value = false
  isShowUploadArea.value = false
}

/**
 * 更换文件
 */
function handleReplaceFileClick() {
  isShowUploadArea.value = true
  clearSelectedFile()
  isShowFileSelectDialog.value = true
  replaceSearchParams(searchFormState.value)
  void getData()
}

/**
 * 搜索
 */
function handleSearch() {
  clearSelectedFile()
  replaceSearchParams(searchFormState.value)
  void getData()
}

/**
 * 提交小节
 */
async function handleSubmit() {
  if (!formData.value.asId) {
    ElNotification.warning('请先选择文件')
    return
  }

  try {
    if (isEditMode.value) {
      await fetchAdminCourseOutlineSectionVideoUpdate(formData.value)
      ElNotification.success('小节更新成功')
    }
    else {
      await fetchAdminCourseOutlineSectionVideoAdd(formData.value)
      ElNotification.success('小节创建成功')
    }

    // 关闭当前标签页
    workTabStore.removeTab(route.path)

    backToCourseOutline()
  }
  catch {
    ElNotification.error(isEditMode.value ? '小节更新失败' : '小节新增失败')
  }
}

onMounted(() => {
  if (isEditMode.value) {
    void getSectionDetail()
  }
})

/**
 * 是否显示播放弹窗
 */
const isShowVideoPlayDialog = ref(false)

/**
 * 视频播放地址
 */
const videoPlayUrl = ref('')

/**
 * 重置视频播放器
 */
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
  try {
    resetVideoPlayer()
    videoPlayUrl.value = URL.createObjectURL(await fetchAdminFileAttachment(item.asId))
    isShowVideoPlayDialog.value = true
  }
  catch {
    ElNotification.error('播放视频失败')
  }
}

/**
 * 返回课程大纲页。
 */
function backToCourseOutline() {
  router.push({
    name: 'AdminCourseOutline',
    params: {
      couId: couId.value,
    },
  })
}
</script>

<template>
  <div
    v-loading="pageLoading"
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
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

    <el-dialog
      v-if="isShowFileSelectDialog"
      v-model="isShowFileSelectDialog"
      title="选择视频"
      width="50%"
      :show-close="false"
    >
      <div
        class="flex justify-between items-center"
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

        <div
          class="flex gap-2 items-center"
        >
          <ArtButton
            @click="$router.push({ name: 'AdminFileVideo' })"
          >
            去上传视频
          </ArtButton>

          <ArtButton
            :disabled="!selectedFile"
            type="primary"
            @click="confirmSelectFile"
          >
            选择视频
          </ArtButton>
        </div>
      </div>

      <!-- 视频表格 -->
      <ArtTable
        row-key="asId"
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        highlight-current-row
        @current-change="handleTableCurrentChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </el-dialog>

    <AdminPageHeader
      :title="pageTitle"
      @back="backToCourseOutline"
    >
      <template
        #extra
      >
        <ArtButton
          v-if="!isShowUploadArea"
          type="warning"
          class="mr-2"
          @click="handleReplaceFileClick"
        >
          更换视频
        </ArtButton>

        <ArtButton
          type="primary"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <!-- 视频选择区域 -->
    <div
      v-if="isShowUploadArea"
      class="art-card flex flex-col items-center justify-center"
    >
      <ArtButton
        icon="ri:upload-line"
        class="text-2xl w-20 h-20"
        @click="handleOpenTableDialog"
      />

      <div
        class="my-5"
      >
        选择一个视频
      </div>

      <div
        class="text-sm text-g-600"
      >
        <p>
          1.点击上方图标，选取转码、审核完成的视频;
        </p>

        <p>
          2.视频支持mp4格式;
        </p>
      </div>
    </div>

    <!-- 视频编辑区 -->
    <div
      v-else
      class="art-card flex items-center justify-between gap-20"
    >
      <aside
        v-if="selectedFile"
      >

        <div
          class="space-y-4 text-sm text-g-600"
        >
          <div
            class="text-lg font-semibold text-g-900"
          >
            视频信息
          </div>

          <div
            class=""
          >
            <ArtPreviewImage
              :path="selectedFile?.asThumbnailPath"
              class="w-15 h-20"
              :preview="false"
              @click="playVideo(selectedFile)"
            />
          </div>

          <div>
            <div>
              视频名称
            </div>

            <div>
              {{ selectedFile?.asName || '-' }}
            </div>
          </div>

          <div>
            <div>
              上传时间：
            </div>

            <div>
              {{ formatDateTime(selectedFile?.createTime) || '' }}
            </div>
          </div>

          <div>
            <div>
              视频大小
            </div>

            <div>
              {{ fileSizeFormat(selectedFile?.asSize || 0) }}
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧 -->
      <div
        class="flex-1"
      >
        <el-form
          :model="formData"
          label-position="top"
          class="min-w-0"
        >
          <el-form-item
            label="节点名称"
            required
          >
            <el-input
              v-model="formData.olName"
              placeholder="请输入节点名称"
            />
          </el-form-item>

          <el-form-item
            label="节点描述"
            required
          >
            <el-input
              v-model="formData.olIntro"
              placeholder="请输入节点描述"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped>

</style>

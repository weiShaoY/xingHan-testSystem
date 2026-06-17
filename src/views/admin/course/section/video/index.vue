<!------------------------------------  创建文档小节  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { useRoute } from 'vue-router'

const route = useRoute()

const router = useRouter()

/**
   *  是否显示播放弹窗
   */
const isShowVideoPlayDialog = ref(false)

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
  return Number(route.query.olPID || 0)
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
  return isEditMode.value ? '编辑文档' : '添加文档'
})

/**
 * 文档表格列配置
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
]

/**
 * 文档列表加载状态
 */
const loading = ref(false)

/**
 * 是否显示文件选择弹窗
 */
const isShowFileSelectDialog = ref(false)

/**
 * 是否显示文档选择上传区域
 */
const isShowDocumentUploadArea = ref(!isEditMode.value)

/**
 * 文件列表请求参数
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
 * 表格当前选中的文档。只有点击“选择文档”后才会写入 formData。
 */
const selectedVideo = ref<FileApi.FileListItem>()

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: videoList.value.totals,
}))

/**
 * 小节表单数据
 */
const formData = ref<AdminApi.Course.CourseOutlineSectionEditor>(createInitialFormData())

/**
 * 创建新增或编辑模式下的小节初始表单
 */
function createInitialFormData(): AdminApi.Course.CourseOutlineSectionEditor {
  const baseFormData = {
    couId: couId.value,
    olName: '',
    olIntro: '',
    asId: 0,
  }

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
function clearSelectedDocument() {
  selectedVideo.value = undefined
}

/**
 * 获取可选择的视频列表
 */
async function getVideoList() {
  loading.value = true

  try {
    videoList.value = await fetchAdminFileList(params)
  }
  finally {
    loading.value = false
  }
}

/**
 * 获取小节详情
 */
async function getSectionDetail() {
  if (!olId.value) {
    return
  }

  try {
    const section = await fetchAdminCourseOutlineSectionDetail(olId.value)

    formData.value = {
      ...formData.value,
      ...section,
    }
    selectedVideo.value = section.accessory
  }
  catch {
    ElNotification.error('获取小节详情失败')
  }
}

/**
 * 选择表格行
 */
function handleVideoCurrentChange(row?: FileApi.FileListItem) {
  selectedVideo.value = row
}

/**
 * 确认选择
 */
function confirmSelectVideo() {
  if (!selectedVideo.value) {
    return
  }

  formData.value = {
    ...formData.value,
    asId: selectedVideo.value.asId,
  }

  isShowFileSelectDialog.value = false
  isShowDocumentUploadArea.value = false
}

/**
 * 更换视频
 */
function handleReplaceVideoClick() {
  isShowDocumentUploadArea.value = true
  clearSelectedDocument()
  void getVideoList()
  isShowFileSelectDialog.value = true
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.pageSize = size
  params.currentPage = 1
  clearSelectedDocument()
  void getVideoList()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  clearSelectedDocument()
  void getVideoList()
}

/**
 * 搜索
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  clearSelectedDocument()
  void getVideoList()
}

/**
 * 提交文档小节
 */
async function handleSubmit() {
  if (!formData.value.asId) {
    ElNotification.warning('请先选择文件')
    return
  }

  try {
    if (isEditMode.value) {
      await fetchAdminCourseOutlineSectionUpdate(formData.value)
      ElNotification.success('小节更新成功')
    }
    else {
      await fetchAdminCourseOutlineSectionAdd(formData.value)
      ElNotification.success('小节创建成功')
    }

    // 关闭当前标签页
    workTabStore.removeTab(route.path)

    router.back()
  }
  catch {
    ElNotification.error(isEditMode.value ? '小节更新失败' : '小节新增失败')
  }
}

onMounted(() => {
  void getVideoList()

  if (isEditMode.value) {
    void getSectionDetail()
  }
})

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

        <div
          class="flex gap-2 items-center"
        >
          <ArtButton
            @click="$router.push({ name: 'AdminFileDocument' })"
          >
            去上传视频
          </ArtButton>

          <ArtButton
            :disabled="!selectedVideo"
            type="primary"
            @click="confirmSelectVideo"
          >
            选择视频
          </ArtButton>
        </div>
      </div>

      <!-- 视频表格 -->
      <ArtTable
        :loading="loading"
        :data="videoList.rows"
        :columns="columns"
        :pagination="pagination"
        row-key="asId"
        highlight-current-row
        @current-change="handleVideoCurrentChange"
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
      </ArtTable>
    </el-dialog>

    <AdminPageHeader
      :title="pageTitle"
    >
      <template
        #extra
      >
        <ArtButton
          v-if="!isShowDocumentUploadArea"
          type="warning"
          class="mr-2"
          @click="handleReplaceVideoClick"
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

    <!-- 文档选择上传区域 -->
    <div
      v-if="isShowDocumentUploadArea"
      class="art-card flex flex-col items-center justify-center"
    >
      <ArtButton
        icon="ri:upload-line"
        class="text-2xl w-20 h-20"
        @click="isShowFileSelectDialog = true"
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
        v-if="selectedVideo"
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
              :path="selectedVideo?.asThumbnailPath"
              class="w-15 h-20"
              :preview="false"
              @click="playVideo(selectedVideo)"
            />
          </div>

          <div>
            <div>
              视频名称
            </div>

            <div>
              {{ selectedVideo?.asName || '-' }}
            </div>
          </div>

          <div>
            <div>
              上传时间：
            </div>

            <div>
              {{ formatDateTime(selectedVideo?.createTime) || '' }}
            </div>
          </div>

          <div>
            <div>
              视频大小
            </div>

            <div>
              {{ fileSizeFormat(selectedVideo?.asSize || 0) }}
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

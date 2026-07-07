<!------------------------------------  创建文档小节  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { useRoute } from 'vue-router'

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
  return isEditMode.value ? '编辑文档' : '添加文档'
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
]

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 是否显示文件选择弹窗
 */
const isShowFileSelectDialog = ref(false)

/**
 * 是否显示上传区域
 */
const isShowUploadArea = ref(!isEditMode.value)

/**
 * 请求参数
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
 * 表格当前选中的文件。只有点击“选择文档”后才会写入 formData。
 */
const selectedFile = ref<FileApi.FileListItem>()

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: table.value.totals,
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
    olIsAccessory: 0,
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

/**
 * 获取小节详情
 */
async function getSectionDetail() {
  loading.value = true
  if (!olId.value) {
    return
  }

  try {
    const section = await fetchAdminCourseOutlineSectionDetail(olId.value)

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
    loading.value = false
  }
}

/**
 * 打开表格弹窗
 */
function handleOpenTableDialog() {
  isShowFileSelectDialog.value = true
  void getTable()
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
  void getTable()
  isShowFileSelectDialog.value = true
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.pageSize = size
  params.currentPage = 1
  clearSelectedFile()
  void getTable()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  clearSelectedFile()
  void getTable()
}

/**
 * 搜索
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  clearSelectedFile()
  void getTable()
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
  if (isEditMode.value) {
    void getSectionDetail()
  }
})

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <el-dialog
      v-if="isShowFileSelectDialog"
      v-model="isShowFileSelectDialog"
      title="选择文档"
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
            去上传文档
          </ArtButton>

          <ArtButton
            :disabled="!selectedFile"
            type="primary"
            @click="confirmSelectFile"
          >
            选择文档
          </ArtButton>
        </div>
      </div>

      <!-- 文档表格 -->
      <ArtTable
        class="max-h-[calc(100vh-400px)] overflow-auto"
        :loading="loading"
        :data="table.rows"
        :columns="columns"
        :pagination="pagination"
        row-key="asId"
        highlight-current-row
        @current-change="handleTableCurrentChange"
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
      </ArtTable>
    </el-dialog>

    <AdminPageHeader
      :title="pageTitle"
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
          更换文档
        </ArtButton>

        <ArtButton
          type="primary"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <!-- 文档选择区域 -->
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
        选择一个文档
      </div>

      <div
        class="text-sm text-g-600"
      >
        <p>
          1.点击上方图标，选取转码、审核完成的文档;
        </p>

        <p>
          2.文档支持pdf格式;
        </p>
      </div>
    </div>

    <!-- 文档编辑区 -->
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
            文档信息
          </div>

          <div
            class=""
          >
            <ArtPreviewImage
              :path="selectedFile?.asThumbnailPath"
              class="w-15 h-20"
            />
          </div>

          <div>
            <div>
              文档名称
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
              文档大小
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

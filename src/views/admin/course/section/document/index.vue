<!------------------------------------  创建文档小节  ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { useRoute } from 'vue-router'

const route = useRoute()

const router = useRouter()

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 当前编辑的小节 ID
 * @abstract 只有在编辑模式下才会有值
 */
const olId = computed(() => {
  return Number(route.params.olId || 0)
})

/**
 * 当前节点所属的 章节 ID
 * @abstract 只有在新增模式下才会有值
 */
const olPID = computed(() => {
  return Number(route.query.olPID || 0)
})

/**
 * 是否为编辑模式。
 */
const isEditMode = computed(() => {
  return Boolean(olId.value)
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
   *  是否显示文件选择弹窗
   */
const isShowFileSelectDialog = ref(false)

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
 * 文档列表
 */
const documentTable = ref<FileApi.FileListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 当前选中的文档
 */
const selectedDocument = ref<FileApi.FileListItem>()

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
  loading.value = true

  try {
    documentTable.value = await fetchAdminFileList(params)
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
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.pageSize = size
  params.currentPage = 1
  selectedDocument.value = undefined
  getDocumentList()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  selectedDocument.value = undefined
  getDocumentList()
}

/**
 * 搜索文档
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  selectedDocument.value = undefined
  getDocumentList()
}

const formData = ref<AdminApi.Course.CourseOutlineSectionEditor>(
  isEditMode.value
  // 编辑小节
    ? {
        olId: olId.value,
        couId: couId.value,
        olName: '',
        olIntro: '',
        asId: 0,
      }

  // 新增小节
    : {
        couId: couId.value,
        olName: '',
        olIntro: '',
        olPID: olPID.value || 0,
        olLevel: olPID.value ? 2 : 1,
        asId: 0,
      },
)

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
  }
  catch {
    ElNotification.error('获取小节详情失败')
  }
}

onMounted(() => {
  if (isEditMode.value) {
    void getSectionDetail()
  }
})

/**
 * 选择文档表格行
 */
function handleDocumentCurrentChange(row: FileApi.FileListItem) {
  selectedDocument.value = row
}

/**
 * 确认选择文档
 */
function confirmSelectDocument() {
  if (!selectedDocument.value) {
    return
  }

  formData.value = {
    ...formData.value,
    asId: selectedDocument.value.asId,
  }

  isShowFileSelectDialog.value = false
}

/**
 * 更换文档
 */
function handleReplaceDocumentClick() {
  selectedDocument.value = undefined
  getDocumentList()
  isShowFileSelectDialog.value = true
}

/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

/**
 * 提交文档小节
 */
async function handleSubmit() {
  try {
    if (isEditMode.value) {
      await fetchAdminCourseOutlineSectionUpdate(formData.value)
      console.log('🚀 ~ file: index.vue:247 ~ formData.value:', formData.value)
      ElNotification.success('文档小节更新成功')
    }
    else {
      await fetchAdminCourseOutlineSectionAdd(formData.value)
      console.log('🚀 ~ file: index.vue:251 ~ formData.value:', formData.value)
      ElNotification.success('文档小节创建成功')
    }

    // 关闭当前标签页
    workTabStore.removeTab(route.path)

    router.back()
  }
  catch {
    ElNotification.error(isEditMode.value ? '文档小节更新失败' : '文档小节新增失败')
  }
}
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
          <ArtIconButton
            @click="$router.push({ name: 'AdminFileDocument' })"
          >
            去上传文档
          </ArtIconButton>

          <ArtIconButton
            :disabled="!selectedDocument"
            type="primary"
            @click="confirmSelectDocument"
          >
            选择文档
          </ArtIconButton>
        </div>
      </div>

      <!-- 文档表格 -->
      <ArtTable
        :loading="loading"
        :data="documentTable.rows"
        :columns="columns"
        :pagination="pagination"
        row-key="asId"
        highlight-current-row
        @current-change="handleDocumentCurrentChange"
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
      </ArtTable>
    </el-dialog>

    <AdminPageHeader
      title="添加文档"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="warning"
          class="mr-2"
          @click="handleReplaceDocumentClick"
        >
          更换文档
        </ArtIconButton>

        <ArtIconButton
          type="primary"
          class=""
          @click="handleSubmit"
        >
          完成
        </ArtIconButton>
      </template>
    </AdminPageHeader>

    <!-- 文档选择上传区域 -->
    <div
      class="art-card flex flex-col items-center justify-center"
    >
      <ArtIconButton
        icon="ri:upload-line"
        class="text-2xl w-20 h-20"
        @click="isShowFileSelectDialog = true"
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
      class="art-card flex items-center justify-between gap-20"
    >
      <aside
        class=""
      >
        <el-image
          :src="getFileUrl(selectedDocument?.asThumbnailPath || '')"
        />

        <div
          class="space-y-4 text-sm text-g-600"
        >
          <div
            class="text-lg font-semibold text-g-900"
          >
            文档信息
          </div>

          <div>
            <div>
              文档名称
            </div>

            <div>
              {{ selectedDocument?.asName || selectedDocument?.asFileName || `未命名文件${selectedDocument?.asExtension || ''}` }}
            </div>
          </div>

          <div>
            <div>
              上传时间：
            </div>

            <div>
              {{ formatDateTime(selectedDocument?.createTime) || '' }}
            </div>
          </div>

          <div>
            <div>
              文档大小
            </div>

            <div>
              {{ formatFileSize(selectedDocument?.asSize || 0) }}
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
            label="文档名称"
            required
          >
            <el-input
              v-model="formData.olName"
              placeholder="请输入文档名称"
            />
          </el-form-item>

          <el-form-item
            label="文档描述"
            required
          >
            <el-input
              v-model="formData.olIntro"
              placeholder="请输入文档描述"
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

<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { ref } from 'vue'

const props = withDefaults(defineProps<{

  /** 当前阶段索引 */
  stageIndex?: number

  /** 当前       */

}>(), {
  stageIndex: 0,
})

const emit = defineEmits<{

  /** 添加课程事件 */
  'add-course': [course: AdminApi.Course.CourseListItem, stageIndex: number]
}>()

const loading = ref(false)

/**
 * 表格列配置
 */
const columns: ColumnOption<AdminApi.Course.CourseListItem>[] = [
  {
    label: '课程名称',
    prop: 'couName',
    slotName: 'couName',
    minWidth: 200,
    useSlot: true,
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    minWidth: 140,
    useSlot: true,
    sortable: true,
  },
  {
    label: '查看',
    prop: 'view',
    width: 100,
    useSlot: true,
    fixed: 'right',
  },
  {
    label: '已添加',
    prop: 'isAdded',
    width: 200,
    useSlot: true,
    fixed: 'right',
  },

]

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
const table = ref<AdminApi.Course.CourseListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 表格当前选中的课程
 */
const selectedCourse = ref<AdminApi.Course.CourseListItem>()

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.currentPage,
  size: params.pageSize,
  total: table.value.totals,
}))

const visible = defineModel<boolean>()

/**
   * 添加课程
   */
function addCourse(course: AdminApi.Course.CourseListItem) {
  emit('add-course', course, props.stageIndex)

  // // 更新课程列表中的状态
  // const courseItem = courseList.value.find(item => item.accessCode === course.accessCode)

  // if (courseItem) {
  //   courseItem.isAdded = true
  // }
}

/**
 * 选择表格行
 */
function handleTableCurrentChange(row?: AdminApi.Course.CourseListItem) {
  selectedCourse.value = row
}

/**
 * 清空表格当前选择
 */
function clearSelectedFile() {
  selectedCourse.value = undefined
}

/**
 * 获取表格数据
 */
async function getTable() {
  loading.value = true

  try {
    table.value = await fetchAdminCourseList(params)
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

onMounted(() => {
  void getTable()
})
</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="选择课程"
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
        #couName="{ row }"
      >
        <div
          class="min-w-0 flex items-center gap-2"
        >
          {{ row.couName || '-' }}

        </div>
      </template>

      <template
        #updateTime="{ row }"
      >
        <span>
          {{ formatDateTime(row.updateTime) }}
        </span>
      </template>

      <template
        #view="{ row }"
      >
        <el-button
          link
          size="small"
        >
          查看
        </el-button>
      </template>

      <template
        #isAdded="{ row }"
      >

        <div
          class="flex items-center gap-2"
        >
          <ArtButton
            type="primary"
            size="small"
            @click="addCourse(row)"
          >
            添加
          </ArtButton>

          <ArtButton
            type="warning"
            size="small"
            @click="addCourse(row)"
          >
            已添加
          </ArtButton>

        </div>
      </template>
    </ArtTable>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

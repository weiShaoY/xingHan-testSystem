<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import {
  h,
  ref,
  watch,
} from 'vue'

import { useTable } from '@/hooks'

defineOptions({
  name: 'QuestionBankSelectDialog',
})

/**
 * 弹窗确认事件。
 * 返回当前勾选的题库题目列表。
 */
const emit = defineEmits<{
  confirm: [questions: AdminApi.Question.QuestionEditorQuestion[]]
}>()

/**
 * 弹窗显示状态。
 */
const visible = defineModel<boolean>({
  default: false,
})

/**
 * 题库筛选表单状态。
 */
const searchFormState = ref({
  qbIds: [] as number[],
})

/**
 * 题库下拉列表数据。
 */
const questionBankList = ref<AdminApi.Course.CourseOutlineSectionExamQuestionBankItem[]>([])

/**
 * 当前在弹窗表格中勾选的题目。
 */
const selectedQuestions = ref<AdminApi.Question.QuestionEditorQuestion[]>([])

/**
 * 获取题型显示文案。
 * @param type 题型值
 */
function getQuestionTypeLabel(type: number) {
  return type === 1 ? '单选题' : type === 2 ? '多选题' : '其他题型'
}

/**
 * 获取题型标签类型。
 * @param type 题型值
 */
function getQuestionTypeTagType(type: number) {
  return type === 1 ? 'primary' : type === 2 ? 'success' : 'info'
}

/**
 * 获取难度显示文案。
 * @param diff 难度值
 */
function getDiffLabel(diff: number) {
  return diff === 1 ? '简单' : diff === 2 ? '中等' : '困难'
}

/**
 * 获取难度标签类型。
 * @param diff 难度值
 */
function getDiffTagType(diff: number) {
  return diff === 1 ? 'success' : diff === 2 ? 'warning' : 'danger'
}

/**
 * 构建题库表格列配置。
 */
function createQuestionTableColumns(): ColumnOption<AdminApi.Question.QuestionEditorQuestion>[] {
  return [
    {
      label: '序号',
      type: 'globalIndex',
      width: 60,
      visible: true,
    },
    {
      label: '题目名称',
      prop: 'qusTitle',
      minWidth: 260,
    },
    {
      label: '题型',
      prop: 'qusType',
      width: 100,
      formatter: (row) => {
        return h(ElTag, {
          type: getQuestionTypeTagType(row.qusType),
          size: 'small',
        }, () => getQuestionTypeLabel(row.qusType))
      },
    },
    {
      label: '难度',
      prop: 'qusDiff',
      width: 100,
      formatter: (row) => {
        return h(ElTag, {
          type: getDiffTagType(row.qusDiff),
          size: 'small',
        }, () => getDiffLabel(row.qusDiff))
      },
    },
    {
      label: '分数',
      prop: 'qusScore',
      width: 100,
    },
  ]
}

/**
 * 适配题库题目列表接口响应结构。
 * 将后端返回的 rows、totals 转换为 useTable 统一识别的 records、total。
 * @param response 接口原始响应
 */
function adaptQuestionListResponse(response: AdminApi.Course.CourseOutlineSectionExamQuestionListResponse) {
  return {
    records: response.rows ?? [],
    total: response.totals ?? 0,
  }
}

/**
 * 题库弹窗表格列配置。
 */
const {
  columns,
  /**
   * 题库弹窗表格数据。
   */
  data: tableData,
  /**
   * 题库弹窗表格加载状态。
   */
  loading,
  /**
   * 题库弹窗表格分页信息。
   */
  pagination: tablePagination,

  /**
   * 获取题库题目列表。
   */
  getData,

  /**
   * 替换当前筛选参数。
   */
  replaceSearchParams,

  /**
   * 处理分页大小变化。
   */
  handleSizeChange: handleTableSizeChange,

  /**
   * 处理页码变化。
   */
  handleCurrentChange: handleTableCurrentChange,
} = useTable({
  core: {
    apiFn: fetchAdminCourseOutlineSectionExamQuestionList,
    apiParams: {
      pageSize: 10,
      currentPage: 1,
      qbIds: [],
    },
    immediate: false,
    paginationKey: {
      current: 'currentPage',
      size: 'pageSize',
    },
    columnsFactory: createQuestionTableColumns,
  },
  transform: {
    responseAdapter: adaptQuestionListResponse,
  },
  hooks: {
    onError: () => {
      ElNotification.error('获取题目列表失败')
    },
  },
})

/**
 * 题库筛选参数。
 * 兼容模板中对 params 的使用方式。
 */
const params = searchFormState

/**
 * 根据筛选表单生成题库查询参数。
 * @param search 当前筛选表单状态
 */
function buildSearchParams(search: typeof searchFormState.value) {
  return {
    qbIds: [...search.qbIds],
  }
}

/**
 * 获取题库下拉列表。
 */
async function getQuestionBankList() {
  try {
    questionBankList.value = await fetchAdminCourseOutlineSectionExamQuestionBank()
  }
  catch {
    ElNotification.error('获取题库下拉列表失败')
  }
}

/**
 * 初始化弹窗数据。
 * 包括重置选中状态、加载题库下拉项和首屏题目列表。
 */
async function initDialogData() {
  selectedQuestions.value = []
  searchFormState.value = {
    qbIds: [],
  }
  await getQuestionBankList()
  replaceSearchParams({
    ...buildSearchParams(searchFormState.value),
    currentPage: 1,
    pageSize: 10,
  })
  await getData()
}

/**
 * 记录当前表格选中项。
 * @param rows 当前选中的题目列表
 */
function handleTableSelectionChange(rows: AdminApi.Question.QuestionEditorQuestion[]) {
  selectedQuestions.value = rows
}

/**
 * 按当前筛选条件重新加载题目列表。
 */
function handleSearch() {
  selectedQuestions.value = []
  replaceSearchParams(buildSearchParams(searchFormState.value))
  void getData()
}

/**
 * 处理每页条数变化。
 * @param size 每页条数
 */
async function handleSizeChange(size: number) {
  selectedQuestions.value = []
  await handleTableSizeChange(size)
}

/**
 * 处理页码变化。
 * @param currentPage 当前页码
 */
async function handleCurrentChange(currentPage: number) {
  selectedQuestions.value = []
  await handleTableCurrentChange(currentPage)
}

/**
 * 关闭弹窗。
 */
function closeDialog() {
  visible.value = false
}

/**
 * 确认当前选择的题目。
 * 未选择题目时给出提示，否则将结果回传给父组件。
 */
function confirmSelectQuestions() {
  if (!selectedQuestions.value.length) {
    ElNotification.warning('请先选择题目')
    return
  }

  emit('confirm', selectedQuestions.value)
  visible.value = false
}

/**
 * 监听弹窗打开状态，在展示时初始化所需数据。
 * @param value 当前弹窗显示状态
 */
watch(visible, (value) => {
  if (!value) {
    return
  }

  void initDialogData()
})
</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="从题库添加题目"
    width="72%"
    destroy-on-close
  >
    <div
      class="mb-4 flex flex-wrap items-center justify-between gap-3"
    >
      <div
        class="flex flex-wrap items-center gap-3"
      >
        <el-select
          v-model="params.qbIds"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          placeholder="筛选题库"
          style="width: 320px"
          @change="handleSearch"
        >
          <el-option
            v-for="item in questionBankList"
            :key="item.qbId"
            :label="item.qbName"
            :value="item.qbId"
          />
        </el-select>
      </div>

      <div
        class="text-sm text-g-600"
      >
        共 {{ tablePagination.total }} 道，已选 {{ selectedQuestions.length }} 道
      </div>
    </div>

    <ArtTable
      :loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="tablePagination"
      row-key="qusId"
      @selection-change="handleTableSelectionChange"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    />

    <template
      #footer
    >
      <div
        class="flex items-center justify-end gap-3"
      >
        <el-button
          @click="closeDialog"
        >
          取消
        </el-button>

        <ArtButton
          type="primary"
          @click="confirmSelectQuestions"
        >
          添加所选题目
        </ArtButton>
      </div>
    </template>
  </el-dialog>
</template>

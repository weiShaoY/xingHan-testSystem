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

const emit = defineEmits<{
  confirm: [questions: AdminApi.Question.QuestionEditorQuestion[]]
}>()

const visible = defineModel<boolean>({
  default: false,
})

type QuestionListItem = AdminApi.Question.QuestionEditorQuestion

const questionBankList = ref<AdminApi.Course.CourseOutlineSectionExamQuestionBankItem[]>([])

const selectedQuestions = ref<QuestionListItem[]>([])

function getQuestionTypeLabel(type: number) {
  return type === 1 ? '单选题' : type === 2 ? '多选题' : '其他题型'
}

function getQuestionTypeTagType(type: number) {
  return type === 1 ? 'primary' : type === 2 ? 'success' : 'info'
}

function getDiffLabel(diff: number) {
  return diff === 1 ? '简单' : diff === 2 ? '中等' : '困难'
}

function getDiffTagType(diff: number) {
  return diff === 1 ? 'success' : diff === 2 ? 'warning' : 'danger'
}

function createQuestionTableColumns(): ColumnOption<QuestionListItem>[] {
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

const {
  columns,
  data: tableData,
  loading: tableLoading,
  pagination: tablePagination,
  searchParams,
  getData,
  replaceSearchParams,
  handleSizeChange: handleTableSizeChange,
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
  hooks: {
    onError: () => {
      ElNotification.error('获取题目列表失败')
    },
  },
})

const params = searchParams as {
  currentPage: number
  pageSize: number
  qbIds: number[]
}

async function getQuestionBankList() {
  try {
    questionBankList.value = await fetchAdminCourseOutlineSectionExamQuestionBank()
  }
  catch {
    ElNotification.error('获取题库下拉列表失败')
  }
}

async function initDialogData() {
  selectedQuestions.value = []
  await getQuestionBankList()
  replaceSearchParams({
    ...searchParams,
    currentPage: 1,
  })
  await getData()
}

function handleTableSelectionChange(rows: QuestionListItem[]) {
  selectedQuestions.value = rows
}

function handleSearch() {
  selectedQuestions.value = []
  replaceSearchParams({
    ...searchParams,
    currentPage: 1,
  })
  void getData()
}

async function handleSizeChange(size: number) {
  selectedQuestions.value = []
  await handleTableSizeChange(size)
}

async function handleCurrentChange(currentPage: number) {
  selectedQuestions.value = []
  await handleTableCurrentChange(currentPage)
}

function closeDialog() {
  visible.value = false
}

function confirmSelectQuestions() {
  if (!selectedQuestions.value.length) {
    ElNotification.warning('请先选择题目')
    return
  }

  emit('confirm', selectedQuestions.value)
  visible.value = false
}

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
        已选 {{ selectedQuestions.length }} 道
      </div>
    </div>

    <ArtTable
      class="max-h-[calc(100vh-360px)] overflow-auto"
      :loading="tableLoading"
      :data="tableData"
      :columns="columns"
      :pagination="tablePagination"
      row-key="qusID"
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

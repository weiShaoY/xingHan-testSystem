<!------  2026-07-09---考试小节编辑  ------>
<script lang="ts" setup>
import {
  computed,
  ref,
} from 'vue'

import QuestionBankSelectDialog from './QuestionBankSelectDialog.vue'

const route = useRoute()

const router = useRouter()

// ==================== Constants ====================

/** 当前激活的页签 */
const activeTab = ref<'edit' | 'setting'>('edit')

// ==================== Types ====================

/** 支持的题目类型 */
type QuestionType = 1 | 2

/** 支持的题目难度 */
type QuestionDifficulty = 1 | 2 | 3

/** 题目选项类型 */
type QuestionOption = AdminApi.Question.QuestionItem

/** 题库列表项类型 */
type QuestionListItem = AdminApi.Question.QuestionEditorQuestion

/** 页面内部使用的题目结构，补充了前端生成的 clientId */
type ExamQuestion = Omit<QuestionListItem, 'qusType'> & {
  clientId: string
  qusType: QuestionType
}

/** 考试编辑表单结构 */
type ExamEditorForm = Omit<AdminApi.Course.CourseOutlineSectionExamEditor, 'questions'> & {
  questions: ExamQuestion[]
}

const workTabStore = useWorkTabStore()

// ==================== Route Derived State ====================

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
  return isEditMode.value ? '编辑考试' : '添加考试'
})

// ==================== UI State ====================

/**
 * 加载状态
 */
const pageLoading = ref(false)

/**
 * 是否显示题库弹窗
 */
const isShowExamSelectDialog = ref(false)

/**
 * 小节表单数据
 */
const formData = ref<ExamEditorForm>(createInitialFormData())

// ==================== Static Options ====================

/** 选项标签序列，如 A、B、C、D */
const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/** 题型选项 */
const questionTypes: { label: string, value: QuestionType }[] = [
  {
    label: '单选题',
    value: 1,
  },
  {
    label: '多选题',
    value: 2,
  },
]

/** 难度选项 */
const diffOptions: { label: string, value: QuestionDifficulty }[] = [
  {
    label: '简单',
    value: 1,
  },
  {
    label: '中等',
    value: 2,
  },
  {
    label: '困难',
    value: 3,
  },
]

/** 题目操作菜单 */
const questionActions = [
  {
    label: '移动',
    action: 'move',
  },
  {
    label: '复制',
    action: 'copy',
  },
  {
    label: '删除',
    action: 'delete',
  },
]

/** 当前正在移动的题目 clientId */
const movingQuestionId = ref('')

// ==================== Computed State ====================

/**
 * 考试总分
 */
const totalScore = computed(() => {
  return formData.value.questions.reduce((sum, question) => sum + Number(question.qusScore || 0), 0)
})

/**
 * 考试统计
 */
const examStats = computed(() => {
  return [
    `题目数 ${formData.value.questions.length}`,
    `总分 ${totalScore.value}`,
    `单选 ${formData.value.questions.filter(question => question.qusType === 1).length}`,
    `多选 ${formData.value.questions.filter(question => question.qusType === 2).length}`,
    `当前满分 ${totalScore.value} 分`,
  ]
})

/**
 * 时间范围
 */
const dateRange = computed<[string, string] | []>({
  get() {
    if (formData.value.startTime && formData.value.endTime) {
      return [formData.value.startTime, formData.value.endTime] as [string, string]
    }

    return [] as []
  },
  set(value: [string, string] | []) {
    if (!value?.length) {
      formData.value.startTime = ''
      formData.value.endTime = ''
      return
    }

    formData.value.startTime = value[0]
    formData.value.endTime = value[1]
  },
})

/**
 * 创建新增或编辑模式下的小节初始表单
 */
function createInitialFormData(): ExamEditorForm {
  const baseFormData: Omit<ExamEditorForm, 'olId' | 'olPID' | 'olLevel'> = {
    couId: couId.value,
    attemptLimit: 1,
    durationMinutes: 60,
    endTime: '',
    examIntro: '',
    examType: 0,
    isShowAnswer: 1,
    isShowScore: 1,
    passScore: 60,
    retakeIntervalHours: 0,
    score: 0,
    startTime: '',
    testPaperName: '',
    testPaperType: 1,
    questions: [createQuestion()],
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
 * 生成前端临时题目 ID，用于拖拽、复制等本地交互。
 */
function createClientId() {
  const randomValue = Math.random().toString(36)

  const randomId = randomValue.slice(2)

  return `${Date.now()}-${randomId}`
}

/**
 * 创建一个默认题目选项。
 * @param ansContext 选项内容
 * @param ansIsCorrect 是否为正确答案
 */
function createOption(ansContext = '', ansIsCorrect = false): QuestionOption {
  return {
    ansContext,
    ansIsCorrect,
  }
}

/**
 * 创建一个默认题目。
 * @param type 题目类型，默认单选题
 */
function createQuestion(type: QuestionType = 1): ExamQuestion {
  return {
    clientId: createClientId(),
    qusTitle: '',
    qusType: type,
    qusScore: 10,
    qusExplain: '',
    qusDiff: 2,
    qusItems: [
      createOption(),
      createOption(),
      createOption(),
      createOption(),
    ],
  }
}

/**
 * 判断接口题型是否属于当前页面支持的题型。
 * @param type 接口返回的题型值
 */
function isSupportedQuestionType(type: AdminApi.Question.QuestionEditorQuestion['qusType']): type is QuestionType {
  return type === 1 || type === 2
}

/**
 * 将接口返回的题目结构标准化为页面内部结构。
 * @param question 原始题目数据
 */
function normalizeQuestion(question: AdminApi.Question.QuestionEditorQuestion): ExamQuestion {
  const qusType = isSupportedQuestionType(question.qusType) ? question.qusType : 1

  const normalizedQuestion: ExamQuestion = {
    ...question,
    clientId: createClientId(),
    qusType,
    qusTitle: question.qusTitle ?? '',
    qusScore: question.qusScore ?? 10,
    qusExplain: question.qusExplain ?? '',
    qusDiff: ([1, 2, 3].includes(Number(question.qusDiff)) ? question.qusDiff : 2) as QuestionDifficulty,
    qusItems: question.qusItems?.length
      ? question.qusItems.map(item => ({
          ...item,
          ansContext: item.ansContext ?? '',
          ansIsCorrect: Boolean(item.ansIsCorrect),
        }))
      : [
          createOption(),
          createOption(),
          createOption(),
          createOption(),
        ],
  }

  ensureQuestionTypeConsistency(normalizedQuestion)

  return normalizedQuestion
}

/**
 * 将接口返回的考试详情标准化为页面表单结构。
 * @param data 原始考试详情
 */
function normalizeFormData(data: AdminApi.Course.CourseOutlineSectionExamEditor): ExamEditorForm {
  const questions = (data.questions ?? [])
    .filter(question => isSupportedQuestionType(question.qusType))
    .map(normalizeQuestion)

  return {
    ...createInitialFormData(),
    ...data,
    questions: questions.length ? questions : [createQuestion()],
  }
}

/**
 * 根据选项索引生成展示标签。
 * @param index 选项索引
 */
function getOptionLabel(index: number) {
  return optionLabels[index] ?? `${index + 1}`
}

/**
 * 获取多选题所有正确答案的索引。
 * @param question 当前题目
 */
function getCorrectOptionIndexes(question: ExamQuestion) {
  return question.qusItems
    .map((option, index) => option.ansIsCorrect ? index : -1)
    .filter(index => index !== -1)
}

/**
 * 获取单选题当前正确答案索引。
 * @param question 当前题目
 */
function getCorrectSingleOptionIndex(question: ExamQuestion) {
  return getCorrectOptionIndexes(question)[0]
}

/**
 * 设置单选题的正确答案。
 * @param question 当前题目
 * @param optionIndex 选中的选项索引
 */
function setCorrectSingleOption(question: ExamQuestion, optionIndex: number | string) {
  const selectedIndex = Number(optionIndex)

  question.qusItems.forEach((option, index) => {
    option.ansIsCorrect = index === selectedIndex
  })
}

/**
 * 设置多选题的正确答案。
 * @param question 当前题目
 * @param optionIndexes 选中的选项索引列表
 */
function setCorrectMultipleOptions(question: ExamQuestion, optionIndexes: Array<number | string>) {
  const selectedIndexes = optionIndexes.map(Number)

  question.qusItems.forEach((option, index) => {
    option.ansIsCorrect = selectedIndexes.includes(index)
  })
}

/**
 * 保证题型与答案状态一致。
 * 单选题只允许保留一个正确答案，并补足最少选项数量。
 * @param question 当前题目
 */
function ensureQuestionTypeConsistency(question: ExamQuestion) {
  if (!question.qusItems?.length) {
    question.qusItems = [
      createOption(),
      createOption(),
      createOption(),
      createOption(),
    ]
  }

  if (question.qusType !== 1) {
    return
  }

  let hasCorrectOption = false

  question.qusItems.forEach((option) => {
    if (!option.ansIsCorrect) {
      return
    }

    if (hasCorrectOption) {
      option.ansIsCorrect = false
      return
    }

    hasCorrectOption = true
  })
}

/** 追加一条新题目。 */
function addQuestion() {
  formData.value.questions.push(createQuestion())
}

/**
 * 复制指定题目，并清空后端主键，保留题干和选项内容。
 * @param question 被复制的题目
 */
function copyQuestion(question: ExamQuestion) {
  formData.value.questions.push({
    clientId: createClientId(),
    qusId: undefined,
    qusTitle: question.qusTitle,
    qusType: question.qusType,
    qusScore: question.qusScore,
    qusExplain: question.qusExplain,
    qusDiff: question.qusDiff,
    qusItems: question.qusItems.map(option => ({
      ansId: undefined,
      qusId: undefined,
      ansContext: option.ansContext,
      ansIsCorrect: option.ansIsCorrect,
    })),
  })
}

/**
 * 删除指定题目，至少保留一题。
 * @param questionIndex 题目索引
 */
function deleteQuestion(questionIndex: number) {
  if (formData.value.questions.length <= 1) {
    ElNotification.warning('至少保留一道题目')
    return
  }

  formData.value.questions.splice(questionIndex, 1)
}

/**
 * 进入题目移动状态。
 * @param questionIndex 题目索引
 */
function moveQuestion(questionIndex: number) {
  movingQuestionId.value = formData.value.questions[questionIndex]?.clientId ?? ''
}

/** 取消题目移动状态。 */
function cancelMoveQuestion() {
  movingQuestionId.value = ''
}

/**
 * 将当前移动中的题目插入到目标位置之后。
 * @param targetIndex 目标题目索引
 */
function moveQuestionTo(targetIndex: number) {
  if (!movingQuestionId.value) {
    return
  }

  const sourceIndex = formData.value.questions.findIndex(question => question.clientId === movingQuestionId.value)

  if (sourceIndex === -1) {
    cancelMoveQuestion()
    return
  }

  const [question] = formData.value.questions.splice(sourceIndex, 1)

  const insertIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1

  formData.value.questions.splice(insertIndex, 0, question)
  cancelMoveQuestion()
}

/**
 * 统一处理题目操作菜单行为。
 * @param action 操作类型
 * @param question 当前题目
 * @param questionIndex 当前题目索引
 */
function handleQuestionAction(action: string, question: ExamQuestion, questionIndex: number) {
  if (action === 'move') {
    moveQuestion(questionIndex)
  }

  if (action === 'copy') {
    copyQuestion(question)
  }

  if (action === 'delete') {
    deleteQuestion(questionIndex)
  }
}

/**
 * 在指定位置后插入一个选项；未指定位置时追加到末尾。
 * @param question 当前题目
 * @param index 当前选项索引
 */
function addOption(question: ExamQuestion, index?: number) {
  const insertIndex = typeof index === 'number' ? index + 1 : question.qusItems.length

  question.qusItems.splice(insertIndex, 0, createOption())
}

/**
 * 删除指定选项，至少保留两个选项。
 * @param question 当前题目
 * @param index 选项索引
 */
function removeOption(question: ExamQuestion, index: number) {
  if (question.qusItems.length <= 2) {
    ElNotification.warning('每道题至少保留两个选项')
    return
  }

  question.qusItems.splice(index, 1)
}

/**
 * 校验整个考试表单数据。
 * 包括试卷标题、题目内容、选项内容、分值和正确答案约束。
 */
function validateFormData() {
  if (!formData.value.testPaperName.trim()) {
    ElNotification.warning('请输入考试标题')
    return false
  }

  if (!formData.value.questions.length) {
    ElNotification.warning('请至少添加一道题目')
    return false
  }

  for (const [questionIndex, question] of formData.value.questions.entries()) {
    const questionNumber = `第 ${questionIndex + 1} 题`

    if (!question.qusTitle.trim()) {
      ElNotification.warning(`${questionNumber} 请输入题目内容`)
      return false
    }

    if (question.qusItems.length < 2) {
      ElNotification.warning(`${questionNumber} 至少需要两个选项`)
      return false
    }

    if (question.qusItems.some(option => !option.ansContext.trim())) {
      ElNotification.warning(`${questionNumber} 请完善选项内容`)
      return false
    }

    if (!Number.isFinite(Number(question.qusScore)) || Number(question.qusScore) <= 0) {
      ElNotification.warning(`${questionNumber} 请填写有效分值`)
      return false
    }

    const correctOptionCount = question.qusItems.filter(option => option.ansIsCorrect).length

    if (question.qusType === 1 && correctOptionCount !== 1) {
      ElNotification.warning(`${questionNumber} 单选题需要且只能设置一个正确答案`)
      return false
    }

    if (question.qusType === 2 && correctOptionCount === 0) {
      ElNotification.warning(`${questionNumber} 多选题请至少设置一个正确答案`)
      return false
    }
  }

  return true
}

/**
 * 生成提交给后端的考试数据。
 */
function createSubmitData(): AdminApi.Course.CourseOutlineSectionExamEditor {
  return {
    ...formData.value,
    testPaperName: formData.value.testPaperName.trim(),
    examIntro: formData.value.examIntro.trim(),
    score: totalScore.value,
    questions: formData.value.questions.map((question) => {
      return {
        qusId: question.qusId,
        qusTitle: question.qusTitle.trim(),
        qusType: question.qusType,
        qusScore: Number(question.qusScore),
        qusExplain: question.qusExplain?.trim() ?? '',
        qusDiff: question.qusDiff,
        qusItems: question.qusItems.map(option => ({
          ansId: option.ansId,
          qusId: option.qusId,
          ansContext: option.ansContext.trim(),
          ansIsCorrect: Boolean(option.ansIsCorrect),
        })),
      }
    }),
  }
}

/**
 * 获取小节详情
 */
async function getSectionDetail() {
  if (!olId.value) {
    return
  }

  pageLoading.value = true

  try {
    const section = await fetchAdminCourseOutlineSectionExamDetail(olId.value)

    formData.value = normalizeFormData(section)
  }
  catch {
    ElNotification.error('获取考试详情失败')
  }
  finally {
    pageLoading.value = false
  }
}

/** 打开题库弹窗。 */
function handleOpenTableDialog() {
  isShowExamSelectDialog.value = true
}

/**
 * 将题库题目追加到当前试卷，并自动过滤重复题目。
 * @param questions 选中的题库题目
 */
function appendQuestions(questions: QuestionListItem[]) {
  const existingQuestionIds = new Set(
    formData.value.questions
      .map(question => question.qusId)
      .filter((id): id is number => Number.isFinite(Number(id))),
  )

  const normalizedQuestions = questions
    .filter((question) => {
      if (!question.qusId) {
        return true
      }

      return !existingQuestionIds.has(question.qusId)
    })
    .map(normalizeQuestion)

  if (!normalizedQuestions.length) {
    ElNotification.warning('所选题目已全部存在于当前试卷')
    return
  }

  formData.value.questions.push(...normalizedQuestions)
  ElNotification.success(`已添加 ${normalizedQuestions.length} 道题目`)
}

/** 处理题库弹窗确认选题。 */
function handleConfirmSelectQuestions(questions: QuestionListItem[]) {
  appendQuestions(questions)
}

/**
 * 提交小节
 */
async function handleSubmit() {
  if (pageLoading.value) {
    return
  }

  if (!validateFormData()) {
    return
  }

  pageLoading.value = true

  try {
    const submitData = createSubmitData()

    if (isEditMode.value) {
      await fetchAdminCourseOutlineSectionExamUpdate(submitData)
      ElNotification.success('考试更新成功')
    }
    else {
      await fetchAdminCourseOutlineSectionExamAdd(submitData)
      ElNotification.success('考试创建成功')
    }

    workTabStore.removeTab(route.path)
    backToCourseOutline()
  }
  catch {
    ElNotification.error(isEditMode.value ? '考试更新失败' : '考试创建失败')
  }
  finally {
    pageLoading.value = false
  }
}

/** 返回课程大纲页。 */
function backToCourseOutline() {
  console.log('🚀 ~ file: index.vue:732 ~ couId:', couId)

  router.push({
    name: 'AdminCourseOutline',
    params: {
      couId: couId.value,
    },
  })
}

/** 页面初始化：编辑模式拉取详情，新增模式标准化默认表单。 */
onMounted(() => {
  if (isEditMode.value) {
    void getSectionDetail()
    return
  }

  formData.value = normalizeFormData(formData.value)
})
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <QuestionBankSelectDialog
      v-model="isShowExamSelectDialog"
      @confirm="handleConfirmSelectQuestions"
    />

    <AdminPageHeader
      :title="pageTitle"
      :stats="examStats"
      @back="backToCourseOutline"
    >
      <template
        #extra
      >
        <ArtButton
          type="success"
          :loading="pageLoading"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <div
      v-loading="pageLoading"
      class="flex flex-col gap-4"
    >
      <el-tabs
        v-model="activeTab"
        class="exam-tabs"
      >
        <el-tab-pane
          label="考试编辑"
          name="edit"
        >
          <el-form
            :model="formData"
            label-position="top"
            class="flex flex-col gap-4"
          >
            <!-- 考试信息 -->
            <div
              class="flex flex-col gap-4"
            >
              <h3
                class="text-base font-semibold text-g-900"
              >
                考试信息
              </h3>

              <div
                class="art-card"
              >
                <el-form-item
                  label="标题"
                  required
                  class="mb-0!"
                >
                  <el-input
                    v-model="formData.testPaperName"
                    placeholder="请填写考试名称"
                    size="large"
                  />
                </el-form-item>

                <el-form-item
                  label="考试说明"
                  class="mb-0! mt-4"
                >
                  <el-input
                    v-model="formData.examIntro"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入考试说明"
                  />
                </el-form-item>
              </div>

            </div>

            <!-- 题目列表 -->
            <div
              class="flex flex-col gap-4"
            >
              <h3
                class="text-base font-semibold text-g-900"
              >
                题目列表
              </h3>

              <div
                v-for="(question, questionIndex) in formData.questions"
                :key="question.clientId"
              >
                <div
                  class="art-card flex flex-col gap-4 transition"
                  :class="[
                    movingQuestionId === question.clientId
                      ? 'border-primary/30 bg-primary/10!'
                      : '',
                  ]"
                >
                  <div
                    class="flex gap-4 items-start max-md:flex-col"
                  >
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-custom-sm bg-primary/10 text-sm font-semibold text-primary"
                    >
                      Q{{ questionIndex + 1 }}
                    </div>

                    <el-input
                      v-model="question.qusTitle"
                      placeholder="请输入问题"
                      class="w-full flex-1"
                    />

                    <div
                      class="flex shrink-0 flex-wrap gap-2 items-center max-md:w-full max-md:justify-end"
                    >
                      <ArtButton
                        v-for="item in questionActions"
                        :key="item.action"
                        type="link"
                        @click="handleQuestionAction(item.action, question, questionIndex)"
                      >
                        {{ item.label }}
                      </ArtButton>
                    </div>
                  </div>

                  <div
                    class="rounded-custom-sm bg-(--art-gray-100) px-4 py-3"
                  >
                    <el-radio-group
                      v-model="question.qusType"
                      class="flex flex-wrap gap-x-12 gap-y-2"
                      @change="ensureQuestionTypeConsistency(question)"
                    >
                      <el-radio
                        v-for="item in questionTypes"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>

                  <div
                    class="flex flex-col gap-2"
                  >
                    <div
                      v-for="(option, optionIndex) in question.qusItems"
                      :key="optionIndex"
                      class="flex gap-2 items-center justify-between max-sm:flex-col max-sm:items-stretch"
                    >
                      <el-input
                        v-model="option.ansContext"
                        placeholder="请输入选项内容"
                        @keyup.enter="addOption(question, optionIndex)"
                      >
                        <template
                          #prepend
                        >
                          {{ getOptionLabel(optionIndex) }}.
                        </template>
                      </el-input>

                      <div
                        class="flex gap-1 items-center justify-end"
                      >
                        <ArtButton
                          type="add"
                          @click="addOption(question, optionIndex)"
                        />

                        <ArtButton
                          type="delete"
                          :disabled="question.qusItems.length <= 2"
                          @click="removeOption(question, optionIndex)"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-3 gap-5 max-md:grid-cols-1"
                  >

                    <el-form-item
                      label="难度"
                      class="mb-0! w-full!"
                      required
                    >
                      <el-radio-group
                        v-model="question.qusDiff"
                        class="flex flex-wrap gap-x-8 gap-y-2"
                      >
                        <el-radio
                          v-for="item in diffOptions"
                          :key="item.value"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item
                      label="正确答案"
                      required
                      class="mb-0! [&_.el-select]:w-full"
                    >
                      <el-select
                        v-if="question.qusType === 1"
                        :model-value="getCorrectSingleOptionIndex(question)"
                        placeholder="请选择正确答案"
                        @update:model-value="value => setCorrectSingleOption(question, value)"
                      >
                        <el-option
                          v-for="(option, optionIndex) in question.qusItems"
                          :key="optionIndex"
                          :label="option.ansContext || `选项${getOptionLabel(optionIndex)}`"
                          :value="optionIndex"
                        />
                      </el-select>

                      <el-select
                        v-else
                        :model-value="getCorrectOptionIndexes(question)"
                        multiple
                        placeholder="请选择正确答案"
                        @update:model-value="value => setCorrectMultipleOptions(question, value)"
                      >
                        <el-option
                          v-for="(option, optionIndex) in question.qusItems"
                          :key="optionIndex"
                          :label="option.ansContext || `选项${getOptionLabel(optionIndex)}`"
                          :value="optionIndex"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="分值"
                      class="mb-0! w-full!"
                      required
                    >
                      <el-input-number
                        v-model="question.qusScore"
                        :min="1"
                        :max="100"
                        :controls="true"
                        placeholder="本题分值"
                        class="w-full!"
                      />
                    </el-form-item>
                  </div>

                  <el-form-item
                    label="答案说明(选填)"
                    class="mb-0!"
                  >
                    <el-input
                      v-model="question.qusExplain"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入答案说明"
                    />
                  </el-form-item>

                  <div
                    class="grid grid-cols-2 gap-5 max-md:grid-cols-1"
                  />
                </div>

                <div
                  v-if="movingQuestionId"
                  class="my-3 flex flex-wrap gap-3 items-center justify-center"
                >
                  <art-button
                    type="warning"
                    :disabled="movingQuestionId === question.clientId"
                    @click="moveQuestionTo(questionIndex)"
                  >
                    移到第 {{ questionIndex + 1 }} 题后
                  </art-button>

                  <art-button
                    type="default"
                    @click="cancelMoveQuestion"
                  >
                    取消移动
                  </art-button>
                </div>
              </div>
            </div>

            <div
              class="art-card flex flex-wrap items-center gap-3"
            >
              <art-button
                type="add"
                @click="addQuestion"
              >
                添加问题
              </art-button>

              <ArtButton
                type="import"
                @click="handleOpenTableDialog"
              >
                从题库添加
              </ArtButton>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          label="考试设置"
          name="setting"
        >
          <div
            class="art-card"
          >
            <el-form
              :model="formData"
              label-position="left"
              label-width="auto"
              class="flex flex-col gap-4"
            >
              <el-form-item
                label="考试类型"
                class="mb-0!"
              >
                <el-radio-group
                  v-model="formData.examType"
                >
                  <el-radio
                    :value="0"
                  >
                    选修
                  </el-radio>

                  <el-radio
                    :value="1"
                  >
                    必修
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                label="考试时长（分钟）"
                class="mb-0!"
              >
                <el-input-number
                  v-model="formData.durationMinutes"
                  :min="1"
                  :max="360"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="允许尝试次数"
                class="mb-0!"
              >
                <el-input-number
                  v-model="formData.attemptLimit"
                  :min="1"
                  :max="99"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="及格分数"
                class="mb-0!"
              >
                <el-input-number
                  v-model="formData.passScore"
                  :min="0"
                  :max="totalScore || 100"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="重考间隔（小时）"
                class="mb-0!"
              >
                <el-input-number
                  v-model="formData.retakeIntervalHours"
                  :min="0"
                  :max="720"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="时间范围"
                class="mb-0!"
              >
                <el-date-picker
                  v-model="dateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="考试总分"
                class="mb-0!"
              >
                <el-input
                  :model-value="`${totalScore} 分`"
                  disabled
                />
              </el-form-item>

              <el-form-item
                label="考后显示答案"
                class="mb-0!"
              >
                <el-switch
                  v-model="formData.isShowAnswer"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>

              <el-form-item
                label="考后显示分数"
                class="mb-0!"
              >
                <el-switch
                  v-model="formData.isShowScore"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

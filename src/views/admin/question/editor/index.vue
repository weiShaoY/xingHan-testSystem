<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

const route = useRoute()

const router = useRouter()

/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

/**
 * 页面提交和详情加载状态。
 */
const loading = ref(false)

/**
 * 当前题库 ID
 */
const qbId = computed(() => {
  return Number(route.params.qbId || 0)
})

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(route.params.qbId)
})

/**
 * 表单数据。
 */
type QuestionType = 1 | 2

type QuestionDifficulty = AdminApi.Question.Question['qusDiff']

type QuestionOption = AdminApi.Question.QuestionOption

type EditorQuestion = Omit<AdminApi.Question.Question, 'qusType' | 'qusItems'> & {
  clientId: string
  qusType: QuestionType
  qusItems: QuestionOption[]
}

type QuestionEditorForm = Omit<AdminApi.Question.QuestionEditor, 'questions'> & {
  questions: EditorQuestion[]
}

const formData = ref<QuestionEditorForm>(createDefaultFormData())

/**
 * 页面标题
 */
const pageTitle = computed(() => {
  return isEditMode.value ? `设置题库-${formData.value.qbName}` : '创建题库'
})

/**
 * 创建题库编辑表单默认值。
 *
 * @returns 默认题库编辑表单数据。
 */
function createDefaultFormData(): QuestionEditorForm {
  return {
    qbId: isEditMode.value ? qbId.value : undefined,
    qbName: isEditMode.value ? '' : '未命名题库',
    questions: isEditMode.value ? [] : [createQuestion()],
  }
}

/**
 * 获取题库设置并回填表单。
 * @returns 题库设置请求完成。
 */
async function getQuestionSetting() {
  if (!qbId.value) {
    return
  }

  loading.value = true
  try {
    formData.value = normalizeFormData(await fetchAdminQuestionSetting(qbId.value))
    console.log('🚀 ~ file: index.vue:96 ~ formData.value:', formData.value)
  }
  catch {
    ElNotification.error('题库详情获取失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 返回题库列表页并关闭当前编辑标签。
 */
function backToQuestionList() {
  workTabStore.removeTab(route.path)

  router.push({
    name: 'AdminQuestionList',
  })
}

/**
 * 保存或创建题库。
 *
 * @returns 提交请求完成。
 */
async function handleSubmit() {
  if (loading.value) {
    return
  }

  if (!validateFormData()) {
    return
  }

  loading.value = true

  try {
    const submitData = createSubmitData()

    if (isEditMode.value) {
      await fetchAdminQuestionUpdate(submitData)
      ElNotification.success('题库更新成功')
    }
    else {
      await fetchAdminQuestionAdd(submitData)
      ElNotification.success('题库创建成功')
    }

    backToQuestionList()
  }
  catch {
    ElNotification.error(isEditMode.value ? '题库更新失败' : '题库创建失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 题目类型选项
 */
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

/**
 * 题目难度选项
 */
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

/**
 * 页面统计
 */
const questionStats = computed(() => {
  return [
    `单选题数量: ${formData.value.questions.filter(question => question.qusType === 1).length}`,
    `多选题数量: ${formData.value.questions.filter(question => question.qusType === 2).length}`,
  ]
})

/**
 * 选项序号标签
 */
const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * 题目操作按钮配置
 */
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

/**
 * 当前正在移动的题目 ID
 */
const movingQuestionId = ref('')

/**
 * 创建前端临时题目 ID。
 *
 * @returns 临时题目 ID。
 */
function createClientId() {
  const randomValue = Math.random().toString(36)

  const randomId = randomValue.slice(2)

  return `${Date.now()}-${randomId}`
}

/**
 * 创建题目选项
 *
 * @param ansContext 选项内容
 * @param ansIsCorrect 是否为正确答案
 * @returns 题目选项数据
 */
function createOption(ansContext = '', ansIsCorrect = false): QuestionOption {
  return {
    ansContext,
    ansIsCorrect,
  }
}

/**
 * 创建题目
 *
 * @param type 题目类型
 * @returns 题目数据
 */
function createQuestion(type: QuestionType = 1): EditorQuestion {
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
 * 确保题目只包含当前支持的单选、多选类型。
 *
 * @param type 接口返回的题目类型。
 * @returns 当前页面支持的题目类型。
 */
function isSupportedQuestionType(type: AdminApi.Question.Question['qusType']): type is QuestionType {
  return type === 1 || type === 2
}

/**
 * 规范化接口题目数据。
 *
 * @param question 接口题目数据。
 * @returns 编辑页题目数据。
 */
function normalizeQuestion(question: AdminApi.Question.Question): EditorQuestion {
  const qusType = isSupportedQuestionType(question.qusType) ? question.qusType : 1

  const normalizedQuestion: EditorQuestion = {
    ...question,
    clientId: createClientId(),
    qusType,
    qusTitle: question.qusTitle ?? '',
    qusScore: question.qusScore ?? 10,
    qusExplain: question.qusExplain ?? '',
    qusDiff: question.qusDiff ?? 2,
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

  handleQuestionTypeChange(normalizedQuestion)

  return normalizedQuestion
}

/**
 * 规范化接口题库数据。
 *
 * @param data 接口题库数据。
 * @returns 编辑页题库数据。
 */
function normalizeFormData(data: AdminApi.Question.QuestionEditor): QuestionEditorForm {
  const questions = data.questions
    .filter(question => isSupportedQuestionType(question.qusType))
    .map(normalizeQuestion)

  return {
    qbId: data.qbId ?? (qbId.value || undefined),
    qbName: data.qbName ?? '',
    questions: questions.length ? questions : [createQuestion()],
  }
}

/**
 * 获取选项展示序号
 *
 * @param index 选项索引
 * @returns 选项标签
 */
function getOptionLabel(index: number) {
  return optionLabels[index] ?? `${index + 1}`
}

/**
 * 获取题目的所有正确选项索引
 *
 * @param question 题目数据
 * @returns 正确选项索引列表
 */
function getCorrectOptionIndexes(question: EditorQuestion) {
  return question.qusItems
    .map((option, index) => option.ansIsCorrect ? index : -1)
    .filter(index => index !== -1)
}

/**
 * 获取单选题的正确选项索引
 *
 * @param question 题目数据
 * @returns 正确选项索引
 */
function getCorrectSingleOptionIndex(question: EditorQuestion) {
  return getCorrectOptionIndexes(question)[0]
}

/**
 * 设置单选题正确答案
 *
 * @param question 题目数据
 * @param optionIndex 正确选项索引
 */
function setCorrectSingleOption(question: EditorQuestion, optionIndex: number | string) {
  const selectedIndex = Number(optionIndex)

  question.qusItems.forEach((option, index) => {
    option.ansIsCorrect = index === selectedIndex
  })
}

/**
 * 设置多选题正确答案
 *
 * @param question 题目数据
 * @param optionIndexes 正确选项索引列表
 */
function setCorrectMultipleOptions(question: EditorQuestion, optionIndexes: Array<number | string>) {
  const selectedIndexes = optionIndexes.map(Number)

  question.qusItems.forEach((option, index) => {
    option.ansIsCorrect = selectedIndexes.includes(index)
  })
}

/**
 * 设置题目难度。
 *
 * @param question 题目数据
 * @param value 题目难度
 */
function setDiff(question: EditorQuestion, value: number | string | boolean | undefined) {
  const diff = Number(value)

  question.qusDiff = diffOptions.some(item => item.value === diff)
    ? diff as QuestionDifficulty
    : 2
}

/**
 * 处理题目类型切换
 *
 * @param question 题目数据
 */
function handleQuestionTypeChange(question: EditorQuestion) {
  if (!question.qusItems?.length) {
    question.qusItems = [
      createOption(),
      createOption(),
      createOption(),
      createOption(),
    ]
  }

  if (question.qusType === 1) {
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
}

/**
 * 添加选项
 *
 * @param question 题目数据
 * @param index 当前选项索引，不传则添加到末尾
 */
function addOption(question: EditorQuestion, index?: number) {
  const insertIndex = typeof index === 'number' ? index + 1 : question.qusItems.length

  question.qusItems.splice(insertIndex, 0, createOption())
}

/**
 * 删除选项
 *
 * @param question 题目数据
 * @param index 选项索引
 */
function removeOption(question: EditorQuestion, index: number) {
  if (question.qusItems.length <= 2) {
    return
  }

  question.qusItems.splice(index, 1)
}

/**
 * 添加新题目
 */
function addQuestion() {
  formData.value.questions.push(createQuestion())
}

/**
 * 复制题目
 *
 * @param question 被复制的题目数据
 */
function copyQuestion(question: EditorQuestion) {
  formData.value.questions.push({
    clientId: createClientId(),
    qusTitle: question.qusTitle,
    qusType: question.qusType,
    qusScore: question.qusScore,
    qusExplain: question.qusExplain,
    qusDiff: question.qusDiff,
    qusItems: question.qusItems.map(option => ({
      ansContext: option.ansContext,
      ansIsCorrect: option.ansIsCorrect,
    })),
  })
}

/**
 * 删除题目
 *
 * @param questionIndex 题目索引
 */
function deleteQuestion(questionIndex: number) {
  if (formData.value.questions.length <= 1) {
    return
  }

  formData.value.questions.splice(questionIndex, 1)
}

/**
 * 进入题目移动模式
 *
 * @param questionIndex 要移动的题目索引
 */
function moveQuestion(questionIndex: number) {
  movingQuestionId.value = formData.value.questions[questionIndex]?.clientId ?? ''
}

/**
 * 取消题目移动模式
 */
function cancelMoveQuestion() {
  movingQuestionId.value = ''
}

/**
 * 将当前移动题目插入到目标题目之后
 *
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
 * 处理题目操作按钮点击
 *
 * @param action 操作类型
 * @param question 当前题目数据
 * @param questionIndex 当前题目索引
 */
function handleQuestionAction(action: string, question: EditorQuestion, questionIndex: number) {
  //  移动
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
 * 批量导入题目示例
 */
function importQuestions() {
  formData.value.questions.push(createQuestion(1))
  formData.value.questions.push(createQuestion(2))
}

/**
 * 校验表单数据。
 *
 * @returns 是否校验通过。
 */
function validateFormData() {
  if (!formData.value.qbName.trim()) {
    ElNotification.warning('请输入题库标题')
    return false
  }

  if (!formData.value.questions.length) {
    ElNotification.warning('请至少添加一道题目')
    return false
  }

  for (const [questionIndex, question] of formData.value.questions.entries()) {
    const questionNumber = `第 ${questionIndex + 1} 题`

    if (!question.qusTitle.trim()) {
      ElNotification.warning(`${questionNumber} 请输入题目`)
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

    if (!diffOptions.some(item => item.value === question.qusDiff)) {
      ElNotification.warning(`${questionNumber} 请选择题目难度`)
      return false
    }

    if (!Number.isFinite(Number(question.qusScore))) {
      ElNotification.warning(`${questionNumber} 请填写题目分值`)
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
 * 创建提交给接口的数据，剔除前端临时字段。
 *
 * @returns 接口提交数据。
 */
function createSubmitData(): AdminApi.Question.QuestionEditor {
  const submitData: AdminApi.Question.QuestionEditor = {
    qbName: formData.value.qbName.trim(),
    questions: formData.value.questions.map((question) => {
      return {
        qusDiff: question.qusDiff,
        qusExplain: question.qusExplain?.trim() ?? '',
        qusId: question.qusId,
        qusItems: question.qusItems.map(option => ({
          ...option,
          ansContext: option.ansContext.trim(),
        })),
        qusScore: Number(question.qusScore),
        qusTitle: question.qusTitle.trim(),
        qusType: question.qusType,
      }
    }),
  }

  if (isEditMode.value) {
    submitData.qbId = formData.value.qbId ?? qbId.value
  }

  return submitData
}

onMounted(() => {
  if (isEditMode.value) {
    void getQuestionSetting()
  }
})

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="pageTitle"
      :stats="questionStats"
      @back="backToQuestionList"
    >
      <template
        #extra
      >
        <ArtButton
          type="success"
          :loading="loading"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <el-form
      v-loading="loading"
      label-position="top"
      class="flex flex-col gap-4"
    >
      <div
        class="art-card"
      >
        <div
          class="mb-4 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start"
        >
          <div>
            <h3
              class="text-base font-semibold text-g-900"
            >
              题库信息
            </h3>

            <p
              class="mt-1 text-sm text-g-600"
            >
              共 {{ formData.questions.length }} 道题
            </p>
          </div>
        </div>

        <el-form-item
          required
          label="题库标题"
          class="mb-0!"
        >
          <el-input
            v-model="formData.qbName"
            placeholder="请输入题库标题"
          />
        </el-form-item>
      </div>

      <div
        class="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
      >
        <div>
          <h3
            class="text-base font-semibold text-g-900"
          >
            题目列表
          </h3>

          <p
            class="mt-1 text-sm text-g-600"
          >
            单选 {{ formData.questions.filter(question => question.qusType === 1).length }} / 多选 {{ formData.questions.filter(question => question.qusType === 2).length }}
          </p>
        </div>

        <div
          class="flex flex-wrap gap-3 max-sm:flex-col"
        >
          <art-button
            type="import"
            @click="importQuestions"
          >
            批量导入问题
          </art-button>

          <art-button
            type="add"
            @click="addQuestion"
          >
            添加问题
          </art-button>
        </div>
      </div>

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
              placeholder="请输入题目"
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
              @change="handleQuestionTypeChange(question)"
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
            class="grid grid-cols-2 gap-5 max-md:grid-cols-1"
          >
            <el-form-item
              label="正确答案"
              required
              class="mb-0! [&_.el-select]:w-full"
            >
              <!-- 单选题 -->
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

                <template
                  #header
                />
              </el-select>

              <!-- 多选题 -->
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

            <!-- 分值 -->
            <el-form-item
              label="分值"
              class="mb-0! w-full!"
              required
            >
              <el-input-number
                v-model="question.qusScore"
                :min="0"
                :controls="true"
                placeholder="本题分值"
                class="w-full!"
              />
            </el-form-item>
          </div>

          <div
            class="grid grid-cols-2 gap-5 max-md:grid-cols-1"
          >
            <!-- 难度 -->
            <el-form-item
              label="难度"
              class="mb-0! w-full!"
              required
            >
              <el-radio-group
                v-model="question.qusDiff"
                @update:model-value="value => setDiff(question, value)"
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

            <!-- 答案说明 -->
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
          </div>
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
            移动到此后
          </art-button>

          <art-button
            type="error"
            @click="cancelMoveQuestion"
          >
            取消
          </art-button>

        </div>
      </div>
    </el-form>

  </div>
</template>

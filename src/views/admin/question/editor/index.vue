<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

const route = useRoute()

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(route.params.id)
})

/**
 * 页面标题
 */
const pageTitle = computed(() => {
  return isEditMode.value ? '题库1 编辑页' : '创建题库'
})

/**
 * 题目选项数据
 */
type QuestionOption = {

  /** 选项内容 */
  content: string

  /** 是否为正确答案 */
  isCorrect: boolean
}

/**
 * 题目类型
 */
type QuestionType = '单选题' | '多选题' | '开放式题'

/**
 * 题目难度
 */
type Difficulty = '易' | '中' | '难'

/**
 * 题目数据
 */
type Stage = {

  /** 阶段ID */
  id: string

  /** 阶段名称 */
  name: string

  /** 题目类型 */
  type: QuestionType

  /** 分值 */
  score: number

  /** 难度 */
  difficulty: Difficulty

  /** 标准答案 */
  standardAnswer?: string[]

  /** 单选或多选选项和答案 */
  answerOptions?: QuestionOption[]

  /** 答案说明 */
  answerExplanation?: string
}

/**
 * 题目列表数据
 */
const stages = ref<Stage[]>([
  {
    id: '1',
    name: '学习阶段一',
    type: '单选题',
    score: 10,
    difficulty: '中',
    answerOptions: [
      {
        content: '1',
        isCorrect: true,
      },
      {
        content: '2',
        isCorrect: false,
      },
      {
        content: '3',
        isCorrect: false,
      },
      {
        content: '4',
        isCorrect: false,
      },
    ],
  },
  {
    id: '2',
    name: '学习阶段二',
    type: '多选题',
    score: 10,
    difficulty: '易',
    answerOptions: [
      {
        content: '1',
        isCorrect: true,
      },
      {
        content: '12',
        isCorrect: true,
      },
      {
        content: '3',
        isCorrect: false,
      },
    ],
  },
  {
    id: '3',
    name: '学习阶段三',
    type: '开放式题',
    score: 10,
    difficulty: '中',
    standardAnswer: ['开放式问题答案1', '开放式问题答案2'],
  },
])

/**
 * 题库标题
 */
const questionBankTitle = ref(isEditMode.value ? '题库1' : '未命名题库')

/**
 * 题目类型选项
 */
const questionTypes: { label: string, value: QuestionType }[] = [
  {
    label: '单选题',
    value: '单选题',
  },
  {
    label: '多选题',
    value: '多选题',
  },
  {
    label: '开放式问题',
    value: '开放式题',
  },
]

/**
 * 难度选项
 */
const difficultyOptions: Difficulty[] = ['易', '中', '难']

/**
 * 选项序号标签
 */
const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * 题目操作按钮配置
 */
const stageActions = [
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
 * 题干右侧工具图标
 */
const questionTools = [
  'ri:mic-line',
  'ri:video-line',
  'ri:image-line',
  'ri:superscript',
]

/**
 * 当前正在移动的题目 ID
 */
const movingStageId = ref('')

/**
 * 创建题目选项
 *
 * @param content 选项内容
 * @returns 题目选项数据
 */
function createOption(content = ''): QuestionOption {
  return {
    content,
    isCorrect: false,
  }
}

/**
 * 创建题目
 *
 * @param type 题目类型
 * @returns 题目数据
 */
function createStage(type: QuestionType = '单选题'): Stage {
  const id = `${Date.now()}`

  return {
    id,
    name: '',
    type,
    score: 10,
    difficulty: '中',
    answerOptions: type === '开放式题'
      ? undefined
      : [
          createOption(''),
          createOption(''),
          createOption(''),
          createOption(''),
        ],
    standardAnswer: type === '开放式题' ? [''] : undefined,
    answerExplanation: '',
  }
}

if (!isEditMode.value) {
  stages.value = [createStage()]
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
 * 获取题目的所有正确选项内容
 *
 * @param stage 题目数据
 * @returns 正确选项内容列表
 */
function getCorrectOptionContents(stage: Stage) {
  return stage.answerOptions
    ?.filter(option => option.isCorrect)
    .map(option => option.content)
    .filter(Boolean) ?? []
}

/**
 * 获取单选题的正确选项内容
 *
 * @param stage 题目数据
 * @returns 正确选项内容
 */
function getCorrectSingleOption(stage: Stage) {
  return getCorrectOptionContents(stage)[0] ?? ''
}

/**
 * 设置单选题正确答案
 *
 * @param stage 题目数据
 * @param value 正确选项内容
 */
function setCorrectSingleOption(stage: Stage, value: string) {
  stage.answerOptions?.forEach((option) => {
    option.isCorrect = option.content === value
  })
}

/**
 * 设置多选题正确答案
 *
 * @param stage 题目数据
 * @param values 正确选项内容列表
 */
function setCorrectMultipleOptions(stage: Stage, values: string[]) {
  stage.answerOptions?.forEach((option) => {
    option.isCorrect = values.includes(option.content)
  })
}

/**
 * 处理题目类型切换
 *
 * @param stage 题目数据
 */
function handleQuestionTypeChange(stage: Stage) {
  if (stage.type === '开放式题') {
    stage.answerOptions = undefined
    stage.standardAnswer = stage.standardAnswer?.length ? stage.standardAnswer : ['']
    return
  }

  stage.standardAnswer = undefined
  stage.answerOptions = stage.answerOptions?.length
    ? stage.answerOptions
    : [createOption(''), createOption(''), createOption(''), createOption('')]
}

/**
 * 添加选项
 *
 * @param stage 题目数据
 * @param index 当前选项索引，不传则添加到末尾
 */
function addOption(stage: Stage, index?: number) {
  if (!stage.answerOptions) {
    stage.answerOptions = []
  }

  const insertIndex = typeof index === 'number' ? index + 1 : stage.answerOptions.length

  stage.answerOptions.splice(insertIndex, 0, createOption(''))
}

/**
 * 删除选项
 *
 * @param stage 题目数据
 * @param index 选项索引
 */
function removeOption(stage: Stage, index: number) {
  if (!stage.answerOptions || stage.answerOptions.length <= 1) {
    return
  }

  stage.answerOptions.splice(index, 1)
}

/**
 * 添加开放式题标准答案
 *
 * @param stage 题目数据
 * @param index 当前答案索引，不传则添加到末尾
 */
function addStandardAnswer(stage: Stage, index?: number) {
  if (!stage.standardAnswer) {
    stage.standardAnswer = []
  }

  const insertIndex = typeof index === 'number' ? index + 1 : stage.standardAnswer.length

  stage.standardAnswer.splice(insertIndex, 0, '')
}

/**
 * 删除开放式题标准答案
 *
 * @param stage 题目数据
 * @param index 答案索引
 */
function removeStandardAnswer(stage: Stage, index: number) {
  if (!stage.standardAnswer || stage.standardAnswer.length <= 1) {
    return
  }

  stage.standardAnswer.splice(index, 1)
}

/**
 * 添加新题目
 */
function addQuestion() {
  stages.value.push(createStage())
}

/**
 * 复制题目
 *
 * @param stage 被复制的题目数据
 */
function copyQuestion(stage: Stage) {
  stages.value.push({
    ...structuredClone(stage),
    id: `${Date.now()}`,
  })
}

/**
 * 删除题目
 *
 * @param stageIndex 题目索引
 */
function deleteQuestion(stageIndex: number) {
  if (stages.value.length <= 1) {
    return
  }

  stages.value.splice(stageIndex, 1)
}

/**
 * 进入题目移动模式
 *
 * @param stageIndex 要移动的题目索引
 */
function moveQuestion(stageIndex: number) {
  movingStageId.value = stages.value[stageIndex]?.id ?? ''
}

/**
 * 取消题目移动模式
 */
function cancelMoveQuestion() {
  movingStageId.value = ''
}

/**
 * 将当前移动题目插入到目标题目之后
 *
 * @param targetIndex 目标题目索引
 */
function moveQuestionTo(targetIndex: number) {
  if (!movingStageId.value) {
    return
  }

  const sourceIndex = stages.value.findIndex(stage => stage.id === movingStageId.value)

  if (sourceIndex === -1) {
    cancelMoveQuestion()
    return
  }

  const [stage] = stages.value.splice(sourceIndex, 1)

  const insertIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1

  stages.value.splice(insertIndex, 0, stage)

  cancelMoveQuestion()
}

/**
 * 处理题目操作按钮点击
 *
 * @param action 操作类型
 * @param stage 当前题目数据
 * @param stageIndex 当前题目索引
 */
function handleStageAction(action: string, stage: Stage, stageIndex: number) {
  //  移动
  if (action === 'move') {
    moveQuestion(stageIndex)
  }

  if (action === 'copy') {
    copyQuestion(stage)
  }

  if (action === 'delete') {
    deleteQuestion(stageIndex)
  }
}

/**
 * 批量导入题目示例
 */
function importQuestions() {
  stages.value.push(createStage('单选题'))
  stages.value.push(createStage('多选题'))
}

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <ArtPageHeader
      :title="pageTitle"
      :stats="[
        `单选题数量: ${stages.filter(stage => stage.type === '单选题').length}`,
        `多选题数量: ${stages.filter(stage => stage.type === '多选题').length}`,
        `开放式题数量: ${stages.filter(stage => stage.type === '开放式题').length}`,
      ]"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="success"
          @click="$router.back()"
        >
          完成
        </ArtIconButton>
      </template>
    </ArtPageHeader>

    <div
      class="art-card"
    >
      <el-form
        label-position="top"
      >

        <!-- 标题 -->
        <el-form-item
          required
          label="标题"
          class="!mb-10"
        >
          <el-input
            v-model="questionBankTitle"
            placeholder="请输入题库标题"
          />
        </el-form-item>

        <div
          v-for="(stage, stageIndex) in stages"
          :key="stage.id"
          class="mb-10"
        >
          <div
            class="art-card flex flex-col gap-3"
            :class="[
              movingStageId === stage.id
                ? '!bg-primary/10'
                : '',
            ]"
          >
            <div
              class="flex gap-4 items-start max-md:flex-col"
            >
              <el-input
                v-model="stage.name"
                placeholder="请输入题目"
                class="w-full flex-1"
              >
                <template
                  #prefix
                >
                  <div
                    class="text-primary pr-5"
                  >
                    Q{{ stageIndex + 1 }}.
                  </div>
                </template>

                <template
                  #append
                >
                  <div
                    class="text-5 text-[var(--art-gray-800)] flex gap-3.5 items-center"
                  >
                    <ArtSvgIcon
                      v-for="tool in questionTools"
                      :key="tool"
                      :icon="tool"
                    />
                  </div>
                </template>
              </el-input>

              <div
                class="flex flex-shrink-0 flex-wrap gap-2 items-center max-md:w-full max-md:justify-end"
              >
                <ArtIconButton
                  v-for="item in stageActions"
                  :key="item.action"
                  type="link"
                  @click="handleStageAction(item.action, stage, stageIndex)"
                >
                  {{ item.label }}
                </ArtIconButton>
              </div>
            </div>

            <!-- 题目类型选择 -->
            <el-radio-group
              v-model="stage.type"
              class="mt-5.5 flex flex-wrap gap-x-12 gap-y-2"
              @change="handleQuestionTypeChange(stage)"
            >
              <el-radio
                v-for="item in questionTypes"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>

            <!-- 单选题和多选题 -->
            <template
              v-if="stage.type !== '开放式题'"
            >
              <!-- 选项 -->
              <div
                v-for="(option, optionIndex) in stage.answerOptions"
                :key="optionIndex"
                class="mb-2 flex gap-2 items-center justify-between max-sm:flex-col max-sm:items-stretch"
              >
                <el-input
                  v-model="option.content"
                  placeholder="请输入选项内容"
                >
                  <template
                    #prepend
                  >
                    {{ getOptionLabel(optionIndex) }}.
                  </template>

                  <template
                    #suffix
                  >
                    <div
                      class="text-4.5 inline-flex gap-3"
                    >
                      <ArtSvgIcon
                        icon="ri:image-line"
                      />

                      <ArtSvgIcon
                        icon="ri:superscript"
                      />
                    </div>
                  </template>
                </el-input>

                <div
                  class="flex gap-1 items-center justify-end"
                >
                  <ArtIconButton
                    type="add"
                    @click="addOption(stage, optionIndex)"
                  />

                  <ArtIconButton
                    type="delete"
                    :disabled="(stage.answerOptions?.length ?? 0) <= 1"
                    @click="removeOption(stage, optionIndex)"
                  />

                </div>

              </div>

              <el-form-item
                label="正确答案"
                required
                class="mt-4.5 [&_.el-select]:w-full"
              >
                <!-- 单选题 -->
                <el-select
                  v-if="stage.type === '单选题'"
                  :model-value="getCorrectSingleOption(stage)"
                  placeholder="请选择正确答案"
                  @update:model-value="value => setCorrectSingleOption(stage, value)"
                >
                  <el-option
                    v-for="option in stage.answerOptions"
                    :key="option.content"
                    :label="option.content"
                    :value="option.content"
                  />

                  <template
                    #header
                  />
                </el-select>

                <!-- 多选题 -->
                <el-select
                  v-else
                  :model-value="getCorrectOptionContents(stage)"
                  multiple

                  placeholder="请选择正确答案"
                  @update:model-value="value => setCorrectMultipleOptions(stage, value)"
                >
                  <el-option
                    v-for="option in stage.answerOptions"
                    :key="option.content"
                    :label="option.content"
                    :value="option.content"
                  />
                </el-select>
              </el-form-item>
            </template>

            <template
              v-else
            >
              <el-form-item
                label="标准答案 (选填)"
                required
              >
                <p
                  class="text-3 text-g-600"
                >
                  设置一个或多个标准答案，学员提交的答案和任何一个标准答案一致则自动得分，否则不得分；不设置标准答案时，学员提交答案后不会立即得分，需您手动给学员评分。
                </p>

                <div
                  class="flex flex-col gap-3 w-full items-center"
                >
                  <div
                    v-for="(_, answerIndex) in stage.standardAnswer"
                    :key="answerIndex"
                    class="flex gap-3 w-full items-center max-sm:flex-col max-sm:items-stretch"
                  >
                    <el-input
                      v-model="stage.standardAnswer![answerIndex]"
                      class="!flex-1"
                      placeholder="请输入标准答案"
                    >
                      <template
                        v-if="answerIndex > 0"
                        #prepend
                      >
                        或
                      </template>
                    </el-input>

                    <div
                      class="flex gap-2 items-center justify-end"
                    >
                      <ArtIconButton
                        type="add"
                        @click="addStandardAnswer(stage, answerIndex)"
                      />

                      <ArtIconButton
                        type="delete"
                        :disabled="(stage.standardAnswer?.length ?? 0) <= 1"
                        @click="removeStandardAnswer(stage, answerIndex)"
                      />
                    </div>

                  </div>

                </div>

              </el-form-item>

            </template>

            <!-- 分值和难度 -->
            <div
              class="grid grid-cols-2 gap-5 max-sm:grid-cols-1"
            >
              <el-form-item
                label="分值"
                class="!w-full"
                required
              >
                <el-input-number
                  v-model="stage.score"
                  :min="0"
                  :controls="true"
                  placeholder="本题分值"
                  class="w-full!"
                />
              </el-form-item>

              <el-form-item
                label="难度"
                class="!w-full"
                required
              >
                <el-select
                  v-model="stage.difficulty"
                >
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </div>

            <!-- 答案说明 -->
            <el-form-item
              label="答案说明(选填)"
              required
            >
              <p
                class="text-3 text-g-600"
              >
                填写答题思路，帮助学员理解考试内容，提升考试成绩。
              </p>

              <el-input
                v-model="stage.answerExplanation"
                type="textarea"
                :rows="3"
                placeholder="请输入答案说明"
              />
            </el-form-item>

          </div>

          <div
            v-if="movingStageId"
            class="my-3 flex flex-wrap gap-3 items-center justify-center"
          >
            <art-icon-button
              type="warning"
              :disabled="movingStageId === stage.id"
              @click="moveQuestionTo(stageIndex)"
            >
              移动到此后
            </art-icon-button>

            <art-icon-button
              type="error"
              @click="cancelMoveQuestion"
            >
              取消
            </art-icon-button>

          </div>
        </div>

        <!-- 底部 -->
        <div
          class="rounded-lg border p-5 flex flex-wrap gap-3 items-center justify-end !border-[var(--art-card-border)] !bg-[var(--art-gray-100)] max-sm:flex-col max-sm:items-stretch"
        >
          <art-icon-button
            type="import"
            @click="importQuestions"
          >
            批量导入问题
          </art-icon-button>

          <art-icon-button
            type="add"
            @click="addQuestion"
          >
            添加问题
          </art-icon-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

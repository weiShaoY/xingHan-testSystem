<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

type QuestionOption = {

  /** 选项内容 */
  content: string

  /** 是否为正确答案 */
  isCorrect: boolean
}

type QuestionType = '单选题' | '多选题' | '开放式题'

type Difficulty = '易' | '中' | '难'

/**
   * 阶段类型定义
   */
type Stage = {

  /** 阶段ID */
  id: string

  /** 阶段名称 */
  name: string

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
   * 阶段列表数据
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

const questionBankTitle = ref('未命名题库')

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

const difficultyOptions: Difficulty[] = ['易', '中', '难']

const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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

const questionTools = [
  'ri:mic-line',
  'ri:video-line',
  'ri:image-line',
  'ri:superscript',
]

function createOption(content = ''): QuestionOption {
  return {
    content,
    isCorrect: false,
  }
}

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

function getOptionLabel(index: number) {
  return optionLabels[index] ?? `${index + 1}`
}

function getCorrectOptionContents(stage: Stage) {
  return stage.answerOptions
    ?.filter(option => option.isCorrect)
    .map(option => option.content)
    .filter(Boolean) ?? []
}

function getCorrectSingleOption(stage: Stage) {
  return getCorrectOptionContents(stage)[0] ?? ''
}

function setCorrectSingleOption(stage: Stage, value: string) {
  stage.answerOptions?.forEach((option) => {
    option.isCorrect = option.content === value
  })
}

function setCorrectMultipleOptions(stage: Stage, values: string[]) {
  stage.answerOptions?.forEach((option) => {
    option.isCorrect = values.includes(option.content)
  })
}

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

function addOption(stage: Stage, index?: number) {
  if (!stage.answerOptions) {
    stage.answerOptions = []
  }

  const insertIndex = typeof index === 'number' ? index + 1 : stage.answerOptions.length

  stage.answerOptions.splice(insertIndex, 0, createOption(''))
}

function removeOption(stage: Stage, index: number) {
  if (!stage.answerOptions || stage.answerOptions.length <= 1) {
    return
  }

  stage.answerOptions.splice(index, 1)
}

function addStandardAnswer(stage: Stage, index?: number) {
  if (!stage.standardAnswer) {
    stage.standardAnswer = []
  }

  const insertIndex = typeof index === 'number' ? index + 1 : stage.standardAnswer.length

  stage.standardAnswer.splice(insertIndex, 0, '')
}

function removeStandardAnswer(stage: Stage, index: number) {
  if (!stage.standardAnswer || stage.standardAnswer.length <= 1) {
    return
  }

  stage.standardAnswer.splice(index, 1)
}

function addQuestion() {
  stages.value.push(createStage())
}

function copyQuestion(stage: Stage) {
  stages.value.push({
    ...structuredClone(stage),
    id: `${Date.now()}`,
  })
}

function deleteQuestion(stageIndex: number) {
  if (stages.value.length <= 1) {
    return
  }

  stages.value.splice(stageIndex, 1)
}

function moveQuestion(stageIndex: number) {

}

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

function importQuestions() {
  stages.value.push(createStage('单选题'))
  stages.value.push(createStage('多选题'))
}

</script>

<template>
  <div
    class="flex flex-col gap-4"
  >
    <el-page-header
      class="art-card p-4 z-10"
      @back="$router.back()"
    >
      <template
        #content
      >
        <div
          class="flex gap-5 items-center"
        >
          <span>题库1 编辑页</span>

          <div
            class="text-sm color-info font-normal flex gap-2"
          >
            <span>单选题数量: {{ stages.filter(stage => stage.type === '单选题').length }}</span>

            <span>多选题数量: {{ stages.filter(stage => stage.type === '多选题').length }}</span>

            <span>开放式题数量: {{ stages.filter(stage => stage.type === '开放式题').length }}</span>

          </div>

        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex items-center"
        >

          <ArtIconButton
            class="ml-3 max-sm:ml-[7px]"
            type="success"
            @click="$router.back()"
          >
            完成
          </ArtIconButton>

        </div>
      </template>
    </el-page-header>

    <div
      class="art-card p-4"
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
        >
          <div
            class="art-card p-6 flex flex-col gap-3"
          >
            <div
              class="flex gap-7 items-center"
            >
              <el-input
                v-model="stage.name"
                placeholder="请输入题目"
                class="flex-1"
              >
                <template
                  #prefix
                >
                  <div
                    class="color-primary pr-5"
                  >
                    Q{{ stageIndex + 1 }}.
                  </div>
                </template>

                <template
                  #append
                >
                  <div
                    class="text-5 color-[var(--art-gray-800)] flex gap-3.5 items-center"
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
                class="flex flex-shrink-0 gap-2 items-center"
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
              class="mt-5.5 gap-12"
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
                class="mb-2 flex gap-2 items-center justify-between"
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
                  class="flex gap-1 items-center justify-between"
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
                  class="text-3 color-info"
                >
                  设置一个或多个标准答案，学员提交的答案和任何一个标准答案一致则自动得分，否则不得分；不设置标准答案时，学员提交答案后不会立即得分，需您手动给学员评分。
                </p>

                <div
                  class="flex flex-col gap-3 w-full items-center"
                >
                  <div
                    v-for="(_, answerIndex) in stage.standardAnswer"
                    :key="answerIndex"
                    class="flex gap-3 w-full items-center"
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
                      class="flex gap-2 items-center"
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
              class="flex gap-5 items-center"
            >
              <el-form-item
                label="分值"
                class="!w-40"
                required
              >
                <el-input-number
                  v-model="stage.score"
                  :min="0"
                  :controls="true"
                  placeholder="本题分值"
                />
              </el-form-item>

              <el-form-item
                label="难度"
                class="!w-40"
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
                class="text-3 color-info"
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
            class="my-3 flex gap-3 items-center justify-center"
          >
            <art-icon-button
              type="warning"
            >
              移动到此
            </art-icon-button>

            <art-icon-button
              type="error"
            >
              取消
            </art-icon-button>

          </div>
        </div>

        <!-- 底部 -->
        <div
          class="p-8 border flex gap-5 items-center !border-[var(--art-card-border)] !bg-[var(--art-gray-100)]"
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

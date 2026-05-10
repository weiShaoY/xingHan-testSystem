<!------  2026-04-20---09:54---星期一  ------>
<!------------------------------------  问卷小节  ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

const route = useRoute()

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(route.params.sectionId)
})

/**
 * 页面标题
 */
const pageTitle = computed(() => {
  return isEditMode.value ? '编辑问卷' : '添加问卷'
})

/**
 * 问题类型
 */
type SurveyQuestionType = 'single' | 'multiple' | 'open' | 'number'

/**
 * 问题选项
 */
type SurveyOption = {

  /** 选项 ID */
  id: string

  /** 选项内容 */
  content: string
}

/**
 * 问题数据
 */
type SurveyQuestion = {

  /** 问题 ID */
  id: string

  /** 题目 */
  title: string

  /** 问题类型 */
  type: SurveyQuestionType

  /** 选项 */
  options: SurveyOption[]

  /** 是否添加其他选项 */
  enableOther: boolean

  /** 是否展开高级设置 */
  advancedExpanded: boolean

  /** 是否必填 */
  required: boolean

  /** 是否智能排序 */
  smartSort: boolean

  /** 段落说明 */
  description: string
}

const activeTab = ref('editor')

/**
 * 问卷表单
 */
const surveyForm = ref({
  title: '未命名问卷',
  required: true,
  scoreMultiplier: 1,
  startSubmitTime: '',
  endSubmitTime: '',
  sectionTypeTag: '',
  description: '',
  successMessage: '感谢您的参与！',
  randomOptions: false,
  successRedirectType: 'none',
  showResult: false,
  showParticipantCount: true,
  accessPermission: 'course',
  submitPermission: 'anonymous',
  maxSubmitCount: 1,
  unlimitedSubmit: false,
  allowModifyAfterSubmit: false,
})

/**
 * 问题列表
 */
const questions = ref<SurveyQuestion[]>([
  {
    id: '1',
    title: 'Q1.',
    type: 'multiple',
    options: [
      {
        id: '1',
        content: '',
      },
    ],
    enableOther: false,
    advancedExpanded: true,
    required: true,
    smartSort: false,
    description: '',
  },
  {
    id: '2',
    title: 'Q2.',
    type: 'single',
    options: [
      {
        id: '1',
        content: '',
      },
    ],
    enableOther: false,
    advancedExpanded: true,
    required: true,
    smartSort: false,
    description: '',
  },
])

/**
 * 小节基本分
 */
const baseScore = 10

/**
 * 小节积分
 */
const sectionScore = computed(() => {
  return baseScore * Number(surveyForm.value.scoreMultiplier || 0)
})

/**
 * 问题类型选项
 */
const questionTypeOptions: Array<{
  label: string
  value: SurveyQuestionType
}> = [
  {
    label: '单选题',
    value: 'single',
  },
  {
    label: '多选题',
    value: 'multiple',
  },
  {
    label: '开放式问题',
    value: 'open',
  },
  {
    label: '数值型',
    value: 'number',
  },
]

/**
 * 富文本工具栏图标
 */
const editorTools = [
  'ri:font-size',
  'ri:font-color',
  'ri:bold',
  'ri:list-ordered',
  'ri:list-unordered',
  'ri:align-left',
  'ri:align-center',
  'ri:link',
  'ri:image-line',
  'ri:subtract-line',
]

/**
 * 生成 ID
 */
function createId() {
  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

/**
 * 创建问题
 */
function createQuestion(type: SurveyQuestionType = 'single'): SurveyQuestion {
  return {
    id: createId(),
    title: `Q${questions.value.length + 1}.`,
    type,
    options: [
      {
        id: createId(),
        content: '',
      },
    ],
    enableOther: false,
    advancedExpanded: true,
    required: true,
    smartSort: false,
    description: '',
  }
}

/**
 * 添加问题
 */
function addQuestion() {
  questions.value.push(createQuestion())
}

/**
 * 批量添加问题
 */
function batchAddQuestion() {
  questions.value.push(createQuestion('single'))
  questions.value.push(createQuestion('multiple'))
}

/**
 * 添加段落说明
 */
function addParagraphDescription() {
  const question = createQuestion('open')

  question.title = '段落说明'
  question.description = '请输入段落说明'
  questions.value.push(question)
}

/**
 * 复制问题
 */
function copyQuestion(question: SurveyQuestion) {
  questions.value.push({
    ...structuredClone(question),
    id: createId(),
    title: `Q${questions.value.length + 1}.`,
  })
}

/**
 * 删除问题
 */
function deleteQuestion(questionIndex: number) {
  if (questions.value.length <= 1) {
    return
  }

  questions.value.splice(questionIndex, 1)
}

/**
 * 移动问题
 */
function moveQuestion(questionIndex: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1

  if (targetIndex < 0 || targetIndex >= questions.value.length) {
    return
  }

  const [question] = questions.value.splice(questionIndex, 1)

  questions.value.splice(targetIndex, 0, question)
}

/**
 * 添加选项
 */
function addOption(question: SurveyQuestion, optionIndex?: number) {
  const insertIndex = typeof optionIndex === 'number' ? optionIndex + 1 : question.options.length

  question.options.splice(insertIndex, 0, {
    id: createId(),
    content: '',
  })
}

/**
 * 删除选项
 */
function removeOption(question: SurveyQuestion, optionIndex: number) {
  if (question.options.length <= 1) {
    return
  }

  question.options.splice(optionIndex, 1)
}

/**
 * 切换问题高级设置
 */
function toggleQuestionAdvanced(question: SurveyQuestion) {
  question.advancedExpanded = !question.advancedExpanded
}

/**
 * 提交问卷
 */
function handleSubmit() {
  console.log('问卷小节表单:', {
    mode: isEditMode.value ? 'edit' : 'create',
    survey: surveyForm.value,
    questions: questions.value,
  })
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <ArtPageHeader
      :title="pageTitle"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="success"
          @click="handleSubmit"
        >
          完成
        </ArtIconButton>
      </template>
    </ArtPageHeader>

    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane
        label="问卷编辑"
        name="editor"
        class="art-card"
      >
        <el-form
          :model="surveyForm"
          label-position="top"
        >
          <div
            class="mb-6 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch"
          >
            <el-form-item
              label="标题"
              required
              class="mb-0! flex-1"
            >
              <el-input
                v-model="surveyForm.title"
                placeholder="请输入问卷标题"
              />
            </el-form-item>

            <ArtIconButton
              type="link"
              @click="batchAddQuestion"
            >
              批量添加问题
            </ArtIconButton>
          </div>

          <div
            class="flex flex-col gap-6"
          >
            <div
              v-for="(question, questionIndex) in questions"
              :key="question.id"
              class="rounded-lg border border-[var(--art-card-border)] p-5"
            >
              <div
                class="flex gap-4 items-start max-lg:flex-col"
              >
                <div
                  class="flex min-w-0 flex-1 flex-col gap-4"
                >
                  <div
                    class="flex gap-4 items-center max-sm:flex-col max-sm:items-stretch"
                  >
                    <el-input
                      v-model="question.title"
                      placeholder="请输入问题标题"
                      class="flex-1"
                    >
                      <template
                        #append
                      >
                        <div
                          class="flex items-center gap-3 text-5 text-g-700"
                        >
                          <ArtSvgIcon
                            icon="ri:mic-line"
                          />

                          <ArtSvgIcon
                            icon="ri:vidicon-line"
                          />

                          <ArtSvgIcon
                            icon="ri:image-line"
                          />
                        </div>
                      </template>
                    </el-input>

                    <div
                      class="flex flex-shrink-0 gap-3 items-center justify-end"
                    >
                      <ArtIconButton
                        type="link"
                        :disabled="questionIndex === 0"
                        @click="moveQuestion(questionIndex, 'up')"
                      >
                        移动
                      </ArtIconButton>

                      <ArtIconButton
                        type="link"
                        @click="copyQuestion(question)"
                      >
                        复制
                      </ArtIconButton>

                      <ArtIconButton
                        type="link"
                        @click="deleteQuestion(questionIndex)"
                      >
                        删除
                      </ArtIconButton>
                    </div>
                  </div>

                  <el-radio-group
                    v-model="question.type"
                    class="flex flex-wrap gap-x-12 gap-y-2"
                  >
                    <el-radio
                      v-for="item in questionTypeOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>

                  <template
                    v-if="question.type === 'single' || question.type === 'multiple'"
                  >
                    <div
                      v-for="(option, optionIndex) in question.options"
                      :key="option.id"
                      class="flex gap-3 items-center max-sm:flex-col max-sm:items-stretch"
                    >
                      <el-input
                        v-model="option.content"
                        :placeholder="optionIndex === 0 ? '点击创建选项，回车自动创建下一个选项' : '请输入选项内容'"
                      >
                        <template
                          #prepend
                        >
                          {{ String.fromCharCode(65 + optionIndex) }}.
                        </template>

                        <template
                          #append
                        >
                          <ArtSvgIcon
                            icon="ri:image-line"
                            class="text-5"
                          />
                        </template>
                      </el-input>

                      <div
                        class="flex gap-2 justify-end"
                      >
                        <ArtIconButton
                          type="add"
                          @click="addOption(question, optionIndex)"
                        />

                        <ArtIconButton
                          type="delete"
                          :disabled="question.options.length <= 1"
                          @click="removeOption(question, optionIndex)"
                        />
                      </div>
                    </div>

                    <div
                      class="border border-[var(--art-card-border)] px-4 py-3"
                    >
                      <el-checkbox
                        v-model="question.enableOther"
                      >
                        添加选项“其他”
                      </el-checkbox>

                      <el-tooltip
                        content="允许学员填写其他选项"
                        placement="top"
                      >
                        <span
                          class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                        >
                          ?
                        </span>
                      </el-tooltip>
                    </div>
                  </template>

                  <template
                    v-else
                  >
                    <el-input
                      v-model="question.description"
                      type="textarea"
                      :rows="4"
                      :placeholder="question.type === 'number' ? '学员填写数值答案' : '学员填写开放式答案'"
                    />
                  </template>

                  <div
                    class="border border-[var(--art-card-border)]"
                  >
                    <button
                      type="button"
                      class="flex h-12 w-full items-center gap-4 px-5 text-primary"
                      @click="toggleQuestionAdvanced(question)"
                    >
                      <ArtSvgIcon
                        :icon="question.advancedExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                        class="text-6"
                      />

                      <span>高级设置</span>

                      <el-tag
                        size="small"
                      >
                        必填
                      </el-tag>

                      <el-tag
                        size="small"
                      >
                        智能排序
                      </el-tag>
                    </button>

                    <div
                      v-if="question.advancedExpanded"
                      class="grid grid-cols-2 gap-4 border-t border-[var(--art-card-border)] p-4 max-sm:grid-cols-1"
                    >
                      <el-radio-group
                        v-model="question.required"
                        class="flex gap-6"
                      >
                        <el-radio
                          :value="true"
                        >
                          必填
                        </el-radio>

                        <el-radio
                          :value="false"
                        >
                          选填
                        </el-radio>
                      </el-radio-group>

                      <el-checkbox
                        v-model="question.smartSort"
                      >
                        智能排序
                      </el-checkbox>
                    </div>
                  </div>

                  <div
                    class="w-full border border-[var(--art-card-border)]"
                  >
                    <div
                      class="flex flex-wrap items-center gap-5 border-b border-[var(--art-card-border)] px-4 py-3 text-g-500"
                    >
                      <span>16px</span>

                      <ArtSvgIcon
                        v-for="tool in editorTools"
                        :key="tool"
                        :icon="tool"
                        class="text-5"
                      />
                    </div>

                    <el-input
                      v-model="question.description"
                      type="textarea"
                      :rows="6"
                      resize="none"
                      class="survey-description-editor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="mt-6 rounded-lg border border-[var(--art-card-border)] p-4 flex flex-wrap gap-3 items-center"
          >
            <ArtIconButton
              type="add"
              @click="addQuestion"
            >
              添加问题
            </ArtIconButton>

            <ArtIconButton
              type="add"
              @click="addParagraphDescription"
            >
              添加段落说明
            </ArtIconButton>

            <ArtIconButton
              type="link"
              @click="batchAddQuestion"
            >
              批量添加问题
            </ArtIconButton>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        label="问卷设置"
        name="settings"
        class="art-card"
      >
        <el-form
          :model="surveyForm"
          label-position="top"
          class="flex flex-col gap-6"
        >
          <div
            class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
          >
            <div
              class="flex items-center gap-2"
            >
              <span>是否必修</span>

              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
              >?</span>
            </div>

            <el-radio-group
              v-model="surveyForm.required"
              class="flex flex-wrap gap-x-10 gap-y-2"
            >
              <el-radio
                :value="true"
              >
                必修
              </el-radio>

              <el-radio
                :value="false"
              >
                选修
              </el-radio>
            </el-radio-group>
          </div>

          <div
            class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
          >
            <div
              class="flex items-center gap-2"
            >
              <span>小节基本积分</span>

              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
              >?</span>
            </div>

            <div
              class="flex flex-wrap gap-6 items-center"
            >
              <span
                class="text-warning"
              >+ {{ sectionScore }}</span>

              <span
                class="h-6 w-px bg-[var(--art-card-border)]"
              />

              <span>基本分 {{ baseScore }} ×</span>

              <el-input-number
                v-model="surveyForm.scoreMultiplier"
                :min="0"
                :controls="false"
                class="!w-36"
              />
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-6 max-md:grid-cols-1"
          >
            <el-form-item
              label="开始提交时间"
            >
              <el-date-picker
                v-model="surveyForm.startSubmitTime"
                type="datetime"
                placeholder="不设置"
                class="w-full!"
              />
            </el-form-item>

            <el-form-item
              label="结束提交时间"
            >
              <el-date-picker
                v-model="surveyForm.endSubmitTime"
                type="datetime"
                placeholder="不设置"
                class="w-full!"
              />
            </el-form-item>
          </div>

          <div
            class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
          >
            <div>
              小节类型标签
            </div>

            <div
              class="flex gap-5 items-center max-sm:flex-col max-sm:items-stretch"
            >
              <el-input
                v-model="surveyForm.sectionTypeTag"
                class="max-w-72 max-sm:max-w-none"
              />

              <span>预览</span>
            </div>
          </div>

          <el-form-item
            label="说明"
          >
            <div
              class="w-full border border-[var(--art-card-border)]"
            >
              <div
                class="flex h-12 items-center border-b border-[var(--art-card-border)] text-sm"
              >
                <button
                  type="button"
                  class="h-full px-6 text-g-900"
                >
                  文本编辑
                </button>

                <button
                  type="button"
                  class="h-full border-l border-[var(--art-card-border)] px-6 text-primary"
                >
                  图文编辑
                </button>
              </div>

              <div
                class="flex flex-wrap items-center gap-5 border-b border-[var(--art-card-border)] px-4 py-3 text-g-500"
              >
                <span>16px</span>

                <ArtSvgIcon
                  v-for="tool in editorTools"
                  :key="tool"
                  :icon="tool"
                  class="text-5"
                />
              </div>

              <el-input
                v-model="surveyForm.description"
                type="textarea"
                :rows="8"
                resize="none"
                class="survey-description-editor"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="提交成功提示语"
          >
            <el-input
              v-model="surveyForm.successMessage"
            />
          </el-form-item>

          <div
            class="flex flex-col gap-6"
          >
            <el-form-item
              label="选项随机展示"
            >
              <el-radio-group
                v-model="surveyForm.randomOptions"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  :value="false"
                >
                  不随机展示
                </el-radio>

                <el-radio
                  :value="true"
                >
                  随机展示
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="提交成功页面跳转按钮"
            >
              <el-radio-group
                v-model="surveyForm.successRedirectType"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  value="none"
                >
                  不跳转
                </el-radio>

                <el-radio
                  value="custom"
                >
                  自定义按钮
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="提交后展示问卷结果"
            >
              <el-radio-group
                v-model="surveyForm.showResult"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  :value="true"
                >
                  展示
                </el-radio>

                <el-radio
                  :value="false"
                >
                  不展示
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="大屏幕展示问卷参与人数"
            >
              <el-radio-group
                v-model="surveyForm.showParticipantCount"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  :value="true"
                >
                  展示
                </el-radio>

                <el-radio
                  :value="false"
                >
                  不展示
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="问卷访问权限"
            >
              <el-select
                v-model="surveyForm.accessPermission"
                class="max-w-xl"
              >
                <el-option
                  label="课程内公开 - 课程内所有学员可见"
                  value="course"
                />

                <el-option
                  label="仅分配学员可见"
                  value="assigned"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="问卷提交权限"
            >
              <el-radio-group
                v-model="surveyForm.submitPermission"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  value="anonymous"
                >
                  允许不登录提交
                </el-radio>

                <el-radio
                  value="login"
                >
                  需登录提交
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="问卷提交次数"
            >
              <div
                class="flex flex-wrap gap-4 items-center"
              >
                <el-radio-group
                  v-model="surveyForm.unlimitedSubmit"
                  class="flex flex-wrap gap-4 items-center"
                >
                  <el-radio
                    :value="false"
                  >
                    最多允许提交
                  </el-radio>

                  <el-input-number
                    v-model="surveyForm.maxSubmitCount"
                    :min="1"
                    :controls="false"
                    class="!w-20"
                    :disabled="surveyForm.unlimitedSubmit"
                  />

                  <span>次</span>

                  <el-radio
                    :value="true"
                  >
                    不限提交次数
                  </el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item
              label="是否允许提交后修改问卷"
            >
              <el-radio-group
                v-model="surveyForm.allowModifyAfterSubmit"
                class="flex flex-wrap gap-x-10 gap-y-2"
              >
                <el-radio
                  :value="false"
                >
                  不允许修改
                </el-radio>

                <el-radio
                  :value="true"
                >
                  允许修改
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div
      class="sticky bottom-0 z-10 -mx-10 border-t border-[var(--art-card-border)] bg-[var(--default-bg-color)] px-10 py-5 max-lg:-mx-6 max-lg:px-6 max-sm:-mx-4 max-sm:px-4"
    >
      <div
        class="mx-auto flex max-w-7xl justify-end"
      >
        <ArtIconButton
          type="success"
          class="px-10 py-5 text-base"
          @click="handleSubmit"
        >
          完成
        </ArtIconButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.survey-description-editor) {
  .el-textarea__inner {
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>

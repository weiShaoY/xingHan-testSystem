<!------  2026-04-16---20:42---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

import SelectFromQuestionBankDialog from './SelectFromQuestionBankDialog.vue'

const activeTab = ref('edit')

const isShowSelectFromQuestionBankDialog = ref(false)

/**
 * 题目类型
 */
type QuestionType = 'single' | 'multiple'

/**
 * 难度
 */
type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * 选项
 */
type Option = {
  id: number
  title: string
  image: string
}

/**
 * 题目
 */
type Question = {
  id: number

  /** 题目名称 */
  title: string

  /** 题目类型 */
  type: QuestionType

  /** 正确答案 */
  correctAnswer: string | string[]

  /** 答案解析 */
  explanation: string

  /** 分值 */
  score: number

  /** 难度 */
  difficulty: Difficulty

  /** 多选题得分规则 */
  multipleScoreRule: 'each' | 'all'

  /** 选项列表 */
  options: Option[]

  /** 是否展开高级设置 */
  showAdvanced: boolean

}

/**
 * 表单数据
 */
const formData = ref<{

  /** 考试标题 */
  title: string

  /** 总分值 */
  totalScore: number

  /** 题目列表 */
  questions: Question[]

  /** 考试设置 */
  examSettings: {

    /** 考试时间（分钟） */
    duration: number

    /** 考试次数限制 */
    attemptLimit: number

    /** 考试通过分数 */
    passingScore: number

    /** 考试开始时间 */
    startTime: string

    /** 考试结束时间 */
    endTime: string

    /** 考试说明 */
    description: string

    /** 考试规则 */
    rules: string

    /** 允许重复考试 */
    allowRetake: boolean

    /** 考试后显示答案 */
    showAnswers: boolean

    /** 考试后显示解析 */
    showExplanations: boolean

    /** 防作弊设置 */
    antiCheat: {

      /** 禁止复制粘贴 */
      disableCopy: boolean

      /** 禁止切换窗口 */
      disableWindowSwitch: boolean

      /** 开启摄像头监控 */
      enableCamera: boolean
    }

    /** 考试结果通知 */
    notification: {

      /** 通知考生 */
      notifyStudent: boolean

      /** 通知教师 */
      notifyTeacher: boolean

      /** 通知管理员 */
      notifyAdmin: boolean
    }

    /** 考试数据分析 */
    analytics: {

      /** 启用数据分析 */
      enable: boolean

      /** 分析维度 */
      dimensions: string[]
    }

    /** 其他设置 */
    other: {

      /** 允许断点续考 */
      allowResume: boolean

      /** 随机出题 */
      randomQuestions: boolean

      /** 题目乱序 */
      randomOrder: boolean

      /** 选项乱序 */
      randomOptions: boolean

      /** 显示倒计时 */
      showCountdown: boolean

      /** 自动提交 */
      autoSubmit: boolean
    }
  }
}>({
  title: '',

  totalScore: 0,
  questions: [
    {
      id: 1,
      title: '',
      type: 'single',
      correctAnswer: '',
      explanation: '',
      score: 10,
      difficulty: 'medium',
      multipleScoreRule: 'each',
      options: [
        {
          id: 1,
          title: '',
          image: '',
        },
        {
          id: 2,
          title: '',
          image: '',
        },
        {
          id: 3,
          title: '',
          image: '',
        },
      ],
      showAdvanced: false,
    },
  ],
  examSettings: {
    duration: 60,
    attemptLimit: 1,
    passingScore: 60,
    startTime: '',
    endTime: '',
    description: '',
    rules: '',
    allowRetake: false,
    showAnswers: true,
    showExplanations: true,
    antiCheat: {
      disableCopy: true,
      disableWindowSwitch: true,
      enableCamera: false,
    },
    notification: {
      notifyStudent: true,
      notifyTeacher: true,
      notifyAdmin: false,
    },
    analytics: {
      enable: true,
      dimensions: ['score', 'time', 'difficulty'],
    },
    other: {
      allowResume: true,
      randomQuestions: false,
      randomOrder: false,
      randomOptions: true,
      showCountdown: true,
      autoSubmit: true,
    },
  },
})

/**
 * 计算满分
 */
const totalScore = computed(() => {
  return formData.value.questions.reduce((sum, question) => sum + (question.score || 0), 0)
})

/**
 * 添加问题
 */
function addQuestion() {
  const newId = Math.max(...formData.value.questions.map(q => q.id)) + 1

  formData.value.questions.push({
    id: newId,
    title: '',
    type: 'single',
    correctAnswer: '',
    explanation: '',
    score: 10,
    difficulty: 'medium',
    multipleScoreRule: 'each',
    options: [
      {
        id: 1,
        title: '',
        image: '',
      },
      {
        id: 2,
        title: '',
        image: '',
      },
      {
        id: 3,
        title: '',
        image: '',
      },
    ],
    showAdvanced: false,
  })

  // 强制更新视图
  formData.value = {
    ...formData.value,
  }
}

/**
 * 删除问题
 */
function deleteQuestion(id: number) {
  formData.value.questions = formData.value.questions.filter(q => q.id !== id)

  // 强制更新视图
  formData.value = {
    ...formData.value,
  }
}

/**
 * 复制问题
 */
function duplicateQuestion(id: number) {
  const question = formData.value.questions.find(q => q.id === id)

  if (question) {
    const newId = Math.max(...formData.value.questions.map(q => q.id)) + 1

    const newQuestion = {
      ...question,
      id: newId,
    }

    newQuestion.options = newQuestion.options.map((opt, index) => ({
      ...opt,
      id: index + 1,
    }))
    formData.value.questions.push(newQuestion)

    // 强制更新视图
    formData.value = {
      ...formData.value,
    }
  }
}

/**
 * 添加选项
 */
function addOption(questionIndex: number) {
  const question = formData.value.questions[questionIndex]

  const newId = Math.max(...question.options.map(opt => opt.id)) + 1

  question.options.push({
    id: newId,
    title: '',
    image: '',
  })

  // 强制更新视图
  formData.value = {
    ...formData.value,
  }
}

/**
 * 删除选项
 */
function deleteOption(questionIndex: number, optionId: number) {
  const question = formData.value.questions[questionIndex]

  question.options = question.options.filter(opt => opt.id !== optionId)

  // 重新编号选项
  question.options.forEach((opt, index) => {
    opt.id = index + 1
  })

  // 强制更新视图
  formData.value = {
    ...formData.value,
  }
}

/**
 * 完成考试创建
 */
function completeExam() {
  console.log('完成考试创建', formData.value)

  // 这里可以添加提交逻辑
}

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 处理日期范围变化
function handleDateRangeChange(val: [string, string] | null) {
  if (val) {
    formData.value.examSettings.startTime = val[0]
    formData.value.examSettings.endTime = val[1]
  }
  else {
    formData.value.examSettings.startTime = ''
    formData.value.examSettings.endTime = ''
  }
}

</script>

<template>
  <div
    class="h-full"
  >
    <!-- 从题库添加弹窗 -->
    <SelectFromQuestionBankDialog
      v-if="isShowSelectFromQuestionBankDialog"
      v-model="isShowSelectFromQuestionBankDialog"
    />

    <AdminPageHeader
      title="创建考试"
    >
      <template
        #extra
      >
        <el-button
          type="primary"
          class="flex items-center justify-center"
          @click="completeExam"
        >
          完成
        </el-button>
      </template>
    </AdminPageHeader>

    <el-tabs
      v-model="activeTab"
      class="mt-5"
    >
      <el-tab-pane
        label="考试编辑"
        name="edit"
      >
        <div
          class="mb-10 flex items-center gap-4"
        >
          <div
            class=""
          >
            问题总数 {{ formData.questions.length }}
          </div>

          <div
            class=""
          >
            满分 : {{ totalScore }}
          </div>
        </div>

        <el-form
          :model="formData"
          label-position="top"
        >
          <el-form-item
            prop="title"
            label="标题"
            required
            class="mb-10"
          >
            <el-input
              v-model="formData.title"
              placeholder="请输入考试名称"
            />
          </el-form-item>

          <!-- 问题列表 -->
          <div
            v-for="(item, index) in formData.questions"
            :key="item.id"
            class="mb-6 border rounded-lg p-4"
          >
            <div
              class="mb-4 flex items-center justify-between"
            >
              <h3
                class="text-lg font-medium"
              >
                Q{{ index + 1 }}. {{ item.title || '请输入问题' }}
              </h3>

              <div
                class="flex items-center gap-2"
              >
                <el-button
                  @click="duplicateQuestion(item.id)"
                >
                  复制
                </el-button>

                <el-button
                  @click="deleteQuestion(item.id)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <el-input
              v-model="item.title"
              placeholder="请输入问题名称"
              class="mb-4"
            />

            <el-radio-group
              v-model="item.type"
              class="mb-4"
            >
              <el-radio
                value="single"
              >
                单选题
              </el-radio>

              <el-radio
                value="multiple"
              >
                多选题
              </el-radio>
            </el-radio-group>

            <!-- 选项列表 -->
            <div
              class="mb-4"
            >
              <div
                v-for="(option, optIndex) in item.options"
                :key="option.id"
                class="mb-2 flex items-center gap-2"
              >
                <div
                  class="w-6 text-center font-medium"
                >
                  {{ String.fromCharCode(65 + optIndex) }}.
                </div>

                <el-input
                  v-model="option.title"
                  placeholder="点击创建选项, 回车自动创建下一个选项"
                  class="flex-1"
                  @keyup.enter="addOption(index)"
                />

                <el-button
                  size="small"
                  :disabled="item.options.length <= 2"
                  @click="deleteOption(index, option.id)"
                >
                  -
                </el-button>
              </div>

              <div
                class="mt-2 flex justify-end"
              >
                <el-button
                  size="small"
                  @click="addOption(index)"
                >
                  + 添加选项
                </el-button>
              </div>
            </div>

            <!-- 正确答案 -->
            <div
              class="mb-4"
            >
              <label
                class="mb-2 block font-medium"
              >
                正确答案
              </label>

              <el-select
                v-if="item.type === 'single'"
                v-model="item.correctAnswer"
                placeholder="请选择正确答案"
                class="w-40"
              >
                <el-option
                  v-for="(option, optIndex) in item.options"
                  :key="option.id"
                  :label="String.fromCharCode(65 + optIndex)"
                  :value="String.fromCharCode(65 + optIndex)"
                />
              </el-select>

              <el-select
                v-else
                v-model="item.correctAnswer"
                placeholder="请选择正确答案"
                multiple
                class="w-60"
              >
                <el-option
                  v-for="(option, optIndex) in item.options"
                  :key="option.id"
                  :label="String.fromCharCode(65 + optIndex)"
                  :value="String.fromCharCode(65 + optIndex)"
                />
              </el-select>
            </div>

            <!-- 分值和难度 -->
            <div
              class="mb-4 flex items-center gap-4"
            >
              <div>
                <label
                  class="mb-1 block font-medium"
                >分值 / 满分</label>

                <div
                  class="flex items-center gap-2"
                >
                  <el-input-number
                    v-model="item.score"
                    :min="0"
                    :max="100"
                  />

                  <span>/ {{ totalScore }}</span>
                </div>
              </div>

              <div>
                <label
                  class="mb-1 block font-medium"
                >
                  难度
                </label>

                <el-select
                  v-model="item.difficulty"
                  class="w-24"
                >
                  <el-option
                    label="易"
                    value="easy"
                  />

                  <el-option
                    label="中"
                    value="medium"
                  />

                  <el-option
                    label="难"
                    value="hard"
                  />
                </el-select>
              </div>
            </div>

            <!-- 答案说明 -->
            <div
              class="mb-4"
            >
              <label
                class="mb-2 block font-medium"
              >
                答案说明 (选填)
              </label>

              <el-input
                v-model="item.explanation"
                type="textarea"
                placeholder="填写答题思路，帮助学员理解考试内容，提升考试成绩。"
                :rows="3"
              />
            </div>

          </div>

          <!-- 添加问题按钮 -->
          <div
            class="mt-6 flex items-center gap-4"
          >
            <el-button
              type="primary"
              @click="addQuestion"
            >
              + 添加问题
            </el-button>

            <el-button
              type="info"
              @click="isShowSelectFromQuestionBankDialog = true"
            >
              从题库添加
            </el-button>
          </div>
        </el-form>

      </el-tab-pane>

      <el-tab-pane
        label="考试设置"
        name="setting"
      >
        <div
          class="mt-5 border rounded-3 p-6"
        >
          <el-form
            :model="formData.examSettings"
            label-width="150px"
            class="space-y-4"
          >
            <!-- 考试时间设置 -->
            <el-form-item
              label="考试时间（分钟）"
            >
              <el-input-number
                v-model="formData.examSettings.duration"
                :min="1"
                :max="360"
                class="w-40"
              />
            </el-form-item>

            <!-- 考试次数限制 -->
            <el-form-item
              label="考试次数限制"
            >
              <el-input-number
                v-model="formData.examSettings.attemptLimit"
                :min="1"
                :max="10"
                class="w-40"
              />

              <el-checkbox
                v-model="formData.examSettings.allowRetake"
                class="ml-4"
              >
                允许重复考试
              </el-checkbox>
            </el-form-item>

            <!-- 考试通过分数 -->
            <el-form-item
              label="考试通过分数"
            >
              <el-input-number
                v-model="formData.examSettings.passingScore"
                :min="0"
                :max="100"
                class="w-40"
              />

              <span
                class="ml-2"
              >分</span>
            </el-form-item>

            <!-- 考试时间范围 -->
            <el-form-item
              label="考试时间范围"
            >
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="w-96"
                @change="handleDateRangeChange"
              />
            </el-form-item>

            <!-- 考试说明 -->
            <el-form-item
              label="考试说明"
            >
              <el-input
                v-model="formData.examSettings.description"
                type="textarea"
                :rows="3"
                placeholder="请输入考试说明"
                class="w-full"
              />
            </el-form-item>

            <!-- 考试规则 -->
            <el-form-item
              label="考试规则"
            >
              <el-input
                v-model="formData.examSettings.rules"
                type="textarea"
                :rows="3"
                placeholder="请输入考试规则"
                class="w-full"
              />
            </el-form-item>

            <!-- 考试后显示设置 -->
            <el-form-item
              label="考试后显示设置"
            >
              <div
                class="flex items-center gap-4"
              >
                <el-checkbox
                  v-model="formData.examSettings.showAnswers"
                >
                  显示答案
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.showExplanations"
                >
                  显示解析
                </el-checkbox>
              </div>
            </el-form-item>

            <!-- 防作弊设置 -->
            <el-form-item
              label="防作弊设置"
            >
              <div
                class="flex items-center gap-4"
              >
                <el-checkbox
                  v-model="formData.examSettings.antiCheat.disableCopy"
                >
                  禁止复制粘贴
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.antiCheat.disableWindowSwitch"
                >
                  禁止切换窗口
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.antiCheat.enableCamera"
                >
                  开启摄像头监控
                </el-checkbox>
              </div>
            </el-form-item>

            <!-- 考试结果通知 -->
            <el-form-item
              label="考试结果通知"
            >
              <div
                class="flex items-center gap-4"
              >
                <el-checkbox
                  v-model="formData.examSettings.notification.notifyStudent"
                >
                  通知考生
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.notification.notifyTeacher"
                >
                  通知教师
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.notification.notifyAdmin"
                >
                  通知管理员
                </el-checkbox>
              </div>
            </el-form-item>

            <!-- 考试数据分析 -->
            <el-form-item
              label="考试数据分析"
            >
              <div
                class="flex items-center gap-4"
              >
                <el-checkbox
                  v-model="formData.examSettings.analytics.enable"
                >
                  启用数据分析
                </el-checkbox>

                <el-select
                  v-model="formData.examSettings.analytics.dimensions"
                  multiple
                  placeholder="选择分析维度"
                  class="w-64"
                >
                  <el-option
                    label="分数分析"
                    value="score"
                  />

                  <el-option
                    label="时间分析"
                    value="time"
                  />

                  <el-option
                    label="难度分析"
                    value="difficulty"
                  />

                  <el-option
                    label="题型分析"
                    value="type"
                  />
                </el-select>
              </div>
            </el-form-item>

            <!-- 其他设置 -->
            <el-form-item
              label="其他设置"
            >
              <div
                class="grid grid-cols-2 gap-4"
              >
                <el-checkbox
                  v-model="formData.examSettings.other.allowResume"
                >
                  允许断点续考
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.other.randomQuestions"
                >
                  随机出题
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.other.randomOrder"
                >
                  题目乱序
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.other.randomOptions"
                >
                  选项乱序
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.other.showCountdown"
                >
                  显示倒计时
                </el-checkbox>

                <el-checkbox
                  v-model="formData.examSettings.other.autoSubmit"
                >
                  自动提交
                </el-checkbox>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div
      class="h-20"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
s

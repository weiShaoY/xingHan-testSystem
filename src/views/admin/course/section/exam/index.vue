<!------  2026-04-16---20:42---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import { computed, ref } from 'vue'

const activeTab = ref<'edit' | 'preview'>('edit')

const route = useRoute()

const router = useRouter()

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
const formData1 = ref<{

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
  return formData1.value.questions.reduce((sum, question) => sum + (question.score || 0), 0)
})

/**
 * 添加问题
 */
function addQuestion() {
  const newId = Math.max(...formData1.value.questions.map(q => q.id)) + 1

  formData1.value.questions.push({
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
  formData1.value = {
    ...formData1.value,
  }
}

/**
 * 删除问题
 */
function deleteQuestion(id: number) {
  formData1.value.questions = formData1.value.questions.filter(q => q.id !== id)

  // 强制更新视图
  formData1.value = {
    ...formData1.value,
  }
}

/**
 * 复制问题
 */
function duplicateQuestion(id: number) {
  const question = formData1.value.questions.find(q => q.id === id)

  if (question) {
    const newId = Math.max(...formData1.value.questions.map(q => q.id)) + 1

    const newQuestion = {
      ...question,
      id: newId,
    }

    newQuestion.options = newQuestion.options.map((opt, index) => ({
      ...opt,
      id: index + 1,
    }))
    formData1.value.questions.push(newQuestion)

    // 强制更新视图
    formData1.value = {
      ...formData1.value,
    }
  }
}

/**
 * 添加选项
 */
function addOption(questionIndex: number) {
  const question = formData1.value.questions[questionIndex]

  const newId = Math.max(...question.options.map(opt => opt.id)) + 1

  question.options.push({
    id: newId,
    title: '',
    image: '',
  })

  // 强制更新视图
  formData1.value = {
    ...formData1.value,
  }
}

/**
 * 删除选项
 */
function deleteOption(questionIndex: number, optionId: number) {
  const question = formData1.value.questions[questionIndex]

  question.options = question.options.filter(opt => opt.id !== optionId)

  // 重新编号选项
  question.options.forEach((opt, index) => {
    opt.id = index + 1
  })

  // 强制更新视图
  formData1.value = {
    ...formData1.value,
  }
}

/**
 * 完成考试创建
 */
function completeExam() {
  console.log('完成考试创建', formData1.value)

  // 这里可以添加提交逻辑
}

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 处理日期范围变化
function handleDateRangeChange(val: [string, string] | null) {
  if (val) {
    formData1.value.examSettings.startTime = val[0]
    formData1.value.examSettings.endTime = val[1]
  }
  else {
    formData1.value.examSettings.startTime = ''
    formData1.value.examSettings.endTime = ''
  }
}

// / ///// ////////////////////////  2026-07-09---14:50---星期四  ////////////////////////
/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

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

/**
 * 表格列配置
 */
const columns: ColumnOption<AdminApi.Question.QuestionEditorQuestion>[] = [
  {
    label: '题目名称',
    prop: 'qusTitle',
    slotName: 'qusTitle',
    minWidth: 200,
    useSlot: true,
  },
  {
    label: '题目类型',
    prop: 'qusType',
    minWidth: 140,
    useSlot: true,
    sortable: true,
  },

  {
    label: '难度',
    prop: 'qusType',
    slotName: 'qusType',
    minWidth: 140,
    useSlot: true,
    sortable: true,
  },
  {
    label: '分值',
    prop: 'qusType',
    slotName: 'qusType',
    minWidth: 140,
    useSlot: true,
    sortable: true,
  },
]

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 是否显示文件选择弹窗
 */
const isShowExamSelectDialog = ref(false)

/**
 * 小节表单数据
 */
const formData = ref<AdminApi.Course.CourseOutlineSectionExamEditor>(createInitialFormData())

/**
 * 创建新增或编辑模式下的小节初始表单
 */
function createInitialFormData(): AdminApi.Course.CourseOutlineSectionExamEditor {
  const baseFormData = {
    couId: couId.value,
    olName: '',
    olIntro: '',
    asId: 0,
    olIsAccessory: 0,
    attemptLimit: 10,
    durationMinutes: 0,
    endTime: '',
    examIntro: '',
    examType: 0,
    isShowAnswer: 0,
    isShowScore: 1,
    passScore: 0,
    retakeIntervalHours: 0,
    score: 0,
    startTime: '',

    testPaperName: '',
    testPaperType: 1,
  } as const

  if (isEditMode.value) {
    return {
      questions: [],
      ...baseFormData,

      olId: olId.value,
    }
  }

  return {
    questions: [],
    ...baseFormData,

    olPID: olPID.value || 0,
    olLevel: olPID.value ? 2 : 1,
  }
}

/**
 * 获取小节详情
 */
async function getSectionDetail() {
  loading.value = true
  if (!olId.value) {
    return
  }

  try {
    const section = await fetchAdminCourseOutlineSectionExamDetail(olId.value)

    formData.value = {
      ...formData.value,
      ...section,
    }
  }
  catch {
    ElNotification.error('获取小节详情失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    void getSectionDetail()
  }
})

const COURSE_OUTLINE_PATH = '/admin/course/outline'

/**
 * 返回课程大纲页。
 */
function backToCourseOutline() {
  router.push({
    path: COURSE_OUTLINE_PATH,
  })
}

// / ////////////////////////  2026-07-09---15:58---星期四  ////////////////////////
/**
 * 请求参数
 */
const params = ref<AdminApi.Course.CourseOutlineSectionExamQuestionListParams>({
  pageSize: 10,
  currentPage: 1,
  qbIds: [],
})

/**
 * 表格数据
 */
const table = ref<AdminApi.Course.CourseOutlineSectionExamQuestionListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 分页配置
 */
const pagination = computed(() => ({
  current: params.value.currentPage,
  size: params.value.pageSize,
  total: table.value.totals,
}))

/**
 * 选择表格行
 */
function handleTableCurrentChange(row?: AdminApi.Question.QuestionEditorQuestion) {
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  params.value.pageSize = size
  params.value.currentPage = 1

  // clearSelectedFile()
  void getTable()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.value.currentPage = currentPage

  // clearSelectedFile()
  void getTable()
}

/**
 * 获取表格数据
 */
async function getTable() {
  loading.value = true

  try {
    table.value = await fetchAdminCourseOutlineSectionExamQuestionList(params.value)
  }
  finally {
    loading.value = false
  }
}

const questionBankList = ref<AdminApi.Course.CourseOutlineSectionExamQuestionBankItem[]>([])

/**
   *  获取题库下拉列表
   */
async function getQuestionBankList() {
  try {
    questionBankList.value = await fetchAdminCourseOutlineSectionExamQuestionBank()

    console.log('题库下拉列表', questionBankList)
  }
  catch {
    ElNotification.error('获取题库下拉列表失败')
  }
}

/**
 * 打开表格弹窗
 */
async function handleOpenTableDialog() {
  await getQuestionBankList()
  await getTable()
  isShowExamSelectDialog.value = true
}

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <el-dialog
      v-if="isShowExamSelectDialog"
      v-model="isShowExamSelectDialog"
      title="从题库选题"
      width="50%"
      :show-close="false"
    >
      <div
        class="flex justify-between items-center"
      >

        <div
          class="flex gap-2 items-center"
        >

          <ArtButton
            type="primary"
          >
            保存
          </ArtButton>
        </div>
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
          #fileName="{ row }"
        >
          <div
            class="min-w-0 flex items-center gap-2"
          >
            <div
              class=""
            >
              <ArtPreviewImage
                :path="row.asThumbnailPath"
                class="w-15 h-20"
              />
            </div>

            <div
              class="truncate text-sm font-medium text-g-900"
            >
              {{ row.asName || '-' }}
            </div>

          </div>
        </template>

        <template
          #createTime="{ row }"
        >
          <span>
            {{ formatDateTime(row.createTime) }}
          </span>
        </template>

        <template
          #fileSize="{ row }"
        >
          <span
            class="text-base text-g-900"
          >
            {{ fileSizeFormat(row.asSize) }}
          </span>
        </template>
      </ArtTable>
    </el-dialog>

    <AdminPageHeader
      :title="pageTitle"
      @back="backToCourseOutline"
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
            问题总数 {{ formData1.questions.length }}
          </div>

          <div
            class=""
          >
            满分 : {{ totalScore }}
          </div>
        </div>

        <el-form
          :model="formData1"
          label-position="top"
        >
          <el-form-item
            prop="title"
            label="标题"
            required
            class="mb-10"
          >
            <el-input
              v-model="formData1.title"
              placeholder="请输入考试名称"
            />
          </el-form-item>

          <!-- 问题列表 -->
          <div
            v-for="(item, index) in formData1.questions"
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
              @click="handleOpenTableDialog"
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
            :model="formData1.examSettings"
            label-width="150px"
            class="space-y-4"
          >
            <!-- 考试时间设置 -->
            <el-form-item
              label="考试时间（分钟）"
            >
              <el-input-number
                v-model="formData1.examSettings.duration"
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
                v-model="formData1.examSettings.attemptLimit"
                :min="1"
                :max="10"
                class="w-40"
              />

              <el-checkbox
                v-model="formData1.examSettings.allowRetake"
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
                v-model="formData1.examSettings.passingScore"
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
                v-model="formData1.examSettings.description"
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
                v-model="formData1.examSettings.rules"
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
                  v-model="formData1.examSettings.showAnswers"
                >
                  显示答案
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.showExplanations"
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
                  v-model="formData1.examSettings.antiCheat.disableCopy"
                >
                  禁止复制粘贴
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.antiCheat.disableWindowSwitch"
                >
                  禁止切换窗口
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.antiCheat.enableCamera"
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
                  v-model="formData1.examSettings.notification.notifyStudent"
                >
                  通知考生
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.notification.notifyTeacher"
                >
                  通知教师
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.notification.notifyAdmin"
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
                  v-model="formData1.examSettings.analytics.enable"
                >
                  启用数据分析
                </el-checkbox>

                <el-select
                  v-model="formData1.examSettings.analytics.dimensions"
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
                  v-model="formData1.examSettings.other.allowResume"
                >
                  允许断点续考
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.other.randomQuestions"
                >
                  随机出题
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.other.randomOrder"
                >
                  题目乱序
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.other.randomOptions"
                >
                  选项乱序
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.other.showCountdown"
                >
                  显示倒计时
                </el-checkbox>

                <el-checkbox
                  v-model="formData1.examSettings.other.autoSubmit"
                >
                  自动提交
                </el-checkbox>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>
s

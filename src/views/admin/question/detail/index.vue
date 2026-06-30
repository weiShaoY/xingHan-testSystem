<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import {
  computed,
  ref,
} from 'vue'

const route = useRoute()

const router = useRouter()

type Question = AdminApi.Question.QuestionEditorQuestion

type QuestionType = 1 | 2

type QuestionDifficulty = Question['qusDiff']

type SupportedQuestion = Omit<Question, 'qusType'> & {
  qusType: QuestionType
}

/**
 * 页面加载状态。
 */
const loading = ref(false)

/**
 * 当前题库 ID。
 */
const qbId = computed(() => {
  return Number(route.params.qbId || 0)
})

/**
 * 题库详情。
 */
const formData = ref<AdminApi.Question.QuestionEditor>({
  qbId: qbId.value || undefined,
  qbName: '',
  questions: [],
})

/**
 * 当前页面只展示单选题和多选题。
 */
const questions = computed<SupportedQuestion[]>(() => {
  return formData.value.questions.filter((question): question is SupportedQuestion => {
    return isSupportedQuestionType(question.qusType)
  })
})

/**
 * 页面标题。
 */
const pageTitle = computed(() => {
  return formData.value.qbName ? `${formData.value.qbName} 详情页` : '题库详情'
})

/**
 * 页面统计。
 */
const questionStats = computed(() => {
  return [
    `单选题数量: ${questions.value.filter(question => question.qusType === 1).length}`,
    `多选题数量: ${questions.value.filter(question => question.qusType === 2).length}`,
  ]
})

/**
 * 选项序号标签。
 */
const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * 获取选项展示序号。
 *
 * @param index 选项索引。
 */
function getOptionLabel(index: number) {
  return optionLabels[index] ?? `${index + 1}`
}

/**
 * 判断题目类型是否为当前支持的单选或多选。
 *
 * @param type 接口题目类型。
 */
function isSupportedQuestionType(type: Question['qusType']): type is QuestionType {
  return type === 1 || type === 2
}

/**
 * 获取题目类型名称。
 *
 * @param type 题目类型。
 */
function getQuestionTypeLabel(type: QuestionType) {
  const labelMap: Record<QuestionType, string> = {
    1: '单选题',
    2: '多选题',
  }

  return labelMap[type]
}

/**
 * 获取题目类型标签颜色。
 *
 * @param type 题目类型。
 */
function getQuestionTypeTagType(type: QuestionType) {
  const tagTypeMap: Record<QuestionType, 'primary' | 'success'> = {
    1: 'primary',
    2: 'success',
  }

  return tagTypeMap[type]
}

/**
 * 获取题目分值标签颜色。
 *
 * @param score 分值。
 */
function getScoreTagType(score: number) {
  if (score >= 20) {
    return 'danger'
  }

  if (score >= 10) {
    return 'success'
  }

  return 'info'
}

/**
 * 获取题目难度名称。
 *
 * @param difficulty 题目难度。
 */
function getDifficultyLabel(difficulty: QuestionDifficulty) {
  const labelMap: Record<QuestionDifficulty, string> = {
    1: '简单',
    2: '中等',
    3: '困难',
  }

  return labelMap[difficulty] ?? '中等'
}

/**
 * 获取题目难度标签颜色。
 *
 * @param difficulty 题目难度。
 */
function getDifficultyTagType(difficulty: QuestionDifficulty) {
  const tagTypeMap: Record<QuestionDifficulty, 'success' | 'warning' | 'danger'> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
  }

  return tagTypeMap[difficulty] ?? 'warning'
}

/**
 * 获取正确选项索引列表。
 *
 * @param question 题目数据。
 */
function getCorrectOptionIndexes(question: Question) {
  return question.qusItems
    ?.map((option, index) => option.ansIsCorrect ? index : -1)
    .filter(index => index !== -1) ?? []
}

/**
 * 获取单选题正确选项索引。
 *
 * @param question 题目数据。
 */
function getCorrectSingleOptionIndex(question: Question) {
  return getCorrectOptionIndexes(question)[0]
}

/**
 * 跳转到编辑页。
 */
function goToEdit() {
  router.push({
    name: 'AdminQuestionEdit',
    params: {
      qbId: qbId.value,
    },
  })
}

/**
 * 获取题库详情。
 *
 * @returns 题库详情请求完成。
 */
async function getQuestionSetting() {
  if (!qbId.value) {
    return
  }

  loading.value = true
  try {
    formData.value = await fetchAdminQuestionSetting(qbId.value)
    console.log('🚀 ~ file: index.vue:213 ~ formData.value:', formData.value)
  }
  catch {
    ElNotification.error('题库详情获取失败')
  }
  finally {
    loading.value = false
  }
}

getQuestionSetting()
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="pageTitle"
      :stats="questionStats"
    >
      <template
        #extra
      >
        <ArtButton
          type="edit"
          @click="goToEdit"
        />

        <ArtButton
          type="export"
        />

        <ArtButton
          type="delete"
        />
      </template>
    </AdminPageHeader>

    <div
      v-loading="loading"
      class="flex flex-col gap-4"
    >
      <ElEmpty
        v-if="!loading && questions.length === 0"
        description="暂无题目"
        class="py-18"
      />

      <div
        v-for="(question, index) in questions"
        :key="question.qusId || index"
        class="art-card"
      >
        <div
          class="flex gap-6 items-start max-sm:flex-col"
        >
          <div
            class="flex h-9 w-12 shrink-0 items-center justify-center rounded-custom-sm bg-primary/10 font-semibold text-primary"
          >
            Q{{ index + 1 }}
          </div>

          <div
            class="flex min-w-0 flex-1 flex-col gap-4"
          >
            <div
              class="flex flex-wrap gap-3 items-center"
            >
              <div
                class="text-base font-semibold text-g-900"
              >
                {{ question.qusTitle || '未命名题目' }}
              </div>

              <el-tag
                :type="getQuestionTypeTagType(question.qusType)"
                size="small"
              >
                {{ getQuestionTypeLabel(question.qusType) }}
              </el-tag>

              <el-tag
                :type="getScoreTagType(question.qusScore)"
                size="small"
              >
                {{ question.qusScore }} 分
              </el-tag>

              <el-tag
                :type="getDifficultyTagType(question.qusDiff)"
                size="small"
              >
                {{ getDifficultyLabel(question.qusDiff) }}
              </el-tag>
            </div>

            <div
              class="rounded-custom-sm bg-(--art-gray-100) p-4"
            >
              <el-radio-group
                v-if="question.qusType === 1"
                :model-value="getCorrectSingleOptionIndex(question)"
                disabled
                class="question-option-group flex flex-col gap-2"
              >
                <el-radio
                  v-for="(option, optionIndex) in question.qusItems"
                  :key="option.ansId || optionIndex"
                  :value="optionIndex"
                  size="large"
                >
                  {{ getOptionLabel(optionIndex) }}. {{ option.ansContext || '未填写选项内容' }}
                </el-radio>
              </el-radio-group>

              <el-checkbox-group
                v-else
                :model-value="getCorrectOptionIndexes(question)"
                disabled
                class="question-option-group flex flex-col gap-2"
              >
                <el-checkbox
                  v-for="(option, optionIndex) in question.qusItems"
                  :key="option.ansId || optionIndex"
                  :value="optionIndex"
                  size="large"
                >
                  {{ getOptionLabel(optionIndex) }}. {{ option.ansContext || '未填写选项内容' }}
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <div
              v-if="question.qusExplain"
              class="rounded-custom-sm bg-(--art-gray-100) p-4"
            >
              <div
                class="mb-2 text-sm font-medium text-g-900"
              >
                答案说明
              </div>

              <div
                class="text-sm text-g-700"
              >
                {{ question.qusExplain }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-option-group {
  align-items: flex-start;
}

.question-option-group :deep(.el-radio),
.question-option-group :deep(.el-checkbox) {
  justify-content: flex-start;
  width: 100%;
  margin-right: 0;
}
</style>

<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

defineOptions({
  name: 'ClientCourseSectionQuestionResult',
})

type QuestionResult = ClientApi.Course.CourseQuestionResultResponseUserQuestionAnswerItem

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

const loadError = ref('')

const questionResult = ref<ClientApi.Course.CourseQuestionResultResponse | null>(null)

const questionId = computed(() => Number(route.params.questionId || 0))

const questions = computed(() => questionResult.value?.userQuestionAnswers || [])

const answeredCount = computed(() => questionResult.value?.answersCount || 0)

const totalCount = computed(() => questionResult.value?.totalCount || 0)

const progress = computed(() => totalCount.value ? Math.round((answeredCount.value / totalCount.value) * 100) : 0)

async function getCourseQuestionResult() {
  if (!questionId.value) {
    loadError.value = '未找到问卷结果'
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    questionResult.value = await fetchClientCourseQuestionResult(questionId.value)
    console.log('🚀 ~ file: index.vue:43 ~ questionResult.value:', questionResult.value)
    setClientNavTitle('问卷结果')
  }
  catch (error) {
    console.error(error)
    loadError.value = '问卷结果加载失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}

function splitAnswer(answer?: string | null) {
  return String(answer || '').split(',').map(item => item.trim()).filter(Boolean)
}

function hasAnswer(question: QuestionResult) {
  return splitAnswer(question.userAnswer).length > 0
}

function isSelected(question: QuestionResult, optionIndex: number) {
  const answers = splitAnswer(question.userAnswer)

  return answers.includes(String(optionIndex))
    || answers.includes(String.fromCharCode(65 + optionIndex))
}

function getUserAnswerText(question: QuestionResult) {
  const answerTexts = question.qusItems
    .map((option, index) => isSelected(question, index) ? option.ansContext : '')
    .filter(Boolean)

  return answerTexts.length ? answerTexts.join('、') : question.userAnswer || '未作答'
}

function questionTypeLabel(type: number) {
  return ({
    1: '单选题',
    2: '多选题',
    3: '判断题',
    4: '填空题',
    5: '问答题',
  })[type] || '题目'
}

function backToCourse() {
  router.replace({
    name: 'ClientCourseDetail',
    params: {
      couId: route.params.couId,
    },
  })
}

onMounted(getCourseQuestionResult)
onBeforeUnmount(clearClientNavTitle)
</script>

<template>
  <div
    class="min-h-full flex flex-col gap-4 pb-4"
  >
    <div
      v-if="loading"
      class="min-h-90 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white text-3.5 text-slate-500"
    >
      <van-loading
        color="#0f766e"
      />
      正在加载问卷结果...
    </div>

    <van-empty
      v-else-if="loadError"
      image="error"
      :description="loadError"
      class="min-h-90 rounded-2xl bg-white"
    >
      <van-button
        size="small"
        type="primary"
        @click="getCourseQuestionResult"
      >
        重新加载
      </van-button>
    </van-empty>

    <template
      v-else-if="questionResult"
    >
      <section
        class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 via-white to-cyan-50 px-4 py-4 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
      >
        <div
          class="flex items-start justify-between gap-3"
        >
          <div>
            <div
              class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"
            >
              <van-icon
                name="description-o"
                size="16"
              />课程问卷
            </div>

            <h1
              class="m-0 text-4.5 text-slate-900 font-700"
            >
              提交结果
            </h1>

            <p
              class="mb-0 mt-1 text-3.25 text-slate-500"
            >
              已提交 {{ questionResult.submissionCount }} 次
            </p>
          </div>

          <div
            class="shrink-0 text-right"
          >
            <div
              class="text-4.5 text-teal-700 font-700"
            >
              {{ answeredCount }}/{{ totalCount }}
            </div>

            <div
              class="text-3 text-slate-500"
            >
              已作答
            </div>
          </div>
        </div>

        <van-progress
          class="mt-4"
          :percentage="progress"
          :show-pivot="false"
          stroke-width="7"
          color="#0f766e"
          track-color="#ccfbf1"
        />
      </section>

      <van-empty
        v-if="!questions.length"
        image="search"
        description="暂无答题记录"
        class="rounded-2xl bg-white"
      />

      <section
        v-for="(question, index) in questions"
        :key="question.qusId || index"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgb(15_23_42/5%)]"
      >
        <div
          class="mb-3 flex items-center justify-between gap-3"
        >
          <span
            class="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 text-3 text-teal-700 font-600"
          >第 {{ question.sortOrder || index + 1 }} 题</span>

          <van-tag
            plain
            type="primary"
          >
            {{ questionTypeLabel(question.qusType) }}
          </van-tag>
        </div>

        <h2
          class="m-0 text-4 text-slate-900 font-600 leading-7"
        >
          {{ question.qusTitle }}
        </h2>

        <div
          v-if="question.qusItems?.length"
          class="mt-5 flex flex-col gap-2.5"
        >
          <div
            v-for="(option, optionIndex) in question.qusItems"
            :key="option.ansId || optionIndex"
            class="flex items-center gap-3 border rounded-xl px-3 py-3"
            :class="isSelected(question, optionIndex) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'"
          >
            <span
              class="flex size-7 shrink-0 items-center justify-center border rounded-full text-3 font-600"
              :class="isSelected(question, optionIndex) ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-500'"
            >{{ String.fromCharCode(65 + optionIndex) }}</span>

            <span
              class="min-w-0 flex-1 text-3.5 text-slate-700 leading-6"
            >{{ option.ansContext }}</span>

            <van-icon
              v-if="isSelected(question, optionIndex)"
              name="success"
              color="#0f766e"
              size="18"
            />

          </div>
        </div>

        <div
          v-else
          class="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-3.5 text-slate-600"
        >
          {{ question.userAnswer || '未作答' }}
        </div>

        <div
          v-if="question.qusItems?.length"
          class="mt-4 rounded-xl bg-teal-50 px-3 py-3 text-3.25 text-teal-800"
        >
          我的答案：{{ getUserAnswerText(question) }}
        </div>

        <van-tag
          v-if="hasAnswer(question)"
          class="mt-4"
          plain
          :type="question.isCorrect ? 'success' : 'warning'"
        >
          {{ question.isCorrect ? '本题回答正确' : '本题回答已记录' }}
        </van-tag>

        <div
          v-if="question.qusExplain"
          class="mt-4 border-t border-slate-100 pt-4"
        >
          <div
            class="mb-1 text-3 text-slate-500"
          >
            题目解析
          </div>

          <p
            class="m-0 text-3.5 text-slate-700 leading-6"
          >
            {{ question.qusExplain }}
          </p>
        </div>

        <div
          v-else-if="!hasAnswer(question)"
          class="mt-4 text-3.25 text-slate-400"
        >
          本题未作答
        </div>
      </section>

      <van-button
        type="primary"
        block
        @click="backToCourse"
      >
        返回课程目录
      </van-button>
    </template>
  </div>
</template>

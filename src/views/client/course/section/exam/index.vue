<script setup lang="ts">
import { showToast } from 'vant'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

defineOptions({
  name: 'ClientCourseSectionExam',
})

type Question = AdminApi.Question.Question

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

const submitting = ref(false)

const loadError = ref('')

const activeQuestionIndex = ref(0)

/** 当前考试总用时（秒）。 */
const pageOpenTime = ref(0)

let pageOpenTimer: ReturnType<typeof setInterval> | undefined

const selectedAnswers = ref<Record<number, number[]>>({
})

/** 每道题首次进入时的时间戳。 */
const questionStartedAt = ref<Record<number, number>>({
})

/** 每道题从进入到首次作答的耗时（秒）。 */
const questionAnswerTimes = ref<Record<number, number>>({
})

const examStartedAt = ref(0)

const examInfo = ref<ClientApi.Course.CourseExamInfoResponse>({
  couId: 0,
  couName: '',
  currentOlId: 0,
  testPaperName: '',
  previousNode: {
    olId: 0,
    olType: 0,
  },
  nextNode: {
    olId: 0,
    olType: 0,
  },
  questions: [],
  nodes: [],
})

const olId = computed(() => Number(route.params.olId || 0))

const questions = computed(() => examInfo.value.questions || [])

const activeQuestion = computed(() => questions.value[activeQuestionIndex.value])

const totalScore = computed(() => questions.value.reduce((sum, question) => sum + Number(question.qusScore || 0), 0))

const answeredCount = computed(() => questions.value.filter((_, index) => getSelectedAnswers(index).length).length)

const progress = computed(() => {
  if (!questions.value.length) { return 0 }

  return Math.round((answeredCount.value / questions.value.length) * 100)
})

const isLastQuestion = computed(() => activeQuestionIndex.value === questions.value.length - 1)

const questionTypeLabel = computed(() => activeQuestion.value?.qusType === 2 ? '多选题' : '单选题')

async function getExamInfo() {
  if (!olId.value) {
    loadError.value = '未找到考试小节'
    return
  }

  loading.value = true
  loadError.value = ''
  activeQuestionIndex.value = 0
  selectedAnswers.value = {
  }
  questionStartedAt.value = {
  }
  questionAnswerTimes.value = {
  }
  examStartedAt.value = 0
  pageOpenTime.value = 0
  stopPageOpenTimer()

  try {
    examInfo.value = await fetchClientCourseExamInfo(olId.value)
    setClientNavTitle(examInfo.value.testPaperName || '课程考试')
    examStartedAt.value = Date.now()
    markQuestionStarted(0)
    startPageOpenTimer()
  }
  catch (error) {
    console.error(error)
    loadError.value = '考试内容加载失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}

function getSelectedAnswers(questionIndex: number) {
  return selectedAnswers.value[questionIndex] || []
}

function selectAnswer(question: Question, questionIndex: number, optionIndex: number) {
  const selected = getSelectedAnswers(questionIndex)

  if (questionAnswerTimes.value[questionIndex] === undefined) {
    const startedAt = questionStartedAt.value[questionIndex] || Date.now()

    questionAnswerTimes.value[questionIndex] = Math.max(0, Math.round((Date.now() - startedAt) / 1000))
  }

  if (question.qusType === 2) {
    selectedAnswers.value[questionIndex] = selected.includes(optionIndex)
      ? selected.filter(index => index !== optionIndex)
      : [...selected, optionIndex]
    return
  }

  selectedAnswers.value[questionIndex] = [optionIndex]
}

function goToQuestion(index: number) {
  const nextIndex = Math.min(Math.max(index, 0), questions.value.length - 1)

  activeQuestionIndex.value = nextIndex
  markQuestionStarted(nextIndex)
}

function markQuestionStarted(questionIndex: number) {
  if (questionStartedAt.value[questionIndex] === undefined) {
    questionStartedAt.value[questionIndex] = Date.now()
  }
}

function startPageOpenTimer() {
  stopPageOpenTimer()
  pageOpenTime.value = 0
  pageOpenTimer = setInterval(() => {
    pageOpenTime.value = Math.floor((Date.now() - examStartedAt.value) / 1000)
  }, 1000)
}

function stopPageOpenTimer() {
  if (pageOpenTimer === undefined) { return }

  clearInterval(pageOpenTimer)
  pageOpenTimer = undefined
}

function goToPreviousQuestion() {
  goToQuestion(activeQuestionIndex.value - 1)
}

function goToNextQuestion() {
  goToQuestion(activeQuestionIndex.value + 1)
}

function backToCourse() {
  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId: examInfo.value.couId || route.params.couId,
    },
  })
}

onMounted(() => {
  getExamInfo()
})

onBeforeUnmount(() => {
  clearClientNavTitle()
  stopPageOpenTimer()
})

async function submitExam() {
  if (submitting.value) { return }

  if (answeredCount.value < questions.value.length) {
    showToast(`还有 ${questions.value.length - answeredCount.value} 题未作答`)
    return
  }

  const submitParams: ClientApi.Course.CourseExamSubmitParams = {
    durationSeconds: getExamDuration(),
    examId: examInfo.value.currentOlId,
    answers: questions.value.map((question, index) => ({
      answerStatus: getSelectedAnswers(index).length ? 1 : 0,
      answerTime: questionAnswerTimes.value[index] || 0,
      qusId: question.qusId || 0,
      userAnswer: getSelectedAnswers(index).join(','),
    })),
  }

  submitting.value = true

  try {
    console.log('🚀 ~ file: index.vue:216 ~ submitParams:', submitParams)

    await fetchClientCourseExamSubmit(submitParams)
    stopPageOpenTimer()
    showToast('考试交卷成功')
  }
  catch (error) {
    console.error(error)
    showToast('考试交卷失败，请稍后重试')
  }
  finally {
    submitting.value = false
  }
}

function getExamDuration() {
  if (!examStartedAt.value) { return pageOpenTime.value }

  return Math.max(0, Math.floor((Date.now() - examStartedAt.value) / 1000))
}
</script>

<template>
  <div
    class="min-h-full flex flex-col gap-4 pb-4"
  >
    <template
      v-if="loading"
    >
      <div
        class="min-h-90 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white text-3.5 text-slate-500"
      >
        <van-loading
          color="#0f766e"
        />
        正在加载考试内容...
      </div>
    </template>

    <van-empty
      v-else-if="loadError"
      image="error"
      :description="loadError"
      class="min-h-90 rounded-2xl bg-white"
    >
      <van-button
        size="small"
        type="primary"
        @click="getExamInfo"
      >
        重新加载
      </van-button>
    </van-empty>

    <van-empty
      v-else-if="!questions.length"
      image="search"
      description="暂无考试题目"
      class="min-h-90 rounded-2xl bg-white"
    >
      <van-button
        size="small"
        type="primary"
        icon="orders-o"
        @click="backToCourse"
      >
        返回课程目录
      </van-button>
    </van-empty>

    <template
      v-else
    >
      <section
        class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 via-white to-cyan-50 px-4 py-4 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
      >
        <div
          class="flex items-start justify-between gap-3"
        >
          <div
            class="min-w-0"
          >
            <div
              class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"
            >
              <van-icon
                name="medal-o"
                size="16"
              />
              课程考试
            </div>

            <h1
              class="m-0 truncate text-4.5 text-slate-900 font-700"
            >
              {{ examInfo.testPaperName || '课程考试' }}
            </h1>

            <p
              v-if="examInfo.couName"
              class="mb-0 mt-1 truncate text-3.25 text-slate-500"
            >
              {{ examInfo.couName }}
            </p>
          </div>

          <div
            class="shrink-0 text-right"
          >
            <div
              class="text-4.5 text-teal-700 font-700"
            >
              {{ totalScore }}
            </div>

            <div
              class="text-3 text-slate-500"
            >
              总分
            </div>
          </div>
        </div>

        <div
          class="mt-4 flex items-center justify-between text-3.25 text-slate-500"
        >
          <span>已作答 {{ answeredCount }} / {{ questions.length }} 题</span>

          <span
            class="text-teal-700 font-700"
          >
            {{ progress }}%
          </span>
        </div>

        <van-progress
          class="mt-2"
          :percentage="progress"
          :show-pivot="false"
          stroke-width="7"
          color="#0f766e"
          track-color="#ccfbf1"
        />
      </section>

      <section
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgb(15_23_42/5%)]"
      >
        <div
          class="mb-4 flex items-center justify-between gap-3"
        >
          <span
            class="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 text-3 text-teal-700 font-600"
          >
            第 {{ activeQuestionIndex + 1 }} 题
          </span>

          <van-tag
            plain
            size="large"
            type="primary"
          >
            {{ questionTypeLabel }} · {{ activeQuestion?.qusScore || 0 }} 分
          </van-tag>
        </div>

        <h2
          class="m-0 text-4 text-slate-900 font-600 leading-7"
        >
          {{ activeQuestion?.qusTitle }}
        </h2>

        <div
          class="mt-5 flex flex-col gap-3"
        >
          <button
            v-for="(option, index) in activeQuestion?.qusItems || []"
            :key="option.ansId || index"
            type="button"
            class="option-button flex items-center gap-3 border rounded-xl px-3 py-3 text-left transition-colors"
            :class="getSelectedAnswers(activeQuestionIndex).includes(index) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white active:bg-slate-50'"
            @click="selectAnswer(activeQuestion!, activeQuestionIndex, index)"
          >
            <span
              class="option-label flex size-7 shrink-0 items-center justify-center border rounded-full text-3 font-600"
              :class="getSelectedAnswers(activeQuestionIndex).includes(index) ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-500'"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>

            <span
              class="min-w-0 flex-1 text-3.5 text-slate-700 leading-6"
            >{{ option.ansContext }}</span>

            <van-icon
              v-if="getSelectedAnswers(activeQuestionIndex).includes(index)"
              name="success"
              color="#0f766e"
              size="18"
            />
          </button>
        </div>
      </section>

      <section
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgb(15_23_42/5%)]"
      >
        <div
          class="mb-3 flex items-center justify-between"
        >
          <h2
            class="m-0 text-3.75 text-slate-900 font-700"
          >
            答题卡
          </h2>

          <span
            class="text-3 text-slate-500"
          >点击题号跳转</span>
        </div>

        <div
          class="grid grid-cols-6 gap-2 sm:grid-cols-8"
        >
          <button
            v-for="(question, index) in questions"
            :key="question.qusId || index"
            type="button"
            class="h-9 border rounded-lg text-3.25 font-600"
            :class="[index === activeQuestionIndex ? 'border-teal-600 bg-teal-600 text-white' : getSelectedAnswers(index).length ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500']"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </section>

      <div
        class="grid grid-cols-2 gap-3"
      >
        <van-button
          plain
          type="primary"
          :disabled="activeQuestionIndex === 0"
          @click="goToPreviousQuestion"
        >
          上一题
        </van-button>

        <van-button
          v-if="!isLastQuestion"
          type="primary"
          @click="goToNextQuestion"
        >
          下一题
        </van-button>

        <van-button
          v-else
          type="primary"
          :loading="submitting"
          @click="submitExam"
        >
          完成并交卷
        </van-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.option-button {
  width: 100%;
}
</style>

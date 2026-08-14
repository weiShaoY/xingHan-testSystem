<script setup lang="ts">
import { showToast } from 'vant'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

defineOptions({
  name: 'ClientCourseSectionQuestion',
})

type Question = AdminApi.Question.Question

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

const submitting = ref(false)

const loadError = ref('')

const activeQuestionIndex = ref(0)

const selectedAnswers = ref<Record<number, number[]>>({
})

const questionStartedAt = ref<Record<number, number>>({
})

const questionAnswerTimes = ref<Record<number, number>>({
})

const questionStartedAtPage = ref(0)

const questionInfo = ref<ClientApi.Course.CourseQuestionInfoResponse>({
  couId: 0,
  examId: 0,
  examName: '',
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

const questions = computed(() => questionInfo.value.questions || [])

const activeQuestion = computed(() => questions.value[activeQuestionIndex.value])

const answeredCount = computed(() => questions.value.filter((_, index) => getSelectedAnswers(index).length).length)

const progress = computed(() => questions.value.length ? Math.round((answeredCount.value / questions.value.length) * 100) : 0)

const isLastQuestion = computed(() => activeQuestionIndex.value === questions.value.length - 1)

const questionTypeLabel = computed(() => activeQuestion.value?.qusType === 2 ? '多选题' : '单选题')

async function getQuestionInfo() {
  if (!olId.value) {
    loadError.value = '未找到问卷小节'
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
  questionStartedAtPage.value = 0

  try {
    questionInfo.value = await fetchClientCourseQuestionInfo(olId.value)
    setClientNavTitle(questionInfo.value.testPaperName || '课程问卷')
    questionStartedAtPage.value = Date.now()
    markQuestionStarted(0)
  }
  catch (error) {
    console.error(error)
    loadError.value = '问卷内容加载失败，请稍后重试'
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

function markQuestionStarted(questionIndex: number) {
  if (questionStartedAt.value[questionIndex] === undefined) {
    questionStartedAt.value[questionIndex] = Date.now()
  }
}

function goToQuestion(index: number) {
  activeQuestionIndex.value = Math.min(Math.max(index, 0), questions.value.length - 1)
  markQuestionStarted(activeQuestionIndex.value)
}

function backToCourse() {
  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId: questionInfo.value.couId || route.params.couId,
    },
  })
}

async function submitQuestion() {
  if (submitting.value) { return }

  if (answeredCount.value < questions.value.length) {
    showToast(`还有 ${questions.value.length - answeredCount.value} 题未作答`)
    return
  }

  const submitParams: ClientApi.Course.CourseQuestionSubmitParams = {
    olId: olId.value,
    couId: questionInfo.value.couId || 0,
    examId: questionInfo.value.examId || 0,
    answers: questions.value.map((question, index) => ({
      qusId: question.qusId || 0,
      userAnswer: getSelectedAnswers(index).join(','),
    })),
  }

  submitting.value = true
  try {
    await fetchClientCourseQuestionSubmit(submitParams)
    showToast('问卷提交成功')
    router.replace({
      name: 'ClientCourseSectionQuestionResult',
      params: {
        couId: questionInfo.value.couId || route.params.couId,
        olId: olId.value,
      },
    })
  }
  catch (error) {
    console.error(error)
    showToast('问卷提交失败，请稍后重试')
  }
  finally {
    submitting.value = false
  }
}

onMounted(getQuestionInfo)

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
      正在加载问卷内容...
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
        @click="getQuestionInfo"
      >
        重新加载
      </van-button>
    </van-empty>

    <van-empty
      v-else-if="!questions.length"
      image="search"
      description="暂无问卷题目"
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
          class="flex items-start gap-3"
        >
          <div
            class="min-w-0 flex-1"
          >
            <div
              class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"
            >
              <van-icon
                name="description"
                size="16"
              />课程问卷
            </div>

            <h1
              class="m-0 truncate text-4.5 text-slate-900 font-700"
            >
              {{ questionInfo.testPaperName || '课程问卷' }}
            </h1>

            <p
              v-if="questionInfo.examName"
              class="mb-0 mt-1 truncate text-3.25 text-slate-500"
            >
              {{ questionInfo.examName }}
            </p>
          </div>
        </div>

        <div
          class="mt-4 flex items-center justify-between text-3.25 text-slate-500"
        >
          <span>已作答 {{ answeredCount }} / {{ questions.length }} 题</span>

          <span
            class="text-teal-700 font-700"
          >{{ progress }}%</span>
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
          >第 {{ activeQuestionIndex + 1 }} 题</span>

          <van-tag
            plain
            size="large"
            type="primary"
          >
            {{ questionTypeLabel }}
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
            >{{ String.fromCharCode(65 + index) }}</span>

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
          @click="goToQuestion(activeQuestionIndex - 1)"
        >
          上一题
        </van-button>

        <van-button
          v-if="!isLastQuestion"
          type="primary"
          @click="goToQuestion(activeQuestionIndex + 1)"
        >
          下一题
        </van-button>

        <van-button
          v-else
          type="primary"
          :loading="submitting"
          @click="submitQuestion"
        >
          提交问卷
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

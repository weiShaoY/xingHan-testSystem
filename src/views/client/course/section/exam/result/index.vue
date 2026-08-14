<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

defineOptions({ name: 'ClientCourseSectionExamResult' })

type ExamAnswer = ClientApi.Course.CourseExamResultResponseUserQuestionAnswerItem

const route = useRoute()
const router = useRouter()
const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)
const loadError = ref('')
const examResult = ref<ClientApi.Course.CourseExamResultResponse | null>(null)

const examId = computed(() => Number(route.params.examId || 0))
const answers = computed(() => examResult.value?.examAnswers || [])
const scoringRate = computed(() => {
  const value = Number(examResult.value?.scoringRate || 0)
  return value <= 1 ? Math.round(value * 100) : Math.round(value)
})

async function getCourseExamResult() {
  if (!examId.value) {
    loadError.value = '未找到考试结果'
    return
  }

  loading.value = true
  loadError.value = ''
  try {
    examResult.value = await fetchClientCourseExamResult(examId.value)
    setClientNavTitle('考试结果')
  }
  catch (error) {
    console.error(error)
    loadError.value = '考试结果加载失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}

function splitAnswer(answer: string) {
  return answer.split(',').map(item => item.trim()).filter(Boolean)
}

function isCorrectOption(question: ExamAnswer, optionIndex: number, optionId?: number) {
  const correctAnswers = splitAnswer(question.correctAnswer)
  return correctAnswers.includes(String(optionIndex)) || (optionId !== undefined && correctAnswers.includes(String(optionId)))
}

function questionTypeLabel(type: number) {
  return ({ 1: '单选题', 2: '多选题', 3: '判断题', 4: '填空题', 5: '问答题' })[type] || '题目'
}

function formatDuration(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds || 0)))
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return minutes ? `${minutes} 分 ${remainingSeconds} 秒` : `${remainingSeconds} 秒`
}

function backToCourse() {
  router.replace({ name: 'ClientCourseDetail', params: { couId: route.params.couId } })
}

onMounted(getCourseExamResult)
onBeforeUnmount(clearClientNavTitle)
</script>

<template>
  <div class="min-h-full flex flex-col gap-4 pb-4">
    <div v-if="loading" class="min-h-90 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white text-3.5 text-slate-500">
      <van-loading color="#0f766e" />
      正在加载考试结果...
    </div>

    <van-empty v-else-if="loadError" image="error" :description="loadError" class="min-h-90 rounded-2xl bg-white">
      <van-button size="small" type="primary" @click="getCourseExamResult">重新加载</van-button>
    </van-empty>

    <template v-else-if="examResult">
      <section class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 via-white to-cyan-50 px-4 py-5 shadow-[0_8px_20px_rgb(15_23_42/4%)]">
        <div class="flex items-center justify-between gap-4">
          <div><div class="mb-1 flex items-center gap-1.5 text-3 text-teal-700 font-600"><van-icon name="medal-o" size="16" />课程考试</div><h1 class="m-0 text-4.5 text-slate-900 font-700">考试成绩</h1></div>
          <div class="text-right"><div class="text-7 text-teal-700 font-700">{{ examResult.score }}</div><div class="text-3 text-slate-500">满分 {{ examResult.totalScore }} 分</div></div>
        </div>
        <div class="mt-5 grid grid-cols-2 divide-x divide-teal-100 rounded-xl bg-white/70 py-3 text-center">
          <div><div class="text-4 text-slate-900 font-700">{{ scoringRate }}%</div><div class="mt-1 text-3 text-slate-500">得分率</div></div>
          <div><div class="text-4 text-slate-900 font-700">{{ formatDuration(examResult.durationSeconds) }}</div><div class="mt-1 text-3 text-slate-500">考试用时</div></div>
        </div>
      </section>

      <van-empty v-if="!answers.length" image="search" description="暂无试题解析" class="rounded-2xl bg-white" />

      <section v-for="(question, index) in answers" :key="question.qusId || index" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgb(15_23_42/5%)]">
        <div class="mb-3 flex items-center justify-between gap-3"><span class="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 text-3 text-teal-700 font-600">第 {{ question.sortOrder || index + 1 }} 题</span><van-tag plain type="primary">{{ questionTypeLabel(question.qusType) }} · {{ question.score }} 分</van-tag></div>
        <h2 class="m-0 text-4 text-slate-900 font-600 leading-7">{{ question.qusTitle }}</h2>
        <div v-if="question.qusItems?.length" class="mt-5 flex flex-col gap-2.5">
          <div v-for="(option, optionIndex) in question.qusItems" :key="option.ansId || optionIndex" class="flex items-center gap-3 border rounded-xl px-3 py-3" :class="isCorrectOption(question, optionIndex, option.ansId) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'">
            <span class="flex size-7 shrink-0 items-center justify-center border rounded-full text-3 font-600" :class="isCorrectOption(question, optionIndex, option.ansId) ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-500'">{{ String.fromCharCode(65 + optionIndex) }}</span>
            <span class="min-w-0 flex-1 text-3.5 text-slate-700 leading-6">{{ option.ansContext }}</span>
            <van-icon v-if="isCorrectOption(question, optionIndex, option.ansId)" name="success" color="#0f766e" size="18" />
          </div>
        </div>
        <div v-else class="mt-4 rounded-xl bg-teal-50 px-3 py-3 text-3.5 text-teal-800">正确答案：{{ question.correctAnswer || '暂无' }}</div>
        <div v-if="question.qusExplain" class="mt-4 border-t border-slate-100 pt-4"><div class="mb-1 text-3 text-slate-500">题目解析</div><p class="m-0 text-3.5 text-slate-700 leading-6">{{ question.qusExplain }}</p></div>
      </section>

      <van-button type="primary" block @click="backToCourse">返回课程目录</van-button>
    </template>
  </div>
</template>

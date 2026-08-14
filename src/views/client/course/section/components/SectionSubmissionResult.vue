<script setup lang="ts">
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

const props = defineProps<{ type: 'exam' | 'question' }>()

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const isExam = computed(() => props.type === 'exam')

function backToCourse() {
  router.replace({
    name: 'ClientCourseDetail',
    params: {
      couId: route.params.couId,
    },
  })
}

onMounted(() => setClientNavTitle(isExam.value ? '考试结果' : '问卷结果'))
onBeforeUnmount(clearClientNavTitle)
</script>

<template>
  <section
    class="min-h-90 flex flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white px-6 text-center shadow-[0_8px_20px_rgb(15_23_42/5%)]"
  >
    <van-icon
      name="checked"
      size="56"
      color="#0f766e"
    />

    <h1
      class="mb-2 mt-5 text-5 text-slate-900 font-700"
    >
      {{ isExam ? '考试已交卷' : '问卷已提交' }}
    </h1>

    <p
      class="m-0 text-3.5 text-slate-500"
    >
      {{ isExam ? '本次考试已完成，成绩公布后可在学习记录中查看。' : '感谢你的反馈，问卷内容已成功提交。' }}
    </p>

    <van-button
      class="mt-7"
      type="primary"
      @click="backToCourse"
    >
      返回课程目录
    </van-button>
  </section>
</template>

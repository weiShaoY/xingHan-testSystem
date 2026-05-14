<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

import { getCourseList } from '@/apis/course'

import AllocateCourseDialog from './AllocateCourseDialog.vue'

const router = useRouter()

/**
 * 是否显示分配学习任务弹窗
 */
const isShowAllocateCourseDialog = ref(false)

/**
 * 课程类型定义
 */
type Course = {
  id: number
  name: string
  updateTime: string
  isAdded: boolean
  lessons: number
  completedLessons: number
  tags: string[]
  description: string
  year: string
  date: string
  lastUpdateTime: string

  time: {
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }
}

/**
 * 课程列表
 */
const sourceList = ref<Course[]>([
  {
    id: 1,
    name: '前端开发基础课程',
    updateTime: '2026-04-13 15:36',
    isAdded: true,
    lessons: 12,
    completedLessons: 8,
    tags: ['前端', 'HTML', 'CSS'],
    description:
        '本课程主要介绍前端开发的基础知识，包括HTML、CSS和JavaScript的核心概念和实践技巧。',
    year: '2026 年',
    date: '4月13日',
    lastUpdateTime: '最后更新15:36',
    time: {
      year: 2026,
      month: 4,
      day: 15,
      hour: 16,
      minute: 8,
    },
  },

])

/**
 * 获取课程列表
 */
async function fetchCourseList() {
  const a = await getCourseList()

  console.log('🚀 ~ file: index.vue:75 ~ a:', a)
}

fetchCourseList()

/**
 * 获取课程完成进度
 */
function getCourseProgress(item: Course) {
  if (!item.lessons) {
    return 0
  }

  return Math.round((item.completedLessons / item.lessons) * 100)
}

/**
 * 获取课程创建时间文本
 */
function getCreateTimeText(item: Course) {
  const minute = item.time.minute < 10 ? `0${item.time.minute}` : item.time.minute

  return `${item.time.hour}:${minute}`
}

/**
 * 跳转到创建页
 */
function goToCreate() {
  router.push({
    name: 'AdminCourseCreate',
  })
}

/**
 * 跳转到编辑页
 */
function goToEdit(item: Course) {
  router.push({
    name: 'AdminCourseEdit',
    params: {
      id: item.id,
    },
  })
}

/**
 * 跳转到详情页
 */
function goToDetail(item: Course) {
  router.push({
    name: 'AdminCourseDetail',
    params: {
      id: item.id,
    },
  })
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-sm:items-start"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          课程列表
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ sourceList.length }} 门课程
        </p>
      </div>

      <ArtIconButton
        type="add"
        @click="goToCreate"
      >
        创建课程
      </ArtIconButton>
    </div>

    <div
      class="flex flex-col gap-4"
    >
      <div
        v-for="item in sourceList"
        :key="item.id"
        class="grid grid-cols-[150px_8px_minmax(0,1fr)] gap-5 items-center max-md:grid-cols-1 max-md:gap-3"
      >
        <div
          class="flex flex-col items-end text-sm text-g-600 max-md:flex-row max-md:items-center max-md:justify-between max-md:rounded-custom-sm max-md:bg-box max-md:border-full-d max-md:px-4 max-md:py-3"
        >
          <div
            class="max-md:flex max-md:items-center max-md:gap-1"
          >
            <span
              class="font-medium text-primary"
            >
              {{ item.time.year }} 年
            </span>

            <span
              class="font-medium text-primary"
            >
              {{ item.time.month }} 月 {{ item.time.day }} 日
            </span>
          </div>

          <div
            class="mt-1 max-md:mt-0"
          >
            创建时间 {{ getCreateTimeText(item) }}
          </div>
        </div>

        <div
          class="h-10 w-2 rounded-full bg-primary max-md:hidden"
        >
          <!-- 分隔符 -->
        </div>

        <div
          class="art-card flex flex-1 flex-col cursor-pointer justify-center relative transition hover:border-primary/30 max-sm:p-4"
          @click="goToDetail(item)"
        >
          <div
            class="flex items-start justify-between gap-4 max-sm:flex-col"
          >
            <div
              class="min-w-0"
            >
              <h3
                class="truncate text-base font-semibold text-g-900"
              >
                {{ item.name }}
              </h3>

              <p
                class="mt-2 line-clamp-2 max-w-3xl text-sm text-g-600"
              >
                {{ item.description }}
              </p>
            </div>

            <div
              class="flex flex-shrink-0 gap-2 items-center justify-center max-sm:w-full max-sm:justify-end"
              @click.stop
            >
              <ArtIconButton
                type="edit"
                @click="goToEdit(item)"
              />

              <ArtIconButton
                type="allocate"
                @click="isShowAllocateCourseDialog = true"
              />
            </div>
          </div>

          <el-divider />

          <div
            class="grid grid-cols-[1.2fr_1fr_1.4fr] gap-5 items-start max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <!-- 参与信息 -->
            <section>
              <p
                class="font-medium mb-2 text-g-900"
              >
                参与信息
              </p>

              <div
                class="text-sm text-g-600 flex flex-wrap gap-x-4 gap-y-2 items-center"
              >
                <span>
                  总课时: {{ item.lessons }} 节
                </span>

                <span>
                  已完成: {{ item.completedLessons }} 节
                </span>

                <span>
                  进度: {{ getCourseProgress(item) }}%
                </span>
              </div>
            </section>

            <!-- 课程标签 -->
            <section>
              <p
                class="font-medium mb-2 text-g-900"
              >
                课程标签
              </p>

              <div
                class="flex flex-wrap gap-2"
              >
                <el-tag
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </section>

            <!-- 更新时间 -->
            <section
              class="max-lg:col-span-2 max-sm:col-span-1"
            >
              <p
                class="font-medium mb-2 text-g-900"
              >
                更新时间
              </p>

              <p
                class="text-sm text-g-600"
              >
                {{ item.updateTime }}
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

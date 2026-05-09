<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

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
   *  跳转到创建页
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
    class="mx-auto px-10 max-w-7xl relative max-sm:px-5"
  >
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <div
      class="my-5 flex w-full items-center justify-end"
    >

      <ArtIconButton
        type="add"
        @click="goToCreate"
      >
        创建课程
      </ArtIconButton>
    </div>

    <div
      v-for="item in sourceList"
      :key="item.id"
      class="flex-c gap-5"
    >
      <div
        class="flex flex-col items-end"
      >
        <div
          class="text-primary"
        >
          {{ item.time.year }} 年
        </div>

        <div
          class="text-primary"
        >
          {{ item.time.month }} 月 {{ item.time.day }} 日
        </div>

        <div
          class=""
        >
          创建时间   {{ item.time.hour }}:{{ item.time.minute < 10 ? `0${item.time.minute}` : item.time.minute }}
        </div>
      </div>

      <div
        class="bg-primary h-10 w-2"
      >
        <!-- 分隔符 -->
      </div>

      <div
        class="art-card mb-5 flex flex-1 flex-col cursor-cell justify-center relative max-sm:mb-4"
        @click="goToDetail(item)"
      >
        <div
          class="flex items-center justify-between"
        >
          <div
            class=""
          >
            {{ item.name }}
          </div>

          <div
            class="flex gap-2 items-center justify-center"
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
          class="flex gap-5 items-start justify-between"
        >
          <!-- 参与信息 -->
          <div>
            <p
              class="font-medium mb-2"
            >
              参与信息
            </p>

            <div
              class="text-3 color-info flex gap-4 items-center"
            >
              <p>
                总课时: {{ item.lessons }}节
              </p>

              <p>
                已完成: {{ item.completedLessons }}节
              </p>

              <p>
                进度: {{ Math.round((item.completedLessons / item.lessons) * 100) }}%
              </p>
            </div>
          </div>

          <!-- 课程标签 -->
          <div>
            <p
              class="font-medium mb-2"
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
          </div>

          <!-- 课程介绍 -->
          <div
            class="max-w-md"
          >
            <p
              class="font-medium mb-2"
            >
              课程介绍
            </p>

            <p
              class="text-3 color-info"
            >
              {{ item.description }}
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

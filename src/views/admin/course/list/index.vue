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
}

/**
   *  跳转到创建课程
   */
function goToCreateCourse() {
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
  },
  {
    id: 2,
    name: 'Vue3实战开发',
    updateTime: '2026-04-10 10:24',
    isAdded: true,
    lessons: 18,
    completedLessons: 5,
    tags: ['前端', 'Vue', 'TypeScript'],
    description: '从入门到精通Vue3框架，学习组合式API、响应式原理和实战项目开发。',
    year: '2026 年',
    date: '4月10日',
    lastUpdateTime: '最后更新10:24',
  },
  {
    id: 3,
    name: 'Node.js后端开发',
    updateTime: '2026-04-08 14:15',
    isAdded: false,
    lessons: 20,
    completedLessons: 0,
    tags: ['后端', 'Node.js', 'Express'],
    description: '学习Node.js后端开发，包括Express框架、数据库操作和RESTful API设计。',
    year: '2026 年',
    date: '4月8日',
    lastUpdateTime: '最后更新14:15',
  },
  {
    id: 4,
    name: 'React高级应用',
    updateTime: '2026-04-05 09:30',
    isAdded: true,
    lessons: 15,
    completedLessons: 12,
    tags: ['前端', 'React', 'Hooks'],
    description: '深入学习React高级特性，包括Hooks、Context API、Redux状态管理等。',
    year: '2026 年',
    date: '4月5日',
    lastUpdateTime: '最后更新09:30',
  },
  {
    id: 5,
    name: '数据库设计与优化',
    updateTime: '2026-04-01 16:45',
    isAdded: false,
    lessons: 10,
    completedLessons: 0,
    tags: ['数据库', 'MySQL', '优化'],
    description: '学习数据库设计原则、SQL优化技巧和数据库性能调优方法。',
    year: '2026 年',
    date: '4月1日',
    lastUpdateTime: '最后更新16:45',
  },
])
</script>

<template>
  <div
    class="relative mx-auto max-w-7xl px-10 max-sm:px-5"
  >
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <div
      class="my-5 w-full flex items-center justify-end"
    >
      <el-button
        class="ml-20"
        type="primary"
        @click="goToCreateCourse"
      >
        创建课程
      </el-button>
    </div>

    <div
      v-for="item in sourceList"
      :key="item.id"
      class="mb-6 flex justify-between gap-5 rounded-3"
      @click="goToDetail(item)"
    >
      <div
        class="flex flex-col gap-4 color-primary"
      >
        <div
          class="flex justify-end"
        >
          {{ item.year }}
        </div>

        <div
          class="text-10 font-bold"
        >
          {{ item.date }}
        </div>

        <div
          class="flex justify-end"
        >
          {{ item.lastUpdateTime }}
        </div>
      </div>

      <div
        class="flex-1 bg-[#f5f5f5] p-6"
      >
        <!-- 头部 -->
        <div
          class="flex items-center justify-between"
        >
          <div
            class="text-xl font-bold"
          >
            {{ item.name }}
          </div>

          <div
            class="flex items-center gap-2"
          >
            <el-button
              class="flex items-center justify-center"
              @click.stop="goToEdit(item)"
            >
              <SvgIcon
                icon="admin-edit"
              />
            </el-button>

            <!-- 分配 -->
            <el-button
              class="flex items-center justify-center"
              @click.stop="isShowAllocateCourseDialog = true"
            >
              <SvgIcon
                icon="admin-allocate"
              />
            </el-button>
          </div>
        </div>

        <el-divider />

        <!-- 内容 -->
        <div
          class="flex justify-between border rounded-3 p-6"
        >
          <!-- 左侧 -->
          <div>
            <p
              class="mb-2 font-medium"
            >
              参与信息
            </p>

            <div
              class="flex items-center gap-4"
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
          <!-- 中间 -->
          <div>
            <p
              class="mb-2 font-medium"
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
          <!-- 右侧 -->
          <div
            class="max-w-md"
          >
            <p
              class="mb-2 font-medium"
            >
              课程介绍
            </p>

            <p
              class="line-clamp-2 text-gray-600"
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

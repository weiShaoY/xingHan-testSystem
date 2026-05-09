<script lang="ts" setup>
import { ref } from 'vue'

import AllocateDialog from './AllocateDialog.vue'

import CreateProjectDialog from './CreateProjectDialog.vue'

const inputVModel = ref('')

/**
 * 是否显示创建学习项目弹窗
 */
const isShowCreateProjectDialog = ref(false)

/**
 * 是否显示分配弹窗
 */
const isShowAllocateDialog = ref(false)

/**
 * 学习项目类型定义
 */
type StudyProject = {

  /** 唯一标识 */
  id: string

  /** 项目标题 */
  title: string

  /** 项目描述 */
  description: string

  /** 时间 */
  date: string

  /** 学习阶段数量 */
  stageCount: number

  /** 课程数量 */
  courseCount: number

  /** 跳转链接 */
  link?: string
}

/**
 * 学习项目列表
 */
const projectList = ref<StudyProject[]>([
  {
    id: '1',
    title: '未命名学习项目1',
    description: '暂时没有项目描述',
    date: '2026/04/12',
    stageCount: 1,
    courseCount: 1,
    link: '#',
  },
  {
    id: '2',
    title: 'Vue3 进阶训练',
    description: '深入学习组合式 API + Pinia 状态管理',
    date: '2026/04/10',
    stageCount: 3,
    courseCount: 8,
    link: '#',
  },
  {
    id: '3',
    title: '前端工程化实践',
    description: 'Vite + 自动化部署 + CI/CD 实战',
    date: '2026/04/08',
    stageCount: 2,
    courseCount: 5,
    link: '#',
  },
])

/**
 * 获取课程描述文本
 */
function getCourseText(item: StudyProject): string {
  return `${item.stageCount} 个学习阶段，${item.courseCount} 门课程`
}

/**
 * 打开分配弹窗
 */
function openAllocateDialog(item: StudyProject) {
  console.log('🚀 ~ file: index.vue:83 ~ item:', item)
  isShowAllocateDialog.value = true
}

const router = useRouter()

/**
 * 跳转到详情页
 */
function goToDetail(item: StudyProject) {
  router.push({
    name: 'AdminProjectDetail',
    params: {
      id: item.id,
    },
  })
}

/**
 * 跳转到编辑页
 */
function goToEdit(item: StudyProject) {
  router.push({
    name: 'AdminProjectEdit',
    params: {
      id: item.id,
    },
  })
}
</script>

<template>
  <div
    class="relative mx-auto max-w-7xl px-10 max-lg:px-6 max-sm:px-4"
  >
    <CreateProjectDialog
      v-if="isShowCreateProjectDialog"
      v-model="isShowCreateProjectDialog"
    />

    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
    >
      <div
        class="flex-1"
      >
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          学习项目
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ projectList.length }} 个项目
        </p>
      </div>

      <div
        class="flex flex-1 items-center justify-end gap-3 max-md:w-full max-md:justify-start max-sm:flex-col"
      >
        <el-input
          v-model="inputVModel"
          class="max-w-110 max-md:max-w-none max-sm:w-full"
          placeholder="学习项目名称、描述、标签或访问码"
        >
          <template
            #append
          >
            <el-button
              class="flex items-center justify-center"
            >
              <SvgIcon
                icon="search"
              />
            </el-button>
          </template>
        </el-input>

        <ArtIconButton
          type="add"
          class="max-sm:w-full"
          @click="isShowCreateProjectDialog = true"
        >
          创建学习项目
        </ArtIconButton>
      </div>
    </div>

    <div
      class="flex flex-col gap-4"
    >
      <AllocateDialog
        v-if="isShowAllocateDialog"
        v-model="isShowAllocateDialog"
      />

      <div
        v-for="item in projectList"
        :key="item.id"
        class="grid grid-cols-[150px_8px_minmax(0,1fr)] gap-5 items-center max-md:grid-cols-1 max-md:gap-3"
      >
        <div
          class="flex flex-col items-end text-sm text-g-600 max-md:flex-row max-md:items-center max-md:justify-between max-md:rounded-custom-sm max-md:bg-box max-md:border-full-d max-md:px-4 max-md:py-3"
        >
          <span
            class="font-medium text-primary"
          >
            {{ item.date }}
          </span>

          <span>
            创建时间
          </span>
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
                {{ item.title }}
              </h3>

              <p
                class="mt-2 line-clamp-2 text-sm text-g-600"
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
                @click="openAllocateDialog(item)"
              />
            </div>
          </div>

          <el-divider />

          <div
            class="grid grid-cols-[1fr_1fr_1.5fr] gap-4 items-center max-sm:grid-cols-1"
          >
            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3 text-primary"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.stageCount }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                学习阶段
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3 text-primary"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.courseCount }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                课程
              </p>
            </div>

            <el-link
              :href="item.link"
              type="primary"
              class="justify-self-end max-sm:justify-self-start"
              @click.stop
            >
              {{ getCourseText(item) }} >
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

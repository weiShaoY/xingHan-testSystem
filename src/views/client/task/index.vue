<script setup lang="ts">
const router = useRouter()

const accentClasses = [
  'from-teal-600 to-cyan-500',
  'from-sky-600 to-teal-500',
  'from-emerald-600 to-teal-500',
]

const surfaceClasses = [
  'border-teal-100 bg-linear-to-b from-teal-50 to-white',
  'border-sky-100 bg-linear-to-b from-sky-50 to-white',
  'border-emerald-100 bg-linear-to-b from-emerald-50 to-white',
]

type TaskListResponse = ClientApi.Task.TaskListResponse

type ProjectTaskItem = TaskListResponse['projectList'][number]

type CourseTaskItem = TaskListResponse['courseList'][number]

type TaskViewItem = {
  id: number
  title: string
  subtitle: string
  type: 'project' | 'course'
  progress: number
}

function getAccentClass(index: number): string {
  return accentClasses[index % accentClasses.length]
}

function getSurfaceClass(index: number): string {
  return surfaceClasses[index % surfaceClasses.length]
}

function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) { return 0 }

  return Math.min(Math.max(progress, 0), 100)
}

function normalizeProjectTask(item: ProjectTaskItem): TaskViewItem {
  return {
    id: item.projId,
    title: item.projName,
    subtitle: `${item.projStage || 0}个学习阶段 ${item.projStageCourse || 0}门课程`,
    type: 'project',
    progress: clampProgress(Number(item.learningProgress || 0)),
  }
}

function normalizeCourseTask(item: CourseTaskItem): TaskViewItem {
  return {
    id: item.couId,
    title: item.couName,
    subtitle: `${item.couOutlineCount || 0}个课程小节`,
    type: 'course',
    progress: clampProgress(Number(item.learningProgress || 0)),
  }
}

function normalizeTaskList(
  data: TaskListResponse,
  learningType: ClientApi.Task.TaskListParams['learningType'],
): TaskViewItem[] {
  if (learningType === 1) {
    return data.projectList.map(normalizeProjectTask)
  }

  if (learningType === 2) {
    return data.courseList.map(normalizeCourseTask)
  }

  return [
    ...data.projectList.map(normalizeProjectTask),
    ...data.courseList.map(normalizeCourseTask),
  ]
}

const params = ref<ClientApi.Task.TaskListParams>({
  learningType: 1,
})

/**
 * 列表响应数据。
 */
const taskList = ref<TaskViewItem[]>([])

const refreshing = ref(false)

const listLoading = ref(false)

const finished = ref(false)

/**
 * 获取任务列表。
 */
async function fetchTaskList() {
  try {
    const data = await fetchClientTaskList(params.value)

    taskList.value = normalizeTaskList(data, params.value.learningType)
    finished.value = true
  }
  finally {
    refreshing.value = false
    listLoading.value = false
  }
}

const active = ref(0)

async function handleChange(index: number) {
  active.value = index
  if (active.value === 0) {
    params.value.learningType = 1
  }
  else {
    params.value.learningType = 2
  }

  finished.value = false
  taskList.value = []
  listLoading.value = true

  await fetchTaskList()
}

async function onRefresh() {
  finished.value = false
  listLoading.value = true

  await fetchTaskList()
  window.$toast('刷新成功')
}

function onLoad() {
  fetchTaskList()
}

function goToTask(item: TaskViewItem) {
  if (item.type === 'project') {
    router.push({
      name: 'ClientProjectStages',
      params: {
        projId: item.id,
      },
    })
    return
  }

  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId: item.id,
    },
  })
}
</script>

<template>

  <div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="listLoading"
        :finished="finished"
        :finished-text="taskList.length ? '没有更多了' : ''"
        @load="onLoad"
      >
        <div
          class="flex flex-col gap-4"
        >
          <div
            v-for="(item, index) in taskList"
            :key="`${item.type}-${item.id}`"
            class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992]"
          >
            <div
              class="relative overflow-hidden bg-linear-to-r px-4 py-5 text-white sm:px-5"
              :class="getAccentClass(index)"
            >
              <div
                class="pointer-events-none absolute right--6 top--5 h-24 w-24 rounded-full bg-white/10"
              />

              <div
                class="pointer-events-none absolute right-10 bottom--8 h-20 w-20 rounded-full bg-white/8 blur-2xl"
              />

              <div
                class="relative z-1"
              >
                <h3
                  class="m-0 wrap-break-word text-5.5 font-700 leading-1.35"
                >
                  {{ item.title }}
                </h3>

                <p
                  class="mt-3 mb-0 text-4 leading-1.6 text-white/90"
                >
                  {{ item.subtitle }}
                </p>
              </div>
            </div>

            <div
              class="px-4 py-4 sm:px-5"
              :class="getSurfaceClass(index)"
            >
              <van-cell
                center
                class="rounded-4 bg-transparent px-0 py-0 [&_.van-cell__value]:flex [&_.van-cell__value]:items-center [&_.van-cell__value]:justify-end"
              >
                <template
                  #title
                >
                  <van-tag
                    size="large"
                    :type="item.type === 'project' ? 'primary' : 'warning'"
                  >
                    {{ item.type === 'project' ? '项目' : '课程' }}
                  </van-tag>
                </template>

                <template
                  #value
                >
                  <van-button
                    size="small"
                    type="primary"
                    class="border-0 bg-linear-to-r from-teal-600 to-cyan-500 px-3 shadow-[0_10px_18px_rgb(20_184_166/22%)]!"
                    @click.stop="goToTask(item)"
                  >
                    {{ item.progress > 0 ? '继续学习' : '开始学习' }}
                    <van-icon
                      name="arrow"
                      class="ml-1"
                    />
                  </van-button>
                </template>
              </van-cell>

              <div
                class="mt-3 rounded-4 bg-white/70 px-3.5 py-3 backdrop-blur-sm"
              >
                <div
                  class="mb-2 flex items-center justify-between text-3.5 text-slate-500"
                >
                  <span>学习进度</span>

                  <span>
                    {{ item.progress }}%
                  </span>
                </div>

                <van-progress
                  :percentage="item.progress"
                  stroke-width="6"
                  color="linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)"
                  track-color="#e2e8f0"
                  :show-pivot="false"
                />
              </div>
            </div>
          </div>

          <van-empty
            v-if="finished && !listLoading && !taskList.length"
            class="py-16"
            description="暂无"
          />
        </div>
      </van-list>

      <template
        #success
      />
    </van-pull-refresh>

    <van-tabbar
      v-model="active"
      placeholder
      @change="handleChange"
    >
      <van-tabbar-item
        icon="apps-o"
      >
        项目
      </van-tabbar-item>

      <van-tabbar-item
        icon="desktop-o"
      >
        课程
      </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

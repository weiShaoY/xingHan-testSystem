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
  cover: string
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
    cover: item.projCover,
    type: 'project',
    progress: clampProgress(Number(item.learningProgress || 0)),
  }
}

function normalizeCourseTask(item: CourseTaskItem): TaskViewItem {
  return {
    id: item.couId,
    title: item.couName,
    subtitle: `${item.couOutlineCount || 0}个课程小节`,
    cover: item.couLogo,
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
async function loadTaskList(reset = false) {
  if (reset) {
    taskList.value = []
    finished.value = false
  }

  listLoading.value = true

  try {
    const data = await fetchClientTaskList(params.value)

    taskList.value = normalizeTaskList(data, params.value.learningType)
    finished.value = true

    return true
  }
  catch (error) {
    finished.value = true
    taskList.value = []
    window.$toast?.('获取任务列表失败')
    console.error('fetchTaskList error:', error)

    return false
  }
  finally {
    refreshing.value = false
    listLoading.value = false
  }
}

const active = ref(0)

async function handleChange(index: number) {
  active.value = index
  params.value.learningType = active.value === 0 ? 1 : 2

  await loadTaskList(true)
}

async function onRefresh() {
  const success = await loadTaskList(true)

  if (success) {
    window.$toast('刷新成功')
  }
}

async function onLoad() {
  if (listLoading.value || finished.value) {
    return
  }

  await loadTaskList()
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
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_24px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992]"
          >
            <div
              class="relative overflow-hidden bg-linear-to-r px-4 py-4 text-white sm:px-5"
              :class="getAccentClass(index)"
            >
              <div
                class="relative z-1 flex items-start justify-between gap-3"
              >
                <div
                  class="min-w-0 flex-1"
                >
                  <div
                    class="mb-2 flex items-center gap-2"
                  >
                    <van-tag
                      size="medium"
                      :type="item.type === 'project' ? 'primary' : 'warning'"
                      class="bg-white/20 text-white!"
                    >
                      {{ item.type === 'project' ? '项目' : '课程' }}
                    </van-tag>

                    <span
                      class="text-3 text-white/80"
                    >
                      {{ item.progress > 0 ? '进行中' : '未开始' }}
                    </span>
                  </div>

                  <h3
                    class="m-0 wrap-break-word text-5.5 font-700 leading-1.35"
                  >
                    {{ item.title }}
                  </h3>

                  <p
                    class="mt-2 mb-0 text-4 leading-1.6 text-white/90"
                  >
                    {{ item.subtitle }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center"
              :class="getSurfaceClass(index)"
            >
              <div
                class="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-30 sm:w-32"
              >
                <van-image
                  :src="getFileUrl(item.cover)"
                  :alt="item.title"
                  fit="cover"
                  class="size-full"
                />
              </div>

              <div
                class="min-w-0 flex-1"
              >
                <div
                  class="mb-2 flex items-center justify-between gap-2 text-3.5 text-slate-500"
                >
                  <span>学习进度</span>

                  <span
                    class="font-700 text-slate-700"
                  >
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

                <div
                  class="mt-3 flex items-center justify-between gap-2"
                >
                  <div
                    class="flex min-w-0 items-center gap-2 text-3 text-slate-500"
                  >
                    <ArtSvgIcon
                      :icon="item.type === 'project' ? 'ri:folder-2-line' : 'ri:book-open-line'"
                      class="text-4"
                    />

                    <span
                      class="truncate"
                    >
                      {{ item.type === 'project' ? '项目任务' : '课程任务' }}
                    </span>
                  </div>

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
                </div>
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

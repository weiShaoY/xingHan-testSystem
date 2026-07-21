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

function getAccentClass(index: number): string {
  return accentClasses[index % accentClasses.length]
}

function getSurfaceClass(index: number): string {
  return surfaceClasses[index % surfaceClasses.length]
}

function getTaskSubtitle(item: ClientApi.Task.TaskListItem): string {
  return `${item.projStage}个学习阶段 ${item.projStageCourse}门课程`
}

function goToTaskDetail() {
  router.push('/client/course/list')
}

const params = ref<ClientApi.Task.TaskListParams>({
  learningType: 1,
})

/**
 * 列表响应数据。
 */
const taskList = ref<ClientApi.Task.TaskListResponse>([])

const loading = ref(false)

/**
 * 获取任务列表。
 */
async function fetchTaskList() {
  loading.value = true
  try {
    taskList.value = await fetchClientTaskList(params.value)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTaskList()
})

const active = ref(0)

async function handleChange(index: number) {
  active.value = index
  if (active.value === 0) {
    params.value.learningType = 1
  }
  else {
    params.value.learningType = 2
  }

  await fetchTaskList()
}

async function onRefresh() {
  loading.value = true
  await fetchTaskList()
  loading.value = false
  window.$toast('刷新成功')
}

</script>

<template>

  <div
    class="flex flex-col gap-4 px-0 pt-3 pb-6 sm:gap-5 sm:pt-4 sm:pb-7"
  >
    <van-pull-refresh
      v-model="loading"
      @refresh="onRefresh"
    >
      <van-space
        direction="vertical"
        fill
        :size="16"
      >
        <div
          v-for="(item, index) in taskList"
          :key="item.taskId"
          class="overflow-hidden rounded-5 border border-slate-200 bg-white shadow-[0_10px_24px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992]"
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
                {{ item.projName }}
              </h3>

              <p
                class="mt-3 mb-0 text-4 leading-1.6 text-white/90"
              >
                {{ getTaskSubtitle(item) }}
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
                  :type="params.learningType === 1 ? 'primary' : 'warning'"
                >
                  {{ item.learningType === 1 ? '项目' : '课程' }}
                </van-tag>
              </template>

              <template
                #value
              >
                <van-button
                  size="small"
                  type="primary"
                  class="border-0 bg-linear-to-r from-teal-600 to-cyan-500 px-3 shadow-[0_10px_18px_rgb(20_184_166/22%)]!"
                  @click.stop="goToTaskDetail"
                >
                  {{ Number(item.learningProgress) > 0 ? '继续学习' : '开始学习' }}
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
                  {{ item.learningProgress ? item.learningProgress : 0 }}%
                </span>
              </div>

              <van-progress
                :percentage="item.learningProgress"
                stroke-width="6"
                color="linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)"
                track-color="#e2e8f0"
                :show-pivot="false"
              />
            </div>
          </div>
        </div>
      </van-space>
    </van-pull-refresh>

    <van-tabbar
      v-model="active"
      placeholder
      safe-area-inset-bottom
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

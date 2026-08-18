<script lang="ts" setup>
type HistoryItem = ClientApi.History.HistoryCourseResponseItem

type HistoryFilter = 'all' | 'learning' | 'completed'

const router = useRouter()

const loading = ref(false)

const historyData = ref<ClientApi.History.HistoryCourseResponse>({
  completedCount: 0,
  learningCount: 0,
  totalCount: 0,
  totalStudySeconds: 0,
  totalStudyTimeText: '',
  items: [],
})

const activeFilter = ref<HistoryFilter>('all')

const filters: Array<{ name: HistoryFilter, label: string }> = [
  {
    name: 'all',
    label: '全部',
  },
  {
    name: 'learning',
    label: '学习中',
  },
  {
    name: 'completed',
    label: '已完成',
  },
]

const historyList = computed(() => {
  if (activeFilter.value === 'learning') {
    return historyData.value.items.filter((item: HistoryItem) => !item.isCompleted)
  }

  if (activeFilter.value === 'completed') {
    return historyData.value.items.filter((item: HistoryItem) => item.isCompleted)
  }

  return historyData.value.items
})

function clampProgress(progress: number): number {
  const value = Number(progress)

  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0
}

function getTypeLabel(item: HistoryItem): string {
  return item.targetType || (item.targetTypeValue === 1 ? '项目' : '课程')
}

function getStatusType(item: HistoryItem): 'success' | 'primary' {
  return item.isCompleted ? 'success' : 'primary'
}

function getStudyTime(item: HistoryItem): string {
  return item.studyTimeText || (item.studySeconds ? `${Math.floor(item.studySeconds / 60)} 分钟` : '暂未记录')
}

async function getHistory(showSuccessToast = false) {
  loading.value = true

  try {
    historyData.value = await fetchClientCourseHistory()

    if (showSuccessToast) {
      window.$toast('刷新成功')
    }
  }
  finally {
    loading.value = false
  }
}

function onRefresh() {
  getHistory(true)
}

function goToLearning(item: HistoryItem) {
  if (item.targetTypeValue === 1) {
    router.push({
      name: 'ClientProjectStages',
      params: {
        projId: item.targetId,
      },
    })
    return
  }

  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId: item.targetId,
    },
  })
}

onMounted(() => {
  getHistory()
})
</script>

<template>
  <van-pull-refresh
    v-model="loading"
    class="min-h-full"
    @refresh="onRefresh"
  >
    <div
      class="flex flex-col gap-4 pb-4"
    >
      <section
        class="relative overflow-hidden rounded-md bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 px-5 py-5 text-white shadow-[0_12px_28px_rgb(13_148_136/22%)]"
      >
        <div
          class="pointer-events-none absolute right--7 top--8 h-28 w-28 rounded-full bg-white/10"
        />

        <div
          class="relative z-1"
        >
          <div
            class="inline-flex items-center gap-1.5 text-3.5 text-white/85"
          >
            <van-icon
              name="clock-o"
              size="16"
            />
            累计学习
          </div>

          <div
            class="mt-2 flex items-end justify-between gap-4"
          >
            <strong
              class="text-7 font-700 leading-none"
            >{{ historyData.totalStudyTimeText || '0 分钟' }}</strong>

            <span
              class="shrink-0 pb-0.5 text-3.5 text-white/85"
            >{{ historyData.totalCount }} 条记录</span>
          </div>

          <div
            class="mt-5 grid grid-cols-2 gap-3"
          >
            <div
              class="rounded-md bg-white/12 px-3 py-3 backdrop-blur-sm"
            >
              <div
                class="text-3.25 text-white/75"
              >
                学习中
              </div>

              <div
                class="mt-1 text-5 font-700"
              >
                {{ historyData.learningCount }}
              </div>
            </div>

            <div
              class="rounded-md bg-white/12 px-3 py-3 backdrop-blur-sm"
            >
              <div
                class="text-3.25 text-white/75"
              >
                已完成
              </div>

              <div
                class="mt-1 text-5 font-700"
              >
                {{ historyData.completedCount }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div
          class="mb-3 flex items-center justify-between"
        >
          <h2
            class="m-0 text-5 text-slate-900 font-700"
          >
            学习记录
          </h2>

          <span
            class="text-3.25 text-slate-500"
          >最近学习优先</span>
        </div>

        <van-tabs
          v-model:active="activeFilter"
          shrink
          class="history-tabs"
        >
          <van-tab
            v-for="filter in filters"
            :key="filter.name"
            :name="filter.name"
            :title="filter.label"
          />
        </van-tabs>

        <div
          v-if="historyList.length"
          class="mt-3 flex flex-col gap-3"
        >
          <button
            v-for="item in historyList"
            :key="`${item.targetTypeValue}-${item.targetId}`"
            type="button"
            class="history-card w-full overflow-hidden rounded-md border border-slate-200 bg-white p-0 text-left shadow-[0_8px_20px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992]"
            @click="goToLearning(item)"
          >
            <div
              class="flex items-start gap-3 px-4 pt-4"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-md text-5"
                :class="item.targetTypeValue === 1 ? 'bg-sky-50 text-sky-600' : 'bg-teal-50 text-teal-700'"
              >
                <van-icon
                  :name="item.targetTypeValue === 1 ? 'description-o' : 'play-circle-o'"
                />
              </div>

              <div
                class="min-w-0 flex-1"
              >
                <div
                  class="flex min-w-0 items-center gap-2"
                >
                  <h3
                    class="m-0 min-w-0 flex-1 truncate text-4 text-slate-900 font-700 leading-1.45"
                  >
                    {{ item.targetName }}
                  </h3>

                  <van-tag
                    plain
                    :type="getStatusType(item)"
                    size="medium"
                    class="shrink-0"
                  >
                    {{ item.statusText || (item.isCompleted ? '已完成' : '学习中') }}
                  </van-tag>
                </div>

                <div
                  class="mt-2 flex items-center gap-3 text-3.25 text-slate-500"
                >
                  <span
                    class="inline-flex items-center gap-1"
                  ><van-icon
                    name="label-o"
                  />{{ getTypeLabel(item) }}</span>

                  <span
                    class="inline-flex items-center gap-1"
                  ><van-icon
                    name="clock-o"
                  />{{ getStudyTime(item) }}</span>
                </div>
              </div>
            </div>

            <div
              class="mt-4 border-t border-slate-100 bg-slate-50/70 px-4 py-3"
            >
              <div
                class="mb-2 flex items-center justify-between text-3.25 text-slate-500"
              >
                <span>学习进度</span>

                <span
                  class="font-600 text-teal-700"
                >{{ item.progressText || `${clampProgress(item.progress)}%` }}</span>
              </div>

              <van-progress
                :percentage="clampProgress(item.progress)"
                :color="item.isCompleted ? '#16a34a' : 'linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)'"
                track-color="#e2e8f0"
                :show-pivot="false"
                stroke-width="6"
              />

              <div
                class="mt-3 flex items-center justify-between text-3.25 text-slate-500"
              >
                <span>{{ item.lastStudyTimeText || '暂未学习' }}</span>

                <span
                  class="inline-flex items-center gap-0.5 text-teal-700"
                >
                  {{ item.isCompleted ? '查看详情' : '继续学习' }}
                  <van-icon
                    name="arrow"
                  />
                </span>
              </div>
            </div>
          </button>
        </div>

        <van-empty
          v-else-if="!loading"
          class="py-16"
          image="search"
          :description="activeFilter === 'all' ? '暂无学习记录' : '暂无符合条件的记录'"
        />
      </section>
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.history-tabs {
  :deep(.van-tabs__nav) {
    background: transparent;
  }

  :deep(.van-tab) {
    flex: none;
    padding: 0 16px;
  }

  :deep(.van-tabs__line) {
    background: #0f766e;
  }
}

.history-card {
  appearance: none;
}
</style>

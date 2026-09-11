<script lang="ts" setup>
import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

const DEFAULT_NAV_TITLE = '项目阶段列表'

const STAGE_COLORS = [
  'from-teal-600 to-cyan-500',
  'from-sky-600 to-teal-500',
  'from-emerald-600 to-teal-500',
] as const

type ProjectStagesData = ClientApi.Project.ProjectStagesListResponse

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

const activeName = ref<number[]>([])

/**
 * 当前项目 ID
 */
const projId = computed(() => Number(route.params.projId || 0))

/**
 * 创建项目阶段列表默认数据。
 *
 * @param currentProjId 当前项目 ID。
 * @returns 空的项目阶段列表数据。
 */
function createEmptyProjectStagesData(currentProjId: number): ProjectStagesData {
  return {
    projId: currentProjId,
    projName: '',
    projIntro: '',
    projCover: '',
    projStage: 0,
    projStageCourseCount: 0,
    learningProgress: '',
    projectDirectory: [],
  }
}

/**
 * 项目阶段列表。
 */
const projectStageList = ref<ProjectStagesData>(createEmptyProjectStagesData(projId.value))

/**
 * 学习进度百分比。
 */
const progress = computed(() => clampPercent(projectStageList.value.learningProgress))

/**
 * 将接口返回的进度值限制在 0-100 范围内。
 *
 * @param value 接口返回的进度值。
 * @returns 合法进度百分比。
 */
function clampPercent(value: string | number): number {
  const percent = Number(value)

  return Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : 0
}

/**
 * 获取阶段序号背景色。
 *
 * @param index 阶段索引。
 * @returns UnoCSS 渐变色 class。
 */
function getStageColor(index: number): string {
  return STAGE_COLORS[index % STAGE_COLORS.length]
}

/**
 * 获取项目阶段列表。
 *
 * @param options.showSuccessToast 是否在请求成功后提示刷新成功。
 */
async function getClientProjectStagesList(showSuccessToast = false) {
  loading.value = true

  try {
    const data = await fetchClientProjectStagesList(projId.value)

    projectStageList.value = data
    setNavTitle(data.projName)

    if (showSuccessToast) {
      window.$toast('刷新成功')
    }
  }
  finally {
    loading.value = false
  }
}

/**
 * 设置顶部导航标题。
 *
 * 当前页面的 VanNavBar 在 client/layout 中统一渲染，
 * 这里通过响应式的客户端导航标题覆盖默认 route.meta.title。
 */
function setNavTitle(title?: string) {
  setClientNavTitle(title?.trim() || DEFAULT_NAV_TITLE)
}

/**
 * 下拉刷新。
 */
function onRefresh() {
  getClientProjectStagesList(true)
}

onBeforeUnmount(() => {
  clearClientNavTitle()
})
onMounted(() => {
  getClientProjectStagesList()
})
function handleGoCourseDetail(couId: number) {
  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId,
    },
  })
}

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
      <div
        class="relative overflow-hidden rounded-md bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 px-5 py-5 text-white shadow-[0_12px_28px_rgb(13_148_136/22%)]"
      >
        <div
          class="pointer-events-none absolute right--7 top--8 h-28 w-28 rounded-full bg-white/10"
        />

        <div
          class="pointer-events-none absolute bottom--10 right-10 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl"
        />

        <div
          class="relative z-1"
        >
          <div
            v-if="projectStageList.projCover"
            class="mb-4 overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-[0_10px_24px_rgb(15_23_42/10%)]"
          >
            <van-image
              :src="getFileUrl(projectStageList.projCover)"
              :alt="projectStageList.projName || '项目封面'"
              fit="cover"
              class="h-40 w-full"
            />
          </div>

          <h1
            class="m-0 wrap-break-word text-6 font-700 leading-1.3"
          >
            {{ projectStageList.projName || '学习项目' }}
          </h1>

          <p
            class="mt-3 mb-0 line-clamp-2 text-3.5 leading-1.65 text-white/85"
          >
            {{ projectStageList.projIntro || '按阶段完成课程，稳步推进学习目标' }}
          </p>

          <div
            class="mt-5 flex items-center gap-5 text-3.5 text-white/90"
          >
            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="orders-o"
              size="16"
            />{{ projectStageList.projStage || 0 }} 个阶段</span>

            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="notes-o"
              size="16"
            />{{ projectStageList.projStageCourseCount || 0 }} 门课程</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-md border border-teal-100 bg-linear-to-r from-teal-50 to-white px-4 py-3.5 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
      >
        <div
          class="mb-2.5 flex items-center justify-between text-3.5 text-slate-600"
        >
          <span
            class="inline-flex items-center gap-1.5 font-600 text-slate-800"
          ><van-icon
            name="chart-trending-o"
            color="#0f766e"
            size="17"
          />学习进度</span>

          <span
            class="font-700 text-teal-700"
          >{{ progress }}%</span>
        </div>

        <van-progress
          :percentage="progress"
          stroke-width="7"
          color="linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)"
          track-color="#dbeafe"
          :show-pivot="false"
        />
      </div>

      <div>
        <div
          class="mb-3 flex items-center justify-between"
        >
          <h2
            class="m-0 text-5 text-slate-900 font-700"
          >
            学习阶段
          </h2>

          <span
            class="text-3.25 text-slate-500"
          >
            共 {{ projectStageList.projectDirectory.length }} 个阶段
          </span>
        </div>

        <van-collapse
          v-model="activeName"
          class="stage-collapse flex flex-col gap-3 bg-transparent"
          :border="false"
        >
          <van-collapse-item
            v-for="(item, index) in projectStageList.projectDirectory"
            :key="item.stageId"
            :title="item.stageName"
            :name="item.stageId"
            class="stage-item overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_8px_20px_rgb(15_23_42/5%)]"
          >
            <template
              #title
            >
              <div
                class="min-w-0 flex flex-1 items-center gap-3"
              >
                <div
                  class="h-10 w-10 flex shrink-0 items-center justify-center rounded-md bg-linear-to-br text-4 text-white font-700 shadow-[0_6px_14px_rgb(13_148_136/20%)]"
                  :class="getStageColor(index)"
                >
                  {{ index + 1 }}
                </div>

                <div
                  class="min-w-0 flex-1"
                >
                  <div
                    class="truncate text-4 text-slate-900 font-700"
                  >
                    {{ item.stageName }}
                  </div>

                  <div
                    class="mt-1 text-3.25 text-slate-500"
                  >
                    {{ item.projStageCourseCount || item.stageCourse.length }} 门课程
                    <template
                      v-if="item.duration"
                    >
                      · {{ item.duration }} 分钟
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <template
              v-if="item.stageCourse.length > 0"
            >
              <div
                v-for="course in item.stageCourse"
                :key="course.couId"
                class="mb-3 flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-3 last:mb-0"
                @click="handleGoCourseDetail(course.couId)"
              >
                <div
                  class="h-8 w-8 flex shrink-0 items-center justify-center rounded-md bg-white text-3.25 text-teal-700 font-700 shadow-sm"
                >
                  <van-icon
                    name="play-circle-o"
                    size="17"
                  />
                </div>

                <div
                  class="min-w-0 flex-1"
                >
                  <div
                    class="truncate text-3.5 text-slate-800 font-600"
                  >
                    {{ course.couTitle || course.couName }}
                  </div>

                  <div
                    v-if="course.couIntro"
                    class="mt-1 truncate text-3 text-slate-500"
                  >
                    {{ course.couIntro }}
                  </div>
                </div>

                <van-icon
                  name="arrow"
                  class="shrink-0 text-slate-400"
                />
              </div>
            </template>

            <template
              v-else
            >
              <div
                class="rounded-md bg-slate-50 py-5 text-center text-3.25 text-slate-500"
              >
                <van-icon
                  name="notes-o"
                  class="mr-1 align--0.5"
                />当前阶段暂无课程
              </div>
            </template>

          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>

</style>

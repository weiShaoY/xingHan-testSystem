<!------  2026-06-29---11:50---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import cover6 from '@imgs/cover/img6.webp'

import ClientLayout from '@/views/client/layout/index.vue'

const loading = ref(false)

const route = useRoute()

/**
 * 当前学习项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 项目阶段列表
 */
const projectStageList = ref<AdminApi.Project.ProjectStageListEditor>({
  projId: projId.value,
  projName: '',
  projSectionCount: 0,
  projStageCourse: 0,
  displayMethod: 0,
  isLearningStages: 0,
  unlockConditions: 2,
  allDuration: 0,
  nodes: [],
})

const sortedStages = computed(() => {
  return [...projectStageList.value.nodes].sort((prev, next) => prev.sortOrder - next.sortOrder)
})

const requiredStageCount = computed(() => {
  return projectStageList.value.nodes.filter(item => item.stageType === 1).length
})

const optionalStageCount = computed(() => {
  return projectStageList.value.nodes.filter(item => item.stageType !== 1).length
})

const unlockLabel = computed(() => {
  const labels: Record<AdminApi.Project.ProjectStageListEditor['unlockConditions'], string> = {
    0: '按学习阶段解锁',
    1: '按课程解锁',
    2: '不限学习顺序',
  }

  return labels[projectStageList.value.unlockConditions]
})

const displayLabel = computed(() => {
  return projectStageList.value.displayMethod === 0 ? '默认展开' : '默认折叠'
})

const projectIntro = computed(() => {
  const firstStageIntro = sortedStages.value.find(item => item.stageIntro)?.stageIntro

  return firstStageIntro || '暂无项目介绍，学员可以从下方学习内容开始了解项目安排。'
})

/**
 * 获取项目预览页
 */
async function fetchProjectPreview() {
  loading.value = true

  try {
    projectStageList.value = await fetchAdminProjectStageList(projId.value)
  }
  catch {
    ElNotification.error('项目预览获取失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchProjectPreview()
})
</script>

<template>
  <ClientLayout
    :show-header="true"
  >
    <div
      v-loading="loading"
      class="layout-content py-5 max-sm:py-4"
    >
      <div
        class="overflow-hidden art-card p-0 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent"
      >
        <div
          class="relative"
        >
          <img
            :src="cover6"
            :alt="projectStageList.projName || '项目预览'"
            class="aspect-16/9 w-full object-cover max-sm:rounded-[5px]"
          >

          <div
            class="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgb(0_0_0/72%)] to-transparent px-5 pb-5 pt-14 text-white max-sm:px-4 max-sm:pb-4"
          >
            <div
              class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1 text-xs font-500 backdrop-blur"
            >
              <ArtSvgIcon
                icon="ri:smartphone-line"
                class="text-[15px]"
              />
              移动端预览
            </div>

            <h1
              class="m-0 line-clamp-2 text-2xl font-semibold leading-8 max-sm:text-[22px] max-sm:leading-7"
            >
              {{ projectStageList.projName || '未命名学习项目' }}
            </h1>
          </div>
        </div>

        <div
          class="px-5 pb-5 pt-4 max-sm:px-0 max-sm:pb-0"
        >
          <div
            class="grid grid-cols-4 gap-3 max-sm:grid-cols-2"
          >
            <div
              class="rounded-custom-sm bg-primary/10 px-3 py-3 text-primary"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ projectStageList.nodes.length }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                学习阶段
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#11bbd2]/10 px-3 py-3 text-[#0a91a4]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ projectStageList.projStageCourse }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                课程
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#febd2d]/14 px-3 py-3 text-[#b47900]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ projectStageList.projSectionCount }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                小节
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#f7979f]/14 px-3 py-3 text-[#c74f5d]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ projectStageList.allDuration }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                分钟
              </p>
            </div>

          </div>

          <div
            class="mt-4 flex flex-wrap gap-2"
          >
            <el-tag
              type="danger"
              size="small"
            >
              必修阶段 {{ requiredStageCount }}
            </el-tag>

            <el-tag
              type="info"
              size="small"
            >
              选修阶段 {{ optionalStageCount }}
            </el-tag>

            <el-tag
              type="primary"
              size="small"
            >
              {{ unlockLabel }}
            </el-tag>

            <el-tag
              type="success"
              size="small"
            >
              {{ displayLabel }}
            </el-tag>
          </div>

          <section
            class="mt-5 rounded-custom-sm bg-g-100/70 px-4 py-4"
          >
            <div
              class="mb-2 flex items-center gap-2"
            >
              <ArtSvgIcon
                icon="ri:file-list-3-line"
                class="text-[18px] text-primary"
              />

              <h2
                class="m-0 text-base font-semibold text-g-900"
              >
                项目介绍
              </h2>
            </div>

            <p
              class="m-0 line-clamp-3 text-sm leading-7 text-g-600"
            >
              {{ projectIntro }}
            </p>
          </section>
        </div>
      </div>

      <section
        class="mt-6"
      >
        <div
          class="mb-4 flex items-end justify-between gap-4"
        >
          <div>
            <h2
              class="m-0 text-xl font-semibold leading-8 text-g-900 max-sm:text-lg"
            >
              学习内容
            </h2>

            <p
              class="mt-1 mb-0 text-sm leading-5 text-g-600"
            >
              {{ projectStageList.nodes.length }} 个阶段 · {{ projectStageList.projStageCourse }} 门课程
            </p>
          </div>

          <div
            class="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-600 text-primary"
          >
            {{ unlockLabel }}
          </div>
        </div>

        <div
          v-for="(stage, stageIndex) in sortedStages"
          :key="stage.stageId"
          class="mb-5 overflow-hidden art-card p-0 last:mb-0"
        >
          <div
            class="px-5 pt-5 max-sm:px-4 max-sm:pt-4"
          >
            <div
              class="flex items-start justify-between gap-3"
            >
              <div
                class="min-w-0"
              >
                <div
                  class="mb-2 flex flex-wrap items-center gap-2"
                >
                  <span
                    class="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-xs font-600 text-primary"
                  >
                    第 {{ stageIndex + 1 }} 阶段
                  </span>

                  <el-tag
                    :type="stage.stageType === 1 ? 'danger' : 'info'"
                    size="small"
                  >
                    {{ stage.stageType === 1 ? '必修' : '选修' }}
                  </el-tag>
                </div>

                <h2
                  class="m-0 line-clamp-2 text-lg font-semibold leading-7 text-g-900 max-sm:text-base"
                >
                  {{ stage.stageName || '未命名阶段' }}
                </h2>
              </div>

              <div
                class="flex min-w-18 shrink-0 items-center justify-center gap-1 rounded-custom-sm bg-g-100 px-3 py-2 text-center"
              >
                <div
                  class="text-lg font-semibold leading-5 text-g-900"
                >
                  {{ stage.course.length }}
                </div>

                <div
                  class="text-xs leading-4 text-g-500"
                >
                  门课程
                </div>
              </div>
            </div>

            <p
              class="mt-3 mb-0 line-clamp-2 text-sm leading-6 text-g-600"
            >
              {{ stage.stageIntro || '暂无阶段说明' }}
            </p>
          </div>

          <div
            v-if="stage.course.length"
            class="mt-4 flex flex-col"
          >
            <button
              v-for="(course, courseIndex) in stage.course"
              :key="course.couId"
              type="button"
              class="group grid grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-3 border-0 border-t border-solid border-(--el-border-color-lighter) bg-transparent px-5 py-4 text-left transition cursor-pointer hover:bg-primary/5 active:opacity-80 max-sm:px-4"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-custom-sm bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white"
              >
                <ArtSvgIcon
                  icon="ri:play-circle-line"
                  class="text-[20px]"
                />
              </div>

              <div
                class="min-w-0"
              >
                <div
                  class="mb-1 flex items-center gap-2 text-xs text-g-500"
                >
                  <span>课程 {{ courseIndex + 1 }}</span>

                  <span
                    v-if="course.couLevel"
                    class="h-1 w-1 rounded-full bg-g-300"
                  />

                  <span
                    v-if="course.couLevel"
                  >
                    难度 {{ course.couLevel }}
                  </span>
                </div>

                <h3
                  class="m-0 line-clamp-2 text-sm font-semibold leading-5 text-g-900 group-hover:text-primary"
                >
                  {{ course.couName || '未命名课程' }}
                </h3>

                <p
                  class="mt-1.5 mb-0 line-clamp-2 text-xs leading-5 text-g-500"
                >
                  {{ course.couIntro || course.couTitle || '暂无课程介绍' }}
                </p>

                <div
                  class="mt-2 flex items-center gap-2 text-xs text-g-500"
                >
                  <ArtSvgIcon
                    icon="ri:eye-line"
                    class="text-[15px] text-primary"
                  />
                  {{ course.couViewNum || 0 }} 次学习
                </div>
              </div>

              <ArtSvgIcon
                icon="ri:arrow-right-s-line"
                class="text-[22px] text-g-400 transition group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          </div>

          <div
            v-else
            class="mx-5 mt-4 mb-5 rounded-custom-sm bg-g-100 px-4 py-4 text-center text-sm text-g-500 max-sm:mx-4"
          >
            暂未配置课程
          </div>
        </div>

        <el-empty
          v-if="!sortedStages.length"
          class="mt-10"
          description="暂未配置学习内容"
        />
      </section>

    </div>
  </ClientLayout>
</template>

<style lang="scss" scoped></style>

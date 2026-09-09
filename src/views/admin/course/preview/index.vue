<!------  2026-06-29---16:20---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { getSectionTypeConfig } from '@/config/course'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import ClientLayout from '@/views/client/layout/index.vue'

const DEFAULT_NAV_TITLE = '课程预览'

const route = useRoute()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 当前展开的章节
 */
const activeNames = ref<number[]>([])

const courseOutlineList = ref<AdminApi.Course.CourseOutlineListResponse>({
  couId: 0,
  couName: '',
  couContent: '',
  couIntro: '',
  couChapterCount: 0,
  couSectionCount: 0,
  nodes: [],
})

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

const courseNodes = computed(() => courseOutlineList.value.nodes || [])

const chapterRecords = computed(() => {
  return courseNodes.value.filter(item => item.itemType === 'chapter')
})

const independentSectionRecords = computed(() => {
  return courseNodes.value.filter(item => item.itemType === 'section')
})

const estimatedMinutes = computed(() => {
  return courseOutlineList.value.couSectionCount * 5
})

const directSectionCount = computed(() => {
  return independentSectionRecords.value.length
})

const visibleChapterCount = computed(() => {
  return chapterRecords.value.filter(item => item.isVisible === 1).length
})

const visibleChapterPercent = computed(() => {
  if (!courseOutlineList.value.couChapterCount) {
    return 0
  }

  return Math.round((visibleChapterCount.value / courseOutlineList.value.couChapterCount) * 100)
})

const courseIntro = computed(() => {
  return courseOutlineList.value.couIntro
    || courseOutlineList.value.couContent
    || '暂无课程介绍'
})

/**
 * 获取课程章节列表
 */
async function getCourseOutlineList(showSuccessToast = false) {
  loading.value = true

  try {
    courseOutlineList.value = await fetchAdminCourseOutlineList(couId.value)
    console.log('🚀 ~ file: index.vue:87 ~ courseOutlineList.value:', courseOutlineList.value)
    setClientNavTitle(courseOutlineList.value.couName || DEFAULT_NAV_TITLE)
    activeNames.value = chapterRecords.value.slice(0, 2).map(item => item.id)

    if (showSuccessToast) {
      window.$toast('刷新成功')
    }
  }
  catch {
    ElNotification.error('课程预览获取失败')
  }
  finally {
    loading.value = false
  }
}

function getChapterSections(chapter: AdminApi.Course.Chapter) {
  return chapter.sectionList || []
}

function formatEstimatedMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} 分钟`
  }

  const hours = Math.floor(minutes / 60)

  const remainingMinutes = minutes % 60

  return remainingMinutes ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`
}

function onRefresh() {
  void getCourseOutlineList(true)
}

onMounted(() => {
  void getCourseOutlineList()
})

onBeforeUnmount(() => {
  clearClientNavTitle()
})
</script>

<template>
  <ClientLayout
    :show-header="true"
  >
    <van-pull-refresh
      v-model="loading"
      class="min-h-full"
      @refresh="onRefresh"
    >
      <div
        class="flex flex-col gap-4 pb-4"
      >
        <div
          class="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 px-5 py-5 text-white shadow-[0_12px_28px_rgb(13_148_136/22%)]"
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
              class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1 text-3 text-white/90 backdrop-blur"
            >
              <van-icon
                name="play-circle-o"
                size="14"
              />
              课程预览
            </div>

            <h1
              class="m-0 wrap-break-word text-6 font-700 leading-1.3"
            >
              {{ courseOutlineList.couName || DEFAULT_NAV_TITLE }}
            </h1>

            <div
              class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-3.5 text-white/90"
            >
              <span
                class="inline-flex items-center gap-1.5"
              >
                <van-icon
                  name="orders-o"
                  size="16"
                />
                {{ courseOutlineList.couChapterCount }} 个章节
              </span>

              <span
                class="inline-flex items-center gap-1.5"
              >
                <van-icon
                  name="clock-o"
                  size="16"
                />
                {{ formatEstimatedMinutes(estimatedMinutes) }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 to-white px-4 py-4 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
        >
          <div
            class="flex items-center justify-between text-3.5 text-slate-700"
          >
            <span
              class="font-700"
            >
              课程结构
            </span>

            <span
              class="text-teal-700 font-700"
            >
              {{ visibleChapterCount }}/{{ courseOutlineList.couChapterCount }} 可见
            </span>
          </div>

          <van-progress
            class="mt-3"
            :percentage="visibleChapterPercent"
            stroke-width="8"
            color="#0f766e"
            track-color="#ccfbf1"
            :show-pivot="false"
          />

          <div
            class="mt-3 grid grid-cols-3 gap-2 text-center"
          >
            <div
              class="rounded-xl bg-white px-2 py-3 shadow-[0_6px_14px_rgb(15_23_42/4%)]"
            >
              <div
                class="text-4.5 text-slate-900 font-700"
              >
                {{ courseOutlineList.couChapterCount }}
              </div>

              <div
                class="mt-1 text-3 text-slate-500"
              >
                章节
              </div>
            </div>

            <div
              class="rounded-xl bg-white px-2 py-3 shadow-[0_6px_14px_rgb(15_23_42/4%)]"
            >
              <div
                class="text-4.5 text-slate-900 font-700"
              >
                {{ courseOutlineList.couSectionCount }}
              </div>

              <div
                class="mt-1 text-3 text-slate-500"
              >
                小节
              </div>
            </div>

            <div
              class="rounded-xl bg-white px-2 py-3 shadow-[0_6px_14px_rgb(15_23_42/4%)]"
            >
              <div
                class="text-4.5 text-slate-900 font-700"
              >
                {{ directSectionCount }}
              </div>

              <div
                class="mt-1 text-3 text-slate-500"
              >
                独立
              </div>
            </div>
          </div>

          <div
            class="mt-4 rounded-xl bg-white/72 px-3 py-3 text-3.25 leading-5.5 text-slate-600"
          >
            <div
              class="mb-1.5 flex items-center gap-1.5 text-3.5 text-slate-800 font-700"
            >
              <van-icon
                name="description-o"
                size="16"
              />
              课程介绍
            </div>

            <p
              class="m-0 wrap-break-word"
            >
              {{ courseIntro }}
            </p>
          </div>
        </div>

        <section>
          <div
            class="mb-3 flex items-center justify-between"
          >
            <h2
              class="m-0 text-5 text-slate-900 font-700"
            >
              学习目录
            </h2>

            <span
              class="text-3.25 text-slate-500"
            >
              共 {{ courseNodes.length }} 条目录
            </span>
          </div>

          <van-empty
            v-if="!courseNodes.length"
            image="search"
            description="暂无章节和小节"
            class="rounded-2xl bg-white"
          />

          <template
            v-else
          >
            <van-collapse
              v-if="chapterRecords.length"
              v-model="activeNames"
              class="flex flex-col gap-3 bg-transparent"
              :border="false"
            >
              <van-collapse-item
                v-for="(chapter, index) in chapterRecords"
                :key="chapter.id"
                :name="chapter.id"
                class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgb(15_23_42/5%)]"
                :border="false"
              >
                <template
                  #title
                >
                  <div
                    class="min-w-0 flex flex-1 items-center gap-3"
                  >
                    <div
                      class="h-9 w-9 flex shrink-0 items-center justify-center rounded-xl bg-teal-600 text-3.5 text-white font-700"
                    >
                      {{ index + 1 }}
                    </div>

                    <div
                      class="min-w-0 flex-1"
                    >
                      <div
                        class="truncate text-3.75 text-slate-900 font-700"
                      >
                        {{ chapter.name || '未命名章节' }}
                      </div>

                      <div
                        class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                      >
                        <span>{{ getChapterSections(chapter).length }} 个小节</span>

                        <span
                          class="h-1 w-1 rounded-full bg-slate-300"
                        />

                        <span>{{ chapter.isVisible === 1 ? '学员可见' : '暂不展示' }}</span>
                      </div>
                    </div>
                  </div>
                </template>

                <p
                  v-if="chapter.description"
                  class="mt-0 mb-3 wrap-break-word rounded-xl bg-slate-50 px-3 py-3 text-3.25 leading-5.5 text-slate-500"
                >
                  {{ chapter.description }}
                </p>

                <div
                  v-for="section in getChapterSections(chapter)"
                  :key="section.id"
                  class="mb-2 rounded-xl bg-slate-50 px-3 py-3 last:mb-0 active:bg-slate-100"
                >
                  <div
                    class="flex items-center gap-3"
                  >
                    <div
                      class="h-8 w-8 flex shrink-0 items-center justify-center rounded-lg text-white"
                      :style="{ backgroundColor: getSectionTypeConfig(section.sectionType).sectionIconBgColor }"
                    >
                      <ArtSvgIcon
                        :icon="getSectionTypeConfig(section.sectionType).sectionIcon"
                        class="text-4.5"
                      />
                    </div>

                    <div
                      class="min-w-0 flex-1"
                    >
                      <div
                        class="truncate text-3.5 text-slate-800 font-600"
                      >
                        {{ section.name || '未命名小节' }}
                      </div>

                      <div
                        class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                      >
                        <span>{{ getSectionTypeConfig(section.sectionType).sectionTypeName }}</span>

                        <span
                          v-if="section.participantCount > 0"
                        >
                          {{ section.participantCount }} 人参与
                        </span>
                      </div>
                    </div>

                    <van-icon
                      name="arrow"
                      class="shrink-0 text-slate-400"
                    />
                  </div>

                  <p
                    v-if="section.description"
                    class="mb-0 mt-2 wrap-break-word text-3 leading-5 text-slate-500"
                  >
                    {{ section.description }}
                  </p>
                </div>

                <div
                  v-if="!getChapterSections(chapter).length"
                  class="rounded-xl bg-slate-50 py-4 text-center text-3.25 text-slate-500"
                >
                  暂无小节
                </div>
              </van-collapse-item>
            </van-collapse>

            <div
              v-if="independentSectionRecords.length"
              class="mt-3 flex flex-col gap-3"
            >
              <div
                v-for="section in independentSectionRecords"
                :key="section.id"
                class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_20px_rgb(15_23_42/5%)] active:bg-slate-50"
              >
                <div
                  class="flex items-center gap-3"
                >
                  <div
                    class="h-9 w-9 flex shrink-0 items-center justify-center rounded-xl text-white"
                    :style="{ backgroundColor: getSectionTypeConfig(section.sectionType).sectionIconBgColor }"
                  >
                    <ArtSvgIcon
                      :icon="getSectionTypeConfig(section.sectionType).sectionIcon"
                      class="text-5"
                    />
                  </div>

                  <div
                    class="min-w-0 flex-1"
                  >
                    <div
                      class="truncate text-3.75 text-slate-900 font-700"
                    >
                      {{ section.name || '未命名小节' }}
                    </div>

                    <div
                      class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                    >
                      <span>独立小节</span>

                      <span
                        class="h-1 w-1 rounded-full bg-slate-300"
                      />

                      <span>{{ getSectionTypeConfig(section.sectionType).sectionTypeName }}</span>
                    </div>
                  </div>

                  <van-icon
                    name="arrow"
                    class="shrink-0 text-slate-400"
                  />
                </div>

                <p
                  v-if="section.description"
                  class="mb-0 mt-2 wrap-break-word text-3 leading-5 text-slate-500"
                >
                  {{ section.description }}
                </p>
              </div>
            </div>
          </template>
        </section>
      </div>
    </van-pull-refresh>
  </ClientLayout>
</template>

<style lang="scss" scoped></style>

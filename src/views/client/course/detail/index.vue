<script lang="ts" setup>
import type { SectionTypeConfig } from '@/config/course'

import { getClientSectionRoute, getSectionTypeConfig } from '@/config/course'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

const DEFAULT_NAV_TITLE = '课程详情'

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

/** 当前展开的章节。 */
const activeNames = ref<number[]>([])

/**
 * 当前课程 ID
 */
const couId = computed(() => Number(route.params.couId || 0))

const courseProgress = ref<ClientApi.Course.CourseProgressResponse>({
  completedChapters: 0,
  courseId: 0,
  courseName: '',
  isCompleted: false,
  overallProgress: 0,
  totalChapters: 0,
  totalStudyTime: 0,
  currentChapter: {
    isCompleted: false,
    learningProgressSpecific: 0,
    olId: 0,
    olLevel: 0,
    olName: '',
    olPID: 0,
    olType: 0,
    progress: 0,
    status: 0,
    totalLearningTime: 0,
    videoProgress: 0,
    videoTime: 0,
  },
  chapters: [],
})

/**
 * 课程学习记录。
 */
const courseRecords = computed(() => courseProgress.value.chapters || [])

/** 章节记录。 */
const chapterRecords = computed(() => courseRecords.value.filter(record => record.olType === 1))

/** 不属于任何章节的小节记录。 */
const independentSectionRecords = computed(() => courseRecords.value.filter((record) => {
  return record.olType === 2
}))

/**
 * 课程章节数量。
 */
const chapterCount = computed(() => courseProgress.value.totalChapters)

/**
 * 是否暂无课程目录。
 */
const isEmpty = computed(() => courseRecords.value.length === 0)

/**
 *  获取课程章节列表
 */
async function getClientCourseProgress(showSuccessToast = false) {
  loading.value = true

  try {
    courseProgress.value = await fetchClientGetCourseProgress(couId.value)

    setNavTitle(courseProgress.value.courseName)

    if (showSuccessToast) {
      window.$toast('刷新成功')
    }
  }

  finally {
    loading.value = false
  }
}

/**
 * 将学习时长格式化为易读文本。
 */
function formatStudyTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds} 秒`
  }

  const minutes = Math.floor(seconds / 60)

  const remainingSeconds = seconds % 60

  return remainingSeconds ? `${minutes} 分 ${remainingSeconds} 秒` : `${minutes} 分`
}

/**
 * 获取学习状态文本。
 */
function getLearningStatus(status: number) {
  return ['未开始', '学习中', '已完成', '已跳过'][status] || '未开始'
}

/** 获取指定章节下的小节。 */
function getChapterSections(chapter: ClientApi.Course.ChaptersItem) {
  return chapter.children || []
}

/** 获取小节附件类型对应的图标配置。 */
function getSectionType(section: ClientApi.Course.ChaptersItem): SectionTypeConfig {
  return getSectionTypeConfig(section.olIsAccessory)
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
  getClientCourseProgress(true)
}

onBeforeUnmount(() => {
  clearClientNavTitle()
})

onMounted(() => {
  getClientCourseProgress()
})

/**
 * 点击课程小节。
 *
 * 当前客户端暂未配置小节学习详情路由，先给用户一个轻提示。
 *
 * @param section 小节数据。
 */
function handleSection(section: ClientApi.Course.ChaptersItem) {
  console.log('🚀 ~ file: index.vue:160 ~ section:', section)
  console.log('🚀 ~ file: index.vue:194 ~ section.progress:', section.progress)

  if (section.olIsAccessory === 0) {
    router.push({
      name: 'ClientCourseSectionDocument',
      params: {
        couId: couId.value,
        olId: section.olId,
      },
    })
  }
  else if (section.olIsAccessory === 1) {
    router.push({
      name: 'ClientCourseSectionVideo',
      params: {
        couId: couId.value,
        olId: section.olId,
      },
    })
  }
  else if (section.olIsAccessory === 2) {
    // 'ClientCourseSectionExamAnswer
    router.push({
      name: section.progress === 100 ? 'ClientCourseSectionExamResult' : 'ClientCourseSectionExamAnswer',
      params: {
        couId: couId.value,
        olId: section.olId,
      },
    })
  }
  else if (section.olIsAccessory === 3) {
    router.push({
      name: section.progress === 100 ? 'ClientCourseSectionQuestionResult' : 'ClientCourseSectionQuestionAnswer',
      params: {
        couId: couId.value,
        olId: section.olId,
        questionId: section.examId || undefined,
      },
    })
  }

  // // ClientCourseSection
  // const targetRoute = router.resolve({
  //   name: getClientSectionRoute(section.olIsAccessory),
  //   params: {
  //     couId: couId.value,
  //     olId: section.olId,
  //   },
  // })

  // console.log('🚀 ~ file: index.vue:170 ~ targetRoute:', targetRoute)

  // router.push(targetRoute)
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
            我的课程
          </div>

          <h1
            class="m-0 wrap-break-word text-6 font-700 leading-1.3"
          >
            {{ courseProgress.courseName || DEFAULT_NAV_TITLE }}
          </h1>

          <div
            class="mt-5 flex items-center gap-5 text-3.5 text-white/90"
          >
            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="orders-o"
              size="16"
            />{{ courseProgress.completedChapters }}/{{ chapterCount }} 个章节</span>

            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="clock-o"
              size="16"
            />{{ formatStudyTime(courseProgress.totalStudyTime) }}</span>
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
            课程进度
          </span>

          <span
            class="text-teal-700 font-700"
          >
            {{ courseProgress.overallProgress }}%
          </span>
        </div>

        <van-progress
          class="mt-3"
          :percentage="courseProgress.overallProgress"
          stroke-width="8"
          color="#0f766e"
          track-color="#ccfbf1"
          :show-pivot="false"
        />

        <div
          v-if="courseProgress.currentChapter.olName"
          class="mt-3 flex items-center gap-2 text-3.25 text-slate-500"
        >
          <van-icon
            name="play-circle-o"
          />
          当前学习：{{ courseProgress.currentChapter.olName }}
        </div>
      </div>

      <div>
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
            共 {{ courseRecords.length }} 条学习记录
          </span>
        </div>

        <van-empty
          v-if="isEmpty"
          image="search"
          description="暂无学习记录"
          class="rounded-2xl bg-white"
        />

        <template
          v-else
        >
          <van-collapse
            v-if="chapterRecords.length"
            v-model="activeNames"
            class="course-collapse flex flex-col gap-3 bg-transparent"
            :border="false"
          >
            <van-collapse-item
              v-for="(chapter, index) in chapterRecords"
              :key="chapter.olId"
              :name="chapter.olId"
              class="chapter-item overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgb(15_23_42/5%)]"
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
                      {{ chapter.olName }}
                    </div>

                    <div
                      class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                    >
                      <span>{{ getChapterSections(chapter).length }} 个小节</span>

                      <span>{{ getLearningStatus(chapter.status) }}</span>
                    </div>
                  </div>

                  <span
                    class="shrink-0 text-3.25 text-teal-700 font-700"
                  >{{ chapter.progress }}%</span>
                </div>
              </template>

              <div
                class="mb-3"
              >
                <van-progress
                  :percentage="chapter.progress"
                  stroke-width="5"
                  :color="chapter.isCompleted ? '#16a34a' : '#0f766e'"
                  :show-pivot="false"
                />
              </div>

              <div
                v-for="section in getChapterSections(chapter)"
                :key="section.olId"
                class="mb-2 rounded-xl bg-slate-50 px-3 py-3 last:mb-0 active:bg-slate-100"
                @click="handleSection(section)"
              >
                <div
                  class="flex items-center gap-3"
                >
                  <div
                    class="h-8 w-8 flex shrink-0 items-center justify-center rounded-lg text-white"
                    :style="{ backgroundColor: getSectionType(section).sectionIconBgColor }"
                  >
                    <ArtSvgIcon
                      :icon="getSectionType(section).sectionIcon"
                      class="text-4.5"
                    />
                  </div>

                  <div
                    class="min-w-0 flex-1"
                  >
                    <div
                      class="truncate text-3.5 text-slate-800 font-600"
                    >
                      {{ section.olName }}
                    </div>

                    <div
                      class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                    >
                      <span>{{ getLearningStatus(section.status) }}</span>

                      <!-- <span>{{ formatStudyTime(section.totalLearningTime) }}</span> -->
                    </div>
                  </div>

                  <span
                    class="shrink-0 text-3.25 text-teal-700 font-700"
                  >{{ section.progress }}%</span>
                </div>

                <van-progress
                  class="mt-2"
                  :percentage="section.progress"
                  stroke-width="4"
                  :color="section.isCompleted ? '#16a34a' : '#0f766e'"
                  :show-pivot="false"
                />
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
              :key="section.olId"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_20px_rgb(15_23_42/5%)] active:bg-slate-50"
              @click="handleSection(section)"
            >
              <div
                class="flex items-center gap-3"
              >
                <div
                  class="h-9 w-9 flex shrink-0 items-center justify-center rounded-xl text-white"
                  :style="{ backgroundColor: getSectionType(section).sectionIconBgColor }"
                >
                  <ArtSvgIcon
                    :icon="getSectionType(section).sectionIcon"
                    class="text-5"
                  />
                </div>

                <div
                  class="min-w-0 flex-1"
                >
                  <div
                    class="truncate text-3.75 text-slate-900 font-700"
                  >
                    {{ section.olName }}
                  </div>

                  <div
                    class="mt-1 flex items-center gap-2 text-3 text-slate-500"
                  >
                    <span>{{ getLearningStatus(section.status) }}</span>

                    <!-- <span>{{ formatStudyTime(section.totalLearningTime) }}</span> -->
                  </div>
                </div>

                <span
                  class="shrink-0 text-3.25 text-teal-700 font-700"
                >{{ section.progress }}%</span>
              </div>

              <van-progress
                class="mt-3"
                :percentage="section.progress"
                stroke-width="5"
                :color="section.isCompleted ? '#16a34a' : '#0f766e'"
                :show-pivot="false"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.course-collapse {
  :deep(.van-collapse-item::after) {
    display: none;
  }

  :deep(.van-cell) {
    min-height: 68px;
    padding: 12px 14px;
  }

  :deep(.van-collapse-item__content) {
    padding: 0 14px 14px;
    background: #fff;
  }
}
</style>

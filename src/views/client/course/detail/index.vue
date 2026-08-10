<script lang="ts" setup>
import { getClientSectionRoute, getSectionTypeConfig } from '@/config/course'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import CourseSectionItem from './components/CourseSectionItem.vue'

const DEFAULT_NAV_TITLE = '课程详情'

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

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
 * 课程目录节点。
 */
const courseNodes = computed(() => courseProgress.value.nodes || [])

/**
 * 章节节点。
 */
const chapterNodes = computed(() => courseNodes.value.filter(isChapterNode))

/**
 * 未归属章节的独立小节。
 */
const independentSectionNodes = computed(() => courseNodes.value.filter(isSectionNode))

/**
 * 课程章节数量。
 */
const chapterCount = computed(() => courseProgress.value.couChapterCount || chapterNodes.value.length)

/**
 * 课程小节数量。
 */
const sectionCount = computed(() => {
  if (courseProgress.value.couSectionCount) {
    return courseProgress.value.couSectionCount
  }

  const chapterSectionCount = chapterNodes.value.reduce((total, chapter) => {
    return total + getChapterSectionCount(chapter)
  }, 0)

  return chapterSectionCount + independentSectionNodes.value.length
})

/**
 * 是否暂无课程目录。
 */
const isEmpty = computed(() => courseNodes.value.length === 0)

/**
 *  获取课程章节列表
 */
async function getClientCourseOutlineList(showSuccessToast = false) {
  loading.value = true

  try {
    courseProgress.value = await fetchClientGetCourseProgress(couId.value)
    console.log('🚀 ~ file: index.vue:83 ~ courseProgress.value:', courseProgress.value)

    setNavTitle(courseProgress.value?.couName)

    if (showSuccessToast) {
      window.$toast('刷新成功')
    }
  }

  finally {
    loading.value = false
  }
}

/**
 * 判断目录节点是否是章节。
 *
 * @param node 课程目录节点。
 * @returns 是否是章节节点。
 */
function isChapterNode(
  node: AdminApi.Course.CourseOutlineListNodesItem,
): node is AdminApi.Course.Chapter {
  return node.itemType === 'chapter'
}

/**
 * 判断目录节点是否是独立小节。
 *
 * @param node 课程目录节点。
 * @returns 是否是小节节点。
 */
function isSectionNode(
  node: AdminApi.Course.CourseOutlineListNodesItem,
): node is AdminApi.Course.Section {
  return node.itemType === 'section'
}

/**
 * 获取章节下小节数量。
 *
 * @param chapter 章节节点。
 * @returns 章节下的小节数量。
 */
function getChapterSectionCount(chapter: AdminApi.Course.Chapter) {
  return chapter.sectionList?.length || 0
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
  getClientCourseOutlineList(true)
}

/**
 * 点击课程小节。
 *
 * 当前客户端暂未配置小节学习详情路由，先给用户一个轻提示。
 *
 * @param section 小节数据。
 */
function handleSection(section: AdminApi.Course.Section) {
  // ClientCourseSection
  const targetRoute = router.resolve({
    name: getClientSectionRoute(section.sectionType),
    params: {
      couId: couId.value,
      olId: section.id,
    },
  })

  router.push(targetRoute)
}

onBeforeUnmount(() => {
  clearClientNavTitle()
})

onMounted(() => {
  getClientCourseOutlineList()
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
            {{ courseProgress.couName || DEFAULT_NAV_TITLE }}
          </h1>

          <p
            v-if="courseProgress.couIntro"
            class="mt-3 mb-0 line-clamp-2 text-3.5 leading-1.65 text-white/85"
          >
            {{ courseProgress.couIntro }}
          </p>

          <div
            class="mt-5 flex items-center gap-5 text-3.5 text-white/90"
          >
            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="orders-o"
              size="16"
            />{{ chapterCount }} 个章节</span>

            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="notes-o"
              size="16"
            />{{ sectionCount }} 个小节</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-teal-100 bg-linear-to-r from-teal-50 to-white px-4 py-4 shadow-[0_8px_20px_rgb(15_23_42/4%)]"
      >
        <div
          class="mb-2 flex items-center gap-2 text-3.75 text-slate-800 font-700"
        >
          <van-icon
            name="description-o"
            color="#0f766e"
            size="17"
          />
          课程简介
        </div>

        <p
          class="m-0 wrap-break-word text-3.5 leading-1.7 text-slate-600"
        >
          {{ courseProgress.couContent || courseProgress.couIntro || '暂无课程简介，先从下方目录开始学习吧。' }}
        </p>
      </div>

      <div>
        <div
          class="mb-3 flex items-center justify-between"
        >
          <h2
            class="m-0 text-5 text-slate-900 font-700"
          >
            课程目录
          </h2>

          <span
            class="text-3.25 text-slate-500"
          >
            共 {{ sectionCount }} 个小节
          </span>
        </div>

        <van-empty
          v-if="isEmpty"
          image="search"
          description="暂无课程目录"
          class="rounded-2xl bg-white"
        />

        <template
          v-else
        >
          <van-collapse
            v-if="chapterNodes.length"
            v-model="activeNames"
            class="course-collapse flex flex-col gap-3 bg-transparent"
            :border="false"
          >
            <van-collapse-item
              v-for="(chapter, index) in chapterNodes"
              :key="chapter.id"
              :name="chapter.id"
              class="chapter-item overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgb(15_23_42/5%)]"
            >
              <template
                #title
              >
                <div
                  class="min-w-0 flex flex-1 items-center gap-3"
                >
                  <div
                    class="h-10 w-10 flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-600 to-cyan-500 text-4 text-white font-700 shadow-[0_6px_14px_rgb(13_148_136/20%)]"
                  >
                    {{ index + 1 }}
                  </div>

                  <div
                    class="min-w-0 flex-1"
                  >
                    <div
                      class="truncate text-4 text-slate-900 font-700"
                    >
                      {{ chapter.name }}
                    </div>

                    <div
                      class="mt-1 text-3.25 text-slate-500"
                    >
                      {{ getChapterSectionCount(chapter) }} 个小节
                    </div>
                  </div>
                </div>
              </template>

              <div
                v-if="chapter.description"
                class="mb-3 rounded-xl bg-slate-50 px-3 py-2.5 text-3.25 leading-1.6 text-slate-500"
              >
                {{ chapter.description }}
              </div>

              <template
                v-if="getChapterSectionCount(chapter)"
              >
                <div
                  v-for="section in chapter.sectionList"
                  :key="section.id"
                  class="mb-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 last:mb-0 active:bg-slate-100"
                  @click="handleSection(section)"
                >
                  <CourseSectionItem
                    :section="section"
                    inner
                    :type-config="getSectionTypeConfig(section.sectionType)"
                  />
                </div>
              </template>

              <template
                v-else
              >
                <div
                  class="rounded-xl bg-slate-50 py-5 text-center text-3.25 text-slate-500"
                >
                  暂无小节
                </div>
              </template>
            </van-collapse-item>
          </van-collapse>

          <div
            v-if="independentSectionNodes.length"
            class="mt-3 flex flex-col gap-3"
          >
            <div
              v-for="section in independentSectionNodes"
              :key="section.id"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-[0_8px_20px_rgb(15_23_42/5%)] active:bg-slate-50"
              @click="handleSection(section)"
            >
              <CourseSectionItem
                :section="section"
                :type-config="getSectionTypeConfig(section.sectionType)"
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
    min-height: 72px;
    padding: 12px 14px;
  }

  :deep(.van-collapse-item__content) {
    padding: 0 14px 14px;
    background: #fff;
  }
}
</style>

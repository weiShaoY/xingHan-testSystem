<script lang="ts" setup>
import type { SectionType } from '@/config/course'

import {
  getSectionCreateRoute,
  getSectionCreateRouteTitle,
  getSectionEditRoute,
  getSectionEditRouteTitle,
  getSectionTypeConfig,
} from '@/config/course'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

import CourseSectionItem from './components/CourseSectionItem.vue'

const DEFAULT_NAV_TITLE = '项目阶段列表'

const route = useRoute()

const router = useRouter()

const { setClientNavTitle, clearClientNavTitle } = useClientNavTitle()

const loading = ref(false)

/**
 * 当前课程 ID
 */
const couId = computed(() => Number(route.params.couId || 0))

const courseOutlineList = ref<ClientApi.Course.CourseOutlineListResponse>({
  couChapterCount: 0,
  couContent: '',
  couId: 0,
  couIntro: '',
  couName: '',
  couSectionCount: 0,
  nodes: [],
})

/**
 *  获取课程章节列表
 */
async function getClientCourseOutlineList(showSuccessToast = false) {
  loading.value = true

  try {
    courseOutlineList.value = await fetchClientCourseOutlineList(couId.value)
    console.log('🚀 ~ file: index.vue:48 ~ courseOutlineList.value:', courseOutlineList.value)

    setNavTitle(courseOutlineList.value?.couName)

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
  getClientCourseOutlineList(true)
}

onBeforeUnmount(() => {
  clearClientNavTitle()
})

onMounted(() => {
  getClientCourseOutlineList()
})

// eslint-disable-next-line unused-imports/no-unused-vars
function handleGoCourseDetail(couId: number) {
  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId,
    },
  })
}

const activeNames = ref([])

function handleSection(section: AdminApi.Course.Section) {
  console.log('🚀 ~ file: index.vue:101 ~ section:', section)
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
          <h1
            class="m-0 wrap-break-word text-6 font-700 leading-1.3"
          >
            {{ courseOutlineList?.couName }}
          </h1>

          <div
            class="mt-5 flex items-center gap-5 text-3.5 text-white/90"
          >
            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="orders-o"
              size="16"
            />{{ 0 }} 个章节</span>

            <span
              class="inline-flex items-center gap-1.5"
            ><van-icon
              name="notes-o"
              size="16"
            />{{ 0 }} 个小节</span>
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
          >
            <van-icon
              name="chart-trending-o"
              color="#0f766e"
              size="17"
            />
            学习进度
          </span>

          <span
            class="font-700 text-teal-700"
          >{{ 199 }}%</span>
        </div>

        <van-progress
          :percentage="0"
          stroke-width="7"
          color="linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)"
          track-color="#dbeafe"
          :show-pivot="false"
        />
      </div>

      <!-- 底部  -->
      <div>

        <div
          class="mb-3 flex items-center justify-between"
        >
          <h2
            class="m-0 text-5 text-slate-900 font-700"
          >
            全部小节
          </h2>

          <span
            class="text-3.25 text-slate-500"
          >
            (5)
          </span>
        </div>

        <div>
          <div
            v-for="item in courseOutlineList.nodes"
            :key="item.id"
          >
            <!-- 章节 -->
            <van-collapse
              v-if="item.itemType === 'chapter'"
              v-model="activeNames"
            >
              <van-collapse-item
                :key="item.id"
                :name="item.id"
                :title="`${item.name}  ( ${item.sectionList.length} 个小节 )`"
              >
                <template
                  #title
                >
                  <div
                    class="flex items-center gap-5"
                  >
                    <div
                      class=""
                    >
                      {{ item.name }}
                    </div>

                    <van-tag
                      :type="item.sectionList.length > 0 ? 'primary' : 'warning'"
                    >
                      {{ item.sectionList.length }} 个小节
                    </van-tag>
                  </div>
                </template>

                <van-cell-group
                  v-if="item.sectionList.length"
                  inset
                >
                  <van-cell
                    v-for="section in item.sectionList"
                    :key="section.id"
                    @click="handleSection(section)"
                  >
                    <CourseSectionItem
                      :section="section"
                      inner
                      :type-config="getSectionTypeConfig(section.sectionType)"
                    />
                  </van-cell>

                </van-cell-group>

                <div
                  v-else
                  class="text-center py-5"
                >
                  暂无内容
                </div>
              </van-collapse-item>
            </van-collapse>

            <!-- 独立小节 -->
            <van-cell
              v-else-if="item.itemType === 'section'"

              @click="handleSection(item)"
            >
              <CourseSectionItem
                :section="item"
                inner
                :type-config="getSectionTypeConfig(item.sectionType)"
              />
            </van-cell>

          </div>
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>

</style>

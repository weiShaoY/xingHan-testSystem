<!------  2026-06-29---16:20---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import cover6 from '@imgs/cover/img6.webp'

import ClientLayout from '@/views/client/layout/index.vue'

import { getSectionTypeConfig } from '@/config/course'

const route = useRoute()

/**
 * 加载状态
 */
const loading = ref(false)

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

const estimatedMinutes = computed(() => {
  return courseOutlineList.value.couSectionCount * 5
})

const directSectionCount = computed(() => {
  return courseNodes.value.filter(item => item.itemType === 'section').length
})

const visibleChapterCount = computed(() => {
  return courseNodes.value.filter(item => item.itemType === 'chapter' && item.isVisible === 1).length
})

const courseIntro = computed(() => {
  return courseOutlineList.value.couIntro
    || courseOutlineList.value.couContent
    || '暂无课程介绍，学员可以从下方课程目录开始了解学习安排。'
})

/**
 * 获取课程章节列表
 */
async function getCourseOutlineList() {
  loading.value = true

  try {
    courseOutlineList.value = await fetchAdminCourseOutlineList(couId.value)
  }
  catch {
    ElNotification.error('课程预览获取失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void getCourseOutlineList()
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
            :alt="courseOutlineList.couName || '课程预览'"
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
              {{ courseOutlineList.couName || '未命名课程' }}
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
                {{ courseOutlineList.couChapterCount }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                章节
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#11bbd2]/10 px-3 py-3 text-[#0a91a4]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ courseOutlineList.couSectionCount }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                小节
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#febd2d]/14 px-3 py-3 text-[#b47900]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ directSectionCount }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                直属小节
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-[#f7979f]/14 px-3 py-3 text-[#c74f5d]"
            >
              <p
                class="m-0 text-xl font-semibold leading-6"
              >
                {{ estimatedMinutes }}
              </p>

              <p
                class="mt-1 mb-0 text-xs text-g-600"
              >
                预计分钟
              </p>
            </div>
          </div>

          <div
            class="mt-4 flex flex-wrap gap-2"
          >
            <el-tag
              type="primary"
              size="small"
            >
              {{ visibleChapterCount }} 个可见章节
            </el-tag>

            <el-tag
              type="success"
              size="small"
            >
              {{ courseOutlineList.couSectionCount }} 个学习小节
            </el-tag>

            <el-tag
              type="info"
              size="small"
            >
              课程预览
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
                课程介绍
              </h2>
            </div>

            <p
              class="m-0 line-clamp-3 text-sm leading-7 text-g-600"
            >
              {{ courseIntro }}
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
              课程目录
            </h2>

            <p
              class="mt-1 mb-0 text-sm leading-5 text-g-600"
            >
              {{ courseOutlineList.couChapterCount }} 个章节 · {{ courseOutlineList.couSectionCount }} 个小节
            </p>
          </div>

          <div
            class="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-600 text-primary"
          >
            学习内容
          </div>
        </div>

        <template
          v-if="courseNodes.length"
        >
          <div
            v-for="(item, nodeIndex) in courseNodes"
            :key="`${item.itemType}-${item.id}`"
            class="mb-5 overflow-hidden art-card p-0 last:mb-0"
          >
            <template
              v-if="item.itemType === 'chapter'"
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
                        第 {{ nodeIndex + 1 }} 章
                      </span>

                      <el-tag
                        :type="item.isVisible === 1 ? 'success' : 'info'"
                        size="small"
                      >
                        {{ item.isVisible === 1 ? '学员可见' : '暂不展示' }}
                      </el-tag>
                    </div>

                    <h2
                      class="m-0 line-clamp-2 text-lg font-semibold leading-7 text-g-900 max-sm:text-base"
                    >
                      {{ item.name || '未命名章节' }}
                    </h2>
                  </div>

                  <div
                    class="flex min-w-18 shrink-0 items-center justify-center gap-1 rounded-custom-sm bg-g-100 px-3 py-2 text-center"
                  >
                    <div
                      class="text-lg font-semibold leading-5 text-g-900"
                    >
                      {{ item.sectionList.length }}
                    </div>

                    <div
                      class="text-xs leading-4 text-g-500"
                    >
                      个小节
                    </div>
                  </div>
                </div>

                <p
                  class="mt-3 mb-0 line-clamp-2 text-sm leading-6 text-g-600"
                >
                  {{ item.description || '暂无章节说明' }}
                </p>
              </div>

              <div
                v-if="item.sectionList.length"
                class="mt-4 flex flex-col"
              >
                <button
                  v-for="(section, sectionIndex) in item.sectionList"
                  :key="section.id"
                  type="button"
                  class="group grid grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-3 border-0 border-t border-solid border-(--el-border-color-lighter) bg-transparent px-5 py-4 text-left transition cursor-pointer hover:bg-primary/5 active:opacity-80 max-sm:px-4"
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-custom-sm text-white transition group-hover:scale-105"
                    :style="{ backgroundColor: getSectionTypeConfig(section.sectionType).sectionIconBgColor }"
                  >
                    <ArtSvgIcon
                      :icon="getSectionTypeConfig(section.sectionType).sectionIcon"
                      class="text-[20px]"
                    />
                  </div>

                  <div
                    class="min-w-0"
                  >
                    <div
                      class="mb-1 flex items-center gap-2 text-xs text-g-500"
                    >
                      <span>小节 {{ sectionIndex + 1 }}</span>

                      <span
                        class="h-1 w-1 rounded-full bg-g-300"
                      />

                      <span>{{ getSectionTypeConfig(section.sectionType).sectionTypeName }}</span>
                    </div>

                    <h3
                      class="m-0 line-clamp-2 text-sm font-semibold leading-5 text-g-900 group-hover:text-primary"
                    >
                      {{ section.name || '未命名小节' }}
                    </h3>

                    <p
                      class="mt-1.5 mb-0 line-clamp-2 text-xs leading-5 text-g-500"
                    >
                      {{ section.description || '暂无小节说明' }}
                    </p>

                    <div
                      class="mt-2 flex items-center gap-2 text-xs text-g-500"
                    >
                      <ArtSvgIcon
                        icon="ri:user-line"
                        class="text-[15px] text-primary"
                      />
                      {{ section.participantCount || 0 }} 人学习
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
                暂未配置小节
              </div>
            </template>

            <button
              v-else
              type="button"
              class="group grid w-full grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-3 border-0 bg-transparent px-5 py-4 text-left transition cursor-pointer hover:bg-primary/5 active:opacity-80 max-sm:px-4"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-custom-sm text-white transition group-hover:scale-105"
                :style="{ backgroundColor: getSectionTypeConfig(item.sectionType).sectionIconBgColor }"
              >
                <ArtSvgIcon
                  :icon="getSectionTypeConfig(item.sectionType).sectionIcon"
                  class="text-[20px]"
                />
              </div>

              <div
                class="min-w-0"
              >
                <div
                  class="mb-1 flex items-center gap-2 text-xs text-g-500"
                >
                  <span>独立小节</span>

                  <span
                    class="h-1 w-1 rounded-full bg-g-300"
                  />

                  <span>{{ getSectionTypeConfig(item.sectionType).sectionTypeName }}</span>
                </div>

                <h3
                  class="m-0 line-clamp-2 text-sm font-semibold leading-5 text-g-900 group-hover:text-primary"
                >
                  {{ item.name || '未命名小节' }}
                </h3>

                <p
                  class="mt-1.5 mb-0 line-clamp-2 text-xs leading-5 text-g-500"
                >
                  {{ item.description || '暂无小节说明' }}
                </p>

                <div
                  class="mt-2 flex items-center gap-2 text-xs text-g-500"
                >
                  <ArtSvgIcon
                    icon="ri:user-line"
                    class="text-[15px] text-primary"
                  />
                  {{ item.participantCount || 0 }} 人学习
                </div>
              </div>

              <ArtSvgIcon
                icon="ri:arrow-right-s-line"
                class="text-[22px] text-g-400 transition group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          </div>
        </template>

        <el-empty
          v-else
          class="mt-10"
          description="暂无章节和小节"
        />
      </section>
    </div>
  </ClientLayout>
</template>

<style lang="scss" scoped></style>

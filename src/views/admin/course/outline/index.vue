<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程大纲列表  ------------------------------------------------->
<script lang="ts" setup>
import type { SectionType } from '@/config/course'

import { computed, ref } from 'vue'

import AminAssignUserDialog from '@/components/admin/admin-assign-user-dialog/index.vue'

import {
  getAdminSectionCreateRoute,
  getAdminSectionCreateRouteTitle,
  getAdminSectionEditRoute,
  getAdminSectionEditRouteTitle,
  getSectionTypeConfig,
} from '@/config/course'

import CourseChapterDialog from './components/CourseChapterDialog.vue'

import CourseSectionItem from './components/CourseSectionItem.vue'

import SectionTypeDialog from './components/SectionTypeDialog.vue'

const route = useRoute()

const router = useRouter()

/**
 * 工作标签页 Store，用于更新动态页面标签标题。
 */
const workTabStore = useWorkTabStore()

/**
 * 加载状态
 */
const loading = ref(false)

const courseOutlineList = ref<AdminApi.Course.CourseOutlineListResponse>(
  {
    couId: 0,
    couName: '',
    couContent: '',
    couIntro: '',
    couChapterCount: 0,
    couSectionCount: 0,
    nodes: [],
  },
)

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 是否显示章节新增或者编辑弹窗
 */
const isShowChapterFormDialog = ref(false)

/**
 * 是否显示新建小节弹窗
 */
const isShowCreateSectionDialog = ref(false)

/**
 * 章节弹窗模式
 */
const chapterFormMode = ref<'add' | 'edit'>('add')

/**
 * 当前编辑的章节ID
 */
const currentEditChapterId = ref<number>()

/**
 * 当前要添加小节的章节
 */
const currentCreateSectionChapter = ref<AdminApi.Course.Chapter>()

const courseNodes = computed(() => courseOutlineList.value.nodes || [])

/**
 * 获取课程章节列表
 */
async function getCourseOutlineList() {
  loading.value = false
  try {
    courseOutlineList.value = await fetchAdminCourseOutlineList(couId.value)
  }
  finally {
    loading.value = false
  }
}

getCourseOutlineList()

/**
 * 跳转到课程编辑页
 */
function goToCourseEdit() {
  router.push({
    name: 'AdminCourseSetting',
    params: {
      couId: couId.value,
    },
  })
}

/**
 * 新增章节
 */
function addChapter() {
  currentEditChapterId.value = undefined
  chapterFormMode.value = 'add'
  isShowChapterFormDialog.value = true
}

/**
 * 删除章节
 */
async function deleteChapter(chapter: AdminApi.Course.Chapter) {
  loading.value = false
  await fetchAdminCourseOutlineChapterDelete(chapter.id)
  try {
    await getCourseOutlineList()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 编辑章节
 */
function editChapter(chapter: AdminApi.Course.Chapter) {
  currentEditChapterId.value = chapter.id
  chapterFormMode.value = 'edit'
  isShowChapterFormDialog.value = true
}

/**
 * 新增小节
 */
function addSection(chapter?: AdminApi.Course.Chapter) {
  currentCreateSectionChapter.value = chapter || undefined
  isShowCreateSectionDialog.value = true
}

/**
 * 删除小节
 */
async function deleteSection(section: AdminApi.Course.Section) {
  await fetchAdminCourseOutlineSectionDelete(section.id)
  try {
    await getCourseOutlineList()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
}

/**
 * 跳转到添加小节（根据类型）
 */
async function goToAddSection(sectionType: SectionType) {
  isShowCreateSectionDialog.value = false

  const targetRoute = router.resolve({
    name: getAdminSectionCreateRoute(sectionType),
    params: currentCreateSectionChapter.value
      ? {
          couId: couId.value,
          olPID: currentCreateSectionChapter.value.id,
        }
      : {
          couId: couId.value,
        },
  })

  await router.push(targetRoute)

  // 章节下的添加小节
  if (currentCreateSectionChapter.value) {
    workTabStore.updateTabTitle(targetRoute.path, `${courseOutlineList.value.couName}-${currentCreateSectionChapter.value?.name}-${getAdminSectionCreateRouteTitle(sectionType)}`)
  }

  // 独立小节
  else {
    workTabStore.updateTabTitle(targetRoute.path, `${courseOutlineList.value.couName}-${getAdminSectionCreateRouteTitle(sectionType)}`)
  }
}

/**
 * 跳转到编辑小节
 */
async function editSection({
  section,
  chapter,
}: {
  section: AdminApi.Course.Section
  chapter?: AdminApi.Course.Chapter
}) {
  const targetRoute = router.resolve({
    name: getAdminSectionEditRoute(section.sectionType),
    params: {
      couId: couId.value,
      olId: section.id,
    },
  })

  await router.push(targetRoute)

  // 章节下的小节
  if (chapter) {
    workTabStore.updateTabTitle(targetRoute.path, `${courseOutlineList.value.couName}-${chapter?.name}-${section.name}-${getAdminSectionEditRouteTitle(section.sectionType)}`)
  }

  // 独立小节
  else {
    workTabStore.updateTabTitle(targetRoute.path, `${courseOutlineList.value.couName}-${section.name}-${getAdminSectionEditRouteTitle(section.sectionType)}`)
  }
}

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <!-- 章节 新增或编辑 弹窗 -->
    <CourseChapterDialog
      v-if="isShowChapterFormDialog"
      v-model="isShowChapterFormDialog"
      :mode="chapterFormMode"
      :cou-id="couId"
      :ol-id="currentEditChapterId"
      @success="getCourseOutlineList"
    />

    <!-- 创建小节 类型选择弹窗 -->
    <SectionTypeDialog
      v-if="isShowCreateSectionDialog"
      v-model="isShowCreateSectionDialog"
      @select="goToAddSection"
    />

    <AdminPageHeader
      :title="` ${courseOutlineList.couName}`"
      :stats="[`
        章节数量: ${courseOutlineList.couChapterCount}
        小节数量: ${courseOutlineList.couSectionCount}`]"
    >
      <template
        #extra
      >
        <AminAssignUserDialog
          :id="couId"
          :name="courseOutlineList.couName"
          type="course"
        />

        <ArtButton
          type="edit"
          @click="goToCourseEdit()"
        />

        <ArtButton
          type="add"
          @click="addSection()"
        >
          添加小节
        </ArtButton>

        <ArtButton
          type="add"
          @click="addChapter"
        >
          添加章节
        </ArtButton>

      </template>
    </AdminPageHeader>

    <!-- 课程内容列表 -->
    <div
      v-if="courseNodes.length"
      v-loading="loading"
      class="flex flex-col gap-4"
    >
      <div
        v-for="item in courseNodes"
        :key="item.id"
      >
        <!-- 章节 -->
        <section
          v-if="item.itemType === 'chapter'"
          class="art-card flex flex-col gap-4"
        >
          <div
            class="flex items-start justify-between gap-4 max-md:flex-col"
          >
            <div
              class="min-w-0"
            >
              <div
                class="flex flex-wrap gap-3 items-center"
              >
                <div
                  class="truncate text-base font-semibold text-g-900"
                >
                  {{ item.name }}
                </div>

                <el-tag
                  type="info"
                  size="small"
                >
                  {{ item.sectionList.length }} 个小节
                </el-tag>
              </div>

              <div
                class="mt-2 text-sm text-g-600"
              >
                {{ item.description }}
              </div>
            </div>

            <div
              class="flex flex-wrap gap-2 items-center justify-end pr-5 max-md:w-full max-md:justify-start max-sm:pr-0"
              @click.stop
            >
              <ArtButton
                type="add"
                @click="addSection(item)"
              >
                添加小节
              </ArtButton>

              <ArtButton
                type="delete"
                @click="deleteChapter(item)"
              >
                删除章节
              </ArtButton>

              <ArtButton
                type="edit"
                @click="editChapter(item)"
              >
                编辑章节
              </ArtButton>
            </div>
          </div>

          <div
            v-if="item.sectionList.length"
            class="flex flex-col gap-3"
          >
            <!-- 章节里的小节 -->
            <CourseSectionItem
              v-for="section in item.sectionList"
              :key="section.id"
              inner
              :section="section"
              :type-config="getSectionTypeConfig(section.sectionType)"
              @delete="deleteSection"
              @edit="editSection({
                section,
                chapter: item,
              })"
            />
          </div>

          <div
            v-else
            class="rounded-custom-sm border-full-d"
          >
            <el-empty
              description="暂无小节"
              :image-size="30"
              class="py-2!"
            />
          </div>
        </section>

        <!-- 独立小节 -->
        <CourseSectionItem
          v-else-if="item.itemType === 'section'"
          :section="item"
          :type-config="getSectionTypeConfig(item.sectionType)"
          @delete="deleteSection"
          @edit="editSection({
            section: item,
          })"
        />
      </div>
    </div>

    <el-empty
      v-else
      description="暂无章节和小节"
      :image-size="30"
      class="py-2!"
    />
  </div>
</template>

<style lang="scss" scoped></style>

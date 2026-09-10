<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程大纲列表  ------------------------------------------------->
<script lang="ts" setup>
import type { MoveEvent } from 'vue-draggable-plus'

import type { SectionType } from '@/config/course'

import { computed, ref } from 'vue'

import { VueDraggable } from 'vue-draggable-plus'

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

const courseNodes = computed({
  get: () => courseOutlineList.value.nodes || [],
  set: (nodes) => {
    courseOutlineList.value.nodes = nodes
  },
})

const draggableGroup = {
  name: 'course-outline',
  pull: true,
  put: true,
}

/**
 * 仅允许小节进入章节内部，章节只能在第一层排序。
 */
function canMoveOutlineItem(event: MoveEvent) {
  const itemType = event.dragged?.dataset.itemType

  const targetType = event.to?.dataset.containerType

  return targetType === 'root' || itemType === 'section'
}

/**
 * 拖动完成后同步当前大纲的排序数据。
 */
function handleOutlineDragEnd() {
  ElNotification.success('目录顺序已调整')
}

/**
 * 获取课程章节列表
 */
async function getCourseOutlineList() {
  loading.value = false
  try {
    const response = await fetchAdminCourseOutlineList(couId.value)

    courseOutlineList.value = {
      ...response,
      nodes: response.nodes || [],
    }
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

async function handleSubmit() {
  try {
    loading.value = true
    await fetchAdminCourseOutlineListUpdate(courseOutlineList.value.nodes || [])
    ElNotification.success('保存成功')
    await getCourseOutlineList()

    // 关闭当前标签页 调转到 课程列表页
    workTabStore.removeTab(route.path)
    await router.push('/admin/course')
  }
  catch {
    ElNotification.error('保存失败')
  }
  finally {
    loading.value = false
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

        <ArtButton
          type="primary"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <!-- 课程内容列表 -->
    <VueDraggable
      v-if="courseNodes.length"
      v-model="courseNodes"
      v-loading="loading"
      :group="draggableGroup"
      handle=".outline-drag-handle"
      ghost-class="course-outline-ghost"
      chosen-class="course-outline-chosen"
      :animation="200"
      class="flex flex-col gap-4"
      data-container-type="root"
      @move="canMoveOutlineItem"
      @end="handleOutlineDragEnd"
    >
      <div
        v-for="item in courseNodes"
        :key="item.id"
        :data-item-type="item.itemType"
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
              class="min-w-0 flex items-start gap-2"
            >
              <el-tooltip
                content="拖动排序"
                placement="top"
              >
                <button
                  type="button"
                  aria-label="拖动章节排序"
                  class="outline-drag-handle mt-0.5 flex size-7 shrink-0 cursor-move items-center justify-center rounded-custom-sm border-0 bg-transparent text-g-400 transition-colors hover:bg-g-100 hover:text-primary"
                >
                  <ArtSvgIcon
                    icon="ri:drag-move-2-fill"
                    class="text-base"
                  />
                </button>
              </el-tooltip>

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

          <VueDraggable
            v-model="item.sectionList"
            :group="draggableGroup"
            handle=".outline-drag-handle"
            ghost-class="course-outline-ghost"
            chosen-class="course-outline-chosen"
            :animation="200"
            filter=".outline-empty-state"
            :prevent-on-filter="false"
            class="flex flex-col gap-3"
            data-container-type="chapter"
            @move="canMoveOutlineItem"
            @end="handleOutlineDragEnd"
          >
            <!-- 章节里的小节 -->
            <div
              v-for="section in item.sectionList"
              :key="section.id"
              data-item-type="section"
              class="cursor-grab active:cursor-grabbing"
            >
              <CourseSectionItem
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
              v-if="!item.sectionList.length"
              class="outline-empty-state rounded-custom-sm border-full-d"
            >
              <el-empty
                description="拖动小节到这里"
                :image-size="30"
                class="py-2!"
              />
            </div>
          </VueDraggable>

        </section>

        <!-- 独立小节 -->
        <CourseSectionItem
          v-else-if="item.itemType === 'section'"
          :section="item"
          :type-config="getSectionTypeConfig(item.sectionType)"
          class="outline-section-item"
          @delete="deleteSection"
          @edit="editSection({
            section: item,
          })"
        />
      </div>
    </VueDraggable>

    <el-empty
      v-else
      description="暂无章节和小节"
      :image-size="30"
      class="py-2!"
    />
  </div>
</template>

<style lang="scss" scoped></style>

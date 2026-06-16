<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程详情页  ------------------------------------------------->
<script lang="ts" setup>
import type { SectionType } from './sectionType'

import { computed, ref } from 'vue'

import AllocateCourseDialog from '../list/AllocateCourseDialog.vue'

import ChapterEditorDialog from './ChapterEditorDialog.vue'

import CourseSectionItem from './CourseSectionItem.vue'

import CreateSectionDialog from './CreateSectionDialog.vue'

import { sectionTypeConfigMap } from './sectionType'

const route = useRoute()

const router = useRouter()

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 创建小节路由映射
 */
const createSectionRouteMap: Record<SectionType, string> = {
  0: 'AdminCourseSectionDocumentCreate',
  1: 'AdminCourseSectionVideoCreate',
  2: 'AdminCourseSectionExamCreate',
  3: 'AdminCourseSectionSurveyCreate',
}

/**
 * 编辑小节路由映射
 */
const editSectionRouteMap: Record<SectionType, string> = {
  0: 'AdminCourseSectionDocumentEdit',
  1: 'AdminCourseSectionVideoEdit',
  2: 'AdminCourseSectionExamEdit',
  3: 'AdminCourseSectionSurveyEdit',
}

/**
 * 是否显示分配学习任务弹窗
 */
const isShowAllocateCourseDialog = ref(false)

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
 * 当前要添加小节的章节 ID，空值表示添加课程直属小节
 */
const currentCreateSectionChapterId = ref<number>()

/**
 * 跳转到课程编辑页
 */
function goToCourseEdit() {
  router.push({
    name: 'AdminCourseEdit',
    params: {
      couId: couId.value,
    },
  })
}

const courseDetail = ref<AdminApi.Course.CourseOutlineListResponse>(
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
   *  获取课程详情
   */
async function getCourseDetail() {
  courseDetail.value = await fetchAdminCourseOutlineList(couId.value)
  console.log('🚀 ~ file: index.vue:206 ~ courseDetail.value:', courseDetail.value)
}

getCourseDetail()

/**
 * 获取小节类型对应的图标配置
 */
function getSectionTypeIcon(sectionType: SectionType) {
  return sectionTypeConfigMap[sectionType]
}

// ! ////////////////////////////// 分配 ///////////////////////////////////////
/**
 * 打开小节分配学习任务弹窗
 */
function allocateSection() {
  isShowAllocateCourseDialog.value = true
}

// # ////////////////////////////// 章节相关 ///////////////////////////////////////

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
  await fetchAdminCourseOutlineChapterDelete(chapter.id)
  try {
    await getCourseDetail()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
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

// $ ////////////////////////////// 小节相关 ///////////////////////////////////////
/**
 * 新增小节
 */
function addSection(chapter?: AdminApi.Course.Chapter) {
  currentCreateSectionChapterId.value = chapter?.id || undefined
  isShowCreateSectionDialog.value = true
}

/**
 * 跳转到添加小节（根据类型）
 */
function goToAddSection(sectionType: SectionType) {
  isShowCreateSectionDialog.value = false

  router.push({
    name: createSectionRouteMap[sectionType],

    params: {
      couId: couId.value,
    },

    query: currentCreateSectionChapterId.value
      ? {
          olPID: currentCreateSectionChapterId.value,
        }
      : undefined,
  })
}

/**
 * 删除小节
 */
async function deleteSection(section: AdminApi.Course.Section) {
  await fetchAdminCourseOutlineSectionDelete(section.id)
  try {
    await getCourseDetail()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
}

/**
 * 编辑小节
 */
function editSection(section: AdminApi.Course.Section) {
  router.push({
    name: editSectionRouteMap[section.sectionType],

    params: {
      couId: couId.value,
      olId: section.id,
    },
  })
}

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <!-- 章节 新增或编辑 弹窗 -->
    <ChapterEditorDialog
      v-if="isShowChapterFormDialog"
      v-model="isShowChapterFormDialog"
      :mode="chapterFormMode"
      :cou-id="couId"
      :ol-id="currentEditChapterId"
      @success="getCourseDetail"
    />

    <!-- 创建小节 类型选择弹窗 -->
    <CreateSectionDialog
      v-if="isShowCreateSectionDialog"
      v-model="isShowCreateSectionDialog"
      @select="goToAddSection"
    />

    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <AdminPageHeader
      :title="` ${courseDetail.couName}`"
      :stats="[`
        章节数量: ${courseDetail.couChapterCount}
        小节数量: ${courseDetail.couSectionCount}`]"
    >
      <template
        #extra
      >
        <ArtButton
          type="allocate"
          @click="isShowAllocateCourseDialog = true"
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
      v-for="item in courseDetail.nodes"
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
            :type-config="getSectionTypeIcon(section.sectionType)"
            @allocate="allocateSection"
            @delete="deleteSection"
            @edit="editSection"
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
        :type-config="getSectionTypeIcon(item.sectionType)"
        @allocate="allocateSection"
        @delete="deleteSection"
        @edit="editSection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

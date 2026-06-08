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
 * 是否显示新建章节弹窗
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
 * 当前编辑的章节
 */
const currentEditChapter = ref<AdminApi.Course.CourseOutlineListItem>()

/**
 * 当前要添加小节的章节 ID，空值表示添加课程直属小节
 */
const currentCreateSectionChapterId = ref<number>()

/**
 * 课程内容数据
 */
const outlineList = ref<AdminApi.Course.CourseOutlineListItem[]>([
  {
    id: 1,
    name: '章节1',
    description: '章节1描述',
    itemType: 'chapter',
    isVisible: '1',
    sectionList: [
      {
        id: 1,
        name: '章节1的小节1',
        description: '小节1描述',
        itemType: 'section',
        sectionType: 0,
        participantCount: 6,
      },
      {
        id: 2,
        name: '章节1的小节2',
        description: '小节2描述',
        itemType: 'section',
        sectionType: 1,
        participantCount: 4,
      },
    ],
  },
  {
    id: 2,
    name: '章节2',
    description: '章节2描述',
    itemType: 'chapter',
    isVisible: '1',
    sectionList: [
      {
        id: 3,
        name: '章节2的小节1',
        description: '小节3描述',
        itemType: 'section',
        sectionType: 2,
        participantCount: 8,
      },
    ],
  },
  {
    id: 4,
    name: '小节1',
    description: '小节1描述',
    itemType: 'section',
    sectionType: 3,
    participantCount: 5,
  },
  {
    id: 5,
    name: '小节2',
    description: '小节2描述',
    itemType: 'section',
    sectionType: 0,
    participantCount: 3,
  },
  {
    id: 6,
    name: '小节3',
    description: '小节3描述',
    itemType: 'section',
    sectionType: 2,
    participantCount: 2,
  },
  {
    id: 7,
    name: '小节4',
    description: '小节4描述',
    itemType: 'section',
    sectionType: 3,
    participantCount: 1,
  },
  {
    id: 8,
    name: '小节5',
    description: '小节5描述',
    itemType: 'section',
    sectionType: 0,
    participantCount: 1,
  },
  {
    id: 9,
    name: '小节5',
    description: '小节5描述',
    itemType: 'section',
    sectionType: 0,
    participantCount: 3,
  },
])

/**
 * 页面从上到下的小节序号映射
 */
const sectionIndexMap = computed(() => {
  const map = new Map<AdminApi.Course.Section, number>()

  let index = 1

  outlineList.value.forEach((item) => {
    if (item.itemType === 'chapter') {
      item.sectionList.forEach((section) => {
        map.set(section, index)
        index += 1
      })

      return
    }

    map.set(item, index)
    index += 1
  })

  return map
})

/**
 * 获取当前小节在整个页面中的序号
 */
function getSectionIndex(section: AdminApi.Course.Section) {
  return sectionIndexMap.value.get(section) ?? 0
}

/**
 * 获取小节类型对应的图标配置
 */
function getSectionTypeIcon(sectionType: SectionType) {
  return sectionTypeConfigMap[sectionType]
}

/**
 * 跳转到编辑页
 */
function goToEdit() {
  router.push({
    name: 'AdminCourseEdit',
    params: {
      couId: couId.value,
    },
  })
}

/**
 * 跳转到添加小节（根据类型）
 */
function goToAddSection(type: SectionType) {
  isShowCreateSectionDialog.value = false

  router.push({
    name: createSectionRouteMap[type],

    params: {
      courseId: couId.value,
    },

    query: currentCreateSectionChapterId.value
      ? {
          chapterId: currentCreateSectionChapterId.value,
        }
      : undefined,
  })
}

/**
 * 打开新增课程直属小节弹窗
 */
function openAddCourseSectionDialog() {
  currentCreateSectionChapterId.value = undefined
  isShowCreateSectionDialog.value = true
}

/**
 * 打开新增章节小节弹窗
 */
function openAddChapterSectionDialog(chapterId: number) {
  currentCreateSectionChapterId.value = chapterId
  isShowCreateSectionDialog.value = true
}

/**
 * 打开新增章节弹窗
 */
function openAddChapterDialog() {
  currentEditChapter.value = undefined
  chapterFormMode.value = 'add'
  isShowChapterFormDialog.value = true
}

/**
 * 新增章节
 */
function handleAddChapter(data: { name: string, description: string, isVisible: string }) {
  outlineList.value.push({
    id: Date.now(),
    name: data.name,
    description: data.description,
    itemType: 'chapter',
    isVisible: data.isVisible,
    sectionList: [],
  })
}

/**
 * 编辑章节
 */
function editChapter(chapterId: number) {
  const chapter = outlineList.value.find(
    (item): item is AdminApi.Course.Chapter => item.itemType === 'chapter' && item.id === chapterId,
  )

  if (!chapter) {
    return
  }

  currentEditChapter.value = chapter
  chapterFormMode.value = 'edit'
  isShowChapterFormDialog.value = true
}

/**
 * 更新章节
 */
function handleEditChapter(data: { name: string, description: string, isVisible: string }) {
  // if (!currentEditChapter.value) {
  //   return
  // }

  // currentEditChapter.value.name = data.name
  // currentEditChapter.value.description = data.description
  // currentEditChapter.value.isVisible = data.isVisible
}

/**
 * 打开小节分配学习任务弹窗
 */
function allocateSection() {
  isShowAllocateCourseDialog.value = true
}

/**
 * 删除小节
 */
function deleteSection(section: AdminApi.Course.Section) {
  // const rootSectionIndex = outlineList.value.findIndex(
  //   item => item.itemType === 'section' && item.id === section.id,
  // )

  // if (rootSectionIndex > -1) {
  //   outlineList.value.splice(rootSectionIndex, 1)
  //   return
  // }

  // outlineList.value.forEach((item) => {
  //   if (item.itemType !== 'chapter') {
  //     return
  //   }

  //   const sectionIndex = item.sectionList.findIndex(child => child.id === section.id)

  //   if (sectionIndex > -1) {
  //     item.sectionList.splice(sectionIndex, 1)
  //   }
  // })
}

/**
 * 编辑小节
 */
function editSection(section: AdminApi.Course.Section) {
  // router.push({
  //   name: editSectionRouteMap[section.sectionType],
  //   params: {
  //     courseId: couId.value,
  //     sectionId: section.id,
  //   }, 
  // })
}

/**
   *  获取课程详情
   */
async function getCourseDetail() {
  const res = await fetchAdminCourseOutlineList(couId.value)

  outlineList.value = res
  console.log('🚀 ~ file: index.vue:418 ~ res:', res)
}

getCourseDetail()

</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <!-- 章节新增或编辑弹窗 -->
    <ChapterEditorDialog
      v-if="isShowChapterFormDialog"
      v-model="isShowChapterFormDialog"
      :mode="chapterFormMode"
      :cou-id="couId"
      @success="getCourseDetail"
    />

    <!-- 创建小节类型选择弹窗 -->
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
      title="学习课程1 详情页"
      :stats="[`小节数量: ${sectionIndexMap.size}`]"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="allocate"
          @click="isShowAllocateCourseDialog = true"
        />

        <ArtIconButton
          type="edit"
          @click="goToEdit()"
        />

        <ArtIconButton
          type="add"
          @click="openAddChapterDialog"
        >
          添加章节
        </ArtIconButton>

        <ArtIconButton
          type="add"
          @click="openAddCourseSectionDialog"
        >
          添加课程小节
        </ArtIconButton>
      </template>
    </AdminPageHeader>

    <!-- 课程内容列表 -->
    <div
      v-for="item in outlineList"
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
            <ArtIconButton
              type="add"
              @click="openAddChapterSectionDialog(item.id)"
            >
              添加课程小节
            </ArtIconButton>

            <ArtIconButton
              type="delete"
            />

            <ArtIconButton
              type="edit"
              @click="editChapter(item.id)"
            />
          </div>
        </div>

        <div
          v-if="item.sectionList.length"
          class="flex flex-col gap-3"
        >
          <CourseSectionItem
            v-for="section in item.sectionList"
            :key="section.id"
            inner
            :section="section"
            :section-index="getSectionIndex(section)"
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
        :section-index="getSectionIndex(item)"
        :type-config="getSectionTypeIcon(item.sectionType)"
        @allocate="allocateSection"
        @delete="deleteSection"
        @edit="editSection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

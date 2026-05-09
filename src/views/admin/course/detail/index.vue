<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

import AllocateCourseDialog from '../list/AllocateCourseDialog.vue'

import ChapterFormDialog from './ChapterFormDialog.vue'

const router = useRouter()

/**
 * 小节内容类型：0 文档，1 视频，2 考试，3 问卷
 */
type SectionType = 0 | 1 | 2 | 3

/**
 * 小节类型定义
 */
type Section = {

  /** 小节 ID */
  id: number

  /** 小节名称 */
  name: string

  /** 小节描述 */
  description: string

  /** 内容项类型标识  区分是 小节 或 章节 */
  itemType: 'section'

  /** 小节内容类型 */
  sectionType: SectionType

  /** 参与小节学习的人数 */
  participantCount: number
}

/**
 * 章节类型定义
 */
type Chapter = {

  /** 章节 ID */
  id: number

  /** 章节名称 */
  name: string

  /** 章节描述 */
  description: string

  /** 内容项类型标识  区分是 小节 或 章节 */
  itemType: 'chapter'

  /** 章节是否对学员可见 */
  isVisible: string

  /** 章节下的小节列表 */
  sectionList: Section[]
}

/**
 * 课程内容项类型（章节或小节）
 */
type CourseItem = Chapter | Section

/**
 * 添加小节路由映射
 */
const sectionRouteMap: Record<SectionType, string> = {
  0: 'AdminCourseSectionDocument',
  1: 'AdminCourseSectionVideo',
  2: 'AdminCourseSectionExam',
  3: 'AdminCourseSectionQuestion',
}

/**
 * 添加小节类型按钮配置
 */
const sectionTypeButtons: Array<{
  type: SectionType
  label: string
}> = [
  {
    type: 0,
    label: '文档',
  },
  {
    type: 1,
    label: '视频',
  },
  {
    type: 2,
    label: '考试',
  },
  {
    type: 3,
    label: '问卷',
  },
]

/**
 * 小节类型图标配置
 */
const sectionTypeIconList: Array<{
  sectionTypeName: string
  sectionIcon: string
  sectionIconBgColor: string
}> = [
  {
    sectionTypeName: '文档',
    sectionIcon: 'ri:article-line',
    sectionIconBgColor: '#fcbd2c',
  },
  {
    sectionTypeName: '视频',
    sectionIcon: 'ri:vidicon-line',
    sectionIconBgColor: '#ff2814',
  },
  {
    sectionTypeName: '考试',
    sectionIcon: 'ri:medal-line',
    sectionIconBgColor: '#673ab8',
  },
  {
    sectionTypeName: '问卷',
    sectionIcon: 'ri:survey-line',
    sectionIconBgColor: '#2cb870',
  },
]

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
const currentEditChapter = ref<Chapter>()

/**
 * 课程内容数据
 */
const courseItems = ref<CourseItem[]>([
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
])

/**
 * 页面从上到下的小节序号映射
 */
const sectionIndexMap = computed(() => {
  const map = new Map<Section, number>()

  let index = 1

  courseItems.value.forEach((item) => {
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
function getSectionIndex(section: Section) {
  return sectionIndexMap.value.get(section) ?? 0
}

/**
 * 获取小节类型对应的图标配置
 */
function getSectionTypeIcon(sectionType: SectionType) {
  return sectionTypeIconList[sectionType]
}

/**
 * 跳转到编辑页
 */
function goToEdit() {
  router.push({
    name: 'AdminCourseEdit',
    query: {
      id: router.currentRoute.value.query.id,
    },
  })
}

/**
 * 跳转到添加小节（根据类型）
 */
function goToAddSection(type: SectionType) {
  router.push({
    name: sectionRouteMap[type],

    params: {
      id: router.currentRoute.value.params.id,
    },
  })
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
  courseItems.value.push({
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
  const chapter = courseItems.value.find(
    (item): item is Chapter => item.itemType === 'chapter' && item.id === chapterId,
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
  if (!currentEditChapter.value) {
    return
  }

  currentEditChapter.value.name = data.name
  currentEditChapter.value.description = data.description
  currentEditChapter.value.isVisible = data.isVisible
}

/**
 * 编辑小节
 */
function editSection(sectionId: number) {
  console.log('编辑小节:', sectionId)
}
</script>

<template>
  <div
    class="mb-10 flex flex-col gap-4"
  >
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <!-- 章节弹窗 -->
    <ChapterFormDialog
      v-if="isShowChapterFormDialog"
      v-model="isShowChapterFormDialog"
      :mode="chapterFormMode"
      :edit-data="currentEditChapter"
      @add="handleAddChapter"
      @edit="handleEditChapter"
    />

    <!-- 新建小节弹窗 -->
    <el-dialog
      v-if="isShowCreateSectionDialog"
      v-model="isShowCreateSectionDialog"
      title="添加课程小节"
      width="30%"
      :show-close="false"
    >
      <div
        class="flex gap-2 w-full items-center justify-center"
      >
        <el-button
          v-for="item in sectionTypeButtons"
          :key="item.type"
          type="primary"
          @click="goToAddSection(item.type)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </el-dialog>

    <el-page-header
      class="art-card z-10"
      @back="$router.back()"
    >
      <template
        #content
      >

        <div
          class="flex gap-5 items-center"
        >
          <span>学习课程1 详情页</span>

          <div
            class="text-sm color-info font-normal flex gap-2"
          >
            <span>
              小节数量: {{ sectionIndexMap.size }}
            </span>
          </div>
        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex gap-2 items-center"
        >
          <ArtIconButton
            type="allocate"
            class="ml-3 max-sm:ml-[7px]"
            @click="isShowAllocateCourseDialog = true"
          />

          <ArtIconButton
            type="edit"
            class="ml-3 max-sm:ml-[7px]"
            @click="goToEdit()"
          />

          <ArtIconButton
            type="add"
            class="ml-3 max-sm:ml-[7px]"
            @click="openAddChapterDialog"
          >
            添加章节
          </ArtIconButton>

          <ArtIconButton
            type="add"
            class="ml-3 max-sm:ml-[7px]"
            @click="isShowCreateSectionDialog = true"
          >
            添加课程小节
          </ArtIconButton>

        </div>
      </template>
    </el-page-header>

    <!-- // 分两种 1 章节, 2 小节  章节可以包含小节  章节是 二级数组 -->

    <!-- 课程内容列表 -->
    <div
      v-for="item in courseItems"
      :key="item.id"
      class="mb-3"
    >
      <!-- 章节 -->
      <el-card
        v-if="item.itemType === 'chapter'"
      >
        <template
          #header
        >
          <div
            class="flex w-full items-center justify-between"
          >
            <div
              class="flex gap-2 items-center"
            >
              <div
                class=""
              >
                {{ item.name }}
              </div>
            </div>

            <div
              class="flex gap-2 items-center"
            >
              <ArtIconButton
                type="add"
                class="ml-3 max-sm:ml-[7px]"
                @click="isShowCreateSectionDialog = true"
              >
                添加课程小节
              </ArtIconButton>

              <ArtIconButton
                type="edit"
                class="ml-3 max-sm:ml-[7px]"
                @click="editChapter(item.id)"
              />
            </div>
          </div>
        </template>

        <!-- 章节下的小节列表 -->
        <el-card
          v-for="section in item.sectionList"
          :key="section.id"
          class="mb-2"
        >
          <div
            class="flex w-full items-center justify-between"
          >
            <div
              class="flex gap-10 items-center"
            >
              <div
                class="font-bold text-primary"
              >
                {{ getSectionIndex(section) }}
              </div>

              <!-- 小节的类型图标 -->
              <div
                class="flex  items-center flex-col gap-1 justify-center"
              >
                <ArtIconButton
                  :icon="getSectionTypeIcon(section.sectionType).sectionIcon"
                  icon-color="#ffffff"
                  :bg-color="getSectionTypeIcon(section.sectionType).sectionIconBgColor"
                />

                <div
                  class="text-xs text-info"
                >
                  {{ getSectionTypeIcon(section.sectionType).sectionTypeName }}
                </div>
              </div>

              <div
                class="flex flex-col  gap-2"
              >
                <div
                  class="font-bold text-sm text-info"
                >
                  {{ section.name }}

                </div>

                <div
                  class="flex gap-5 justify-center"
                >
                  <div
                    class="text-xs"
                  >
                    {{ section.participantCount }}人参与
                  </div>

                  <div
                    class="text-xs"
                  >
                    {{ section.description }}
                  </div>

                </div>
              </div>

            </div>

            <div
              class="flex gap-2 items-center"
            >

              <ArtIconButton
                type="allocate"
                class="ml-3 max-sm:ml-[7px]"
                @click="isShowAllocateCourseDialog = true"
              />

              <ArtIconButton
                type="edit"
                class="ml-3 max-sm:ml-[7px]"
                @click="editSection(section.id)"
              />
            </div>
          </div>
        </el-card>
      </el-card>

      <!-- 独立小节 -->
      <el-card
        v-else-if="item.itemType === 'section'"
      >
        <div
          class="flex w-full items-center justify-between"
        >
          <div
            class="flex gap-20 items-center"
          >
            <div
              class="font-bold text-primary"
            >
              {{ getSectionIndex(item) }}
            </div>

            <!-- 小节的类型图标 -->
            <div
              class="flex  gap-1 items-center flex-col justify-center"
            >
              <ArtIconButton
                :icon="getSectionTypeIcon(item.sectionType).sectionIcon"
                icon-color="#ffffff"
                :bg-color="getSectionTypeIcon(item.sectionType).sectionIconBgColor"
              />

              <div
                class="text-xs text-info"
              >
                {{ getSectionTypeIcon(item.sectionType).sectionTypeName }}
              </div>
            </div>

            <div
              class="flex flex-col  gap-2"
            >
              <div
                class="font-bold text-sm text-info"
              >
                {{ item.name }}

              </div>

              <div
                class="flex gap-5 justify-center"
              >
                <div
                  class="text-xs"
                >
                  {{ item.participantCount }}人参与
                </div>

                <div
                  class="text-xs"
                >
                  {{ item.description }}
                </div>

              </div>
            </div>

          </div>

          <div
            class="flex gap-2 items-center"
          >

            <ArtIconButton
              type="edit"
              class="ml-3 max-sm:ml-[7px]"
              @click="editSection(item.id)"
            />

          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

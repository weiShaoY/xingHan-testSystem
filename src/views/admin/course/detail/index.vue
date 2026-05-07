<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
  import { ref } from 'vue'

  import SvgIcon from '@/components/SvgIcon/index.vue'

  import AllocateCourseDialog from '../list/AllocateCourseDialog.vue'

  import CreateChapterDialog from './CreateChapterDialog.vue'

  const router = useRouter()

  /**
   * 是否显示分配学习任务弹窗
   */
  const isShowAllocateCourseDialog = ref(false)

  /**
   * 是否显示新建章节弹窗
   */
  const isShowCreateChapterDialog = ref(false)

  /**
   *  是否显示新建小节弹窗
   */
  const isShowCreateSectionDialog = ref(false)

  /**
   * 小节类型定义
   */
  type Section = {
    id: number
    name: string
    participants: number
    description: string
    type: 'section'
  }

  /**
   * 章节类型定义
   */
  type Chapter = {
    id: number
    name: string
    sections: Section[]
    type: 'chapter'
  }

  /**
   * 课程内容项类型（章节或小节）
   */
  type CourseItem = Chapter | Section

  /**
   * 课程内容数据
   */
  const courseItems = ref<CourseItem[]>([
    {
      id: 1,
      name: '章节1',
      sections: [
        {
          id: 1,
          name: '章节1的小节1',
          participants: 6,
          description: '小节1描述',
          type: 'section'
        },
        {
          id: 2,
          name: '章节1的小节2',
          participants: 4,
          description: '小节2描述',
          type: 'section'
        }
      ],
      type: 'chapter'
    },
    {
      id: 2,
      name: '章节2',
      sections: [
        {
          id: 3,
          name: '章节2的小节1',
          participants: 8,
          description: '小节3描述',
          type: 'section'
        }
      ],
      type: 'chapter'
    },
    {
      id: 4,
      name: '小节1',
      participants: 5,
      description: '小节1描述',
      type: 'section'
    },
    {
      id: 5,
      name: '小节2',
      participants: 3,
      description: '小节2描述',
      type: 'section'
    }
  ])

  /**
   * 跳转到编辑页
   */
  function goToEdit() {
    router.push({
      name: 'AdminMyCourseEdit',
      query: {
        id: router.currentRoute.value.query.id
      }
    })
  }

  /**

 * 跳转到添加小节（根据类型）

 */

  function goToAddSection(type: 'video' | 'document' | 'exam' | 'question') {
    const routeMap = {
      video: 'AdminCourseSectionVideo',

      document: 'AdminCourseSectionDocument',

      exam: 'AdminCourseSectionExam',

      question: 'AdminCourseSectionQuestion'
    }

    router.push({
      name: routeMap[type],

      params: {
        id: router.currentRoute.value.params.id
      }
    })
  }

  const sectionTypeButtons: Array<{
    type: 'video' | 'document' | 'exam' | 'question'
    label: string
  }> = [
    { type: 'document', label: '文档' },
    { type: 'video', label: '视频' },
    { type: 'exam', label: '考试' },
    { type: 'question', label: '问卷' }
  ]

  /**
   * 编辑章节
   */
  function editChapter(chapterId: number) {
    console.log('编辑章节:', chapterId)
  }

  /**
   * 编辑小节
   */
  function editSection(sectionId: number) {
    console.log('编辑小节:', sectionId)
  }
</script>

<template>
  <div class="w-full">
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog v-if="isShowAllocateCourseDialog" v-model="isShowAllocateCourseDialog" />
    <!-- 新建章节弹窗 -->
    <CreateChapterDialog v-if="isShowCreateChapterDialog" v-model="isShowCreateChapterDialog" />
    <!-- 新建小节弹窗 -->
    <el-dialog
      v-if="isShowCreateSectionDialog"
      v-model="isShowCreateSectionDialog"
      title="添加课程小节"
      width="30%"
      :show-close="false"
    >
      <div class="w-full flex items-center justify-center gap-2">
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

    <el-page-header @back="$router.back()">
      <template #content>
        <div class="flex items-center"> 学习课程1 详情页 </div>
      </template>

      <template #extra>
        <div class="flex items-center gap-2">
          <el-button class="flex items-center justify-center" @click.stop="goToEdit()">
            <SvgIcon icon="admin-edit" />
          </el-button>

          <!-- 分配 -->
          <el-button
            class="flex items-center justify-center"
            @click.stop="isShowAllocateCourseDialog = true"
          >
            <SvgIcon icon="admin-allocate" />
          </el-button>
        </div>
      </template>
    </el-page-header>

    <div class="my-5 w-full flex items-center justify-end">
      <el-button plain class="ml-2" @click="isShowCreateChapterDialog = true"> 添加章节 </el-button>

      <el-button type="primary" class="ml-2" @click="isShowCreateSectionDialog = true">
        添加课程小节
      </el-button>
    </div>

    <!-- // 分两种 1 章节, 2 小节  章节可以包含小节  章节是 二级数组 -->

    <!-- 课程内容列表 -->
    <div v-for="item in courseItems" :key="item.id" class="mb-3">
      <!-- 章节 -->
      <el-card v-if="item.type === 'chapter'">
        <template #header>
          <div class="w-full flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="">
                {{ item.name }}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <el-button
                class="flex items-center justify-center"
                @click="isShowCreateSectionDialog = true"
              >
                添加小节
              </el-button>

              <el-button class="flex items-center justify-center" @click="editChapter(item.id)">
                编辑
              </el-button>
            </div>
          </div>
        </template>

        <!-- 章节下的小节列表 -->
        <el-card v-for="section in item.sections" :key="section.id" class="mb-2">
          <div class="w-full flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="">
                {{ section.name }}
              </div>

              <div class=""> {{ section.participants }}人参与 </div>

              <div class="">
                {{ section.description }}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <el-button class="flex items-center justify-center" @click="editSection(section.id)">
                <SvgIcon icon="admin-edit" />
              </el-button>

              <el-button class="flex items-center justify-center">
                <SvgIcon icon="admin-allocate" />
              </el-button>
            </div>
          </div>
        </el-card>
      </el-card>

      <!-- 独立小节 -->
      <el-card v-else-if="item.type === 'section'">
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-5">
            <div class="">
              {{ item.name }}
            </div>

            <div class=""> {{ item.participants }}人参与 </div>

            <div class="">
              {{ item.description }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <el-button class="flex items-center justify-center">
              <SvgIcon icon="admin-edit" />
            </el-button>

            <el-button class="flex items-center justify-center">
              <SvgIcon icon="admin-allocate" />
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

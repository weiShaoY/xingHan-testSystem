<!------------------------------------  项目阶段列表页  ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

const route = useRoute()

const router = useRouter()

/**
 * 项目列表页路径。
 */
const PROJECT_LIST_PATH = '/admin/project'

/**
 * 返回项目列表页并关闭当前编辑标签。
 */
function backToProjectList() {
  // workTabStore.removeTab(route.path)

  router.push({
    path: PROJECT_LIST_PATH,
  })
}

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 当前项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 项目阶段列表
 */
const projectStageList = ref<AdminApi.Project.ProjectStageListEditor>({
  projId: projId.value,
  projName: '',
  projSectionCount: 0,
  projStageCourse: 0,
  displayMethod: 0,
  isLearningStages: 0,
  unlockConditions: 2,
  nodes: [],
})

/**
 * 获取项目阶段列表
 */
async function getProjectStageList() {
  loading.value = true

  try {
    projectStageList.value = await fetchAdminProjectStageList(projId.value)
  }
  catch {
    ElNotification.error('项目阶段列表获取失败')
  }
  finally {
    loading.value = false
  }
}

getProjectStageList()

/**
 * 跳转到编辑页
 */
function goToEdit() {
  router.push({
    name: 'AdminProjectStageEditor',
    params: {
      projId: projId.value,
    },
  })
}

/**
 * 跳转到课程大纲页
 */
function goToCourseOutline(course: AdminApi.Course.CourseListItem) {
  router.push({
    name: 'AdminCourseOutline',
    params: {
      couId: course.couId,
    },
  })
}

/**
 * 跳转到课程编辑页
 */
function goToCourseEdit(course: AdminApi.Course.CourseListItem) {
  router.push({
    name: 'AdminCourseSetting',
    params: {
      couId: course.couId,
    },
  })
}

</script>

<template>
  <div
    v-loading="loading"
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="projectStageList.projName"
      :stats="[`
        课程总数: ${projectStageList.projStageCourse},
        小节总数: ${projectStageList.projSectionCount}
      `]"
      @back="backToProjectList"
    >
      <template
        #extra
      >
        <ArtButton
          type="edit"
          @click="goToEdit()"
        >
          编辑项目阶段
        </ArtButton>
      </template>
    </AdminPageHeader>

    <template
      v-if="projectStageList.nodes.length"
    >
      <section
        v-for="(item, index) in projectStageList.nodes"
        :key="item.stageId"
        class="art-card flex flex-col gap-5"
      >
        <div
          class="flex items-start flex-col gap-4 max-md:flex-col"
        >
          <div
            class="flex flex-wrap items-center gap-3"
          >
            <div
              class="text-base font-semibold text-g-900"
            >
              第 {{ index + 1 }} 阶段 · {{ item.stageName }}
            </div>

            <el-tag
              :type="item.stageType === 1 ? 'danger' : 'info'"
              size="small"
            >
              {{ item.stageType === 1 ? '必修阶段' : '选修阶段' }}
            </el-tag>

            <el-tag
              type="primary"
              size="small"
            >
              {{ item.course.length }} 门课程
            </el-tag>
          </div>

          <div
            class="mt-2 text-sm text-g-600 leading-relaxed"
          >
            {{ item.stageIntro || '暂无阶段说明' }}
          </div>

        </div>

        <div
          v-if="item.course.length"
          class="flex flex-col gap-3"
        >
          <div
            v-for="course in item.course"
            :key="course.couId"
            class="rounded-custom-sm border-full-d bg-box px-4 py-4 transition-colors hover:border-primary/40"
          >
            <div
              class="flex items-start justify-between gap-4 max-md:flex-col"
            >
              <div
                class="min-w-0 flex-1"
              >
                <div
                  class="flex flex-wrap items-center gap-2"
                >
                  <div
                    class="text-sm font-semibold text-g-900"
                  >
                    {{ course.couName || '-' }}
                  </div>

                  <!-- <el-tag
                    :type="course.isRequired === 1 ? 'danger' : 'info'"
                    size="small"
                  >
                    {{ course.isRequired === 1 ? '必修课程' : '选修课程' }}
                  </el-tag>

                  <el-tag
                    v-if="course.isFree_Preview === 1"
                    type="success"
                    size="small"
                  >
                    支持预览
                  </el-tag> -->
                </div>

                <div
                  v-if="course.couIntro"
                  class="mt-2 text-xs leading-relaxed text-g-500"
                >
                  {{ course.couIntro }}
                </div>
              </div>

              <div
                class="flex shrink-0 items-center gap-2 max-md:w-full max-md:justify-end"
              >
                <ArtButton
                  type="edit"
                  @click="goToCourseEdit(course)"
                />

                <ArtButton
                  type="view"
                  @click="goToCourseOutline(course)"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-custom-sm border-full-d"
        >
          <el-empty
            description="暂无课程"
            :image-size="30"
            class="py-2!"
          />
        </div>
      </section>
    </template>

    <el-empty
      v-else
      description="暂无学习阶段"
      :image-size="30"
      class="py-2!"
    />
  </div>
</template>

<style lang="scss" scoped></style>

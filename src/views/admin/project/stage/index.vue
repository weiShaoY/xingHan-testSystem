<!------------------------------------  项目详情页  ------------------------------------------------->
<script lang="ts" setup>
import { computed, ref } from 'vue'

const route = useRoute()

const router = useRouter()

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 项目阶段列表
 */
const projectStageList = ref<AdminApi.Project.ProjectStageListResponse>([])

/**
 * 当前项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 阶段数量
 */
const stageCount = computed(() => projectStageList.value.length)

/**
 * 课程总数
 */
const courseCount = computed(() => {
  return projectStageList.value.reduce((total, item) => total + item.course.length, 0)
})

/**
 * 必修课程数
 */
const requiredCourseCount = computed(() => {
  return projectStageList.value.reduce((total, item) => {
    return total + item.course.filter(course => course.isRequired === 1).length
  }, 0)
})

/**
 * 选修课程数
 */
const optionalCourseCount = computed(() => {
  return courseCount.value - requiredCourseCount.value
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
    ElNotification.error('项目详情获取失败')
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
    name: 'AdminProjectSetting',
    params: {
      projId: projId.value,
    },
  })
}

/**
 * 跳转到课程大纲页
 */
function goToCourseOutline(course: AdminApi.Project.ProjectStageListItemCourseListItem) {
  router.push({
    name: 'AdminCourseOutline',
    params: {
      couId: course.couID,
    },
  })
}

/**
 * 跳转到课程编辑页
 */
function goToCourseEdit(course: AdminApi.Project.ProjectStageListItemCourseListItem) {
  router.push({
    name: 'AdminCourseSetting',
    params: {
      couId: course.couID,
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
      :title="projectStageList[0].stageName"
      :stats="[`
        学习阶段: ${stageCount}
        课程总数: ${courseCount}`]"
    >
      <template
        #extra
      >
        <ArtButton
          type="edit"
          @click="goToEdit()"
        >
          项目设置
        </ArtButton>
      </template>
    </AdminPageHeader>

    <section
      class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
    >
      <div
        class="art-card flex flex-col gap-2 py-5"
      >
        <div
          class="text-sm text-g-600"
        >
          学习阶段
        </div>

        <div
          class="text-2xl font-semibold text-g-900"
        >
          {{ stageCount }}
        </div>
      </div>

      <div
        class="art-card flex flex-col gap-2 py-5"
      >
        <div
          class="text-sm text-g-600"
        >
          课程总数
        </div>

        <div
          class="text-2xl font-semibold text-g-900"
        >
          {{ courseCount }}
        </div>
      </div>

      <div
        class="art-card flex flex-col gap-2 py-5"
      >
        <div
          class="text-sm text-g-600"
        >
          必修课程
        </div>

        <div
          class="text-2xl font-semibold text-g-900"
        >
          {{ requiredCourseCount }}
        </div>
      </div>

      <div
        class="art-card flex flex-col gap-2 py-5"
      >
        <div
          class="text-sm text-g-600"
        >
          选修课程
        </div>

        <div
          class="text-2xl font-semibold text-g-900"
        >
          {{ optionalCourseCount }}
        </div>
      </div>
    </section>

    <template
      v-if="projectStageList.length"
    >
      <section
        v-for="(item, index) in projectStageList"
        :key="item.stageId"
        class="art-card flex flex-col gap-5"
      >
        <div
          class="flex items-start justify-between gap-4 max-md:flex-col"
        >
          <div
            class="min-w-0"
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
            class="shrink-0 text-sm text-g-500"
          >
            学习顺序 {{ item.sortOrder }}
          </div>
        </div>

        <div
          v-if="item.course.length"
          class="flex flex-col gap-3"
        >
          <div
            v-for="course in item.course"
            :key="course.scId"
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

                  <el-tag
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
                  </el-tag>
                </div>

                <div
                  class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-g-600"
                >
                  <span>课程 ID：{{ course.couID }}</span>

                  <span>阶段排序：{{ course.sortOrder }}</span>

                  <span>推荐顺序：{{ course.recommended_Order }}</span>
                </div>

                <div
                  v-if="course.remark"
                  class="mt-2 text-xs leading-relaxed text-g-500"
                >
                  {{ course.remark }}
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

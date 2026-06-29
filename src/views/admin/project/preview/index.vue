<!------  2026-06-29---11:50---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const activeTab = ref<'outline' | 'detail'>('outline')

const loading = ref(false)

const PROJECT_LIST_PATH = '/admin/project'

const route = useRoute()

/**
 * 当前学习项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

const router = useRouter()

/**
 * 返回项目列表页
 */
function backToProjectList() {
  router.push({
    path: PROJECT_LIST_PATH,
  })
}

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
 * 获取项目预览页
 */
async function fetchProjectPreview() {
  projectStageList.value = await fetchAdminProjectStageList(projId.value)
}

onMounted(() => {
  void fetchProjectPreview()
})
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="projectStageList.projName"
      :stats="[`
        课程总数: ${projectStageList.projStageCourse},
        小节总数: ${projectStageList.projSectionCount},
        课程时长: ${projectStageList.projStageCourse} 分钟
      `]"
      @back="backToProjectList"
    >
      <template
        #extra
      >
        <!-- <ArtButton
          type="success"
          :loading="loading"
          @click="handleSubmit"
        >
          完成
        </ArtButton> -->
      </template>
    </AdminPageHeader>

    <el-tabs
      v-model="activeTab"
      v-loading="loading"
      class="course-editor-tabs"
    >
      <el-tab-pane
        label="项目目录"
        name="outline"
        class="art-card"
      >
        111
      </el-tab-pane>

      <el-tab-pane
        label="项目详情"
        name="detail"
        class="art-card"
      >
        111
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>

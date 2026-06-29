<!------  2026-06-29---11:50---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import ClientLayout from '@/views/client/layout/index.vue'

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
  <ClientLayout>
    <!-- <template
      #content
    >
      1
    </template> -->
    2222222222222222
  </ClientLayout>
</template>

<style lang="scss" scoped>

</style>

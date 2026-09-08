<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const route = useRoute()

const router = useRouter()

/**
 * 默认项目展示图预览地址。
 */
const previewImageUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3'

/**
 * 项目图片配置选项。
 */
const projectImageOptions = [
  {
    label: '项目封面图',
    buttonText: '自定义 项目封面图',
    alt: '项目封面图',
  },
  {
    label: '项目背景图',
    buttonText: '自定义 项目背景图',
    alt: '项目背景图',
  },
]

/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

/**
 * 返回项目列表页并关闭当前编辑标签。
 */
function backToProjectList() {
  workTabStore.removeTab(route.path)

  router.push({
    name: 'AdminProjectList',
  })
}

/**
 * 当前激活的编辑页签。
 */
const activeTab = ref<'basic' | 'apply' | 'setting'>('basic')

/**
 * 页面提交和详情加载状态。
 */
const loading = ref(false)

/**
 * 当前学习项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 是否为编辑模式。
 */
const isEditMode = computed(() => {
  return Boolean(route.params.projId)
})

/**
 * 表单数据。
 */
const formData = ref<AdminApi.Project.ProjectEditor>(createDefaultFormData(isEditMode.value))

/**
 * 页面标题。
 */
const pageTitle = computed(() => {
  return isEditMode.value ? `编辑项目-${formData.value.projName}` : '创建项目'
})

/**
 * 创建项目编辑表单默认值。
 *
 * @param editMode 是否为编辑模式。
 * @returns 默认项目编辑表单数据。
 */
function createDefaultFormData(editMode: boolean): AdminApi.Project.ProjectEditor {
  return {
    projName: editMode ? '' : '未命名项目',
    projIntro: '',
    projIsApply: 1,
    projIsRestrict: 1,
    projRestrictCount: 5,
    projIsRestrictTime: 1,
    projApplyStartTime: '',
    projApplyEndTime: '',
    projIsApplyApproval: 1,
  }
}

/**
 * 获取项目设置并回填表单。
 *
 * @returns 项目设置请求完成。
 */
async function getProjectSetting() {
  if (!projId.value) {
    return
  }

  loading.value = true
  try {
    formData.value = await fetchAdminProjectSetting(projId.value)
  }
  catch {
    ElNotification.error('项目详情获取失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    void getProjectSetting()
  }
})
async function handleSubmit() {
  if (loading.value) {
    return
  }

  loading.value = true
  try {
    if (isEditMode.value) {
      await fetchAdminProjectUpdate(formData.value)
      ElNotification.success('项目更新成功')
    }
    else {
      await fetchAdminProjectAdd(formData.value)
      ElNotification.success('项目创建成功')
    }

    backToProjectList()
  }
  catch {
    ElNotification.error(isEditMode.value ? '项目更新失败' : '项目创建失败')
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
    <AdminPageHeader
      :title="pageTitle"
      @back="backToProjectList"
    >
      <template
        #extra
      >
        <ArtButton
          type="success"
          :loading="loading"
          @click="handleSubmit"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <el-form
      label-width="120px"
      label-position="top"
      class="art-card"
    >
      <el-form-item
        label="项目名称"
        required
      >
        <el-input
          v-model="formData.projName"
          placeholder="请输入项目名称"
          class="w-full"
        />
      </el-form-item>

      <el-form-item
        label="项目介绍"
      >
        <el-input
          v-model="formData.projIntro"
          type="textarea"
          :rows="6"
          placeholder="请输入项目介绍"
          class="w-full"
        />
      </el-form-item>

      <el-form-item
        label="项目展示图片设置"
      >
        <div
          class="grid w-full grid-cols-2 gap-8 max-md:grid-cols-1"
        >
          <div
            v-for="item in projectImageOptions"
            :key="item.label"
            class="flex flex-col items-start"
          >
            <div
              class="mb-4 w-full"
            >
              <img
                :src="previewImageUrl"
                :alt="item.alt"
                class="h-40 w-64 rounded object-cover max-sm:h-auto max-sm:w-full max-sm:aspect-16/10"
              >
            </div>

            <div
              class="flex flex-wrap gap-2"
            >
              <el-button
                type="primary"
              >
                {{ item.buttonText }}
              </el-button>

            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

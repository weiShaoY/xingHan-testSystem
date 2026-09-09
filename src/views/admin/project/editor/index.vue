<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()

const router = useRouter()

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
 * 页面提交和详情加载状态。
 */
const loading = ref(false)

/**
 * 项目编辑表单实例。
 */
const formRef = ref<FormInstance>()

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
 * 项目表单校验规则。
 */
const formRules: FormRules<AdminApi.Project.ProjectEditor> = {
  projName: [
    {
      required: true,
      whitespace: true,
      message: '请输入项目名称',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 50,
      message: '项目名称长度需在 2-50 个字符之间',
      trigger: 'blur',
    },
  ],
  projIntro: [
    {
      required: true,
      whitespace: true,
      message: '请输入项目介绍',
      trigger: 'blur',
    },
  ],
  projCover: [
    {
      required: true,
      message: '请上传项目封面',
      trigger: 'change',
    },
  ],
}

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
    projIsUse: 1,
    asId: 0,
    projCover: '',
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

  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validate()
  }
  catch {
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

async function handleUploadCover(file: File) {
  try {
    const newFormData = new FormData()

    newFormData.append('file', file)

    const response = await fetchAdminUploadFile(newFormData) as any

    formData.value.projCover = response.data[0].url
    formData.value.asId = response.data[0].asId
    ElNotification.success('上传成功')
  }
  catch {
    ElNotification.error('封面上传失败，请重试')
  }
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-5 px-10 max-lg:px-6 max-sm:px-4"
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
      ref="formRef"
      v-loading="loading"
      :model="formData"
      :rules="formRules"
      label-position="top"
    >
      <div
        class="grid grid-cols-[minmax(0,1fr)_280px] gap-x-10 gap-y-8 max-lg:grid-cols-1"
      >
        <section>
          <div
            class="mb-5 flex items-baseline gap-2.5"
          >
            <h2
              class="m-0 text-base text-(--el-text-color-primary) font-semibold leading-normal"
            >
              项目信息
            </h2>

            <span
              class="text-xs text-(--el-text-color-secondary)"
            >
              完善项目名称和介绍
            </span>
          </div>

          <el-form-item
            prop="projName"
            label="项目名称"
            required
            class="mb-6"
          >
            <el-input
              v-model="formData.projName"
              placeholder="请输入项目名称"
              maxlength="50"
              show-word-limit
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            prop="projIntro"
            label="项目介绍"
            class="mb-0"
          >
            <el-input
              v-model="formData.projIntro"
              type="textarea"
              :rows="8"
              maxlength="500"
              show-word-limit
              resize="vertical"
              placeholder="请输入项目介绍"
              class="w-full"
            />
          </el-form-item>
        </section>

        <section
          class="border-l border-(--el-border-color-lighter) pl-8 max-lg:border-l-0 max-lg:pl-0"
        >
          <el-form-item
            prop="projCover"
            label="项目封面"
            required
            class="mb-0"
          >
            <div
              class="mb-5 flex items-baseline gap-2.5"
            >
              <h2
                class="m-0 text-base text-(--el-text-color-primary) font-semibold leading-normal"
              >
                项目封面
              </h2>

              <span
                class="text-xs text-(--el-text-color-secondary)"
              >
                建议使用横向图片
              </span>
            </div>

            <UploadImage
              class="h-40 w-full max-w-full"
              :preview-url="getFileUrl(formData.projCover)"
              @upload="handleUploadCover"
            />
          </el-form-item>
        </section>

        <section
          class="col-span-2 max-lg:col-span-1"
        >
          <div
            class="mb-5 flex items-baseline gap-2.5"
          >
            <h2
              class="m-0 text-base text-(--el-text-color-primary) font-semibold leading-normal"
            >
              发布设置
            </h2>

            <span
              class="text-xs text-(--el-text-color-secondary)"
            >
              控制项目是否对学员开放
            </span>
          </div>

          <div
            class="flex min-h-18 items-center justify-between gap-4 rounded-lg border border-(--el-border-color-lighter) bg-(--el-fill-color-lighter) px-4.5 py-4"
          >
            <div>
              <div
                class="font-medium text-(--el-text-color-primary)"
              >
                启用项目
              </div>

              <div
                class="mt-1 text-sm text-info"
              >
                允许学员正常访问项目及其课程内容
              </div>
            </div>

            <el-switch
              v-model="formData.projIsUse"
              active-value="1"
              inactive-value="0"
            />
          </div>
        </section>
      </div>
    </el-form>
  </div>
</template>

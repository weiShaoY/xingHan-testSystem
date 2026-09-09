<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程新增或者编辑编辑页  ------------------------------------------------->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

/**
 * 课程小节解锁方式选项。
 */
const unlockMethodOptions = [
  {
    value: 1,
    label: '顺序解锁',
    description: '学员必须按章节顺序学习，完成当前章节后，自动解锁下一章节，无需额外条件。',
  },
  {
    value: 2,
    label: '进度解锁',
    description: '学员需完成上一必修小节，才会解锁下一必修小节。两个必修小节间的选修小节将自动解锁。课程拥有者和协作者不受闯关模式影响，始终可以查看所有小节。',
  },
  {
    value: 3,
    label: '章节测试解锁',
    description: '学员必须完成当前章节的测试并达到合格分数，方可解锁下一章节，未达标无法继续学习后续内容。',
  },
]

const route = useRoute()

const router = useRouter()

/**
 * 工作标签页 Store。
 */
const workTabStore = useWorkTabStore()

/**
 * 页面提交和详情加载状态。
 */
const loading = ref(false)

/**
 * 当前课程 ID
 */
const couId = computed(() => {
  return Number(route.params.couId || 0)
})

/**
 * 是否为编辑模式。
 */
const isEditMode = computed(() => {
  return Boolean(route.params.couId)
})

/**
 * 课程编辑表单实例。
 */
const formRef = ref<FormInstance>()

/**
 * 表单数据。
 */
const formData = ref<AdminApi.Course.CourseEditor>(createDefaultFormData())

/**
 * 表单校验规则。
 */
const formRules: FormRules<AdminApi.Course.CourseEditor> = {
  couName: [
    {
      required: true,
      whitespace: true,
      message: '请输入课程名称',
      trigger: 'blur',
    },
  ],
  couIntro: [
    {
      required: true,
      whitespace: true,
      message: '请输入课程介绍',
      trigger: 'blur',
    },
  ],
  couLogo: [
    {
      required: true,
      message: '请上传课程封面',
      trigger: 'change',
    },
  ],

}

/**
 * 页面标题。
 */
const pageTitle = computed(() => {
  return isEditMode.value ? `设置课程-${formData.value.couName}` : '创建课程'
})

/**
 * 创建课程编辑表单默认值。
 *
 * @returns 默认课程编辑表单数据。
 */
function createDefaultFormData(): AdminApi.Course.CourseEditor {
  return {
    couName: isEditMode.value ? '' : '未命名课程',
    couIntro: '',
    isRecommended: 1,
    couIsUse: 1,
    couLogo: '',
    couUnlockMethod: 1,
    asId: 0,
  }
}

/**
 * 获取课程设置并回填表单。
 *
 * @returns 课程设置请求完成。
 */
async function getCourseSetting() {
  if (!couId.value) {
    return
  }

  loading.value = true
  try {
    formData.value = await fetchAdminCourseSetting(couId.value)
  }
  catch {
    ElNotification.error('课程详情获取失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 返回课程列表页并关闭当前编辑标签。
 */
function backToCourseList() {
  workTabStore.removeTab(route.path)

  router.push({
    name: 'AdminCourseList',
  })
}

/**
 * 保存或创建课程。
 *
 * @returns 提交请求完成。
 */
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
      await fetchAdminCourseUpdate(formData.value)
      ElNotification.success('课程更新成功')
    }
    else {
      await fetchAdminCourseAdd(formData.value)
      ElNotification.success('课程创建成功')
    }

    backToCourseList()
  }
  catch {
    ElNotification.error(isEditMode.value ? '课程更新失败' : '课程创建失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    void getCourseSetting()
  }
})

async function handleUploadLogo(file: File) {
  const newFormData = new FormData()

  newFormData.append('file', file)

  const response = await fetchAdminUploadFile(newFormData) as any

  formData.value.couLogo = response.data[0].url
  formData.value.asId = response.data[0].asId
  ElNotification.success('上传成功')
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-5 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="pageTitle"
      @back="backToCourseList"
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
              课程信息
            </h2>

            <span
              class="text-xs text-(--el-text-color-secondary)"
            >
              完善课程名称和介绍
            </span>
          </div>

          <el-form-item
            prop="couName"
            label="课程名称"
            class="mb-6"
          >
            <el-input
              v-model="formData.couName"
              placeholder="请输入课程名称"
              maxlength="50"
              show-word-limit
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            prop="couIntro"
            label="课程介绍"
            class="mb-0"
          >
            <el-input
              v-model="formData.couIntro"
              type="textarea"
              :rows="8"
              maxlength="500"
              show-word-limit
              resize="vertical"
              placeholder="请输入课程介绍"
              class="w-full"
            />
          </el-form-item>
        </section>

        <section
          class="border-l border-(--el-border-color-lighter) pl-8 max-lg:border-l-0 max-lg:pl-0"
        >
          <el-form-item
            prop="couLogo"
            label="课程封面"
            required
            class="mb-0"
          >
            <div
              class="mb-5 flex items-baseline gap-2.5"
            >
              <h2
                class="m-0 text-base text-(--el-text-color-primary) font-semibold leading-normal"
              >
                课程封面
              </h2>

              <span
                class="text-xs text-(--el-text-color-secondary)"
              >
                建议使用横向图片
              </span>
            </div>

            <UploadImage
              class="h-40  max-w-full"
              :preview-url="getFileUrl(formData.couLogo)"
              @upload="handleUploadLogo"
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
              控制课程在平台中的展示状态
            </span>
          </div>

          <div
            class="grid grid-cols-2 gap-4 max-sm:grid-cols-1"
          >
            <div
              class="flex min-h-18 items-center justify-between gap-4 rounded-lg border border-(--el-border-color-lighter) bg-(--el-fill-color-lighter) px-4.5 py-4"
            >
              <div>
                <div
                  class="font-medium text-(--el-text-color-primary)"
                >
                  推荐课程
                </div>

                <div
                  class="mt-1 text-sm text-info"
                >
                  在课程列表中优先展示
                </div>
              </div>

              <el-switch
                v-model="formData.isRecommended"
                active-value="1"
                inactive-value="0"
              />
            </div>

            <div
              class="flex min-h-18 items-center justify-between gap-4 rounded-lg border border-(--el-border-color-lighter) bg-(--el-fill-color-lighter) px-4.5 py-4"
            >
              <div>
                <div
                  class="font-medium text-(--el-text-color-primary)"
                >
                  启用课程
                </div>

                <div
                  class="mt-1 text-sm text-info"
                >
                  允许学员正常访问课程
                </div>
              </div>

              <el-switch
                v-model="formData.couIsUse"
                active-value="1"
                inactive-value="0"
              />
            </div>
          </div>
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
              学习规则
            </h2>

            <span
              class="text-xs text-(--el-text-color-secondary)"
            >
              设置课程小节的解锁方式
            </span>
          </div>

          <el-radio-group
            v-model="formData.couUnlockMethod"
            disabled
            class="grid w-full grid-cols-3 gap-4 max-lg:grid-cols-1"
          >
            <div
              v-for="item in unlockMethodOptions"
              :key="item.value"
              class="min-h-35 rounded-lg border border-(--el-border-color-lighter) bg-(--el-fill-color-lighter) p-4"
              :class="{
                'border-primary/40 bg-primary/5': formData.couUnlockMethod === item.value,
              }"
            >
              <el-radio
                :value="item.value"
              >
                <span
                  class="font-medium"
                >{{ item.label }}</span>
              </el-radio>

              <p
                class="mt-3 mb-0 text-xs text-(--el-text-color-secondary) leading-7"
              >
                {{ item.description }}
              </p>
            </div>
          </el-radio-group>
        </section>
      </div>
    </el-form>
  </div>
</template>

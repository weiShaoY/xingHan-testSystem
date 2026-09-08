<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程新增或者编辑编辑页  ------------------------------------------------->
<script lang="ts" setup>

/**
 * 默认课程展示图预览地址。
 */
const previewImageUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3'

/**
 * 课程图片配置项。
 */
const courseImageOptions = [
  {
    label: '课程封面图',
    buttonText: '自定义 课程封面图',
    alt: '课程封面图',
  },
  {
    label: '课程背景图',
    buttonText: '自定义 课程背景图',
    alt: '课程背景图',
  },
]

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
 * 当前激活的编辑页签。
 */
const activeTab = ref<'basic' | 'apply' | 'setting'>('basic')

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
 * 表单数据。
 */
const formData = ref<AdminApi.Course.CourseEditor>(createDefaultFormData())

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
    couIsApply: 1,
    couTitle: '',
    couIsRestrict: 1,
    couRestrictCount: 5,
    couIsRestrictTime: 1,
    couApplyStartTime: '',
    couApplyEndTime: '',
    couIsApplyApproval: 1,
    couIsCancel: 1,
    couApplyContent: '',
    couUnlockMethod: 1,
    couIsStudyInfo: 1,
    couIsLimitTime: 0,
    couLimitTime: 10,
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
    console.log('🚀 ~ file: index.vue:136 ~ formData.value:', formData.value)
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
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
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

    <el-tabs
      v-model="activeTab"
      v-loading="loading"
      class="course-editor-tabs"
    >
      <el-tab-pane
        label="基本信息"
        name="basic"
        class="art-card"
      >
        <el-form
          label-width="120px"
          label-position="top"
        >
          <el-form-item
            label="课程名称"
            required
          >
            <el-input
              v-model="formData.couName"
              placeholder="请输入课程名称"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="课程介绍"
          >
            <el-input
              v-model="formData.couIntro"
              type="textarea"
              :rows="6"
              placeholder="请输入课程介绍"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="课程展示图片设置"
          >
            <div
              class="grid w-full grid-cols-2 gap-8 max-md:grid-cols-1"
            >
              <div
                v-for="item in courseImageOptions"
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

          <el-form-item
            label="课程小节解锁方式"
          >
            <div
              class="flex w-full items-center gap-10"
            >
              <el-radio-group
                v-model="formData.couUnlockMethod"
              >
                <div
                  class="flex flex-col gap-4"
                >
                  <div
                    v-for="item in unlockMethodOptions"
                    :key="item.value"
                    class="flex items-center"
                  >
                    <el-radio
                      :value="item.value"
                      class="w-30"
                    >
                      {{ item.label }}
                    </el-radio>

                    <div
                      class="text-info text-sm"
                    >
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>

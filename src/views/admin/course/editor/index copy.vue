<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------  课程编辑器  ------------------------------------------------->
<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'

import {
  computed,
  onMounted,
  ref,
} from 'vue'

const route = useRoute()

const router = useRouter()

const activeTab = ref('basic')

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(route.params.id)
})

/**
 * 课程 ID
 */
const courseId = computed(() => {
  return String(route.params.id || '')
})

/**
 * 页面标题
 */
const pageTitle = computed(() => {
  return isEditMode.value ? '编辑课程' : '创建课程'
})

/**
 * 提交按钮文本
 */
const submitButtonText = computed(() => {
  return isEditMode.value ? '保存' : '完成'
})

/**
 * 表单数据
 */
const formData = ref({
  // 基本信息
  name: '未命名课程',
  courseForm: 'online',
  category: '',
  tags: '',

  // 图片设置
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3',
  backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20landscape%20with%20colorful%20trees&image_size=landscape_4_3',

  // 报名设置
  enableEnrollment: true,
  enrollmentTitle: '未命名课程',
  enrollmentQuotaType: 'unlimited',
  enrollmentLimit: '',
  enrollmentTimeType: 'unlimited',
  enrollmentStart: '',
  enrollmentEnd: '',
  enrollmentAuditType: 'auto',
  allowCancelEnrollment: 'no',
  enrollmentIntroduction: '',

  enrollmentFields: {
    name: false,
    phone: false,
    company: false,
  },

  enrollmentFieldLabels: {
    name: '输入真实姓名',
    phone: '输入手机号码',
    company: '您的公司',
  },

  enrollmentFieldRequired: {
    name: false,
    phone: false,
    company: false,
  },

  // 高级设置
  enablePassMode: true,
  electiveUnlockCondition: 'previous_completed',
  singleSectionMode: false,
  enableAutoEvaluation: true,
  enableAutoNextSection: false,
  showCompletedLearners: true,
  enableLearningTimeLimit: false,
  showSectionNumbers: true,
})

/**
 * 内容分类选项
 */
const categoryOptions = [
  {
    label: '前端开发',
    value: 'frontend',
  },
  {
    label: '后端开发',
    value: 'backend',
  },
  {
    label: '移动开发',
    value: 'mobile',
  },
  {
    label: '数据分析',
    value: 'data',
  },
  {
    label: '人工智能',
    value: 'ai',
  },
  {
    label: '云计算',
    value: 'cloud',
  },
  {
    label: '网络安全',
    value: 'security',
  },
  {
    label: '其他',
    value: 'other',
  },
]

/**
 * 报名信息字段 key
 */
type EnrollmentFieldKey = 'name' | 'phone' | 'company'

/**
 * 报名信息字段配置
 */
const enrollmentFieldOptions: Array<{
  key: EnrollmentFieldKey
  label: string
}> = [
  {
    key: 'name',
    label: '姓名',
  },
  {
    key: 'phone',
    label: '手机号',
  },
  {
    key: 'company',
    label: '公司',
  },
]

/**
 * 获取课程详情
 */
async function getCourseDetail() {
  if (!courseId.value) {
    return
  }

  // TODO: 替换成真实接口
  console.log('获取课程详情:', courseId.value)

  // 示例：接口返回后回填表单
  // const res = await getCourseDetailApi(courseId.value)
  //
  // formData.value = {
  //   ...formData.value,
  //   ...res.data,
  // }
}

/**
 * 上传图片
 *
 * @param type 图片类型
 */
function uploadImage(type: string) {
  console.log('上传图片:', type)
}

/**
 * AI 生成图片
 *
 * @param type 图片类型
 */
function generateImage(type: string) {
  console.log('AI生成图片:', type)
}

/**
 * 自定义封面
 */
function customCover() {
  console.log('自定义封面')
}

/**
 * 创建课程
 */
async function createCourse() {
  // TODO: 替换成真实创建接口
  console.log('创建课程:', formData.value)
}

/**
 * 更新课程
 */
async function updateCourse() {
  // TODO: 替换成真实更新接口
  console.log('更新课程:', courseId.value, formData.value)
}

/**
 * 提交课程
 */
async function handleSubmitCourse() {
  if (isEditMode.value) {
    await updateCourse()
  }
  else {
    await createCourse()
  }

  router.back()
}

onMounted(() => {
  if (isEditMode.value) {
    getCourseDetail()
  }
})
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      :title="pageTitle"
    >
      <template
        #extra
      >
        <ArtButton
          type="success"
          @click="handleSubmitCourse"
        >
          {{ submitButtonText }}
        </ArtButton>
      </template>
    </AdminPageHeader>

    <el-tabs
      v-model="activeTab"
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
              v-model="formData.name"
              placeholder="请输入课程名称"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="课程形式"
            required
          >
            <el-radio-group
              v-model="formData.courseForm"
              class="flex flex-wrap gap-x-6 gap-y-2"
            >
              <el-radio
                value="online"
              >
                在线课程
              </el-radio>

              <el-radio
                value="offline"
              >
                面授课程
              </el-radio>

              <el-radio
                value="hybrid"
              >
                混合式学习
              </el-radio>

              <el-radio
                value="other"
              >
                其他
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="内容分类"
            required
          >
            <el-select
              v-model="formData.category"
              placeholder="请选择分类"
              class="w-full"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="课程标签"
            required
          >
            <el-input
              v-model="formData.tags"
              placeholder="用逗号隔开，方便更多学员找到您的课程"
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
                class="flex flex-col items-start"
              >
                <div
                  class="mb-4 w-full"
                >
                  <img
                    :src="formData.coverImage"
                    alt="课程封面图"
                    class="h-40 w-64 rounded object-cover max-sm:h-auto max-sm:w-full max-sm:aspect-16/10"
                  >
                </div>

                <div
                  class="flex flex-wrap gap-2"
                >
                  <el-button
                    type="primary"
                    @click="customCover"
                  >
                    自定义封面
                  </el-button>

                  <el-button
                    type="warning"
                    @click="generateImage('cover')"
                  >
                    AI生成
                  </el-button>
                </div>
              </div>

              <div
                class="flex flex-col items-start"
              >
                <div
                  class="mb-4 w-full"
                >
                  <img
                    :src="formData.backgroundImage"
                    alt="课程背景图"
                    class="h-40 w-64 rounded object-cover max-sm:h-auto max-sm:w-full max-sm:aspect-16/10"
                  >
                </div>

                <div
                  class="flex flex-wrap gap-2"
                >
                  <el-button
                    type="primary"
                    @click="uploadImage('background')"
                  >
                    上传图片
                  </el-button>

                  <el-button
                    type="warning"
                    @click="generateImage('background')"
                  >
                    AI生成
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        label="报名"
        name="enrollment"
        class="art-card"
      >
        <div
          class="mb-4"
        >
          <div
            class="flex gap-2 items-center"
          >
            <span
              class="font-medium"
            >
              报名
            </span>

            <el-tooltip
              content="开启报名后可以在小节的更多设置中开启小节试学，学员在报名之前可以完整学习试学小节的内容。"
            >
              <el-icon
                class="cursor-help"
              >
                <QuestionFilled />
              </el-icon>
            </el-tooltip>

            <el-switch
              v-model="formData.enableEnrollment"
            />
          </div>
        </div>

        <el-form
          label-position="top"
          label-width="120px"
        >
          <el-form-item
            label="报名页标题"
            required
          >
            <el-input
              v-model="formData.enrollmentTitle"
              placeholder="未命名课程"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="报名名额"
          >
            <div
              class="flex w-full flex-wrap gap-x-4 gap-y-2 items-center"
            >
              <el-radio-group
                v-model="formData.enrollmentQuotaType"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  value="unlimited"
                >
                  不限制
                </el-radio>

                <el-radio
                  value="limited"
                >
                  限制
                </el-radio>
              </el-radio-group>

              <template
                v-if="formData.enrollmentQuotaType === 'limited'"
              >
                <el-input
                  v-model="formData.enrollmentLimit"
                  type="number"
                  placeholder="请输入限制人数"
                  class="w-40 max-sm:w-full"
                />

                <span>个</span>

                <el-tooltip
                  content="设置报名总名额"
                >
                  <el-icon
                    class="cursor-help"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
            </div>
          </el-form-item>

          <el-form-item
            label="报名开放时间"
          >
            <div
              class="flex w-full flex-col gap-3"
            >
              <div
                class="flex flex-wrap gap-x-4 gap-y-2 items-center"
              >
                <el-radio-group
                  v-model="formData.enrollmentTimeType"
                  class="flex flex-wrap gap-x-6 gap-y-2"
                >
                  <el-radio
                    value="unlimited"
                  >
                    不限制
                  </el-radio>

                  <el-radio
                    value="limited"
                  >
                    限制
                  </el-radio>
                </el-radio-group>

                <el-tooltip
                  content="设置报名开始和结束时间"
                >
                  <el-icon
                    class="cursor-help"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>

              <div
                v-if="formData.enrollmentTimeType === 'limited'"
                class="grid grid-cols-2 gap-4 max-md:grid-cols-1"
              >
                <el-date-picker
                  v-model="formData.enrollmentStart"
                  type="datetime"
                  placeholder="开始时间"
                  class="w-full!"
                />

                <el-date-picker
                  v-model="formData.enrollmentEnd"
                  type="datetime"
                  placeholder="结束时间"
                  class="w-full!"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="审核方式"
          >
            <div
              class="flex flex-wrap gap-x-4 gap-y-2 items-center"
            >
              <el-radio-group
                v-model="formData.enrollmentAuditType"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  value="auto"
                >
                  自动审核
                </el-radio>

                <el-radio
                  value="manual"
                >
                  手动审核
                </el-radio>
              </el-radio-group>

              <el-tooltip
                content="设置报名审核方式"
              >
                <el-icon
                  class="cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-form-item>

          <el-form-item
            label="允许学员取消报名"
          >
            <div
              class="flex flex-wrap gap-x-4 gap-y-2 items-center"
            >
              <el-radio-group
                v-model="formData.allowCancelEnrollment"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  value="no"
                >
                  不允许
                </el-radio>

                <el-radio
                  value="yes"
                >
                  允许
                </el-radio>
              </el-radio-group>

              <el-tooltip
                content="设置是否允许学员取消报名"
              >
                <el-icon
                  class="cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-form-item>

          <el-form-item
            label="报名介绍"
          >
            <el-input
              v-model="formData.enrollmentIntroduction"
              type="textarea"
              :rows="6"
              placeholder="请输入报名介绍"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="报名信息"
          >
            <div
              class="flex w-full flex-col gap-3"
            >
              <div
                v-for="item in enrollmentFieldOptions"
                :key="item.key"
                class="grid grid-cols-[auto_64px_minmax(0,1fr)_auto] gap-3 items-center max-sm:grid-cols-[auto_1fr] max-sm:items-start"
              >
                <el-checkbox
                  v-model="formData.enrollmentFields[item.key]"
                />

                <span
                  class="text-sm leading-8"
                >
                  {{ item.label }}
                </span>

                <el-input
                  v-model="formData.enrollmentFieldLabels[item.key]"
                  placeholder="请输入字段提示"
                  class="max-sm:col-span-2"
                />

                <el-checkbox
                  v-model="formData.enrollmentFieldRequired[item.key]"
                  class="max-sm:col-span-2"
                >
                  必填
                </el-checkbox>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        label="高级设置"
        name="advanced"
        class="art-card"
      >
        <div>
          <div
            class="mb-6"
          >
            <p
              class="text-4 text-g-600"
            >
              课程在您的个人主页默认为隐藏状态。您可以设置个人主页是否展示该课程。
            </p>
          </div>

          <el-form
            label-position="left"
          >
            <el-form-item>
              <div
                class="flex flex-col"
              >
                <el-checkbox
                  v-model="formData.enablePassMode"
                >
                  按课程小节解锁（闯关模式）
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  闯关模式下，学员需完成上一必修小节，才会解锁下一必修小节。两个必修小节间的选修小节将自动解锁。<br>
                  课程拥有者和协作者不受闯关模式影响，始终可以查看所有小节。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div
                class="flex flex-col pl-10 max-sm:pl-0"
              >
                <div>
                  选修小节解锁条件
                </div>

                <el-radio-group
                  v-model="formData.electiveUnlockCondition"
                  class="flex flex-wrap gap-x-6 gap-y-2"
                >
                  <el-radio
                    value="previous_section"
                  >
                    前面的必修小节解锁之后
                  </el-radio>

                  <el-radio
                    value="previous_completed"
                  >
                    前面的必修小节完成之后
                  </el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.singleSectionMode"
                >
                  单节模式
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  单节模式下，学员参与小节时，将无法从当前小节跳转至上一节或下一节课程。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.enableAutoEvaluation"
                >
                  学完视频和微课自动弹出课程评价弹窗
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  开启时，在学员学完视频和微课小节时，会自动弹出课程评价弹窗。关闭时，弹窗不会自动弹出。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.enableAutoNextSection"
                >
                  学完视频和微课自动进入下一个小节
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  开启时，在学员学完视频和微课小节时，会自动进入下一个小节。关闭时，学完不会自动进入下一个小节。该设置项仅在"学完视频和微课自动弹出课程评价弹窗"为"关闭"时生效。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.showCompletedLearners"
                >
                  视频和微课详情中显示已经学完的学员
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  开启时，学员可在视频和微课小节详情中查看"正在学习"与"已经学完"的学员。关闭时，"正在学习"与"已经学完"的学员将会被隐藏。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.enableLearningTimeLimit"
                >
                  课程学习时长统计上限
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  设置学习时长上限后，学员在本课程有效学习时长的最大值为讲师设置值。实际学习时长会始终被记录。
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div>
                <el-checkbox
                  v-model="formData.showSectionNumbers"
                >
                  显示小节序号
                </el-checkbox>

                <div
                  class="ml-6 mt-2 text-sm text-g-600 max-sm:ml-0"
                >
                  开启时，从第一个小节开始显示默认序号，小节顺序调整后序号会自动更新。<br>
                  关闭后，小节不再显示默认序号，您可以在小节标题中加入自定义序号。
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>

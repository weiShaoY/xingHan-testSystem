<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'

import { ref } from 'vue'

const activeTab = ref('basic')

/**
 * 表单数据
 */
const formData = ref({
  // 基本信息
  name: '未命名课程',
  courseForm: 'online', // online, offline, hybrid, other
  category: '',
  tags: '',

  // 图片设置
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3',
  backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20landscape%20with%20colorful%20trees&image_size=landscape_4_3',

  // 报名设置
  enableEnrollment: true,
  enrollmentTitle: '未命名课程',
  enrollmentQuotaType: 'unlimited', // unlimited, limited
  enrollmentLimit: '',
  enrollmentTimeType: 'unlimited', // unlimited, limited
  enrollmentStart: '',
  enrollmentEnd: '',
  enrollmentAuditType: 'auto', // auto, manual
  allowCancelEnrollment: 'no', // yes, no
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
 * 上传图片
 */
function uploadImage(type: string) {
  // 这里可以添加图片上传逻辑
  console.log('上传图片:', type)
}

/**
 * AI生成图片
 */
function generateImage(type: string) {
  // 这里可以添加AI生成图片逻辑
  console.log('AI生成图片:', type)
}

/**
 * 自定义封面
 */
function customCover() {
  // 这里可以添加自定义封面逻辑
  console.log('自定义封面')
}

/**
 * 添加报名字段
 */
function addEnrollmentField() {
  // 这里可以添加添加报名字段的逻辑
  console.log('添加报名字段')
}

/**
 * 完成创建
 */
function handleComplete() {
  // 这里可以添加表单提交逻辑
  console.log('完成创建:', formData.value)
}
</script>

<template>
  <div
    class="w-full"
  >
    <el-page-header
      @back="$router.back()"
    >
      <template
        #content
      >
        <div
          class="flex items-center"
        >
          编辑课程
        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex items-center"
        >
          <el-button
            type="primary"
            class="ml-2"
            @click="handleComplete"
          >
            完成
          </el-button>
        </div>
      </template>
    </el-page-header>

    <div
      class="mb-30 mt-10"
    >
      <el-tabs
        v-model="activeTab"
      >
        <el-tab-pane
          label="基本信息"
          name="basic"
          class="mt-5 border rounded-3 p-6"
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
                class="flex gap-8"
              >
                <!-- 课程封面图 -->
                <div
                  class="flex flex-col items-center"
                >
                  <div
                    class="mb-4"
                  >
                    <img
                      :src="formData.coverImage"
                      alt="课程封面图"
                      class="h-40 w-64 rounded object-cover"
                    >
                  </div>

                  <div
                    class="flex gap-2"
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

                <!-- 课程背景图 -->
                <div
                  class="flex flex-col items-center"
                >
                  <div
                    class="mb-4"
                  >
                    <img
                      :src="formData.backgroundImage"
                      alt="课程背景图"
                      class="h-40 w-64 rounded object-cover"
                    >
                  </div>

                  <div
                    class="flex gap-2"
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
          class="mt-5 border rounded-3 p-6"
        >
          <div
            class="mb-4"
          >
            <div
              class="flex items-center gap-2"
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
            <!-- 报名页标题 -->
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

            <!-- 报名名额 -->
            <el-form-item
              label="报名名额"
            >
              <el-radio-group
                v-model="formData.enrollmentQuotaType"
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

              <el-input
                v-if="formData.enrollmentQuotaType === 'limited'"
                v-model="formData.enrollmentLimit"
                type="number"
                placeholder="请输入限制人数"
                class="ml-6 mt-2 w-40"
              />

              <span
                v-if="formData.enrollmentQuotaType === 'limited'"
                class="ml-2"
              >个</span>

              <el-tooltip
                v-if="formData.enrollmentQuotaType === 'limited'"
                content="设置报名总名额"
              >
                <el-icon
                  class="ml-1 cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <!-- 报名开放时间 -->
            <el-form-item
              label="报名开放时间"
            >

              <el-radio-group
                v-model="formData.enrollmentTimeType"
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

              <div
                v-if="formData.enrollmentTimeType === 'limited'"
                class="ml-6 mt-2"
              >
                <el-date-picker
                  v-model="formData.enrollmentStart"
                  type="datetime"
                  placeholder="开始时间"
                  class="mr-4"
                />

                <el-date-picker
                  v-model="formData.enrollmentEnd"
                  type="datetime"
                  placeholder="结束时间"
                />
              </div>

              <el-tooltip
                content="设置报名开始和结束时间"
              >
                <el-icon
                  class="ml-1 cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <!-- 审核方式 -->
            <el-form-item
              label="审核方式"
            >
              <el-radio-group
                v-model="formData.enrollmentAuditType"
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
                  class="ml-1 cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <!-- 允许学员取消报名 -->
            <el-form-item
              label="允许学员取消报名"
            >
              <el-radio-group
                v-model="formData.allowCancelEnrollment"
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
                  class="ml-1 cursor-help"
                >
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <!-- 报名介绍 -->
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

            <!-- 报名信息 -->
            <el-form-item
              label="报名信息"
            >

              <div
                class=""
              >
                <!-- 姓名 -->
                <div
                  class="mb-3 flex items-center gap-2"
                >
                  <el-checkbox
                    v-model="formData.enrollmentFields.name"
                  />

                  <span>姓名</span>

                  <el-input
                    v-model="formData.enrollmentFieldLabels.name"
                    placeholder="输入真实姓名"
                    class="ml-2 flex-1"
                  />

                  <el-checkbox
                    v-model="formData.enrollmentFieldRequired.name"
                  >
                    必填
                  </el-checkbox>

                  <el-button
                    @click="addEnrollmentField"
                  >
                    +
                  </el-button>
                </div>
                <!-- 手机号 -->
                <div
                  class="mb-3 flex items-center gap-2"
                >
                  <el-checkbox
                    v-model="formData.enrollmentFields.phone"
                  />

                  <span>手机号</span>

                  <el-input
                    v-model="formData.enrollmentFieldLabels.phone"
                    placeholder="输入手机号码"
                    class="ml-2 flex-1"
                  />

                  <el-checkbox
                    v-model="formData.enrollmentFieldRequired.phone"
                  >
                    必填
                  </el-checkbox>

                  <el-button
                    @click="addEnrollmentField"
                  >
                    +
                  </el-button>
                </div>

                <!-- 公司 -->
                <div
                  class="mb-3 flex items-center gap-2"
                >
                  <el-checkbox
                    v-model="formData.enrollmentFields.company"
                  />

                  <span>公司</span>

                  <el-input
                    v-model="formData.enrollmentFieldLabels.company"
                    placeholder="您的公司"
                    class="ml-2 flex-1"
                  />

                  <el-checkbox
                    v-model="formData.enrollmentFieldRequired.company"
                  >
                    必填
                  </el-checkbox>

                  <el-button
                    @click="addEnrollmentField"
                  >
                    +
                  </el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          label="高级设置"
          name="advanced"
          class="mt-5 border rounded-3 p-6"
        >
          <div
            class=""
          >
            <div
              class="mb-6"
            >
              <p
                class="text-4 color-textSecondary"
              >
                课程在您的个人主页默认为隐藏状态。您可以设置个人主页是否展示该课程。
              </p>
            </div>

            <el-form
              label-position="left"
            >
              <!-- 按课程小节解锁（闯关模式） -->
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
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    闯关模式下，学员需完成上一必修小节，才会解锁下一必修小节。两个必修小节间的选修小节将自动解锁。<br>
                    课程拥有者和协作者不受闯关模式影响，始终可以查看所有小节。
                  </div>

                </div>

              </el-form-item>

              <!-- 选修小节解锁条件 -->
              <el-form-item>
                <div
                  class="flex flex-col pl-10"
                >
                  <div
                    class=""
                  >
                    选修小节解锁条件
                  </div>

                  <el-radio-group
                    v-model="formData.electiveUnlockCondition"
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

              <!-- 单节模式 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.singleSectionMode"
                  >
                    单节模式
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    单节模式下，学员参与小节时，将无法从当前小节跳转至上一节或下一节课程。
                  </div>

                </div>
              </el-form-item>

              <!-- 学完视频和微课自动弹出课程评价弹窗 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.enableAutoEvaluation"
                  >
                    学完视频和微课自动弹出课程评价弹窗
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    开启时，在学员学完视频和微课小节时，会自动弹出课程评价弹窗。关闭时，弹窗不会自动弹出。

                  </div>
                </div>
              </el-form-item>

              <!-- 学完视频和微课自动进入下一个小节 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.enableAutoNextSection"
                  >
                    学完视频和微课自动进入下一个小节
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    开启时，在学员学完视频和微课小节时，会自动进入下一个小节。关闭时，学完不会自动进入下一个小节。该设置项仅在"学完视频和微课自动弹出课程评价弹窗"为"关闭"时生效。
                  </div>
                </div>
              </el-form-item>

              <!-- 视频和微课详情中显示已经学完的学员 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.showCompletedLearners"
                  >
                    视频和微课详情中显示已经学完的学员
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    开启时，学员可在视频和微课小节详情中查看"正在学习"与"已经学完"的学员。关闭时，"正在学习"与"已经学完"的学员将会被隐藏。
                  </div>
                </div>
              </el-form-item>

              <!-- 课程学习时长统计上限 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.enableLearningTimeLimit"
                  >
                    课程学习时长统计上限
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
                  >
                    设置学习时长上限后，学员在本课程有效学习时长的最大值为讲师设置值。实际学习时长会始终被记录。
                  </div>
                </div>
              </el-form-item>

              <!-- 显示小节序号 -->
              <el-form-item>
                <div
                  class=""
                >
                  <el-checkbox
                    v-model="formData.showSectionNumbers"
                  >
                    显示小节序号
                  </el-checkbox>

                  <div
                    class="ml-6 mt-2 text-sm color-textSecondary"
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
  </div>
</template>

<style lang="scss" scoped>

</style>

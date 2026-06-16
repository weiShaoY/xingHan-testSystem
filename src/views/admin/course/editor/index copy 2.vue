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

const workTabStore = useWorkTabStore()

const activeTab = ref('basic')

const loading = ref(false)

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => {
  return Boolean(route.params.couId)
})

/**
 * 课程 ID
 */
const couId = computed(() => {
  return String(route.params.couId || '')
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
const formData = ref<AdminApi.Course.CourseEditor>({
  couName: '未命名课程',
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
})

/**
 * 报名信息字段 key
 */
// type EnrollmentFieldKey = 'name' | 'phone' | 'company'

/**
 * 报名信息字段配置
 */
// const enrollmentFieldOptions: Array<{
//   key: EnrollmentFieldKey
//   label: string
// }> = [
//   {
//     key: 'name',
//     label: '姓名',
//   },
//   {
//     key: 'phone',
//     label: '手机号',
//   },
//   {
//     key: 'company',
//     label: '公司',
//   },
// ]

/**
 * 获取课程详情
 */
async function getCourseDetail() {
  if (!couId.value) {
    return
  }

  const result = await fetchAdminCourseDetail(couId.value)

  formData.value = result
}

/**
 * 创建课程
 */
async function createCourse() {
  loading.value = true
  try {
    await fetchAdminCreateCourse(formData.value)
    ElNotification.success('课程创建成功')

    // 关闭当前标签页
    workTabStore.removeTab(route.path)

    router.push({
      path: '/admin/course',
    })
  }
  catch {
    ElNotification.error('课程创建失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 更新课程
 */
async function updateCourse() {
  loading.value = true
  try {
    await fetchAdminUpdateCourse(formData.value)

    // 关闭当前标签页
    workTabStore.removeTab(route.path)

    router.push({
      path: '/admin/course',
    })
    ElNotification.success('课程更新成功')
  }
  catch {
    ElNotification.error('课程更新失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 保存或创建课程
 */
async function handleSubmitCourse() {
  if (isEditMode.value) {
    await updateCourse()
  }
  else {
    await createCourse()
  }
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
      :loading="loading"
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
            label="内容分类"
            required
          >
            <!-- <el-select
              v-model="formData.couCategory"
              placeholder="请选择分类"
              class="w-full"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select> -->
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
                class="flex flex-col items-start"
              >
                <div
                  class="mb-4 w-full"
                >
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3"
                    alt="课程封面图"
                    class="h-40 w-64 rounded object-cover max-sm:h-auto max-sm:w-full max-sm:aspect-16/10"
                  >
                </div>

                <div
                  class="flex flex-wrap gap-2"
                >
                  <el-button
                    type="primary"
                  >
                    自定义 课程封面图
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
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20road%20scenery%20with%20colorful%20trees&image_size=landscape_4_3"
                    alt="课程背景图"
                    class="h-40 w-64 rounded object-cover max-sm:h-auto max-sm:w-full max-sm:aspect-16/10"
                  >
                </div>

                <div
                  class="flex flex-wrap gap-2"
                >
                  <el-button
                    type="primary"
                  >
                    自定义 课程背景图
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
              v-model="formData.couIsApply"
              :active-value="1"
              :inactive-value="0"
            />
          </div>
        </div>

        <el-form
          v-if="formData.couIsApply === 1"
          label-position="top"
          label-width="120px"
        >
          <el-form-item
            label="报名页标题"
            required
          >
            <el-input
              v-model="formData.couTitle"
              placeholder="未命名课程"
              class="w-full"
            />
          </el-form-item>

          <el-form-item
            label="报名名额"
          >
            <div
              class="flex w-full items-center gap-10"
            >
              <el-radio-group
                v-model="formData.couIsRestrict"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  :value="0"
                >
                  不限制
                </el-radio>

                <el-radio
                  :value="1"
                >
                  限制
                </el-radio>
              </el-radio-group>

              <div
                v-if="formData.couIsRestrict === 1"
                class="flex items-center gap-2"
              >
                <el-input
                  v-model="formData.couRestrictCount"
                  type="number"
                  placeholder="请输入限制人数"
                  class="w-40 "
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
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="报名开放时间"
          >
            <div
              class="flex w-full items-center gap-10"
            >
              <div
                class="flex flex-wrap gap-x-4 gap-y-2 items-center"
              >
                <el-radio-group
                  v-model="formData.couIsRestrictTime"
                  class="flex flex-wrap gap-x-6 gap-y-2"
                >
                  <el-radio
                    :value="0"
                  >
                    不限制
                  </el-radio>

                  <el-radio
                    :value="1"
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
                v-if="formData.couIsRestrictTime === 1"
                class="flex items-center gap-2"
              >
                <el-date-picker
                  v-model="formData.couApplyStartTime"
                  type="datetime"
                  placeholder="开始时间"
                  class="w-full!"
                />

                <el-date-picker
                  v-model="formData.couApplyEndTime"
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
                v-model="formData.couIsApplyApproval"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  :value="0"
                >
                  自动审核
                </el-radio>

                <el-radio
                  :value="1"
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
                v-model="formData.couIsCancel"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  :value="0"
                >
                  不允许
                </el-radio>

                <el-radio
                  :value="1"
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
              v-model="formData.couApplyContent"
              type="textarea"
              :rows="6"
              placeholder="请输入报名介绍"
              class="w-full"
            />
          </el-form-item>

          <!-- 先隐藏 -->
          <!-- <el-form-item
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
          </el-form-item> -->
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
            label-position="top"
          >
            <el-form-item
              label="课程小节解锁方式"
            >
              <div
                class="flex w-full items-center gap-10"
              >
                <el-radio-group
                  v-model="formData.couUnlockMethod"
                  class=""
                >
                  <div
                    class="flex flex-col gap-4"
                  >
                    <!-- 1. 顺序解锁 -->
                    <div
                      class="flex items-center"
                    >
                      <el-radio
                        :value="1"
                        class="w-30"
                      >
                        顺序解锁
                      </el-radio>

                      <div
                        class="text-info text-sm"
                      >
                        学员必须按章节顺序学习，完成当前章节后，自动解锁下一章节，无需额外条件。
                      </div>
                    </div>

                    <!-- 2. 进度解锁 -->
                    <div
                      class="flex items-center"
                    >
                      <el-radio
                        :value="2"
                        class="w-30"
                      >
                        进度解锁
                      </el-radio>

                      <div
                        class="text-info text-sm"
                      >
                        学员需完成上一必修小节，才会解锁下一必修小节。两个必修小节间的选修小节将自动解锁。<br>
                        课程拥有者和协作者不受闯关模式影响，始终可以查看所有小节。
                      </div>
                    </div>

                    <!-- 3. 章节测试解锁 -->
                    <div
                      class="flex items-center"
                    >
                      <el-radio
                        :value="3"
                        class="w-30"
                      >
                        章节测试解锁
                      </el-radio>

                      <div
                        class="text-info text-sm"
                      >
                        学员必须完成当前章节的测试并达到合格分数，方可解锁下一章节，未达标无法继续学习后续内容。
                      </div>
                    </div>
                  </div>
                </el-radio-group>
              </div>
            </el-form-item>

            <el-form-item
              label="视频和微课详情中显示已经学完的学员"
            >
              <el-checkbox
                v-model="formData.couIsStudyInfo"
                :true-value="1"
                :false-value="0"
              />

              <div
                class=" text-sm text-info "
              >
                开启时，学员可在视频和微课小节详情中查看"正在学习"与"已经学完"的学员。关闭时，"正在学习"与"已经学完"的学员将会被隐藏。
              </div>
            </el-form-item>

            <el-form-item
              label="课程学习时长统计上限"
            >
              <div
                class="flex flex-col gap-4"
              >
                <div
                  class="flex items-center gap-2"
                >
                  <el-checkbox
                    v-model="formData.couIsLimitTime"
                    :true-value="1"
                    :false-value="0"
                  />

                  <div
                    class="text-sm text-info"
                  >
                    设置学习时长上限后，学员在本课程有效学习时长的最大值为讲师设置值。实际学习时长会始终被记录。
                  </div>

                </div>

                <div
                  v-if="formData.couIsLimitTime"
                  class="flex items-center gap-2"
                >
                  <el-input-number
                    v-model="formData.couLimitTime"
                    :min="1"
                  />

                  <span>小时</span>

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

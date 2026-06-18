<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

/**
 * 是否为编辑模式。
 */
import type {
  FormInstance,
  FormItemRule,
  FormRules,
  TabPaneName,
} from 'element-plus'

import { QuestionFilled } from '@element-plus/icons-vue'

import {
  nextTick,
  onBeforeUpdate,
  ref,
} from 'vue'

/**
 * 当前激活的编辑页签。
 */
const activeTab = ref('basic')

const route = useRoute()

/**
 * 页面提交和详情加载状态。
 */
const loading = ref(false)

/**
 * 表单数据。
 */
const formData = ref<AdminApi.Project.ProjectEditor>(createDefaultFormData())

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
 * 页面标题。
 */
const pageTitle = computed(() => {
  return isEditMode.value ? `编辑项目-${formData.value.projName}` : '创建项目'
})

/**
 * 创建项目编辑表单默认值。
 *
 * @returns 默认项目编辑表单数据。
 */
function createDefaultFormData(): AdminApi.Project.ProjectEditor {
  return {
    projName: '未命名项目',
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
 * 获取课程详情并回填表单。
 *
 * @returns 课程详情请求完成。
 */
async function getProjectDetail() {
  if (!projId.value) {
    return
  }

  loading.value = true
  try {
    formData.value = await fetchAdminProjectDetail(projId.value)
    console.log('🚀 ~ file: index.vue:90 ~ formData.value:', formData.value)
  }
  catch {
    ElNotification.error('项目详情获取失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('🚀 ~ file: index.vue:102 ~ projId.value:', projId.value)
  if (isEditMode.value) {
    void getProjectDetail()
  }
})

// / //////////////////////////////////// ////////////////////////  2026-06-18---11:14---星期四  ////////////////////////
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

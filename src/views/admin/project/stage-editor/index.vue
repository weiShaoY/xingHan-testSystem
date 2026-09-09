<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import type {
  FormInstance,
  FormItemRule,
  FormRules,
  TabPaneName,
} from 'element-plus'

import { QuestionFilled } from '@element-plus/icons-vue'

import {
  computed,
  nextTick,
  onBeforeUpdate,
  ref,
} from 'vue'

import { useWorkTabStore } from '@/store/modules/workTab'

import AddCourseDialog from './AddCourseDialog.vue'

const store = useWorkTabStore()

const route = useRoute()

const router = useRouter()

type ProjectStage = AdminApi.Project.ProjectStageListItem

type StageCourse = AdminApi.Course.CourseListItem & {

  /** 课程小节数，接口可能随课程列表或阶段详情返回。 */
  couSectionCount?: number

  /** 兼容可能的通用小节数字段。 */
  sectionCount?: number
}

type StageCourseValidator = NonNullable<FormItemRule['validator']>

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 当前项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 标签页激活状态
 */
const activeTab = ref<'basic' | 'setting'>('basic')

/**
 * 激活的阶段 ID
 */
const activeStageId = ref<TabPaneName>('')

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
  allDuration: 0,
  nodes: [],
})

/**
 * 新增阶段临时 ID
 */
let nextTempStageId = -1

/**
 * 添加课程弹窗显示状态
 */
const isShowAddCourseDialog = ref(false)

/**
 * 当前操作的阶段索引
 */
const currentStageIndex = ref(0)

/**
 * 当前阶段已经添加的课程 ID。
 */
const currentStageCourseIds = computed(() => {
  return projectStageList.value.nodes[currentStageIndex.value]?.course.map(item => item.couId) ?? []
})

/**
 * 获取课程小节数量。
 *
 * @param course 课程数据。
 */
function getCourseSectionCount(course: AdminApi.Course.CourseListItem) {
  const stageCourse = course as StageCourse

  return Number(stageCourse.couSectionCount ?? stageCourse.sectionCount ?? 0) || 0
}

/**
 * 页面阶段统计。
 */
const projectStageStats = computed(() => {
  const courses = projectStageList.value.nodes.flatMap(stage => stage.course ?? [])

  const hasCourseSectionCount = courses.some((course) => {
    const stageCourse = course as StageCourse

    return stageCourse.couSectionCount !== undefined || stageCourse.sectionCount !== undefined
  })

  return {
    courseCount: courses.length,
    sectionCount: hasCourseSectionCount
      ? courses.reduce((total, course) => total + getCourseSectionCount(course), 0)
      : projectStageList.value.projSectionCount,
    stageCount: projectStageList.value.nodes.length,
  }
})

/**
 * 阶段表单实例
 */
const stageFormRefs = ref<FormInstance[]>([])

/**
 * 校验阶段课程
 */
function validateStageCourses(
  _rule: Parameters<StageCourseValidator>[0],
  value: AdminApi.Course.CourseListItem[] | undefined,
  callback: Parameters<StageCourseValidator>[2],
) {
  if (!value?.length) {
    callback(new Error('请至少添加一门课程'))
    return
  }

  const hasInvalidCourse = value.some(course => !course.couId || !String(course.couName || '').trim())

  if (hasInvalidCourse) {
    callback(new Error('请完善课程信息'))
    return
  }

  callback()
}

/**
 * 阶段表单校验规则
 */
const stageRules: FormRules<ProjectStage> = {
  stageName: [
    {
      required: true,
      message: '请输入阶段名称',
      trigger: 'blur',
    },
  ],
  stageIntro: [
    {
      required: true,
      whitespace: true,
      message: '请输入阶段描述',
      trigger: 'blur',
    },
  ],
  course: [
    {
      validator: validateStageCourses,
      trigger: 'change',
    },
  ],
}

/**
 * 获取项目阶段列表
 */
async function getProjectStageList() {
  loading.value = true

  try {
    projectStageList.value = await fetchAdminProjectStageList(projId.value)
    activeStageId.value = projectStageList.value.nodes[0]?.stageId ?? ''
  }
  catch {
    ElNotification.error('项目阶段列表获取失败')
  }
  finally {
    loading.value = false
  }
}

onBeforeUpdate(() => {
  stageFormRefs.value = []
})

getProjectStageList()

/**
 * 设置阶段表单实例
 */
function setStageFormRef(formRef: FormInstance | undefined, index: number) {
  if (!formRef) {
    return
  }

  stageFormRefs.value[index] = formRef
}

/**
 * 关闭当前页并返回项目阶段列表页
 */
function backToProjectStages() {
  store.removeTab(route.path)

  return router.push({
    name: 'AdminProjectStages',
    params: {
      projId: projId.value,
    },
  })
}

/**
 * 跳转到课程大纲页
 */
function goToCoursePreview(course: AdminApi.Course.CourseListItem) {
  const targetRoute = router.resolve({
    name: 'AdminCoursePreview',
    params: {
      couId: course.couId,
    },
  })

  window.open(targetRoute.href, '_blank')
}

/**
 * 刷新阶段和课程排序
 */
function refreshSortOrder() {
  projectStageList.value.nodes.forEach((stage, stageIndex) => {
    stage.sortOrder = stageIndex + 1
  })
}

/**
 * 创建空学习阶段
 */
function createStage(): ProjectStage {
  const sortOrder = projectStageList.value.nodes.length + 1

  const previousStage = projectStageList.value.nodes.at(-1)

  return {
    active: 1,
    companyId: previousStage?.companyId ?? 0,
    course: [],
    creater: 0,
    createTime: '',
    prerequisiteStage_Id: previousStage?.stageId ?? 0,
    projId: projId.value,
    sortOrder,
    stageId: nextTempStageId--,
    stageIntro: '',
    stageName: `学习阶段${sortOrder}`,
    stageType: 1,
    updater: 0,
    updateTime: '',
  }
}

/**
 * 通过标签页 name 获取阶段索引
 */
function findStageIndexByName(targetName: TabPaneName) {
  return projectStageList.value.nodes.findIndex(stage => `${stage.stageId}` === `${targetName}`)
}

/**
 * 处理标签页的编辑（添加/删除）
 */
function handleTabsEdit(targetName: TabPaneName | undefined, action: 'remove' | 'add') {
  if (action === 'add') {
    const newStage = createStage()

    projectStageList.value.isLearningStages = 1
    projectStageList.value.nodes.push(newStage)
    activeStageId.value = newStage.stageId
  }
  else if (action === 'remove') {
    if (!targetName) {
      return
    }

    if (projectStageList.value.nodes.length <= 1) {
      ElMessage.warning('至少保留一个学习阶段')
      return
    }

    const targetIndex = findStageIndexByName(targetName)

    if (targetIndex === -1) {
      return
    }

    projectStageList.value.nodes.splice(targetIndex, 1)
    refreshSortOrder()

    activeStageId.value = projectStageList.value.nodes[Math.min(targetIndex, projectStageList.value.nodes.length - 1)]?.stageId ?? ''
  }
}

/**
 * 提交项目编辑
 */
async function handleSubmitProject() {
  if (!projectStageList.value.nodes.length) {
    ElMessage.warning('请至少添加一个学习阶段')
    return
  }

  activeTab.value = 'basic'

  await nextTick()

  for (const [index, stage] of projectStageList.value.nodes.entries()) {
    activeStageId.value = stage.stageId
    await nextTick()

    try {
      await stageFormRefs.value[index]?.validate()
    }
    catch {
      ElMessage.warning(`请完善阶段 ${index + 1} 的信息`)
      return
    }
  }

  refreshSortOrder()

  const formData: AdminApi.Project.ProjectStageListEditor = {
    ...projectStageList.value,
    projSectionCount: projectStageStats.value.sectionCount,
    projStageCourse: projectStageStats.value.courseCount,
    nodes: projectStageList.value.nodes.map(stage => ({
      ...stage,
      stageName: stage.stageName.trim(),
      stageIntro: stage.stageIntro.trim(),
      course: stage.course,
    })),
  }

  try {
    await fetchAdminProjectStageListUpdate(formData)
    ElMessage.success('保存成功')

    await backToProjectStages()
  }
  catch {
    ElMessage.error('保存失败')
  }
}

/**
 * 打开添加课程弹窗
 */
function addCourse(stageIndex: number) {
  currentStageIndex.value = stageIndex
  isShowAddCourseDialog.value = true
}

/**
 * 添加课程到阶段
 */
function addCourseToStage(course: AdminApi.Course.CourseListItem, stageIndex: number) {
  const stage = projectStageList.value.nodes[stageIndex]

  if (!stage) {
    return
  }

  const isExist = stage.course.some(item => item.couId === course.couId)

  if (isExist) {
    ElMessage.warning('该课程已添加到当前阶段')
    return
  }

  stage.course.push({
    ...course,
  })
  stageFormRefs.value[stageIndex]?.validateField('course')
  ElMessage.success('课程已添加')
}

/**
 * 删除课程
 */
function removeCourse(stageIndex: number, courseIndex: number) {
  const courses = projectStageList.value.nodes[stageIndex]?.course

  if (!courses) {
    return
  }

  courses.splice(courseIndex, 1)
  refreshSortOrder()
  stageFormRefs.value[stageIndex]?.validateField('course')
}

/**
 * 移动课程顺序
 */
function moveCourse(stageIndex: number, courseIndex: number, direction: 'up' | 'down') {
  const courses = projectStageList.value.nodes[stageIndex]?.course

  if (!courses) {
    return
  }

  const targetIndex = direction === 'up' ? courseIndex - 1 : courseIndex + 1

  if (targetIndex < 0 || targetIndex >= courses.length) {
    return
  }

  const [course] = courses.splice(courseIndex, 1)

  courses.splice(targetIndex, 0, course)
  refreshSortOrder()
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <!-- 添加课程弹窗组件 -->
    <AddCourseDialog
      v-if="isShowAddCourseDialog"
      v-model="isShowAddCourseDialog"
      :stage-index="currentStageIndex"
      :added-course-ids="currentStageCourseIds"
      @add-course="addCourseToStage"
    />

    <AdminPageHeader
      :title="projectStageList.projName"
      :stats="[`
        项目阶段总数: ${projectStageStats.stageCount},
        课程总数: ${projectStageStats.courseCount},
        小节总数: ${projectStageStats.sectionCount},
      `]"
      @back="backToProjectStages"
    >
      <template
        #extra
      >
        <ArtButton
          type="success"
          :loading="loading"
          @click="handleSubmitProject"
        >
          完成
        </ArtButton>
      </template>
    </AdminPageHeader>

    <!-- 标签页 -->
    <div
      v-loading="loading"
      class="flex flex-col gap-4"
    >
      <el-tabs
        v-model="activeTab"
      >
        <el-tab-pane
          label="目录编辑"
          name="basic"
          class="art-card"
        >
          <!-- 阶段管理 -->
          <div
            class="flex flex-col gap-4"
          >
            <!-- 阶段标签页 -->
            <el-tabs
              v-model="activeStageId"
              class=""
              type="card"
              editable
              @edit="handleTabsEdit"
            >
              <template
                #add-icon
              >
                <ArtSvgIcon
                  icon="ri:add-line"
                  class="text-lg text-primary"
                />
              </template>

              <el-tab-pane
                v-for="(stage, index) in projectStageList.nodes"
                :key="stage.stageId"
                :label="`阶段 ${index + 1}: ${stage.stageName}`"
                :name="stage.stageId"
              >
                <el-form
                  :ref="(formRef) => setStageFormRef(formRef as FormInstance | undefined, index)"
                  :model="stage"
                  :rules="stageRules"
                  label-position="top"
                >
                  <el-form-item
                    label="阶段名称"
                    prop="stageName"
                    required
                  >
                    <el-input
                      v-model="stage.stageName"
                      placeholder="请输入阶段名称"
                      class="w-full"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    label="阶段描述"
                    prop="stageIntro"
                    required
                  >
                    <el-input
                      v-model="stage.stageIntro"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入阶段描述"
                      class="w-full"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item
                    label="课程"
                    prop="course"
                    required
                  >
                    <div
                      class="w-full"
                    >
                      <div
                        class="flex flex-col gap-3"
                      >
                        <!-- 课程列表 -->
                        <div
                          v-for="(course, courseIndex) in stage.course"
                          :key="`${course.couId}`"
                          class="rounded-lg border border-(--art-card-border) p-4"
                        >
                          <div
                            class="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch"
                          >
                            <div
                              class="grid min-w-0 flex-1 grid-cols-[32px_minmax(0,1fr)_96px] gap-4 items-center max-sm:grid-cols-[32px_minmax(0,1fr)] max-sm:items-start"
                            >
                              <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                              >
                                {{ courseIndex + 1 }}
                              </div>

                              <div
                                class="min-w-0"
                              >
                                <div
                                  class="truncate text-sm font-medium text-g-900"
                                >
                                  {{ course.couName || '-' }}
                                </div>

                                <!-- <div
                                  class="mt-1 text-xs text-g-600"
                                >
                                  {{ course.isRequired === 1 ? '必修课程' : '选修课程' }}
                                </div> -->
                              </div>

                              <!-- <el-select
                                v-model="course.isRequired"
                                placeholder="选择类型"
                                class="w-24 max-sm:col-start-2"
                              >
                                <el-option
                                  label="必修"
                                  :value="1"
                                />

                                <el-option
                                  label="选修"
                                  :value="0"
                                />
                              </el-select> -->
                            </div>

                            <div
                              class="flex items-center gap-2"
                            >
                              <ArtButton
                                icon="ri:arrow-up-line"
                                tooltip="上移"
                                :disabled="courseIndex === 0"
                                @click="moveCourse(index, courseIndex, 'up')"
                              />

                              <ArtButton
                                icon="ri:arrow-down-line"
                                tooltip="下移"
                                :disabled="courseIndex === stage.course.length - 1"
                                @click="moveCourse(index, courseIndex, 'down')"
                              />

                              <ArtButton
                                type="preview"
                                @click="goToCoursePreview(course)"
                              />

                              <ArtButton
                                type="delete"
                                @click="removeCourse(index, courseIndex)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <el-empty
                        v-if="!stage.course.length"
                        description="暂无课程"
                        :image-size="80"
                      />
                    </div>

                    <el-divider />

                    <div
                      class="flex items-center justify-between gap-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3 max-sm:flex-col max-sm:items-stretch"
                    >
                      <div
                        class="min-w-0"
                      >
                        <div
                          class="font-medium text-primary"
                        >
                          继续添加课程
                        </div>

                        <div
                          class="mt-1 text-xs text-g-600"
                        >
                          为当前阶段选择需要学习的课程
                        </div>
                      </div>

                      <ArtButton
                        type="add"
                        class="shrink-0 max-sm:w-full"
                        @click="addCourse(index)"
                      >
                        添加课程
                      </ArtButton>
                    </div>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>

            <el-empty
              v-if="!projectStageList.nodes.length"
              description="暂无学习阶段，请点击上方 + 添加"
              :image-size="80"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="高级设置"
          name="setting"
          class="art-card"
        >
          <!-- 高级设置内容 -->
          <div
            class="flex flex-col gap-6"
          >
            <!-- 设置多个学习阶段 -->
            <div
              class="rounded-lg border border-(--art-card-border) p-4"
            >
              <div
                class="mb-3 flex items-center justify-between gap-4"
              >
                <span
                  class="font-medium"
                >设置多个学习阶段</span>

                <el-tooltip
                  content="开启后可以创建多个学习阶段"
                  placement="top"
                >
                  <el-button
                    link
                    size="small"
                  >
                    <el-icon>
                      <QuestionFilled />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>

              <el-switch
                v-model="projectStageList.isLearningStages"
                :active-value="1"
                :inactive-value="0"
                active-text=""
                inactive-text=""
              />
            </div>

            <!-- 解锁条件 -->
            <div
              class="rounded-lg border border-(--art-card-border) p-4"
            >
              <div
                class="mb-3 flex items-center"
              >
                <span
                  class="font-medium"
                >解锁条件</span>

                <el-tooltip
                  content="设置课程的解锁方式"
                  placement="top"
                >
                  <el-button
                    link
                    size="small"
                    class="ml-2"
                  >
                    <el-icon>
                      <QuestionFilled />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>

              <el-radio-group
                v-model="projectStageList.unlockConditions"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  :value="0"
                >
                  按学习阶段解锁
                </el-radio>

                <el-radio
                  :value="1"
                >
                  按课程解锁
                </el-radio>

                <el-radio
                  :value="2"
                >
                  不限定学习顺序
                </el-radio>
              </el-radio-group>
            </div>

            <!-- 展示方式 -->
            <div
              class="rounded-lg border border-(--art-card-border) p-4"
            >
              <div
                class="mb-3 flex items-center"
              >
                <span
                  class="font-medium"
                >展示方式</span>

                <el-tooltip
                  content="设置课程的展示方式"
                  placement="top"
                >
                  <el-button
                    link
                    size="small"
                    class="ml-2"
                  >
                    <el-icon>
                      <QuestionFilled />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>

              <el-radio-group
                v-model="projectStageList.displayMethod"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  :value="0"
                >
                  展开学习阶段下的课程
                </el-radio>

                <el-radio
                  :value="1"
                >
                  折叠学习阶段下的课程
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__new-tab) {
  width: 30px !important;
  height: 30px !important;
  margin-bottom: 15px !important;
  &:hover {
    background-color: var(--el-color-primary-light-9) !important;
  }
}
</style>

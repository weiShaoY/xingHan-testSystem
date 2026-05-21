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
  nextTick,
  onBeforeUpdate,
  ref,
} from 'vue'

import AddCourseDialog from './AddCourseDialog.vue'

/**
   * 课程类型定义
   */
type Course = {
  id: string
  name: string
  type: string
  required: boolean
}

/**
 * 添加课程弹窗返回的课程数据
 */
type AddCoursePayload = {

  /** 课程名称 */
  name: string

  /** 课程类型 */
  type: string
}

/**
   * 阶段类型定义
   */
type Stage = {
  id: string
  name: string
  description: string
  courses: Course[]
}

/**
   * 标签页激活状态
   */
const activeTab = ref('basic')

/**
   * 激活的阶段ID
   */
const activeStageId = ref('1')

/**
   * 阶段索引计数器
   */
let stageIndex = 2

/**
   * 高级设置
   */
const advancedSettings = ref({
  // 是否启用多个学习阶段
  enableMultipleStages: true,

  // 解锁条件：stage-按学习阶段解锁，course-按课程解锁，none-不限定学习顺序
  unlockCondition: 'stage',

  // 展示方式：expanded-展开学习阶段下的课程，collapsed-折叠学习阶段下的课程
  displayMode: 'expanded',
})

/**
   * 弹窗相关数据
   */
const isShowAddCourseDialog = ref(false)

const currentStageIndex = ref(0)

/**
 * 阶段表单实例
 */
const stageFormRefs = ref<FormInstance[]>([])

/**
   * 阶段列表
   */
const stages = ref<Stage[]>([
  {
    id: '1',
    name: '学习阶段一',
    description: '学习阶段一阶段描述',
    courses: [
      {
        id: '1',
        name: '课程1',
        type: '在线课程',
        required: true,
      },
    ],
  },
  {
    id: '2',
    name: '学习阶段二',
    description: '学习阶段二阶段描述',
    courses: [],
  },
])

/**
 * 校验阶段课程
 */
const validateStageCourses: FormItemRule['validator'] = (_rule, value: Course[], callback) => {
  if (!value?.length) {
    callback(new Error('请至少添加一门课程'))
    return
  }

  const hasInvalidCourse = value.some(course => !course.name.trim() || !course.type.trim())

  if (hasInvalidCourse) {
    callback(new Error('请完善课程信息'))
    return
  }

  callback()
}

/**
 * 阶段表单校验规则
 */
const stageRules: FormRules<Stage> = {
  name: [
    {
      required: true,
      message: '请输入阶段名称',
      trigger: 'blur',
    },
  ],
  courses: [
    {
      validator: validateStageCourses,
      trigger: 'change',
    },
  ],
}

onBeforeUpdate(() => {
  stageFormRefs.value = []
})

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
   * 处理标签页的编辑（添加/删除）
   */
function handleTabsEdit(targetName: TabPaneName | undefined, action: 'remove' | 'add') {
  if (action === 'add') {
    // 添加新的学习阶段
    const newStage: Stage = {
      id: `${++stageIndex}`,
      name: `学习阶段${stageIndex}`,
      description: '',
      courses: [],
    }

    stages.value.push(newStage)
    activeStageId.value = newStage.id
  }
  else if (action === 'remove') {
    if (!targetName || stages.value.length <= 1) {
      return
    }

    const targetIndex = stages.value.findIndex(stage => stage.id === targetName)

    if (targetIndex === -1) {
      return
    }

    stages.value.splice(targetIndex, 1)

    // 重新编号阶段ID
    stages.value.forEach((stage, i) => {
      stage.id = `${i + 1}`
    })

    stageIndex = stages.value.length
    activeStageId.value = stages.value[Math.min(targetIndex, stages.value.length - 1)]?.id ?? ''
  }
}

/**
 * 提交项目编辑
 */
async function handleSubmitProject() {
  activeTab.value = 'basic'
  await nextTick()

  for (const [index, stage] of stages.value.entries()) {
    activeStageId.value = stage.id
    await nextTick()

    try {
      await stageFormRefs.value[index]?.validate()
    }
    catch {
      ElMessage.warning(`请完善阶段 ${index + 1} 的信息`)
      return
    }
  }

  const formData = {
    stages: stages.value.map(stage => ({
      ...stage,
      courses: stage.courses.map(course => ({
        ...course,
      })),
    })),
    advancedSettings: {
      ...advancedSettings.value,
    },
  }

  console.log('学习项目表单数据:', formData)
  ElMessage.success('表单验证通过，请查看控制台数据')
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
function addCourseToStage(course: AddCoursePayload, stageIndex: number) {
  const stage = stages.value[stageIndex]

  if (!stage) {
    return
  }

  // 检查课程是否已添加
  const isExist = stage.courses.some((c: Course) => c.name === course.name)

  if (isExist) {
    return
  }

  const newCourse: Course = {
    id: (stage.courses.length + 1).toString(),
    name: course.name,
    type: course.type,
    required: true,
  }

  stage.courses.push(newCourse)
}

/**
   * 删除课程
   */
function removeCourse(stageIndex: number, courseIndex: number) {
  stages.value[stageIndex].courses.splice(courseIndex, 1)

  // 重新编号课程ID
  stages.value[stageIndex].courses.forEach((course, i) => {
    course.id = `${i + 1}`
  })
}

/**
 * 移动课程顺序
 */
function moveCourse(stageIndex: number, courseIndex: number, direction: 'up' | 'down') {
  const courses = stages.value[stageIndex]?.courses

  if (!courses) {
    return
  }

  const targetIndex = direction === 'up' ? courseIndex - 1 : courseIndex + 1

  if (targetIndex < 0 || targetIndex >= courses.length) {
    return
  }

  const [course] = courses.splice(courseIndex, 1)

  courses.splice(targetIndex, 0, course)

  courses.forEach((item, index) => {
    item.id = `${index + 1}`
  })
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <!-- 添加课程弹窗组件 -->
    <AddCourseDialog
      v-model="isShowAddCourseDialog"
      :stage-index="currentStageIndex"
      @add-course="addCourseToStage"
    />

    <AdminPageHeader
      title="编辑学习项目"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="success"
          @click="handleSubmitProject"
        >
          完成
        </ArtIconButton>
      </template>
    </AdminPageHeader>

    <!-- 标签页 -->
    <div
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
              <el-tab-pane
                v-for="(stage, index) in stages"
                :key="stage.id"
                :label="`阶段 ${stage.id}: ${stage.name}`"
                :name="stage.id"
              >
                <el-form
                  :ref="(formRef) => setStageFormRef(formRef as FormInstance | undefined, index)"
                  :model="stage"
                  :rules="stageRules"
                  label-position="top"
                >
                  <el-form-item
                    label="阶段名称"
                    prop="name"
                    required
                  >
                    <el-input
                      v-model="stage.name"
                      placeholder="请输入阶段名称"
                      class="w-full"
                    />
                  </el-form-item>

                  <el-form-item
                    label="阶段描述"
                  >
                    <el-input
                      v-model="stage.description"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入阶段描述"
                      class="w-full"
                    />
                  </el-form-item>

                  <el-form-item
                    label="课程"
                    prop="courses"
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
                          v-for="(course, courseIndex) in stage.courses"
                          :key="course.id"
                          class="rounded-lg border border-[var(--art-card-border)] p-4"
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
                                {{ course.id }}
                              </div>

                              <div
                                class="min-w-0"
                              >
                                <div
                                  class="truncate text-sm font-medium text-g-900"
                                >
                                  {{ course.type }} {{ course.name }}
                                </div>

                                <div
                                  class="mt-1 text-xs text-g-600"
                                >
                                  {{ course.required ? '必修课程' : '选修课程' }}
                                </div>
                              </div>

                              <el-select
                                v-model="course.required"
                                placeholder="选择类型"
                                class="w-24 max-sm:col-start-2"
                              >
                                <el-option
                                  label="必修"
                                  :value="true"
                                />

                                <el-option
                                  label="选修"
                                  :value="false"
                                />
                              </el-select>
                            </div>

                            <div
                              class="flex items-center gap-2"
                            >
                              <ArtIconButton
                                icon="ri:arrow-up-line"
                                tooltip="上移"
                                :disabled="courseIndex === 0"
                                @click="moveCourse(index, courseIndex, 'up')"
                              />

                              <ArtIconButton
                                icon="ri:arrow-down-line"
                                tooltip="下移"
                                :disabled="courseIndex === stage.courses.length - 1"
                                @click="moveCourse(index, courseIndex, 'down')"
                              />

                              <ArtIconButton
                                type="view"
                              />

                              <ArtIconButton
                                type="delete"
                                @click="removeCourse(index, courseIndex)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <el-empty
                        v-if="!stage.courses.length"
                        description="暂无课程"
                        :image-size="80"
                      />
                    </div>

                    <el-divider />

                    <ArtIconButton
                      type="add"
                      @click="addCourse(index)"
                    >
                      添加课程
                    </ArtIconButton>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="高级设置"
          name="advanced"
          class="art-card"
        >
          <!-- 高级设置内容 -->
          <div
            class="flex flex-col gap-6"
          >
            <!-- 设置多个学习阶段 -->
            <div
              class="rounded-lg border border-[var(--art-card-border)] p-4"
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
                v-model="advancedSettings.enableMultipleStages"
                active-text=""
                inactive-text=""
              />
            </div>

            <!-- 解锁条件 -->
            <div
              class="rounded-lg border border-[var(--art-card-border)] p-4"
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
                v-model="advancedSettings.unlockCondition"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  value="stage"
                >
                  按学习阶段解锁
                </el-radio>

                <el-radio
                  value="course"
                >
                  按课程解锁
                </el-radio>

                <el-radio
                  value="none"
                >
                  不限定学习顺序
                </el-radio>
              </el-radio-group>
            </div>

            <!-- 展示方式 -->
            <div
              class="rounded-lg border border-[var(--art-card-border)] p-4"
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
                v-model="advancedSettings.displayMode"
                class="flex flex-wrap gap-x-6 gap-y-2"
              >
                <el-radio
                  value="expanded"
                >
                  展开学习阶段下的课程
                </el-radio>

                <el-radio
                  value="collapsed"
                >
                  折叠学习阶段下的课程
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        class="flex justify-end"
      >
        <ArtIconButton
          type="success"
          class="px-10 py-5 text-2xl!"
          @click="handleSubmitProject"
        >
          完成
        </ArtIconButton>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

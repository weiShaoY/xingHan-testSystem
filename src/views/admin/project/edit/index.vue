<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { TabPaneName } from 'element-plus'

import {
  Delete,
  Folder,
  QuestionFilled,
  Select,
  Top,
  View,
} from '@element-plus/icons-vue'

import { ref } from 'vue'

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
    // 删除学习阶段
    const tabs = stages.value

    let activeName = activeStageId.value

    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.id === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]

          if (nextTab) {
            activeName = nextTab.id
          }
        }
      })
    }

    activeStageId.value = activeName
    stages.value = tabs.filter(tab => tab.id !== targetName)

    // 重新编号阶段ID
    stages.value.forEach((stage, i) => {
      stage.id = `${i + 1}`
    })
    stageIndex = stages.value.length
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
function addCourseToStage(course: any, stageIndex: number) {
  const stage = stages.value[stageIndex]

  // 检查课程是否已添加
  const isExist = stage.courses.some((c: Course) => c.name === course.name)

  if (isExist) {
    return
  }

  const newCourse: Course = {
    id: (stage.courses.length + 1).toString(),
    name: course.name,
    type: '在线课程',
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
</script>

<template>
  <div
    class="w-full"
  >
    <!-- 添加课程弹窗组件 -->
    <AddCourseDialog
      v-model="isShowAddCourseDialog"
      :stage-index="currentStageIndex"
      @add-course="addCourseToStage"
    />

    <ArtPageHeader
      title="学习项目1 详情页"
    >
      <template
        #extra
      >
        <el-button
          type="primary"
          class="ml-2"
        >
          完成
        </el-button>
      </template>
    </ArtPageHeader>

    <!-- 标签页 -->
    <div
      class="mt-10"
    >
      <el-tabs
        v-model="activeTab"
        class=""
      >
        <el-tab-pane
          label="目录编辑"
          name="basic"
          class="mt-5 border rounded-3 p-6"
        >
          <!-- 阶段管理 -->
          <div
            class="mt-5"
          >
            <!-- 阶段标签页 -->
            <el-tabs
              v-model="activeStageId"
              class="mb-5"
              type="card"
              editable
              @edit="handleTabsEdit"
            >
              <template
                #add-icon
              >
                <el-icon>
                  <Select />
                </el-icon>
              </template>

              <el-tab-pane
                v-for="(stage, index) in stages"
                :key="stage.id"
                :label="`阶段 ${stage.id}: ${stage.name}`"
                :name="stage.id"
              >
                <el-form
                  label-position="left"
                  label-width="120px"
                >
                  <el-form-item
                    label="阶段名称"
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
                    required
                  >
                    <div
                      class=""
                    >
                      <div
                        class=""
                      >
                        <!-- 课程列表 -->
                        <div
                          v-for="(course, courseIndex) in stage.courses"
                          :key="course.id"
                          class="mb-3 flex items-center justify-between border rounded p-3"
                        >
                          <div
                            class="flex items-center gap-3"
                          >
                            <div
                              class="w-8 text-center"
                            >
                              {{ course.id }}
                            </div>

                            <el-select
                              v-model="course.required"
                              placeholder="选择类型"
                              class="w-20"
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

                            <div
                              class="flex items-center gap-2"
                            >
                              <el-button
                                size="small"
                              >
                                <el-icon>
                                  <Folder />
                                </el-icon>
                              </el-button>

                              <span>{{ course.type }} {{ course.name }}</span>
                            </div>
                          </div>

                          <div
                            class="flex items-center gap-2"
                          >
                            <el-button
                              size="small"
                            >
                              <el-icon>
                                <Top />
                              </el-icon>
                            </el-button>

                            <el-button
                              size="small"
                            >
                              <el-icon>
                                <View />
                              </el-icon>
                            </el-button>

                            <el-button
                              type="danger"
                              link
                              size="small"
                              @click="removeCourse(index, courseIndex)"
                            >
                              <el-icon>
                                <Delete />
                              </el-icon>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <el-divider />

                    <el-button
                      class="mt-2"
                      type="primary"
                      plain
                      @click="addCourse(index)"
                    >
                      + 添加课程
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="高级设置"
          name="advanced"
          class="px-0"
        >
          <!-- 高级设置内容 -->
          <div
            class="mt-5 border rounded-3 p-6"
          >
            <!-- 设置多个学习阶段 -->
            <div
              class="mb-6"
            >
              <div
                class="mb-2 flex items-center justify-between"
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
              class="mb-6"
            >
              <div
                class="mb-2 flex items-center"
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
              class="mb-6"
            >
              <div
                class="mb-2 flex items-center"
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

      <el-divider />

      <div
        class="flex justify-end"
      >
        <el-button
          type="primary"
        >
          完成
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .el-tag {
  font-size: 14px;
}

.el-button + .el-button {
  margin-left: 8px;
}
</style>

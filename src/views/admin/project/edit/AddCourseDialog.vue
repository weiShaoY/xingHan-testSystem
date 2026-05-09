<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

/**
 * 课程数据
 */
type CourseOption = {

  /** 访问码 */
  accessCode: string

  /** 课程名称 */
  name: string

  /** 课程类型 */
  type: string

  /** 课程拥有者 */
  owner: string

  /** 更新时间 */
  updateTime: string

  /** 课程简介 */
  description: string

  /** 是否已添加 */
  isAdded: boolean
}

const props = withDefaults(defineProps<{

  /** 当前阶段索引 */
  stageIndex?: number
}>(), {
  stageIndex: 0,
})

const emit = defineEmits<{

  /** 添加课程事件 */
  addCourse: [course: CourseOption, stageIndex: number]
}>()

const visible = defineModel<boolean>()

/**
   * 课程搜索数据
   */
const searchForm = ref({
  keyword: '',
  owner: '',
  updateTime: '',
})

/**
   * 课程列表数据
   */
const courseList = ref<CourseOption[]>([
  {
    accessCode: 'bvh105',
    name: '前端开发基础课程',
    type: '在线课程',
    owner: '张三',
    updateTime: '2026-04-13 15:36',
    description: '面向新手的 HTML、CSS、JavaScript 基础入门课程。',
    isAdded: true,
  },
  {
    accessCode: 'vue260',
    name: 'Vue 3 项目实战',
    type: '在线课程',
    owner: '李四',
    updateTime: '2026-04-16 09:20',
    description: '从组件设计、状态管理到后台管理系统落地的完整实战课程。',
    isAdded: false,
  },
  {
    accessCode: 'ops318',
    name: '企业安全规范培训',
    type: '线下课程',
    owner: '王五',
    updateTime: '2026-04-18 14:05',
    description: '覆盖账号安全、数据权限、合规流程等企业通用安全规范。',
    isAdded: false,
  },
  {
    accessCode: 'ai924',
    name: 'AI 工具提效训练营',
    type: '混合课程',
    owner: '赵六',
    updateTime: '2026-04-20 11:12',
    description: '结合线上学习和线下演练，提升团队 AI 工具使用效率。',
    isAdded: false,
  },
])

/**
   * 搜索课程
   */
function searchCourses() {
  // 这里可以添加搜索逻辑
  console.log('搜索课程:', searchForm.value)
}

/**
   * 清空搜索
   */
function clearSearch() {
  searchForm.value = {
    keyword: '',
    owner: '',
    updateTime: '',
  }
}

/**
   * 查看课程详情
   */
function viewCourse(course: CourseOption) {
  // 这里可以添加查看课程详情的逻辑
  console.log('查看课程:', course)
}

/**
   * 添加课程
   */
function addCourse(course: CourseOption) {
  emit('addCourse', course, props.stageIndex)

  // 更新课程列表中的状态
  const courseItem = courseList.value.find(item => item.accessCode === course.accessCode)

  if (courseItem) {
    courseItem.isAdded = true
  }
}

/**
   * 关闭弹窗
   */
function closeDialog() {
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="添加课程到学习项目"
    width="800px"
    :close-on-click-modal="false"
  >
    <!-- 搜索区域 -->
    <div
      class="mb-4 flex flex-col gap-3"
    >
      <el-input
        v-model="searchForm.keyword"
        placeholder="课程名称、介绍、标签和访问码"
        class="w-full"
      />

      <div
        class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] gap-2 max-md:grid-cols-2 max-sm:grid-cols-1"
      >
        <el-input
          v-model="searchForm.owner"
          placeholder="拥有者"
        />

        <el-input
          v-model="searchForm.updateTime"
          placeholder="课程更新时间"
        />

        <el-button
          type="primary"
          @click="searchCourses"
        >
          搜索
        </el-button>

        <el-button
          @click="clearSearch"
        >
          清空
        </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <el-table
      :data="courseList"
      style="width: 100%"
      border
      class="max-sm:hidden"
    >
      <el-table-column
        prop="accessCode"
        label="访问码"
        width="100"
      />

      <el-table-column
        prop="name"
        label="课程名称"
        min-width="200"
      />

      <el-table-column
        prop="type"
        label="类型"
        width="100"
      />

      <el-table-column
        prop="owner"
        label="拥有者"
        width="100"
      />

      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="150"
      />

      <el-table-column
        label="查看"
        width="80"
        align="center"
      >
        <template
          #default="scope"
        >
          <el-button
            link
            size="small"
            @click="viewCourse(scope.row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="添加"
        width="80"
        align="center"
      >
        <template
          #default="scope"
        >
          <el-button
            v-if="!scope.row.isAdded"
            type="primary"
            size="small"
            @click="addCourse(scope.row)"
          >
            添加
          </el-button>

          <el-button
            v-else
            type="info"
            size="small"
            disabled
          >
            已添加
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div
      class="hidden flex-col gap-3 max-sm:flex"
    >
      <div
        v-for="course in courseList"
        :key="course.accessCode"
        class="rounded-lg border border-[var(--art-card-border)] p-4"
      >
        <div
          class="flex items-start justify-between gap-3"
        >
          <div
            class="min-w-0"
          >
            <div
              class="font-medium text-g-900"
            >
              {{ course.name }}
            </div>

            <div
              class="mt-2 flex flex-col gap-1 text-xs text-g-600"
            >
              <span>访问码：{{ course.accessCode }}</span>

              <span>类型：{{ course.type }}</span>

              <span>拥有者：{{ course.owner }}</span>

              <span>更新时间：{{ course.updateTime }}</span>

              <span>{{ course.description }}</span>
            </div>
          </div>

          <ArtIconButton
            type="view"
            @click="viewCourse(course)"
          />
        </div>

        <div
          class="mt-4 flex justify-end"
        >
          <el-button
            v-if="!course.isAdded"
            type="primary"
            size="small"
            @click="addCourse(course)"
          >
            添加
          </el-button>

          <el-button
            v-else
            type="info"
            size="small"
            disabled
          >
            已添加
          </el-button>
        </div>
      </div>
    </div>

    <!-- 分页信息 -->
    <div
      class="mt-4 flex justify-end"
    >
      <span>共 {{ courseList.length }} 条</span>
    </div>

    <!-- 底部按钮 -->
    <template
      #footer
    >
      <div
        class="flex justify-end"
      >
        <el-button
          @click="closeDialog"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="closeDialog"
        >
          完成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

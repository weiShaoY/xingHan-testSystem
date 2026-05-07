<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
  import { View } from '@element-plus/icons-vue'

  import { ref } from 'vue'

  const props = defineProps({
    /**
     * 当前阶段索引
     */
    stageIndex: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits<{
    // 添加课程事件
    (e: 'addCourse', course: any, stageIndex: number): void
  }>()

  const visible = defineModel({
    type: Boolean
  })

  /**
   * 课程搜索数据
   */
  const searchForm = ref({
    keyword: '',
    owner: '',
    updateTime: ''
  })

  /**
   * 课程列表数据
   */
  const courseList = ref([
    {
      accessCode: 'bvh105',
      name: '课程1',
      updateTime: '2026-04-13 15:36',
      isAdded: true
    }
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
      updateTime: ''
    }
  }

  /**
   * 查看课程详情
   */
  function viewCourse(course: any) {
    // 这里可以添加查看课程详情的逻辑
    console.log('查看课程:', course)
  }

  /**
   * 添加课程
   */
  function addCourse(course: any) {
    emit('addCourse', course, props.stageIndex)

    // 更新课程列表中的状态
    const courseItem = courseList.value.find((item) => item.accessCode === course.accessCode)

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
    <div class="mb-4">
      <el-input
        v-model="searchForm.keyword"
        placeholder="课程名称、介绍、标签和访问码"
        class="mb-2 w-full"
      />

      <div class="flex items-center gap-2">
        <el-input v-model="searchForm.owner" placeholder="拥有者" class="w-1/4" />

        <el-input v-model="searchForm.updateTime" placeholder="课程更新时间" class="w-1/4" />

        <el-button type="primary" style="background-color: #f90" @click="searchCourses">
          搜索
        </el-button>

        <el-button @click="clearSearch"> 清空 </el-button>
      </div>
    </div>

    <!-- 课程列表 -->
    <el-table :data="courseList" style="width: 100%" border>
      <el-table-column prop="accessCode" label="访问码" width="100" />

      <el-table-column prop="name" label="课程名称" min-width="200" />

      <el-table-column prop="updateTime" label="更新时间" width="150" />

      <el-table-column label="查看" width="80" align="center">
        <template #default="scope">
          <el-button link size="small" @click="viewCourse(scope.row)">
            <el-icon>
              <View />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="添加" width="80" align="center">
        <template #default="scope">
          <el-button
            v-if="!scope.row.isAdded"
            type="primary"
            size="small"
            @click="addCourse(scope.row)"
          >
            添加
          </el-button>

          <el-button v-else type="info" size="small" disabled> 已添加 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页信息 -->
    <div class="mt-4 flex justify-end">
      <span>共 1 条</span>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeDialog"> 取消 </el-button>

        <el-button
          type="primary"
          style="background-color: #f90; border-color: #f90"
          @click="closeDialog"
        >
          完成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

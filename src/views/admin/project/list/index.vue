<script lang="ts" setup>
  import { ref } from 'vue'

  import AllocateDialog from './AllocateDialog.vue'

  import CreateProjectDialog from './CreateProjectDialog.vue'

  const inputVModel = ref('')

  /**
   *  是否显示创建学习项目弹窗
   */
  const isShowCreateProjectDialog = ref(false)

  /**
   * 学习项目类型定义
   */
  type StudyProject = {
    /** 唯一标识 */
    id: string

    /** 项目标题 */
    title: string

    /** 项目描述 */
    description: string

    /** 时间 */
    date: string

    /** 学习阶段数量 */
    stageCount: number

    /** 课程数量 */
    courseCount: number

    /** 跳转链接 */
    link?: string
  }

  /**
   * 学习项目列表
   */
  const projectList = ref<StudyProject[]>([
    {
      id: '1',
      title: '未命名学习项目1',
      description: '暂时没有项目描述',
      date: '2026/04/12',
      stageCount: 1,
      courseCount: 1,
      link: '#'
    },
    {
      id: '2',
      title: 'Vue3 进阶训练',
      description: '深入学习组合式 API + Pinia 状态管理',
      date: '2026/04/10',
      stageCount: 3,
      courseCount: 8,
      link: '#'
    },
    {
      id: '3',
      title: '前端工程化实践',
      description: 'Vite + 自动化部署 + CI/CD 实战',
      date: '2026/04/08',
      stageCount: 2,
      courseCount: 5,
      link: '#'
    }
  ])

  /**
   * 获取课程描述文本
   * @param item 学习项目
   * @returns 文本描述
   */
  function getCourseText(item: StudyProject): string {
    return `${item.stageCount} 个学习阶段，${item.courseCount} 门课程`
  }

  const isShowAllocateDialog = ref(false)

  /**
   *  打开分配弹窗
   */
  function openAllocateDialog(item: StudyProject) {
    console.log('🚀 ~ file: index.vue:83 ~ item:', item)
    isShowAllocateDialog.value = true
  }

  const router = useRouter()

  /**
   *  跳转到详情页
   */
  function goToDetail(item: StudyProject) {
    router.push({
      name: 'AdminProjectDetail',
      params: {
        id: item.id
      }
    })
  }

  /**
   *  跳转到编辑页
   */
  function goToEdit(item: StudyProject) {
    router.push({
      name: 'AdminProjectEdit',
      params: {
        id: item.id
      }
    })
  }
</script>

<template>
  <div class="relative mx-auto max-w-7xl px-10 max-sm:px-5">
    <CreateProjectDialog v-if="isShowCreateProjectDialog" v-model="isShowCreateProjectDialog" />

    <div class="flex items-center justify-between">
      <el-input v-model="inputVModel" placeholder="学习项目名称、描述、标签或访问码">
        <template #append>
          <el-button class="flex items-center justify-center">
            <SvgIcon icon="search" />
          </el-button>
        </template>
      </el-input>

      <el-button class="ml-20" type="primary" @click="isShowCreateProjectDialog = true">
        创建学习项目
      </el-button>
    </div>

    <div class="mt-10">
      <AllocateDialog v-if="isShowAllocateDialog" v-model="isShowAllocateDialog" />

      <el-timeline>
        <el-timeline-item
          v-for="item in projectList"
          :key="item.id"
          center
          :timestamp="item.date"
          placement="top"
          @click="goToDetail(item)"
        >
          <el-card>
            <template #header>
              <div class="flex items-center justify-between">
                <span>
                  {{ item.title }}
                </span>

                <div class="flex items-center gap-2">
                  <el-button class="flex items-center justify-center" @click.stop="goToEdit(item)">
                    <SvgIcon icon="admin-edit" />
                  </el-button>

                  <!-- 分配 -->
                  <el-button
                    class="flex items-center justify-center"
                    @click.stop="openAllocateDialog(item)"
                  >
                    <SvgIcon icon="admin-allocate" />
                  </el-button>
                </div>
              </div>
            </template>

            <h4>
              {{ item.description }}
            </h4>

            <el-link :href="item.link" type="primary" class="mt-10">
              {{ getCourseText(item) }} >
            </el-link>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style></style>

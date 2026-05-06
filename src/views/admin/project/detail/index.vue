<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
  import { ref } from 'vue'

  import BaseButton from '@/components/Button/base-button/index.vue'

  const router = useRouter()

  /**
   * 阶段类型定义
   */
  type Stage = {
    /** 阶段ID */
    id: string

    /** 阶段名称 */
    name: string

    /** 阶段描述 */
    description: string

    /** 课程类型 */
    courseType: string

    /** 课程名称 */
    courseName: string

    /** 是否必修 */
    required: boolean
  }

  /**
   * 阶段列表数据
   */
  const stages = ref<Stage[]>([
    {
      id: '1',
      name: '学习阶段一',
      description: '学习阶段一阶段描述',
      courseType: '在线课程',
      courseName: '课程1',
      required: true
    },
    {
      id: '2',
      name: '学习阶段二',
      description: '学习阶段二阶段描述',
      courseType: '在线课程',
      courseName: '课程2',
      required: false
    },
    {
      id: '3',
      name: '学习阶段三',
      description: '学习阶段三阶段描述',
      courseType: '线下课程',
      courseName: '课程3',
      required: true
    }
  ])

  /**
   * 跳转到编辑页
   */
  function goToEdit() {
    router.push({
      name: 'AdminProjectEdit',
      params: {
        id: router.currentRoute.value.params.id
      }
    })
  }
</script>

<template>
  <div class="w-full">
    <el-page-header @back="$router.back()">
      <template #content>
        <div class="flex items-center"> 学习项目1 详情页 </div>
      </template>

      <template #extra>
        <div class="flex items-center">
          <el-button type="primary" class="ml-2" @click="goToEdit()"> 编辑内容 </el-button>
        </div>
      </template>
    </el-page-header>

    <div v-for="(stage, index) in stages" :key="stage.id" class="mb-5 mt-10 border rounded-3 p-4">
      <p class="text-5 font-bold"> 阶段{{ index + 1 }}:{{ stage.name }} </p>

      <div class="h-30 color-[#b1b1b1]">
        {{ stage.description }}
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div>
            {{ stage.required ? '必修' : '选修' }}
          </div>

          <div class=""> {{ stage.courseType }} {{ stage.courseName }} </div>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton icon="admin-edit" tooltip-content="编辑" />

          <BaseButton icon="admin-preview" tooltip-content="预览" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

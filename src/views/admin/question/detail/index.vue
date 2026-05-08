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
    required: true,
  },
  {
    id: '2',
    name: '学习阶段二',
    description: '学习阶段二阶段描述',
    courseType: '在线课程',
    courseName: '课程2',
    required: false,
  },
  {
    id: '3',
    name: '学习阶段三',
    description: '学习阶段三阶段描述',
    courseType: '线下课程',
    courseName: '课程3',
    required: true,
  },
  {
    id: '4',
    name: '学习阶段四',
    description: '学习阶段四阶段描述',
    courseType: '线下课程',
    courseName: '课程4',
    required: false,
  },
])

/**
   * 跳转到编辑页
   */
function goToEdit() {
  router.push({
    name: 'AdminProjectEdit',
    params: {
      id: router.currentRoute.value.params.id,
    },
  })
}
</script>

<template>
  <div
    class="pt-20 flex flex-col gap-4 relative"
  >
    <el-page-header
      class="art-card px-2 py-4 left-0 right-0 top-0 absolute"
      @back="$router.back()"
    >
      <template
        #content
      >
        <div
          class="flex items-center"
        >
          题库1 详情页
        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex items-center"
        >
          <ArtIconButton
            type="edit"
            class="ml-3 max-sm:ml-[7px]"
            @click="goToEdit()"
          />
        </div>
      </template>
    </el-page-header>

    <div
      v-for="(stage, index) in stages"
      :key="stage.id"
      class="p-4 border rounded-3"
    >
      <p
        class="text-5 font-bold"
      >
        阶段{{ index + 1 }}:{{ stage.name }}
      </p>

      <div
        class="color-[#b1b1b1] h-30"
      >
        {{ stage.description }}
      </div>

      <div
        class="flex items-center justify-between"
      >
        <div
          class="flex gap-2 items-center"
        >
          <div>
            {{ stage.required ? '必修' : '选修' }}
          </div>

          <div
            class=""
          >
            {{ stage.courseType }} {{ stage.courseName }}
          </div>
        </div>

        <div
          class="flex gap-2 items-center"
        >
          <BaseButton
            icon="admin-edit"
            tooltip-content="编辑"
          />

          <BaseButton
            icon="admin-preview"
            tooltip-content="预览"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

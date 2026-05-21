<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

const route = useRoute()

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
])

/**
   * 跳转到编辑页
   */
function goToEdit() {
  router.push({
    name: 'AdminProjectEdit',
    params: {
      id: route.params.id,
    },
  })
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      title="学习项目1 详情页"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="edit"
          @click="goToEdit()"
        >
          编辑内容
        </ArtIconButton>
      </template>
    </AdminPageHeader>

    <div
      class="flex flex-col gap-4"
    >
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="art-card"
      >
        <div
          class="flex items-start justify-between gap-4 max-sm:flex-col"
        >
          <div
            class="min-w-0"
          >
            <div
              class="flex flex-wrap gap-3 items-center"
            >
              <div
                class="text-base font-semibold text-g-900"
              >
                阶段 {{ index + 1 }}：{{ stage.name }}
              </div>

              <el-tag
                :type="stage.required ? 'danger' : 'info'"
                size="small"
              >
                {{ stage.required ? '必修' : '选修' }}
              </el-tag>
            </div>

            <p
              class="mt-3 text-sm leading-relaxed text-g-600"
            >
              {{ stage.description }}
            </p>

            <div
              class="mt-4 flex flex-wrap gap-3 text-sm text-g-700"
            >
              <span>{{ stage.courseType }}</span>

              <span>{{ stage.courseName }}</span>
            </div>
          </div>

          <div
            class="flex shrink-0 gap-2 items-center max-sm:w-full max-sm:justify-end"
          >
            <ArtIconButton
              type="edit"
            />

            <ArtIconButton
              type="view"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import type { SectionTypeConfig } from '@/config/course'

defineProps<{

  /** 小节数据 */
  section: AdminApi.Course.Section

  /** 小节类型配置 */
  typeConfig: SectionTypeConfig

  /** 是否展示在章节内部 */
  inner?: boolean
}>()

// const emit = defineEmits<{

//   /** 分配当前小节学习任务 */
//   allocate: []

//   /** 删除当前小节 */
//   delete: [section: AdminApi.Course.Section]

//   /** 编辑当前小节 */
//   edit: [section: AdminApi.Course.Section]
// }>()
</script>

<template>
  <div
    class="flex items-start gap-5"
  >
    <div
      class=" font-bold text-primary w-4 flex items-center"
    >
      {{ section.order }}
    </div>

    <div
      class="flex items-center flex-col gap-1 justify-center "
    >
      <ArtButton
        :icon="typeConfig.sectionIcon"
        icon-color="#ffffff"
        :bg-color="typeConfig.sectionIconBgColor"
      />

      <div
        class="text-xs text-g-600"
      >
        {{ typeConfig.sectionTypeName }}
      </div>
    </div>

    <div
      class="flex flex-col items-start"
    >
      <div
        class="truncate text-sm font-semibold text-g-900"
      >
        {{ section.name }}
      </div>

      <div
        class="mt-2 flex flex-col gap-1 text-xs text-g-600"
      >
        <span
          v-if="section.participantCount > 0"
        >
          {{ section.participantCount }} 人参与
        </span>

        <span
          class="wrap-break-word leading-relaxed"
        >
          {{ section.description }}
        </span>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { SectionTypeConfig } from './sectionType'

defineProps<{

  /** 小节数据 */
  section: AdminApi.Course.Section

  /** 小节类型配置 */
  typeConfig: SectionTypeConfig

  /** 是否展示在章节内部 */
  inner?: boolean
}>()

const emit = defineEmits<{

  /** 分配当前小节学习任务 */
  allocate: []

  /** 删除当前小节 */
  delete: [section: AdminApi.Course.Section]

  /** 编辑当前小节 */
  edit: [section: AdminApi.Course.Section]
}>()
</script>

<template>
  <div
    class="rounded-custom-sm border-full-d bg-box py-4 transition-colors hover:border-primary/40"
    :class="inner ? 'px-5 max-sm:px-4' : 'px-10 max-sm:px-4'"
  >
    <div
      class="grid grid-cols-[48px_96px_minmax(0,1fr)_auto] gap-5 items-center max-md:grid-cols-[40px_80px_minmax(0,1fr)] max-md:gap-4 max-sm:grid-cols-1 max-sm:items-start"
    >
      <div
        class="text-lg font-bold text-primary max-sm:text-base"
      >
        {{ section.order }}
      </div>

      <div
        class="flex items-center flex-col gap-1 justify-center max-sm:flex-row max-sm:justify-start max-sm:gap-2"
      >
        <ArtIconButton
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
        class="min-w-0"
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

      <div
        class="flex gap-2 items-center justify-end max-md:col-span-3 max-sm:col-span-1 max-sm:w-full max-sm:justify-end"
        @click.stop
      >
        <ArtIconButton
          type="allocate"
          @click="emit('allocate')"
        />

        <ArtIconButton
          type="delete"
          @click="emit('delete', section)"
        />

        <ArtIconButton
          type="edit"
          @click="emit('edit', section)"
        />
      </div>
    </div>
  </div>
</template>

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
</script>

<template>
  <div
    class="w-full flex items-center gap-3"
  >
    <div
      class="h-8 w-8 flex shrink-0 items-center justify-center rounded-xl bg-white text-3.25 text-teal-700 font-700 shadow-sm"
    >
      {{ section.order || '-' }}
    </div>

    <div
      class="flex shrink-0 flex-col items-center justify-center gap-1"
    >
      <ArtButton
        :icon="typeConfig.sectionIcon"
        icon-color="#ffffff"
        :bg-color="typeConfig.sectionIconBgColor"
      />

      <div
        class="text-sm text-slate-500"
      >
        {{ typeConfig.sectionTypeName }}
      </div>
    </div>

    <div
      class="min-w-0 flex flex-1 flex-col items-start"
    >
      <div
        class="max-w-full truncate text-3.5 text-slate-800 font-700"
      >
        {{ section.name }}
      </div>

      <div
        class="mt-1.5 flex max-w-full flex-col gap-1 text-3 text-slate-500"
      >
        <span
          v-if="section.participantCount > 0"
          class="inline-flex items-center gap-1"
        >
          <van-icon
            name="friends-o"
            size="13"
          />
          {{ section.participantCount }} 人参与
        </span>

        <span
          v-if="section.description"
          class="wrap-break-word leading-relaxed"
        >
          {{ section.description }}
        </span>
      </div>
    </div>

    <van-icon
      name="arrow"
      class="shrink-0 text-slate-400"
    />
  </div>
</template>

<!-- 创建小节类型选择弹窗 -->
<script lang="ts" setup>
import type { SectionType } from './sectionType'

import { sectionTypeOptions } from './sectionType'

/**
 * 选择小节类型事件
 */
const emit = defineEmits<{

  /**
   * 选择小节类型
   */
  select: [sectionType: SectionType]
}>()

/**
 * 弹窗显示状态
 */
const visible = defineModel<boolean>()

/**
 * 选择小节类型
 */
function handleSelect(sectionType: SectionType) {
  emit('select', sectionType)
}
</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="添加课程小节"
    width="30%"
    :show-close="false"
  >
    <div
      class="flex gap-5 w-full items-center justify-center"
    >
      <div
        v-for="item in sectionTypeOptions"
        :key="item.sectionType"
        class="flex items-center flex-col gap-1 justify-center"
      >
        <ArtIconButton
          :icon="item.sectionIcon"
          icon-color="#ffffff"
          :bg-color="item.sectionIconBgColor"
          @click="handleSelect(item.sectionType)"
        />

        <div
          class="text-xs text-info"
        >
          {{ item.sectionTypeName }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

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

/**
 * 关闭弹窗
 */
function handleClose() {
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="添加课程小节"
    width="420px"
    :show-close="true"
  >
    <div
      class="grid grid-cols-4 gap-4 max-sm:grid-cols-2"
    >
      <button
        v-for="item in sectionTypeOptions"
        :key="item.sectionType"
        type="button"
        class="aspect-square w-full flex flex-col items-center justify-center gap-2 rounded-lg border border-[var(--art-card-border)] bg-[var(--default-box-color)] transition-colors hover:border-primary hover:bg-primary/5"
        @click="handleSelect(item.sectionType)"
      >
        <ArtIconButton
          :icon="item.sectionIcon"
          icon-color="#ffffff"
          :bg-color="item.sectionIconBgColor"
        />

        <div
          class="text-sm text-g-700"
        >
          {{ item.sectionTypeName }}
        </div>
      </button>
    </div>

    <template
      #footer
    >
      <div
        class="flex justify-end pt-1"
      >
        <el-button
          @click="handleClose"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>

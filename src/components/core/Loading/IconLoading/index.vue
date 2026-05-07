<script setup lang="ts">

type Props = {

  /**
   * 加载图标的大小
   */
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

/**
 * 计算图标尺寸
 */
const computedSize = computed(() => parseSize(props.size))
</script>

<template>
  <div
    class="flex h-full items-center justify-center"
  >
    <!-- 加载动画 -->
    <ArtSvgIcon
      icon="tabler:loader"
      :size="computedSize"
      class="animate-spin"
    />
  </div>
</template>

<style scoped>
</style>

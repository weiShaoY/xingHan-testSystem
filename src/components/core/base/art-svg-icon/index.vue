<!-- 图标组件 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'ArtSvgIcon',
  inheritAttrs: false,
})

const props = defineProps<Props>()

type Props = {

  /**
   * Iconify 图标名称
   * @example "ri:add-line"
   */
  icon?: string

  /**
   * 图标颜色
   * @description 支持任意合法 CSS 颜色值
   * @example "#ffffff"
   */
  color?: string
}

const attrs = useAttrs()

/**
 * 透传属性
 */
const bindAttrs = computed(() => ({
  class: (attrs.class as string) || '',
  style: attrs.style || {
  },
}))

/**
 * 图标样式
 */
const iconStyle = computed(() => {
  return {
    ...(typeof bindAttrs.value.style === 'object'
      ? bindAttrs.value.style
      : {
        }),

    ...(props.color
      ? {
          color: props.color,
        }
      : {
        }),
  }
})
</script>

<template>
  <Icon
    v-if="icon"
    :icon="icon"
    v-bind="bindAttrs"
    :style="iconStyle"
    class="art-svg-icon inline"
  />
</template>

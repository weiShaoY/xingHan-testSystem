<!-- 系统logo -->
<script setup lang="ts">
import logoFull from '@imgs/logo/logo-full.png'

import logoMark from '@imgs/logo/logo-mark.png'

defineOptions({
  name: 'ArtLogo',
})

const props = withDefaults(defineProps<Props>(), {
  size: 36,
  type: 'mark',
})

type Props = {

  /** logo 大小：mark 时为宽度，full 时为高度 */
  size?: number | string

  /** logo 类型：mark 为图形标，full 为图文组合标 */
  type?: 'mark' | 'full'
}

function normalizeSize(size: number | string) {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return /^\d+(?:\.\d+)?$/.test(size) ? `${size}px` : size
}

const logoSizeStyle = computed(() => ({
  [props.type === 'full' ? 'height' : 'width']: normalizeSize(props.size),
}))

const logoImageSrc = computed(() => (
  props.type === 'full'
    ? logoFull
    : logoMark
))
</script>

<template>
  <div
    class="flex-cc"
  >
    <img
      :style="logoSizeStyle"
      :src="logoImageSrc"
      alt="logo"
    >
  </div>
</template>

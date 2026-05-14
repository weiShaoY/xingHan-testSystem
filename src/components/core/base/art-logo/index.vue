<!-- 系统logo -->
<script setup lang="ts">
defineOptions({
  name: 'ArtLogo',
})

const props = withDefaults(defineProps<Props>(), {
  size: 36,
})

type Props = {

  /** logo 大小 */
  size?: number | string
}

const logoStyle = computed(() => ({
  width: `${props.size}px`,
}))
</script>

<template>
  <div
    class="flex-cc"
  >
    <img
      :style="logoStyle"
      src="@imgs/common/logo.png"
      alt="logo"
      class="w-full h-full"
    >
  </div>
</template>

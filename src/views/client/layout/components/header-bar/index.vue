<!------  2026-05-14---17:08---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
</script>

<template>
  <div
    class="bg-white w-full h-[60px] flex items-center justify-between"
  >
    <!-- 系统信息  -->
    <div
      class="flex-c c-p"
    >
      <ArtLogo
        class="pl-4.5"
        :type="width >= 1400 ? 'full' : 'mark'"
      />
    </div>

    <!-- 用户头像、菜单 -->
    <ArtUserMenu />
  </div>

</template>

<style lang="scss" scoped>

</style>

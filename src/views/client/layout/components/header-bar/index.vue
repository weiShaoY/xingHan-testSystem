<!------  2026-05-14---17:08---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
</script>

<template>
  <div
    class="w-full border-b border-[var(--default-border)] bg-white"
  >
    <div
      class="mx-auto h-[60px] max-w-7xl flex items-center justify-between px-10 max-lg:px-6 max-sm:px-4"
    >
      <!-- 系统信息  -->
      <div
        class="flex-c c-p"
      >
        <ArtLogo
          :type="width >= 1024 ? 'full' : 'mark'"
        />
      </div>

      <!-- 用户头像、菜单 -->
      <ArtUserMenu />
    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>

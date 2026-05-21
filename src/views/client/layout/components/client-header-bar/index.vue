<!------  2026-05-14---17:08---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

import ClientUserLanguage from './client-user-language.vue'

import ClientUserMenu from './client-user-menu.vue'

defineOptions({
  name: 'ClientHeaderBar',
})

const { width } = useWindowSize()
</script>

<template>
  <div
    class="w-full border-b border-(--default-border) bg-white"
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

      <div
        class="flex-c gap-2.5"
      >
        <!-- 国际化按钮 -->
        <ClientUserLanguage />

        <!-- 客户端 用户头像、菜单 -->
        <ClientUserMenu />

      </div>

    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>

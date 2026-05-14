<!------  2026-05-14---16:11---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import HeaderBar from './components/header-bar/index.vue'

import PageContent from './components/page-content/index.vue'

defineOptions({
  name: 'ClientLayout',
})
</script>

<template>
  <div
    class="app-layout"
  >
    <!-- <aside
      id="app-sidebar"
    >
      <ArtSidebarMenu />
    </aside> -->

    <main
      id="app-main"
    >
      <div
        id="app-header"
      >
        <HeaderBar />
      </div>

      <div
        id="app-content"
      >
        <PageContent />
      </div>
    </main>

    <!-- <div
      id="app-global"
    >
      <ArtGlobalComponent />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
  @use './style';
</style>

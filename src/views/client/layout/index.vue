<!------  2026-05-14---16:11---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import ClientHeaderBar from './components/client-header-bar/index.vue'

import ClientPageContent from './components/client-page-content/index.vue'

defineOptions({
  name: 'ClientLayout',
})
const router = useRouter()

const isShowClientHeaderBar = computed(() => {
  return router.currentRoute.value.path === '/client/home'
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
        v-if="isShowClientHeaderBar"
        id="app-header"
      >
        <ClientHeaderBar />
      </div>

      <div
        id="app-content"
      >
        <ClientPageContent />
      </div>
    </main>

    <div
      id="app-global"
    >
      <ArtGlobalComponent />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use './style';
</style>

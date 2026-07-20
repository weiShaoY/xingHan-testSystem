<!------  2026-05-14---16:11---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import ClientHeaderBar from './components/client-header-bar/index.vue'

import ClientPageContent from './components/client-page-content/index.vue'

defineOptions({
  name: 'ClientLayout',
})

const props = withDefaults(defineProps<{

  /** 是否显示客户端顶部栏；不传时保持客户端首页默认显示规则。 */
  showHeader?: boolean | null
}>(), {
  showHeader: null,
})

const router = useRouter()

const isShowClientHeaderBar = computed(() => {
  return props.showHeader ?? router.currentRoute.value.path === '/client/home'
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
        <slot>
          <ClientPageContent />
        </slot>
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

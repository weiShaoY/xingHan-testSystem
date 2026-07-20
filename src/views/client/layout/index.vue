<script setup lang="ts">
defineOptions({
  name: 'ClientLayout',
})
const route = useRoute()

const router = useRouter()

const navTitle = computed(() => {
  return String(route.meta?.title || '')
})

function onBack() {
  if (window.history.state.back) {
    history.back()
  }
  else {
    router.replace('/client/home')
  }
}

</script>

<template>
  <div
    class="app-layout"
  >
    <VanNavBar
      :title="navTitle"
      :fixed="true"
      :left-arrow="!route.meta.hideClientBack"
      placeholder
      clickable
      @click-left="onBack"
    />

    <router-view
      v-slot="{ Component, route: viewRoute }"
    >
      <!-- 缓存路由动画 -->
      <Transition
        class="app-wrapper"
        mode="out-in"
        appear
      >
        <KeepAlive
          :max="10"
        >
          <component
            :is="Component"
            v-if="viewRoute.meta.keepAlive"
            :key="viewRoute.path"
            class="art-page-view"
          />
        </KeepAlive>
      </Transition>

      <!-- 非缓存路由动画 -->
      <Transition
        class="app-wrapper"
        mode="out-in"
        appear
      >
        <component
          :is="Component"
          v-if="!viewRoute.meta.keepAlive"
          :key="viewRoute.path"
          class="art-page-view"
        />
      </Transition>
    </router-view>

  </div>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 16px;
}
</style>

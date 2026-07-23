<script setup lang="ts">
import avatar from '@imgs/avatar/avatar10.webp'

defineOptions({
  name: 'ClientLayout',
})
const route = useRoute()

const router = useRouter()

// const clientUserStore = useClientUserStore()

// const avatarUrl = computed(() => userStore.getUserInfo.avatar || avatar)
const avatarUrl = computed(() => avatar)

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

function goToUser() {
  router.push('/client/user')
}

</script>

<template>
  <div
    class="flex h-dvh flex-col overflow-hidden"
  >
    <VanNavBar
      :title="navTitle"
      :fixed="true"
      :left-arrow="!route.meta.hideClientBack"
      placeholder
      clickable
      @click-left="onBack"
    >

      <template
        #right
      >
        <button
          v-if="route.meta.hideClientBack"
          type="button"
          class="group flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0  "
          aria-label="个人主页"
          @click="goToUser"
        >
          <van-image
            :src="avatarUrl"
            alt="个人头像"
            fit="cover"
            round
            class="size-7.5 overflow-hidden   transition-transform duration-150 group-active:scale-[0.94]"
          />
        </button>
      </template>
    </VanNavBar>

    <div
      class="min-h-0 flex-1 overflow-y-auto p-4"
    >
      <router-view
        v-slot="{ Component, route: viewRoute }"
      >
        <!-- 缓存路由动画 -->
        <Transition
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
            />
          </KeepAlive>
        </Transition>

        <!-- 非缓存路由动画 -->
        <Transition
          mode="out-in"
          appear
        >
          <component
            :is="Component"
            v-if="!viewRoute.meta.keepAlive"
            :key="viewRoute.path"
          />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from '@imgs/avatar/avatar10.webp'

import { useClientNavTitle } from '@/hooks/core/useClientNavTitle'

defineOptions({
  name: 'ClientLayout',
})
const route = useRoute()

const router = useRouter()

// const clientUserStore = useClientUserStore()

// const avatarUrl = computed(() => userStore.getUserInfo.avatar || avatar)
const avatarUrl = computed(() => avatar)

const { customClientNavTitle } = useClientNavTitle()

const desktopNavItems = [
  {
    label: '首页',
    path: '/client/home',
    icon: 'tdesign:home',
  },
  {
    label: '我的任务',
    path: '/client/task',
    icon: 'tdesign:task',
  },
  {
    label: '学习历史',
    path: '/client/history/list',
    icon: 'tdesign:history',
  },
]

const navTitle = computed(() => {
  return customClientNavTitle.value || String(route.meta?.title || '')
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

function goToPath(path: string) {
  router.push(path)
}

function isDesktopNavActive(path: string) {
  return route.path === path || (path !== '/client/home' && route.path.startsWith(`${path}/`))
}

</script>

<template>
  <div
    class="flex min-h-dvh flex-col overflow-hidden bg-[#f7f8fa] md:block"
  >
    <aside
      class="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r border-[#e8eaed] bg-white px-4 pt-7 pb-5 md:flex md:max-lg:w-18 md:max-lg:items-center md:max-lg:px-2.5"
    >
      <button
        type="button"
        class="flex w-fit cursor-pointer items-center gap-2.5 border-0 bg-transparent px-2.5 text-4.5 text-[#172033] font-700 md:max-lg:px-0"
        aria-label="返回首页"
        @click="goToPath('/client/home')"
      >
        <span
          class="grid size-8 place-items-center rounded-[7px] bg-[#0f9f8f] text-4 text-white"
        >培</span>

        <span
          class="md:max-lg:hidden"
        >培训系统</span>
      </button>

      <nav
        class="mt-10.5 grid gap-1.5"
        aria-label="主导航"
      >
        <button
          v-for="item in desktopNavItems"
          :key="item.path"
          type="button"
          class="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-3 text-left text-3.5 text-[#5e6878] transition-colors duration-150 hover:bg-[#f0f9f7] hover:text-[#087f73] md:max-lg:justify-center"
          :class="isDesktopNavActive(item.path) ? 'bg-[#e7f7f3] text-[#087f73] font-600 hover:bg-[#e7f7f3]' : ''"
          @click="goToPath(item.path)"
        >
          <ArtSvgIcon
            :icon="item.icon"
            class="text-5"
          />

          <span
            class="md:max-lg:hidden"
          >{{ item.label }}</span>
        </button>
      </nav>

      <button
        type="button"
        class="mt-auto flex min-h-11 w-full cursor-pointer items-center gap-3 border-0 border-t border-[#edf0f2] bg-transparent px-3 text-left text-3.5 text-[#334155] transition-colors duration-150 hover:bg-[#f0f9f7] hover:text-[#087f73] md:max-lg:justify-center md:max-lg:px-0"
        @click="goToUser"
      >
        <van-image
          :src="avatarUrl"
          alt="个人头像"
          fit="cover"
          round
          class="size-9 overflow-hidden"
        />

        <span
          class="md:max-lg:hidden"
        >
          个人主页
        </span>

        <ArtSvgIcon
          icon="tdesign:chevron-right"
          class="ml-auto text-4 text-slate-400 md:max-lg:hidden"
        />
      </button>
    </aside>

    <main
      class="min-h-0 flex flex-1 flex-col md:ml-56 md:block md:min-h-dvh md:w-[calc(100%_-_224px)] md:max-lg:ml-18 md:max-lg:w-[calc(100%_-_72px)]"
    >
      <header
        class="sticky top-0 z-5 hidden h-19 items-center justify-between border-b border-[#eceef1] bg-[#f7f8fa]/92 px-[max(32px,calc((100vw-224px-1180px)/2))] backdrop-blur-[10px] md:flex md:max-lg:px-6"
      >
        <div>
          <p
            class="mb-0.75 mt-0 text-3 text-[#8a94a4]"
          >
            学习中心
          </p>

          <h1
            class="m-0 text-5 text-[#172033] font-700 leading-1.25"
          >
            {{ navTitle }}
          </h1>
        </div>

        <button
          type="button"
          class="cursor-pointer border-0 bg-transparent p-0"
          aria-label="个人主页"
          @click="goToUser"
        >
          <van-image
            :src="avatarUrl"
            alt="个人头像"
            fit="cover"
            round
            class="size-9 overflow-hidden"
          />
        </button>
      </header>

      <div
        class="md:hidden"
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
      </div>

      <div
        class="min-h-0 flex-1 overflow-y-auto p-4 md:box-border md:min-h-[calc(100dvh_-_76px)] md:w-full md:max-w-311 md:mx-auto md:p-8 md:max-lg:p-6"
      >
        <slot
          v-if="$slots.default"
        />

        <router-view
          v-else
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
    </main>
  </div>
</template>

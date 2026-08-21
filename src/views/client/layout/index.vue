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
    class="client-layout"
  >
    <aside
      class="client-desktop-sidebar"
    >
      <button
        type="button"
        class="client-brand"
        aria-label="返回首页"
        @click="goToPath('/client/home')"
      >
        <span
          class="client-brand-mark"
        >培</span>

        <span>培训系统</span>
      </button>

      <nav
        class="client-desktop-nav"
        aria-label="主导航"
      >
        <button
          v-for="item in desktopNavItems"
          :key="item.path"
          type="button"
          class="client-desktop-nav-item"
          :class="{ 'is-active': isDesktopNavActive(item.path) }"
          @click="goToPath(item.path)"
        >
          <ArtSvgIcon
            :icon="item.icon"
            class="text-5"
          />

          <span>{{ item.label }}</span>
        </button>
      </nav>

      <button
        type="button"
        class="client-profile"
        @click="goToUser"
      >
        <van-image
          :src="avatarUrl"
          alt="个人头像"
          fit="cover"
          round
          class="size-9 overflow-hidden"
        />

        <span>个人主页</span>

        <ArtSvgIcon
          icon="tdesign:chevron-right"
          class="ml-auto text-4 text-slate-400"
        />
      </button>
    </aside>

    <main
      class="client-main"
    >
      <header
        class="client-desktop-header"
      >
        <div>
          <p
            class="client-desktop-header-label"
          >
            学习中心
          </p>

          <h1>
            {{ navTitle }}
          </h1>
        </div>

        <button
          type="button"
          class="client-header-avatar"
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
        class="client-mobile-header"
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
        class="client-content"
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
    </main>
  </div>
</template>

<style lang="scss" scoped>
.client-layout {
  min-height: 100dvh;
  background: #f7f8fa;
}

.client-desktop-sidebar,
.client-desktop-header {
  display: none;
}

.client-main {
  min-width: 0;
  min-height: 100dvh;
}

.client-content {
  min-height: 0;
  padding: 1rem;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .client-layout {
    display: flex;
  }

  .client-desktop-sidebar {
    display: flex;
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 10;
    width: 224px;
    flex-direction: column;
    padding: 28px 16px 20px;
    background: #fff;
    border-right: 1px solid #e8eaed;
  }

  .client-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    padding: 0 10px;
    color: #172033;
    font-size: 18px;
    font-weight: 700;
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  .client-brand-mark {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    color: #fff;
    font-size: 16px;
    background: #0f9f8f;
    border-radius: 7px;
  }

  .client-desktop-nav {
    display: grid;
    gap: 6px;
    margin-top: 42px;
  }

  .client-desktop-nav-item,
  .client-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    color: #5e6878;
    font-size: 14px;
    text-align: left;
    background: transparent;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    transition:
      background-color 150ms,
      color 150ms;
  }

  .client-desktop-nav-item:hover,
  .client-profile:hover {
    color: #087f73;
    background: #f0f9f7;
  }

  .client-desktop-nav-item.is-active {
    color: #087f73;
    font-weight: 600;
    background: #e7f7f3;
  }

  .client-profile {
    margin-top: auto;
    color: #334155;
    border-top: 1px solid #edf0f2;
    border-radius: 0;
  }

  .client-main {
    width: calc(100% - 224px);
    margin-left: 224px;
  }

  .client-desktop-header {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 5;
    align-items: center;
    justify-content: space-between;
    height: 76px;
    padding: 0 max(32px, calc((100vw - 224px - 1180px) / 2));
    background: rgb(247 248 250 / 92%);
    border-bottom: 1px solid #eceef1;
    backdrop-filter: blur(10px);
  }

  .client-desktop-header-label {
    margin: 0 0 3px;
    color: #8a94a4;
    font-size: 12px;
  }

  .client-desktop-header h1 {
    margin: 0;
    color: #172033;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.25;
  }

  .client-header-avatar {
    padding: 0;
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  .client-mobile-header {
    display: none;
  }

  .client-content {
    box-sizing: border-box;
    width: 100%;
    max-width: 1244px;
    min-height: calc(100dvh - 76px);
    margin: 0 auto;
    padding: 32px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .client-desktop-sidebar {
    width: 72px;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
  }

  .client-brand {
    padding: 0;
  }
  .client-brand > span:last-child,
  .client-desktop-nav-item span,
  .client-profile span {
    display: none;
  }
  .client-profile {
    justify-content: center;
    padding: 0;
  }
  .client-profile :deep(.art-svg-icon) {
    display: none;
  }
  .client-main {
    width: calc(100% - 72px);
    margin-left: 72px;
  }
  .client-desktop-header {
    padding-right: 24px;
    padding-left: 24px;
  }
  .client-content {
    padding: 24px;
  }
}
</style>

<!-- 用户菜单 -->
<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

import { useI18n } from 'vue-i18n'

import { useRouter } from 'vue-router'

import { useCurrentUserStore } from '@/store'

defineOptions({
  name: 'ArtUserMenu',
})

const router = useRouter()

const { t } = useI18n()

const userStore = useCurrentUserStore()

const { getUserInfo: userInfo } = storeToRefs(userStore)

const isUserMenuOpen = ref(false)

const displayName = computed(() => userInfo.value.userName || '用户')

const displayEmail = computed(() => userInfo.value.email || '--')

/**
   * 页面跳转
   * @param {string} path - 目标路径
   */
function goPage(path: string): void {
  closeUserMenu()
  router.push(path)
}

/**
   * 打开用户菜单。
   */
function openUserMenu(): void {
  isUserMenuOpen.value = true
}

/**
   * 关闭用户菜单。
   */
function closeUserMenu(): void {
  isUserMenuOpen.value = false
}

/**
   * 用户登出确认
   */
function loginOut(): void {
  closeUserMenu()
  setTimeout(() => {
    ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      customClass: 'login-out-dialog',
    }).then(() => {
      userStore.logOut()
    })
  }, 200)
}

</script>

<template>
  <button
    type="button"
    class="mr-5 border-0 bg-transparent p-0 c-p max-sm:mr-[16px]!"
    aria-label="打开用户菜单"
    @click="openUserMenu"
  >
    <el-avatar
      class="size-8.5! max-sm:size-6.5!"
      :src="userInfo.avatar"
    >
      <img
        src="@imgs/user/avatar.webp"
        alt="avatar"
      >
    </el-avatar>
  </button>

  <Teleport
    to="body"
  >
    <Transition
      name="user-menu-fade"
      enter-active-class="transition-opacity duration-180 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-180 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isUserMenuOpen"
        class="fixed inset-0 z-3000 flex items-start justify-center overflow-y-auto bg-[rgb(15_35_52/76%)]"
        @click.self="closeUserMenu"
      >
        <div
          class="relative w-[min(100%,520px)] bg-white px-8 pb-[34px] pt-12 shadow-[0_24px_80px_rgb(15_23_42/18%)] max-sm:w-full max-sm:px-7 max-sm:pb-7 max-sm:pt-[42px]"
        >
          <!-- 右上角关闭按钮 -->
          <button
            type="button"
            class="absolute right-5 top-5 size-10 flex items-center justify-center border-0 bg-transparent p-0 text-[34px] text-[#5f6368] cursor-pointer"
            aria-label="关闭用户菜单"
            @click="closeUserMenu"
          >
            <ArtSvgIcon
              icon="ri:close-line"
            />
          </button>

          <!-- 用户信息 -->
          <div
            class="flex items-center justify-between gap-4 border-b border-[#eceff3] pb-[42px] pt-[38px] max-sm:pt-[34px]"
          >
            <div
              class="min-w-0 flex flex-1 items-center gap-4"
            >
              <el-avatar
                class="size-[62px]! overflow-hidden bg-[#ffc415]"
                :src="userInfo.avatar"
              >
                <img
                  src="@imgs/user/avatar.webp"
                  alt="avatar"
                >
              </el-avatar>

              <div
                class="min-w-0 flex-1"
              >
                <div
                  class="flex items-center gap-2"
                >
                  <h3
                    class="m-0 max-w-full truncate text-xl text-[#202124] font-700 leading-[1.25]"
                  >
                    {{ displayName }}
                  </h3>

                  <span
                    class="flex-none rounded-[6px] bg-[#f1f2f4] px-2 py-1 text-[13px] text-[#686c73] leading-none"
                  >
                    基本版
                  </span>
                </div>

                <p
                  class="mt-2 mb-0 truncate text-base text-[#60646b] leading-[1.3]"
                >
                  {{ displayEmail }}
                </p>
              </div>

            </div>

            <button
              type="button"
              class="client-menu-profile-link"
              @click="goPage('/admin/system/user-center')"
            >
              个人中心
            </button>
          </div>

          <!-- 导航菜单 -->
          <nav
            class="flex flex-col"
          >
            <button
              type="button"
              class="client-menu-link client-menu-link--divided"
            >
              首页
            </button>

            <button
              type="button"
              class="client-menu-link"
            >
              我的收藏
            </button>

            <button
              type="button"
              class="client-menu-link client-menu-link--divided"
            >
              考题本
            </button>

            <button
              type="button"
              class="client-menu-link"
            >
              我的任务
            </button>

            <button
              type="button"
              class="client-menu-link client-menu-link--divided"
            >
              学习历史
            </button>

            <button
              type="button"
              class="client-menu-link"
              @click="loginOut"
            >
              退出登录
            </button>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.client-menu-link {
  min-height: 52px;
  width: 100%;
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 0 12px;
  color: #202124;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.client-menu-link--divided {
  border-bottom: 1px solid #eceff3;
}

.client-menu-link:hover {
  background-color: #f1f2f4;
  color: var(--el-color-primary);
}

.client-menu-link:active {
  background-color: #e8eaed;
  transform: scale(0.98);
}

.client-menu-profile-link {
  flex: none;
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 8px 12px;
  color: #60646b;
  font-size: 17px;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.client-menu-profile-link:hover {
  background-color: #f1f2f4;
  color: var(--el-color-primary);
}

.client-menu-profile-link:active {
  background-color: #e8eaed;
  transform: scale(0.98);
}
</style>

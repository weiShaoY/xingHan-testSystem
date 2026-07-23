<!------  2026-05-21---14:21---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useClientUserStore } from '@/store'

const clientUserStore = useClientUserStore()

const displayName = computed(() => clientUserStore.userInfo?.userName || '用户')

const displayEmail = computed(() => clientUserStore.userInfo?.email || '--')

function handleLogout() {
  clientUserStore.logOut()
}

</script>

<template>
  <div
    class="flex flex-col"
  >
    <VanCellGroup
      :inset="true"
    >
      <van-cell
        center
      >
        <template
          #title
        >
          <div
            class="flex items-center justify-start gap-5"
          >
            <van-image
              :src="clientUserStore.userInfo.avatar"
              alt="个人头像"
              fit="cover"
              round
              class="size-14 overflow-hidden   transition-transform duration-150 "
            >
              <template
                #loading
              >
                <van-loading
                  type="spinner"
                  size="20"
                />
              </template>

              <template
                #error
              >
                <img
                  src="@imgs/user/avatar.webp"
                  alt="avatar"
                >
              </template>
            </van-image>

            <span
              class="ml-2"
            >
              {{ displayName }}
            </span>

          </div>

        </template>

        <template
          #value
        >
          <span>
            {{ displayEmail }}
          </span>
        </template>
      </van-cell>
    </VanCellGroup>

    <VanCellGroup
      :inset="true"
      class="mt-4!"
    >
      <van-cell
        title="设置"
        icon="setting-o"
        is-link
        to="/settings"
      >
        <template
          #icon
        >
          <div
            class="i-carbon:settings text-gray-400 mr-2 self-center"
          />
        </template>
      </van-cell>

      <van-cell
        title="帮助"
        is-link
        url="https://vue-zone.github.io/docs/vue3-vant-mobile/"
      >
        <template
          #icon
        >
          <div
            class="i-carbon:doc text-gray-400 mr-2 self-center"
          />
        </template>
      </van-cell>
    </VanCellGroup>

    <van-button
      plain
      type="danger"
      class="mt-4!"
      @click="handleLogout"
    >
      退出登录
    </van-button>
  </div>
</template>

<style lang="scss" scoped>

</style>

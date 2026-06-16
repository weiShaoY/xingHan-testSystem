<!------  2026-05-21---14:21---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useClientUserStore } from '@/store'

const userStore = useClientUserStore()

const { getUserInfo: userInfo } = storeToRefs(userStore)

const displayName = computed(() => userInfo.value.userName || '用户')

const displayEmail = computed(() => userInfo.value.email || '--')

const router = useRouter()

/**
   * 页面跳转
   * @param {string} path - 目标路径
   */
function goPage(path: string): void {
  router.push(path)
}

</script>

<template>
  <div
    class="flex flex-col"
  >
    <ClientPageHeader />

    <div
      class="art-card flex items-center justify-between gap-4"
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

      <ArtButton
        type="primary"
        @click="goPage('/client/user-center')"
      >
        编辑中心
      </ArtButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script setup lang="ts">
import { useCommon } from '@/hooks/core/useCommon'

import {
  useCurrentLoginRouteName,
  useCurrentUserStore,
} from '@/store'

withDefaults(
  defineProps<{

    /** 异常页展示数据。 */
    data: ExceptionData
  }>(),
  {
  },
)

const router = useRouter()

const route = useRoute()

const userStore = useCurrentUserStore()

const loginRouteName = useCurrentLoginRouteName()

type ExceptionData = {

  /** 标题 */
  title: string

  /** 描述 */
  desc: string

  /** 按钮文本 */
  btnText: string

  /** 图片地址 */
  imgUrl: string
}

const { homePath } = useCommon()

/** 根据当前错误路径获取所属端的首页。 */
function getTargetHomePath(): string {
  if (route.path.startsWith('/client')) {
    return '/client/home'
  }

  return homePath.value || '/admin'
}

function backHome() {
  const targetHomePath = getTargetHomePath()

  if (!userStore.isLogin) {
    router.push({
      name: loginRouteName,
      query: {
        redirect: targetHomePath,
      },
    })
    return
  }

  router.push(targetHomePath)
}
</script>

<template>
  <div
    class="page-content border-0! bg-transparent! min-h-screen flex-cc"
  >
    <div
      class="flex-cc max-md:block! max-md:text-center"
    >
      <ThemeSvg
        :src="data.imgUrl"
        size="100%"
        class="w-100!"
      />

      <div
        class="ml-15 w-75 max-md:mx-auto max-md:mt-10 max-md:w-full max-md:text-center"
      >
        <p
          class="text-xl leading-7 text-g-600 max-md:text-lg"
        >
          {{ data.desc }}
        </p>

        <ElButton
          v-ripple
          type="primary"
          size="large"
          class="mt-5"
          @click="backHome"
        >
          {{
            data.btnText
          }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

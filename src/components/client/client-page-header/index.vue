<!-- 页面内容头部 -->
<script lang="ts" setup>
const props = withDefaults(defineProps<{

  /**
   * 页面标题
   */
  title?: string

  /**
   * 标题右侧统计信息
   */
  stats?: string[]

  /**
   * 是否吸顶
   */
  sticky?: boolean
}>(), {
  title: '',
  stats: () => [],
  sticky: true,
})

const emit = defineEmits<{

  /**
   * 返回事件
   */
  back: []
}>()

const router = useRouter()

const route = useRoute()

const pageTitle = computed(() => {
  return props.title || String(route.meta.title || '')
})

/**
 * 返回上一页
 */
function handleBack() {
  emit('back')
  router.back()
}

// 隐藏  app-header
/**
 * 隐藏或显示顶部栏
 * @param hidden 是否隐藏
 */
function hideAppHeader(hidden: boolean) {
  const element = document.querySelector<HTMLElement>('#app-header')

  if (!element) {
    return
  }

  element.style.display = hidden
    ? 'none'
    : ''
}

// onMounted(() => {
//   hideAppHeader(true)
// })

// onActivated(() => {
//   hideAppHeader(true)
// })

// onBeforeUnmount(() => {
//   hideAppHeader(false)
// })

// onDeactivated(() => {
//   hideAppHeader(false)
// })
</script>

<template>

  <div
    class="client-page-header relative mb-5 flex shrink-0 gap-4 border border-(--art-gray-200) bg-(--default-box-color) p-4 items-center justify-between max-md:flex-col max-md:items-stretch max-sm:gap-5 max-sm:p-5 h-[60px]"
    :class="{ 'is-sticky': props.sticky }"
  >
    <!-- 左侧 -->
    <div
      class="flex min-w-0 flex-1 items-center gap-6 max-sm:items-start max-sm:gap-4"
    >
      <!-- 返回按钮 -->
      <div
        class="flex shrink-0 cursor-pointer items-center gap-2 text-primary"
        @click="handleBack"
      >
        <art-svg-icon
          icon="material-symbols:arrow-left-alt"
        />

        <span>返回</span>

      </div>

      <div
        class="h-4 w-1 shrink-0 bg-(--art-card-border) max-sm:hidden"
      >
        <!-- 分割线 -->
      </div>

      <slot
        name="content"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 max-w-[60vw] -translate-x-1/2 -translate-y-1/2 truncate text-center font-medium"
        >
          {{ pageTitle }}
        </div>
      </slot>

    </div>

    <!-- 右侧 -->
    <div
      class="flex shrink-0 flex-wrap gap-2 items-center justify-end max-md:w-full max-sm:gap-3 max-sm:justify-start"
    >
      <slot
        name="extra"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.client-page-header {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.client-page-header.is-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>

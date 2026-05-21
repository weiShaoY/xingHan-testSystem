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

/**
 * 返回上一页
 */
function handleBack() {
  emit('back')
  router.back()
}
</script>

<template>

  <div
    class="mb-5 flex shrink-0 gap-4 rounded-xl border border-(--art-gray-200) bg-(--default-box-color) p-4 items-center justify-between max-md:flex-col max-md:items-stretch max-sm:gap-5 max-sm:p-5"
    :class="props.sticky ? 'sticky top-30 z-10' : ''"
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
        class="h-4 w-1 shrink-0 bg-[var(--art-card-border)] max-sm:hidden"
      >
        <!-- 分割线 -->
      </div>

      <slot
        name="content"
      >
        <div
          class="flex min-w-0 flex-wrap gap-x-5 gap-y-2 items-center max-sm:flex-col max-sm:items-start max-sm:gap-y-2.5"
        >
          <span
            class="truncate font-medium"
          >
            {{ props.title }}
          </span>

          <div
            v-if="props.stats.length"
            class="flex flex-wrap gap-x-3 gap-y-1 text-sm font-normal text-info"
          >
            <span
              v-for="item in props.stats"
              :key="item"
            >
              {{ item }}
            </span>
          </div>
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

<style lang="scss" scoped></style>

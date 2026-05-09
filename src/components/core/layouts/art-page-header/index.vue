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
  <el-page-header
    class="art-card"
    :class="props.sticky ? 'sticky top-[60px] z-40' : 'z-10'"
    @back="handleBack"
  >
    <template
      #content
    >
      <slot
        name="content"
      >
        <div
          class="flex gap-5 items-center"
        >
          <span>{{ props.title }}</span>

          <div
            v-if="props.stats.length"
            class="text-sm text-info font-normal flex gap-2"
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
    </template>

    <template
      #extra
    >
      <div
        class="flex gap-2 items-center"
      >
        <slot
          name="extra"
        />
      </div>
    </template>
  </el-page-header>
</template>

<style lang="scss" scoped></style>

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
    class="!sticky shrink-0 top-30 !border-[var(--art-card-border)] p-4 mb-5"
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

  <div
    class="flex items-center justify-between py-4 bg-[var(--default-bg-color)]"
  >
    <!-- 左侧 -->
    <div
      class="flex items-center gap-6"
    >
      <!-- 返回按钮 -->
      <div
        class="flex items-center gap-2 cursor-pointer text-primary"
        @click="handleBack"
      >
        <art-svg-icon
          icon="material-symbols:arrow-left-alt"
        />

        <span>返回</span>

      </div>

      <div
        class="w-1 h-4 bg-[var(--art-card-border)] "
      >
        <!-- 分割线 -->
      </div>

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

    </div>

    <!-- 右侧 -->
    <div
      class="flex gap-5 items-center"
    >
      <slot
        name="extra"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

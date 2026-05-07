<!-- 按钮组件 -->
<script lang="ts" setup>
defineOptions({
  name: 'ArtIconButton',
})

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

type Props = {

  /** 图标名称 */
  icon?: string

  /** 圆角按钮 */
  circle?: boolean

  /** 按钮类型 */
  type?: 'add' | 'edit' | 'delete' | 'more' | 'view' | 'export' | 'default'

  /** icon 颜色 */
  iconColor?: string

  /** 按钮背景色 */
  buttonBgColor?: string

  /** 按钮样式类 */
  iconClass?: string

  /** 提示信息 */
  tooltip?: string

  /** 加载状态 */
  loading?: boolean

  /** 层级 z-index */
  zIndex?: number
}

// 默认按钮配置
const defaultButtons = {
  add: {
    icon: 'ri:add-fill',
    class: 'bg-theme/12 text-theme',
  },
  edit: {
    icon: 'ri:pencil-line',
    class: 'bg-secondary/12 text-secondary',
  },
  delete: {
    icon: 'ri:delete-bin-5-line',
    class: 'bg-error/12 text-error',
  },
  view: {
    icon: 'ri:eye-line',
    class: 'bg-info/12 text-info',
  },
  export: {
    icon: 'ix:arrow-down',
    class: 'bg-success/12 text-success',
  },
  more: {
    icon: 'ri:more-2-fill',
    class: '',
  },
  default: {
    icon: '',
    class: 'bg-info/6 text-info',
  },
} as const// 获取图标内容

const iconContent = computed(() => {
  return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
})

// 获取按钮样式类
const buttonClass = computed(() => {
  return props.iconClass || (props.type ? defaultButtons[props.type]?.class : '') || ''
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <!-- 👇 关键优化：有 tooltip 才渲染，没有就直接显示按钮 -->
  <ElTooltip
    v-if="tooltip"
    :content="tooltip"
    :disabled="!tooltip"
    :z-index="zIndex"
  >
    <div
      class="text-sm mr-2.5 px-2.5 align-middle rounded-md inline-flex gap-2 h-8 min-w-8 c-p items-center justify-center hover:bg-hover-color"
      :class="[buttonClass, { 'rounded-full': circle }]"
      :style="{ backgroundColor: buttonBgColor, color: iconColor }"
      @click="handleClick"
    >
      <ArtSvgIcon
        v-if="!loading"
        :icon="iconContent"
      />

      <IconLoading
        v-else
      />

      <slot />
    </div>
  </ElTooltip>

  <div
    v-else
    class="text-sm mr-2.5 px-2.5 align-middle rounded-md inline-flex gap-2 h-8 min-w-8 c-p items-center justify-center hover:bg-hover-color"
    :class="[buttonClass, { 'rounded-full': circle }]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    @click="handleClick"
  >
    <ArtSvgIcon
      v-if="!loading"
      :icon="iconContent"
    />

    <IconLoading
      v-else
    />

    <slot />
  </div>

</template>

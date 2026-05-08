<!-- 按钮组件 -->
<script lang="ts" setup>
defineOptions({
  name: 'ArtIconButton',
})

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

type Props = {

  /** 图标名称 */
  icon?: string

  /** 圆角按钮 */
  circle?: boolean

  /** 按钮类型 */
  type?: 'default' | 'view' | 'more' | 'add' | 'edit' | 'delete' | 'import' | 'export' | 'success' | 'link'

  /** icon 颜色 */
  iconColor?: string

  /** 按钮背景色 */
  buttonBgColor?: string

  /** 按钮样式类 */
  iconClass?: string

  /** 提示信息 */
  tooltip?: string

  /** 提示信息位置顶部 */
  tooltipPlacement?: string

  /** 加载状态 */
  loading?: boolean

  /** 层级 z-index */
  zIndex?: number

  /** 是否禁用 */
  disabled?: boolean
}

type ButtonPreset = {
  icon?: string
  class: string
  tooltip?: string
}

/**
   *  默认按钮配置
   */
const defaultButtons: Record<NonNullable<Props['type']>, ButtonPreset> = {
  default: {
    icon: '',
    class: 'bg-info/6 text-info',
  },

  view: {
    icon: 'ri:eye-line',
    class: 'bg-info/12 text-info',
    tooltip: '查看',
  },

  more: {
    icon: 'ri:more-2-fill',
    class: '',
  },

  add: {
    icon: 'ri:add-fill',
    class: 'bg-theme/12 text-theme',
  },

  edit: {
    icon: 'ri:pencil-line',
    class: 'bg-secondary/12 text-secondary',
    tooltip: '编辑',
  },

  delete: {
    icon: 'ri:delete-bin-5-line',
    class: 'bg-error/12 text-error',
    tooltip: '删除',
  },

  import: {
    icon: 'ri:import-line',
    class: 'bg-primary/12 text-primary',
  },

  export: {
    icon: 'ix:arrow-down',
    class: 'bg-success/12 text-success',
    tooltip: '导出',
  },

  success: {
    icon: 'ri:check-line',
    class: 'bg-primary/12 text-primary',
  },

  link: {
    class: 'text-primary hover:text-primary/80 hover:underline underline-offset-6',
  },
}

// 获取图标内容
const iconContent = computed(() => {
  return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
})

// 获取按钮样式类
const buttonClass = computed(() => {
  return props.iconClass || (props.type ? defaultButtons[props.type]?.class : '') || ''
})

const buttonStateClass = computed(() => ({
  'c-p hover:bg-hover-color': !props.disabled,
  'cursor-not-allowed opacity-50': props.disabled,
}))

// 获取 tooltip 内容
const tooltipContent = computed(() => {
  return props.tooltip || (props.type ? defaultButtons[props.type]?.tooltip || '' : '') || ''
})

function handleClick(event: MouseEvent) {
  event.stopPropagation()

  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <!-- 👇 关键优化：有 tooltip 才渲染，没有就直接显示按钮 -->
  <ElTooltip
    v-if="tooltipContent"
    :content="tooltipContent"
    :disabled="!tooltipContent"
    :placement="tooltipPlacement"
    :z-index="zIndex"
  >
    <div
      class="text-sm mr-2 px-2.5 align-middle rounded-md inline-flex gap-2 h-8 min-w-8 items-center justify-center"
      :class="[buttonClass, buttonStateClass, { 'rounded-full': circle }]"
      :style="{ backgroundColor: buttonBgColor, color: iconColor }"
      :aria-disabled="disabled"
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
    class="text-sm mr-2 px-2.5 align-middle rounded-md inline-flex gap-2 h-8 min-w-8 items-center justify-center"
    :class="[buttonClass, buttonStateClass, { 'rounded-full': circle }]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    :aria-disabled="disabled"
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

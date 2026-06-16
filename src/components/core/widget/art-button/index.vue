<!-- 按钮组件 -->
<script lang="ts" setup>
defineOptions({
  name: 'ArtButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false,
  deleteConfirm: true,
  deleteConfirmTitle: '删除确认',
  deleteConfirmMessage: '确定要删除吗？删除后无法恢复',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()

type Props = {

  /**
   * 图标名称
   * @description 支持 Iconify 图标名称
   * @example "ri:add-line"
   */
  icon?: string

  /**
   * 是否为圆形按钮
   * @description 开启后按钮会显示为圆形
   */
  circle?: boolean

  /**
   * 按钮预设类型
   * @description 内置不同的图标、颜色和 tooltip 配置
   */
  type?: 'default' | 'view' | 'more' | 'add' | 'edit' | 'delete' | 'import' | 'export' | 'link' | 'primary' | 'success' | 'warning' | 'error' | 'allocate' | 'download'

  /**
   * 图标颜色
   * @description 仅作用于图标颜色
   * @example "#ffffff"
   */
  iconColor?: string

  /**
   * 文字颜色
   * @description 仅作用于按钮文字颜色
   * @example "#ffffff"
   */
  textColor?: string

  /**
   * 按钮背景颜色
   * @description 用于覆盖默认背景色
   * @example "#279275"
   */
  bgColor?: string

  /**
   * 按钮自定义类名
   * @description 用于扩展按钮样式
   */
  iconClass?: string

  /**
   * 提示内容
   * @description 鼠标悬停时显示的 tooltip 文本
   */
  tooltip?: string

  /**
   * 提示框位置
   * @description 等同于 Element Plus Tooltip placement
   * @example "top"
   */
  tooltipPlacement?: string

  /**
   * Tooltip 层级
   * @description 用于控制 tooltip 的 z-index
   */
  tooltipZIndex?: number

  /**
   * 加载状态
   * @description 开启后会显示 loading 图标
   */
  loading?: boolean

  /**
   * 是否禁用按钮
   * @description 禁用后按钮不可点击
   */
  disabled?: boolean

  /**
   * 删除按钮是否需要确认
   * @description type 为 delete 时生效
   */
  deleteConfirm?: boolean

  /**
   * 删除确认标题
   * @description type 为 delete 且 deleteConfirm 为 true 时生效
   */
  deleteConfirmTitle?: string

  /**
   * 删除确认内容
   * @description type 为 delete 且 deleteConfirm 为 true 时生效
   */
  deleteConfirmMessage?: string
}

type ButtonPreset = {
  icon?: string
  class: string
  tooltip?: string
}

/**
 * 默认按钮配置
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

  link: {
    class: 'text-primary hover:text-primary/80 hover:underline underline-offset-6',
  },

  primary: {
    class: 'bg-theme/12 text-theme',
  },

  success: {
    class: 'bg-primary/12 text-primary',
  },

  warning: {
    class: 'bg-warning/12 text-warning',
  },

  error: {
    class: 'bg-error/12 text-error',
  },

  allocate: {
    icon: 'material-symbols:person-add-outline-rounded',
    class: 'bg-primary/12 text-primary',
    tooltip: '分配',
  },
  download: {
    icon: 'ri:download-2-line',
    class: 'bg-info/12 text-info',
    tooltip: '下载',
  },
}

/**
 * 图标内容
 */
const iconContent = computed(() => {
  return props.icon || defaultButtons[props.type]?.icon || ''
})

/**
 * 按钮样式类
 */
const buttonClass = computed(() => {
  return props.iconClass || defaultButtons[props.type]?.class || ''
})

/**
 * 按钮状态类
 */
const buttonStateClass = computed(() => ({
  'c-p hover:bg-hover-color': !props.disabled,
  'cursor-not-allowed opacity-50': props.disabled,
}))

/**
 * 按钮根节点类名
 */
const rootClass = computed(() => [
  'text-sm px-2.5 align-middle rounded-md inline-flex gap-2 h-8 min-w-8 items-center justify-center',
  buttonClass.value,
  buttonStateClass.value,
  {
    'rounded-full': props.circle,
  },
  attrs.class,
])

/**
 * 按钮根节点透传属性
 */
const rootAttrs = computed(() => {
  const {
    class: _class,
    ...restAttrs
  } = attrs

  return restAttrs
})

/**
 * Tooltip 内容
 */
const tooltipContent = computed(() => {
  return props.tooltip || defaultButtons[props.type]?.tooltip || ''
})

/**
 * 按钮内联样式
 */
const buttonStyle = computed(() => {
  return {
    ...(props.bgColor
      ? {
          backgroundColor: props.bgColor,
        }
      : {
        }),
  }
})

/**
 * 文字颜色样式
 */
const textStyle = computed(() => {
  return {
    ...(props.textColor
      ? {
          color: props.textColor,
        }
      : {
        }),
  }
})

/**
 * 处理点击事件
 *
 * @param event 鼠标事件
 */
async function handleClick(event: MouseEvent) {
  event.stopPropagation()

  if (props.disabled) {
    event.preventDefault()
    return
  }

  if (props.type === 'delete' && props.deleteConfirm) {
    try {
      await ElMessageBox.confirm(props.deleteConfirmMessage, props.deleteConfirmTitle, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
    }
    catch {
      return
    }
  }

  emit('click', event)
}
</script>

<template>
  <ElTooltip
    v-if="tooltipContent"
    :content="tooltipContent"
    :disabled="!tooltipContent"
    :placement="tooltipPlacement"
    :z-index="tooltipZIndex"
  >
    <div
      v-bind="rootAttrs"
      :class="rootClass"
      :style="buttonStyle"
      :aria-disabled="disabled"
      @click="handleClick"
    >
      <ArtSvgIcon
        v-if="!loading"
        :icon="iconContent"
        :color="iconColor"
      />

      <IconLoading
        v-else
      />

      <span
        v-if="$slots.default"
        :style="textStyle"
      >
        <slot />
      </span>
    </div>
  </ElTooltip>

  <div
    v-else
    v-bind="rootAttrs"
    :class="rootClass"
    :style="buttonStyle"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <ArtSvgIcon
      v-if="!loading"
      :icon="iconContent"
      :color="iconColor"
    />

    <IconLoading
      v-else
    />

    <span
      v-if="$slots.default"
      :style="textStyle"
    >
      <slot />
    </span>
  </div>
</template>

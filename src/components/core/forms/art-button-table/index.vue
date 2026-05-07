<!-- 表格按钮 -->
<script setup lang="ts">
defineOptions({
  name: 'ArtButtonTable',
})

const props = withDefaults(defineProps<Props>(), {
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

type Props = {

  /** 按钮类型 */
  type?: 'add' | 'edit' | 'delete' | 'more' | 'view' | 'export'

  /** 按钮图标 */
  icon?: string

  /** 按钮样式类 */
  iconClass?: string

  /** icon 颜色 */
  iconColor?: string

  /** 按钮背景色 */
  buttonBgColor?: string
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
    icon: 'ri:export-line',
    class: 'bg-success/12 text-success',
  },
  more: {
    icon: 'ri:more-2-fill',
    class: '',
  },
} as const

// 获取图标内容
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
  <div
    class="text-sm mr-2.5 px-2.5 align-middle rounded-md inline-flex h-8 min-w-8 c-p items-center justify-center"
    :class="[
      buttonClass,
    ]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    @click="handleClick"
  >
    <ArtSvgIcon
      :icon="iconContent"
    />
  </div>
</template>

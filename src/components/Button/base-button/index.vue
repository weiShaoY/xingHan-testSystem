<!------------------------------------  基础图标按钮  ------------------------------------------------->
<script setup lang="ts">
import type { Placement } from 'element-plus'

import type { CSSProperties } from 'vue'

import { twMerge } from 'tailwind-merge'

import { computed } from 'vue'

/**
 * 组件属性类型
 */
type Props = {

  /** 按钮的 class 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 图标名称 */
  icon?: string

  /** 图标大小 */
  size?: number

  /** 图标额外的 class */
  iconClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 提示框内容 */
  tooltipContent?: string

  /** 提示框位置 */
  tooltipPlacement?: Placement

  /** 层级 z-index */
  zIndex?: number

  /** 行内样式 */
  style?: CSSProperties

  /** 是否显示加载中 */
  loading?: boolean

  /** 是否悬浮旋转 */
  rotate?: boolean

  /** 按钮主题 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'

  /** 是否禁用 */
  disabled?: boolean

  /** 按钮形状 */
  shape?: 'circle' | 'square'
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  size: 40,
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  loading: false,
  type: 'default',
  disabled: false,
  shape: 'circle',
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/**
 * 默认按钮类
 */
const DEFAULT_CLASS = 'flex items-center justify-center'

/**
 * 处理 class，兼容多种格式
 * @param input - 输入的类
 * @returns 拼接后的类字符串
 */
function stringifyClass(input?: string | Record<string, boolean> | Array<string | Record<string, boolean>>): string {
  if (!input) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input)) {
    return input
      .map(item => stringifyClass(item))
      .filter(Boolean)
      .join(' ')
  }

  return Object.entries(input)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ')
}

/**
 * 计算按钮的最终类名
 */
const buttonClasses = computed(() => {
  const shapeClass = props.shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return twMerge(DEFAULT_CLASS, shapeClass, stringifyClass(props.class))
})

/**
 * 计算图标的最终类名（包含旋转效果）
 */
const iconClasses = computed(() => {
  const baseClass = stringifyClass(props.iconClass)

  const rotateClass = props.rotate ? 'hover:rotate-180 transition-transform duration-1500' : ''

  return twMerge(baseClass, rotateClass)
})

/**
 * 计算按钮的行内样式
 */
const buttonStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...props.style,
}))

/**
 * 计算图标大小
 */
const iconSize = computed(() => props.size - 14)
</script>

<template>
  <div
    class="inline-block"
  >
    <ElTooltip
      v-if="tooltipContent"
      :placement="tooltipPlacement"
      :content="tooltipContent"
      :z-index="zIndex"
    >
      <ElButton
        quaternary
        class="!h-auto !p-0"
        :type="type"
        :loading="loading"
        :disabled="disabled"
        @click="$emit('click', $event)"
      >
        <div
          :class="buttonClasses"
          :style="buttonStyle"
        >
          <slot>
            <SvgIcon
              v-if="!loading && icon"
              :icon="icon"
              :size="iconSize"
              :class="iconClasses"
            />

            <IconLoading
              v-else-if="loading"
              :size="iconSize"
            />
          </slot>
        </div>
      </ElButton>
    </ElTooltip>

    <ElButton
      v-else
      text
      quaternary
      class="!h-auto !p-0"
      :type="type"
      :loading="loading"
      :disabled="disabled"
      @click="$emit('click', $event)"
    >
      <div
        :class="buttonClasses"
        :style="buttonStyle"
      >
        <slot>
          <SvgIcon
            v-if="!loading && icon"
            :icon="icon"
            :size="iconSize"
            :class="iconClasses"
          />

          <IconLoading
            v-else-if="loading"
            :size="iconSize"
          />
        </slot>
      </div>
    </ElButton>
  </div>
</template>

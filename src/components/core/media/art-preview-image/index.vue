<script setup lang="ts">
type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

type Props = {

  /** 文件路径 */
  path: string

  /** 预览路径，默认与文件路径一致 */
  previewPath?: string

  /** 是否预览 */
  preview?: boolean

  /** 图片适应方式 */
  fit?: ImageFit

  /** 预览缩放倍率 */
  zoomRate?: number

  /** 最大缩放比例 */
  maxScale?: number

  /** 最小缩放比例 */
  minScale?: number
}

defineOptions({
  name: 'ArtPreviewImage',
})

const props = withDefaults(defineProps<Props>(), {
  previewPath: '',
  preview: true,
  fit: 'cover',
  zoomRate: 1.2,
  maxScale: 7,
  minScale: 0.2,
})

const imageUrl = computed(() => getFileUrl(props.path))

const previewUrl = computed(() => getFileUrl(props.previewPath || props.path))
</script>

<template>
  <ElImage
    :src="imageUrl"
    :zoom-rate="props.zoomRate"
    :max-scale="props.maxScale"
    :min-scale="props.minScale"
    :preview-teleported="props.preview"
    :fit="props.fit"
    hide-on-click-modal
    :preview-src-list="props.preview ? [previewUrl] : []"
    v-bind="$attrs"
  />
</template>

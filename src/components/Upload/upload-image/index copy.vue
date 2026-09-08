<script lang="ts" setup>
import type { UploadHooks, UploadRequestOptions } from 'element-plus'

import { computed, ref } from 'vue'

import { getFileUrl } from '@/utils/file'

type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

type Props = {

  /** 图片地址，支持 v-model */
  modelValue?: string

  /** 默认展示图片的 class */
  imageClass?: string

  /** 允许上传的文件类型，可以传扩展名（如 jpg）或 MIME 类型（如 image/jpeg） */
  fileType?: string | string[]

  /** 上传文件大小限制（MB） */
  maxFileSize?: number

  /** 图片适应方式 */
  fit?: ImageFit

  /** 是否显示删除按钮 */
  showRemove?: boolean

  /** 是否可点击预览 */
  previewable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  imageClass: '',
  fileType: () => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  maxFileSize: 5,
  fit: 'cover',
  showRemove: true,
  previewable: true,
})

const emit = defineEmits<Emits>()

type Emits = {
  (e: 'update:modelValue', url: string): void
  /** 文件校验通过后触发，由父组件负责调用上传接口 */
  (e: 'upload', file: File): void

  /** 点击删除按钮时触发 */
  (e: 'remove'): void
}

const uploadRootRef = ref<HTMLElement>()

const previewUrl = computed(() => getFileUrl(props.modelValue))

const hasImage = computed(() => !!props.modelValue)

const accept = computed(() => {
  const types = Array.isArray(props.fileType) ? props.fileType : [props.fileType]

  return types.map(type => type.startsWith('.') || type.includes('/') ? type : `.${type}`).join(',')
})

function validateFileBeforeUpload(
  file: Parameters<UploadHooks['beforeUpload']>[0],
): ReturnType<UploadHooks['beforeUpload']> {
  const types = Array.isArray(props.fileType) ? props.fileType : [props.fileType]

  const extension = `.${file.name.split('.')
    .pop()
    ?.toLowerCase() || ''}`

  const validType = types.some((type) => {
    const normalizedType = type.toLowerCase()

    return normalizedType.includes('/')
      ? file.type.toLowerCase() === normalizedType
      : extension === (normalizedType.startsWith('.') ? normalizedType : `.${normalizedType}`)
  })

  if (!validType) {
    ElNotification.error(`仅支持 ${types.join('、')} 格式图片`)
    return false
  }

  if (file.size / 1024 / 1024 > props.maxFileSize) {
    ElNotification.error(`图片大小不能超过 ${props.maxFileSize}MB`)
    return false
  }

  return true
}

async function handleUploadRequest(options: UploadRequestOptions) {
  emit('upload', options.file)
  options.onSuccess?.({
  })
}

function openFileDialog() {
  uploadRootRef.value?.querySelector<HTMLInputElement>('input[type="file"]')?.click()
}

function handleRemove(e: Event) {
  e.stopPropagation()
  emit('update:modelValue', '')
  emit('remove')
}
</script>

<template>
  <div
    ref="uploadRootRef"
    class="art-upload-image"
  >
    <el-upload
      :accept="accept"
      :multiple="false"
      :show-file-list="false"
      :before-upload="validateFileBeforeUpload"
      :http-request="handleUploadRequest"
    >
      <div
        class="art-upload-image__wrapper"
        @click="openFileDialog"
      >
        <template
          v-if="hasImage"
        >
          <el-image
            class="art-upload-image__img"
            :class="[imageClass]"
            :src="previewUrl"
            :fit="fit"
            :preview-src-list="previewable ? [previewUrl] : []"
            hide-on-click-modal
            preview-teleported
          />

          <div
            class="art-upload-image__mask"
          >
            <el-icon
              class="art-upload-image__icon"
              @click.stop="openFileDialog"
            >
              <Edit />
            </el-icon>

            <el-icon
              v-if="showRemove"
              class="art-upload-image__icon art-upload-image__icon--remove"
              @click="handleRemove"
            >
              <Delete />
            </el-icon>
          </div>
        </template>

        <template
          v-else
        >
          <div
            class="art-upload-image__placeholder"
          >
            <el-icon
              class="art-upload-image__plus"
            >
              <Plus />
            </el-icon>

            <span
              class="art-upload-image__text"
            >上传图片</span>
          </div>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.art-upload-image {
  display: inline-block;

  &__wrapper {
    position: relative;
    width: 148px;
    height: 148px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px dashed var(--el-border-color);
    background-color: var(--el-fill-color-lighter);
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--el-color-primary);

      .art-upload-image__mask {
        opacity: 1;
      }
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &__icon {
    font-size: 20px;
    color: #fff;
    cursor: pointer;

    &--remove:hover {
      color: var(--el-color-danger);
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--el-text-color-secondary);
  }

  &__plus {
    font-size: 28px;
  }

  &__text {
    font-size: 12px;
  }
}
</style>

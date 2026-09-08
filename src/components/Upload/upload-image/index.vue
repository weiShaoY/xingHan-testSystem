<!------  2026-06-03---15:14---星期三  ------>
<!------------------------------------  上传按钮组件  ------------------------------------------------->
<script lang="ts" setup>
import type { UploadHooks, UploadRequestOptions } from 'element-plus'

import { computed, ref } from 'vue'

type Props = {

  /** 允许上传的文件类型，可以传扩展名（如 pdf）或 MIME 类型（如 application/pdf） */
  fileType?: string | string[]

  /** 上传文件大小限制（MB） */
  maxFileSize?: number

  /** 上传按钮文本 */
  title?: string

  /** 预览图片地址 */
  previewUrl: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '上传图片',
  fileType: 'image/*',
  maxFileSize: 10,
})

const emit = defineEmits<{
  /** 文件校验通过后触发，由父组件负责调用上传接口 */
  upload: [file: File]
}>()

const uploadRootRef = ref<HTMLElement>()

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
    ElNotification.error(`仅支持 ${types.join('、')} 格式文件`)
    return false
  }

  if (file.size / 1024 / 1024 > props.maxFileSize) {
    ElNotification.error(`文件大小不能超过 ${props.maxFileSize}MB`)
    return false
  }

  return true
}

/** 将校验通过的文件交给父组件上传 */
async function handleUploadRequest(options: UploadRequestOptions) {
  emit('upload', options.file)
  options.onSuccess?.({
  })
}

function openFileDialog() {
  uploadRootRef.value?.querySelector<HTMLInputElement>('input[type="file"]')?.click()
}
</script>

<template>
  <div
    ref="uploadRootRef"
  >
    <el-upload
      :accept="accept"
      :multiple="false"
      :show-file-list="false"
      :before-upload="validateFileBeforeUpload"
      :http-request="handleUploadRequest"
    >
      <ElImage
        :src="previewUrl"
        fit="contain"
        style="width: 100px; height: 100px; cursor: pointer;"
        @click="openFileDialog"
      />
    </el-upload>
  </div>
</template>

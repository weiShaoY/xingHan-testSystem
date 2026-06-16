<!------  2026-06-03---15:14---星期三  ------>
<!------------------------------------  上传组件  ------------------------------------------------->
<script lang="ts" setup>
import type { UploadHooks, UploadRequestOptions } from 'element-plus'

import { UploadFilled } from '@element-plus/icons-vue'

import { fetchAdminUploadFile } from '@/apis/file'

type UploadType = 'document' | 'video'

type UploadDisplay = 'button' | 'notification'

type Props = {

  /**
   * 上传类型
   */
  uploadType?: UploadType

  /**
   * 上传文件大小限制（MB）
   */
  maxFileSize?: number

  /**
   * 显示样式，默认为按钮
   */
  display?: UploadDisplay
}

/**
 * 上传配置
 */
type UploadConfig = {

  /**
   * 上传区域标题
   */
  title: string

  /**
   * 支持格式提示文案
   */
  acceptText: string

  /**
   * 允许上传的文件扩展名
   */
  extensions: string[]

  /**
   * 文件格式错误提示
   */
  errorMessage: string
}

type UploadResponse = Awaited<ReturnType<typeof fetchAdminUploadFile>>

const props = withDefaults(defineProps<Props>(), {
  uploadType: 'document',
  maxFileSize: 500,
  display: 'button',
})

const emit = defineEmits<{
  'upload-success': [response: UploadResponse]
  'upload-error': [error: Error]
}>()

const uploadLoading = ref(false)

const uploadRootRef = ref<HTMLElement>()

const uploadConfig: Record<UploadType, UploadConfig> = {
  document: {
    title: '上传文档',
    acceptText: '文档支持 pdf 格式。',
    extensions: ['pdf'],
    errorMessage: '仅支持 pdf 格式文件',
  },
  video: {
    title: '上传视频',
    acceptText: '视频支持 mp4 格式。',
    extensions: ['mp4'],
    errorMessage: '仅支持 mp4 格式视频文件',
  },
}

/**
 * 当前上传配置
 * @description 根据上传类型动态获取对应的上传配置
 */
const currentUploadConfig = computed(() => uploadConfig[props.uploadType])

/**
 * 当前上传文件大小限制
 */
const currentMaxFileSize = computed(() => props.maxFileSize)

/**
 * 是否显示按钮样式
 */
const isButtonDisplay = computed(() => props.display === 'button')

/**
 * 上传文件类型
 * @description 根据上传配置动态生成允许上传的文件扩展名
 */
const accept = computed(() => {
  return currentUploadConfig.value.extensions
    .map(item => `.${item}`)
    .join(',')
})

/**
 * 上传文件前校验
 * @param file 当前上传文件
 */
function validateFileBeforeUpload(
  file: Parameters<UploadHooks['beforeUpload']>[0],
): ReturnType<UploadHooks['beforeUpload']> {
  const fileExtension = file.name
    .split('.')
    .pop()
    ?.toLowerCase() || ''

  const isValidExtension = currentUploadConfig.value.extensions.includes(fileExtension)

  const isValidSize = file.size / 1024 / 1024 <= currentMaxFileSize.value

  if (!isValidExtension) {
    ElNotification.error(currentUploadConfig.value.errorMessage)
    return false
  }

  if (!isValidSize) {
    ElNotification.error(`文件大小不能超过 ${currentMaxFileSize.value}MB`)
    return false
  }

  return true
}

/**
 * 标准化上传错误
 * @param error 上传错误
 */
function normalizeUploadError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'string') {
    return new Error(error)
  }

  return new Error('上传失败，请稍后重试')
}

/**
 * 自定义上传请求
 * @param options 上传请求配置
 */
async function handleUploadRequest(options: UploadRequestOptions) {
  try {
    uploadLoading.value = true
    const formData = new FormData()

    formData.append(options.filename, options.file)

    const response = await fetchAdminUploadFile(formData)

    ElNotification.success('上传成功')

    emit('upload-success', response)

    uploadLoading.value = false

    return response
  }
  catch (error) {
    const uploadError = normalizeUploadError(error)

    ElNotification.error(uploadError.message)

    emit('upload-error', uploadError)

    uploadLoading.value = false

    throw uploadError
  }
}

/**
 * 打开文件选择框
 */
function openFileDialog() {
  uploadRootRef.value
    ?.querySelector<HTMLInputElement>('input[type="file"]')
    ?.click()
}
</script>

<template>
  <div
    ref="uploadRootRef"
  >
    <el-upload
      class="upload-demo"
      :drag="!isButtonDisplay"
      :accept="accept"
      :multiple="true"
      :show-file-list="false"
      :before-upload="validateFileBeforeUpload"
      :http-request="handleUploadRequest"
    >
      <template
        v-if="isButtonDisplay"
      >
        <div
          class="flex flex-col items-end gap-1 max-sm:w-full max-sm:items-stretch"
        >
          <ArtIconButton
            icon="ri:add-line"
            type="primary"
            :loading="uploadLoading"
            @click="openFileDialog"
          >
            {{ currentUploadConfig.title }}
          </ArtIconButton>

          <p
            class="text-xs leading-5 text-g-500"
          >
            支持 {{ currentUploadConfig.extensions.join(' / ') }}，大小不超过 {{ currentMaxFileSize }}MB
          </p>
        </div>
      </template>

      <template
        v-else
      >
        <el-icon
          class="el-icon--upload"
        >
          <UploadFilled />
        </el-icon>

        <div
          class="el-upload__text"
        >
          {{ currentUploadConfig.title }}
        </div>

        <div
          class="el-upload__text"
        >
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </template>

      <template
        #tip
      >
        <div
          v-if="!isButtonDisplay"
          class="el-upload__tip mt-4 space-y-2 text-left text-sm leading-relaxed text-g-600"
        >
          <p>
            1. 点击上方图标，选取转码、审核完成的{{ props.uploadType === 'document' ? '文档' : '视频' }}；
          </p>

          <p>
            2. {{ currentUploadConfig.acceptText }}
          </p>

          <p>
            3. 文件大小须在 {{ currentMaxFileSize }}MB 以内，如需上传 {{ currentMaxFileSize }}MB 以上的文件，请联系 support@umu.com；
          </p>

          <p>
            4. 选择文档上传，代表您已同意
            <a
              href="javascript:void(0)"
              class="text-primary"
            >
              用户使用条款
            </a>。
          </p>
        </div>
      </template>

    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
</style>

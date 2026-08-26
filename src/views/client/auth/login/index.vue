<!-- 客户端登录页面 -->
<script setup lang="ts">
import type { FieldRule } from 'vant'

import { sm2, sm3 } from 'sm-crypto'

import { showFailToast, showSuccessToast } from 'vant'

import { useI18n } from 'vue-i18n'

import {
  fetchClientGetPublicKey,
  fetchClientGetUserInfo,
  fetchClientLogin,
} from '@/apis/client/auth'

import { HttpError } from '@/apis/http/error'

import logoFull from '@/assets/svgs/logo-full.svg'

import AppConfig from '@/config'

import { useClientUserStore } from '@/store/modules/clientUser'

defineOptions({
  name: 'ClientLogin',
})

const PRIVACY_PDF_URL = '/pdf/客户隐私说明.pdf'

const userStore = useClientUserStore()

const router = useRouter()

const route = useRoute()

const { t } = useI18n()

const systemName = AppConfig.systemInfo.name

const loading = ref(false)

const passwordVisible = ref(false)

const isPrivacyAccepted = ref(true)

const isShowPdfPreviewDialog = ref(false)

type LoginForm = {
  username: string
  password: string
}

const formData = reactive<LoginForm>({
  username: 'JNAdmin',
  password: '123456',
})

const rules: Record<string, FieldRule[]> = {
  username: [
    {
      required: true,
      message: t('client.login.placeholder.username'),
    },
  ],
  password: [
    {
      required: true,
      message: t('client.login.placeholder.password'),
    },
    {
      validator: (value: string) => value.length >= 6,
      message: '长度至少6位',
    },
  ],
}

/** 加密登录请求数据。 */
function encryptLoginPayload(payload: LoginForm, publicKey: string, sm2key: string) {
  let encryptData = ''

  if (publicKey.startsWith('04')) {
    encryptData += '04'
  }

  encryptData += sm2.doEncrypt(JSON.stringify(payload), publicKey, 0)

  return {
    encryptData,
    smkey: sm3(sm2key),
  }
}

/** 提交登录表单并初始化客户端会话。 */
async function handleSubmit() {
  if (!isPrivacyAccepted.value) {
    showFailToast('请先阅读并同意隐私说明')

    return
  }

  try {
    loading.value = true

    const { key, hash } = await fetchClientGetPublicKey()

    const { encryptData, smkey } = encryptLoginPayload(formData, key, hash)

    const loginResult = await fetchClientLogin({
      data: encryptData,
      key: smkey,
    })

    if (!loginResult.token) {
      throw new Error('登录失败-未收到令牌')
    }

    userStore.setToken(loginResult.token, '')
    userStore.setLoginStatus(true)

    const { userInfo } = await fetchClientGetUserInfo()

    userStore.setUserInfo(userInfo)
    showSuccessToast(`${t('client.login.success.message')}, ${systemName}!`)

    const redirect = route.query.redirect

    await router.push(
      typeof redirect === 'string' && redirect.startsWith('/client')
        ? redirect
        : '/client',
    )
  }
  catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('[登录]意外错误：', error)
      showFailToast('登录失败，请稍后重试')
    }
  }
  finally {
    loading.value = false
  }
}

function openPrivacyPdf() {
  isShowPdfPreviewDialog.value = true
}
</script>

<template>
  <div
    class="login-page min-h-dvh overflow-hidden bg-[#f7f8fa] px-4 sm:px-6"
  >
    <!-- 预览PDF -->
    <PdfPreviewDialog
      v-model="isShowPdfPreviewDialog"
      :source="PRIVACY_PDF_URL"
      title="客户隐私说明"
      mode="h5"
    />

    <main
      class="mx-auto flex min-h-dvh w-full max-w-105 flex-col justify-center py-10 sm:py-14"
    >
      <div
        class="mb-8 flex flex-col items-center text-center sm:mb-10"
      >
        <div
          class="flex h-13 w-full items-center justify-center"
        >
          <van-image
            :src="logoFull"
            fit="contain"
            class="w-46"
            alt="培训系统"
          />
        </div>
      </div>

      <van-form
        :model="formData"
        :rules="rules"
        validate-trigger="onSubmit"
        class="rounded-md border border-[#e8eaed] bg-white p-5 shadow-[0_16px_36px_rgb(15_23_42/7%)] sm:p-7 [&_.van-cell]:min-h-13 [&_.van-cell]:items-center [&_.van-cell]:bg-transparent [&_.van-cell]:px-3.5 [&_.van-field__left-icon]:mr-2.5 [&_.van-field__left-icon]:text-[18px] [&_.van-field__left-icon]:text-[#8a94a4] [&_.van-field__control]:text-[15px] [&_.van-field__control]:text-[#172033] [&_.van-field__control::placeholder]:text-[#a3acb9] [&_.van-field__error-message]:px-3.5 [&_.van-field__error-message]:pt-1.25"
        @submit="handleSubmit"
      >
        <div
          class="overflow-hidden rounded-md border border-[#e2e8f0] bg-[#fafbfc] transition-colors focus-within:border-[#0f9f8f] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(15_159_143/12%)]"
        >
          <van-field
            v-model="formData.username"
            :rules="rules.username"
            name="username"
            left-icon="user-o"
            :placeholder="$t('client.login.placeholder.username')"
            clearable
          />
        </div>

        <div
          class="mt-4 overflow-hidden rounded-md border border-[#e2e8f0] bg-[#fafbfc] transition-colors focus-within:border-[#0f9f8f] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(15_159_143/12%)]"
        >
          <van-field
            v-model.trim="formData.password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="rules.password"
            name="password"
            left-icon="lock"
            :right-icon="passwordVisible ? 'eye-o' : 'closed-eye'"
            :placeholder="$t('client.login.placeholder.password')"
            clearable
            @click-right-icon="passwordVisible = !passwordVisible"
          />
        </div>

        <!-- 隐私说明 -->
        <div
          class="mt-8 flex items-center gap-2 text-3.5 text-[#5f6b7a]"
        >
          <van-checkbox
            v-model="isPrivacyAccepted"
            icon-size="16"
          />

          <button
            type="button"
            class="border-0 bg-transparent p-0 text-[#0f9f8f] outline-none"
            @click="openPrivacyPdf"
          >
            隐私说明
          </button>
        </div>

        <van-button
          :loading="loading"
          :disabled="!isPrivacyAccepted"
          block
          type="primary"
          native-type="submit"
          class="mt-10! h-12 rounded-md! border-0! bg-[#0f9f8f]! text-4 font-600 shadow-[0_8px_16px_rgb(15_159_143/22%)] active:bg-[#087f73]!"
        >
          {{ $t('client.login.btnText') }}
        </van-button>
      </van-form>

    </main>
  </div>
</template>

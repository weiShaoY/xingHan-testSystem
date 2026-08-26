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

const userStore = useClientUserStore()

const router = useRouter()

const route = useRoute()

const { t } = useI18n()

const systemName = AppConfig.systemInfo.name

const loading = ref(false)

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
</script>

<template>
  <div
    class="min-h-dvh bg-[#f5f6f8] px-6"
  >
    <main
      class="mx-auto w-full max-w-130 pt-[clamp(64px,8vh,96px)] md:pt-22"
    >
      <div
        class="mb-[54px] flex justify-center md:mb-18"
      >
        <van-image
          :src="logoFull"
          fit="contain"
          class="w-[200px]"
          alt="培训系统"
        />
      </div>

      <van-form
        :model="formData"
        :rules="rules"
        validate-trigger="onSubmit"
        class="grid gap-5"
        @submit="handleSubmit"
      >
        <div
          class="rounded-md overflow-hidden"
        >
          <van-field
            v-model="formData.username"
            :rules="rules.username"
            name="username"
            :placeholder="$t('client.login.placeholder.username')"
          />
        </div>

        <div
          class="mt-4 rounded-md overflow-hidden"
        >
          <van-field
            v-model.trim="formData.password"
            type="password"
            :rules="rules.password"
            name="password"
            :placeholder="$t('client.login.placeholder.password')"
          />
        </div>

        <van-button
          :loading="loading"
          block
          type="primary"
          native-type="submit"
        >
          {{ $t('client.login.btnText') }}
        </van-button>
      </van-form>

    </main>
  </div>
</template>

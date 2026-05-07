<!-- 登录页面 -->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

import { ElNotification } from 'element-plus'

import { useI18n } from 'vue-i18n'

import { fetchLogin } from '@/api/auth'

import AppConfig from '@/config'

import { useClientUserStore } from '@/store/modules/clientUser'

import { useSettingStore } from '@/store/modules/setting'

import { HttpError } from '@/utils/http/error'

defineOptions({
  name: 'Login',
})

const settingStore = useSettingStore()

const { isDark } = storeToRefs(settingStore)

const { t, locale } = useI18n()

const formKey = ref(0)

// 监听语言切换，重置表单
watch(locale, () => {
  formKey.value++
})

type AccountKey = 'super' | 'admin' | 'user'

export type Account = {
  key: AccountKey
  label: string
  userName: string
  password: string
  roles: string[]
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: t('login.roles.super'),
    userName: 'Super',
    password: '123456',
    roles: ['R_SUPER'],
  },
  {
    key: 'admin',
    label: t('login.roles.admin'),
    userName: 'Admin',
    password: '123456',
    roles: ['R_ADMIN'],
  },
  {
    key: 'user',
    label: t('login.roles.user'),
    userName: 'User',
    password: '123456',
    roles: ['R_USER'],
  },
])

const dragVerify = ref()

const userStore = useClientUserStore()

const router = useRouter()

const route = useRoute()

const isPassing = ref(false)

const isClickPass = ref(false)

const systemName = AppConfig.systemInfo.name

const formRef = ref<FormInstance>()

const formData = reactive({
  account: '',
  username: '',
  password: '',
  rememberPassword: true,
})

const rules = computed<FormRules>(() => ({
  username: [{
    required: true,
    message: t('login.placeholder.username'),
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: t('login.placeholder.password'),
    trigger: 'blur',
  }],
}))

const loading = ref(false)

onMounted(() => {
  setupAccount('super')
})

// 设置账号
function setupAccount(key: AccountKey) {
  const selectedAccount = accounts.value.find((account: Account) => account.key === key)

  formData.account = key
  formData.username = selectedAccount?.userName ?? ''
  formData.password = selectedAccount?.password ?? ''
}

// 登录
async function handleSubmit() {
  if (!formRef.value) { return }

  try {
    // 表单验证
    const valid = await formRef.value.validate()

    if (!valid) { return }

    // 拖拽验证
    if (!isPassing.value) {
      isClickPass.value = true
      return
    }

    loading.value = true

    // 登录请求
    const { username, password } = formData

    const { token, refreshToken } = await fetchLogin({
      userName: username,
      password,
    })

    // 验证token
    if (!token) {
      throw new Error('Login failed - no token received')
    }

    // 存储 token 和登录状态
    userStore.setToken(token, refreshToken)
    userStore.setLoginStatus(true)

    // 登录成功处理
    showLoginSuccessNotice()

    // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到客户端首页
    const redirect = route.query.redirect as string

    router.push(redirect || '/client')
  }
  catch (error) {
    // 处理 HttpError
    if (error instanceof HttpError) {
      // console.log(error.code)
    }
    else {
      // 处理非 HttpError
      // ElMessage.error('登录失败，请稍后重试')
      console.error('[Login] Unexpected error:', error)
    }
  }
  finally {
    loading.value = false
    resetDragVerify()
  }
}

// 重置拖拽验证
function resetDragVerify() {
  dragVerify.value.reset()
}

// 登录成功提示
function showLoginSuccessNotice() {
  setTimeout(() => {
    ElNotification({
      title: t('login.success.title'),
      type: 'success',
      duration: 2500,
      zIndex: 10000,
      message: `${t('login.success.message')}, ${systemName}!`,
    })
  }, 1000)
}
</script>

<template>
  <div
    class="flex h-screen w-full"
  >
    <LoginLeftView />

    <div
      class="flex-1 relative"
    >
      <AuthTopBar />

      <div
        class="auth-right-wrap"
      >
        <div
          class="form"
        >
          <h3
            class="title"
          >
            客户端登录
          </h3>

          <h3
            class="title"
          >
            {{ $t('login.title') }}
          </h3>

          <p
            class="sub-title"
          >
            {{ $t('login.subTitle') }}
          </p>

          <ElForm
            ref="formRef"
            :key="formKey"
            :model="formData"
            :rules="rules"
            style="margin-top: 25px"
            @keyup.enter="handleSubmit"
          >
            <ElFormItem
              prop="account"
            >
              <ElSelect
                v-model="formData.account"
                @change="setupAccount"
              >
                <ElOption
                  v-for="account in accounts"
                  :key="account.key"
                  :label="account.label"
                  :value="account.key"
                >
                  <span>{{ account.label }}</span>
                </ElOption>
              </ElSelect>
            </ElFormItem>

            <ElFormItem
              prop="username"
            >
              <ElInput
                v-model.trim="formData.username"
                class="custom-height"
                :placeholder="$t('login.placeholder.username')"
              />
            </ElFormItem>

            <ElFormItem
              prop="password"
            >
              <ElInput
                v-model.trim="formData.password"
                class="custom-height"
                :placeholder="$t('login.placeholder.password')"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <!-- 推拽验证 -->
            <div
              class="mt-6 pb-5 relative"
            >
              <div
                class="border border-transparent rounded-lg select-none tad-300 relative z-[2] overflow-hidden"
                :class="{ '!border-[#FF4E4F] border-solid border border-solid': !isPassing && isClickPass }"
              >
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  :text="$t('login.sliderText')"
                  text-color="var(--art-gray-700)"
                  :success-text="$t('login.sliderSuccessText')"
                  progress-bar-bg="var(--main-color)"
                  :background="isDark ? '#26272F' : '#F1F1F4'"
                  handler-bg="var(--default-box-color)"
                />
              </div>

              <p
                class="text-xs text-[#f56c6c] mt-2 px-px tad-300 top-0 absolute z-[1]"
                :class="{ 'translate-y-10': !isPassing && isClickPass }"
              >
                {{ $t('login.placeholder.slider') }}
              </p>
            </div>

            <div
              class="text-sm mt-2 flex-cb"
            >
              <ElCheckbox
                v-model="formData.rememberPassword"
              >
                {{
                  $t('login.rememberPwd')
                }}
              </ElCheckbox>

              <RouterLink
                class="text-theme"
                :to="{ name: 'ClientForgetPassword' }"
              >
                {{
                  $t('login.forgetPwd')
                }}
              </RouterLink>
            </div>

            <div
              style="margin-top: 30px"
            >
              <ElButton
                v-ripple
                class="custom-height w-full"
                type="primary"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ $t('login.btnText') }}
              </ElButton>
            </div>

            <div
              class="text-sm text-gray-600 mt-5"
            >
              <span>{{ $t('login.noAccount') }}</span>

              <RouterLink
                class="text-theme"
                :to="{ name: 'ClientRegister' }"
              >
                {{
                  $t('login.register')
                }}
              </RouterLink>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import './style.css';
</style>

<style lang="scss" scoped>
  :deep(.el-select__wrapper) {
  height: 40px !important;
}
</style>

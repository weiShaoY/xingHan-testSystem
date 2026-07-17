<!-- 客户端 登录页面 -->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

import { ElNotification } from 'element-plus'

import { sm2, sm3 } from 'sm-crypto'

import { useI18n } from 'vue-i18n'

import { HttpError } from '@/apis/http/error'
import { fetchClientGetPublicKey, fetchClientGetUserInfo, fetchClientLogin } from '@/apis/client/auth'

import AppConfig from '@/config'

import { useClientUserStore } from '@/store/modules/clientUser'

import { useSettingStore } from '@/store/modules/setting'

defineOptions({
  name: 'Login',
})

/**
 * 系统设置状态，用于读取当前主题等全局配置。
 */
const settingStore = useSettingStore()

/**
 * 客户端用户状态，用于保存 token 与登录状态。
 */
const userStore = useClientUserStore()

/**
 * 路由实例，用于登录成功后的页面跳转。
 */
const router = useRouter()

/**
 * 当前路由信息，用于读取 redirect 参数。
 */
const route = useRoute()

/**
 * 当前是否为暗色主题。
 */
const { isDark } = storeToRefs(settingStore)

/**
 * 国际化方法与当前语言标识。
 */
const { t, locale } = useI18n()

/**
 * 系统名称，用于登录成功通知。
 */
const systemName = AppConfig.systemInfo.name

/**
 * 表单重渲染标识，语言切换后递增以刷新校验文案。
 */
const formKey = ref(0)

/**
 * 拖拽验证组件实例。
 */
const dragVerify = ref()

/**
 * 拖拽验证是否已通过。
 */
const isPassing = ref(false)

/**
 * 是否已经点击登录但未通过拖拽验证。
 */
const isClickPass = ref(false)

/**
 * 登录表单实例。
 */
const formRef = ref<FormInstance>()

/**
 * 登录按钮加载状态。
 */
const loading = ref(false)

/**
 * 登录表单数据。
 */
const formData = ref({
  username: 'qd_admin',
  password: '123456',
  rememberPassword: true,
})

/**
 * 登录表单校验规则。
 */
const rules = computed<FormRules>(() => ({
  username: [{
    required: true,
    message: t('client.login.placeholder.username'),
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: t('client.login.placeholder.password'),
    trigger: 'blur',
  }],
}))

/**
 * 监听语言切换，重置表单实例以更新表单校验文案。
 */
watch(locale, () => {
  formKey.value++
})

/**
 * 加密登录请求数据。
 *
 * 使用后端返回的 SM2 公钥加密登录表单，再使用 SM3 生成密钥摘要，
 * 最终返回登录接口需要的密文数据和摘要密钥。
 *
 * @param formData 登录表单数据。
 * @param publicKey 后端返回的 SM2 公钥。
 * @param sm2key 后端返回的 SM3 摘要源字符串。
 * @returns 登录接口需要的加密参数。
 * @returns returns.encryptData SM2 加密后的表单密文。
 * @returns returns.smkey SM3 计算后的密钥摘要。
 */
function encryptLoginPayload(formData: any, publicKey: string, sm2key: string) {
  let encryptData = ''

  if (publicKey.startsWith('04')) {
    encryptData += '04'
  }

  encryptData += sm2.doEncrypt(JSON.stringify(formData), publicKey, 0)
  const smkey = sm3(sm2key)

  return {
    encryptData,
    smkey,
  }
}

/**
 * 提交登录表单。
 *
 * 校验表单和拖拽验证后调用登录接口，成功后保存客户端 token 与登录状态，
 * 并根据 redirect 参数跳转到目标页面或客户端首页。
 */
async function handleSubmit() {
  if (!formRef.value) { return }

  try {
    // 表单验证
    const valid = await formRef.value.validate()

    if (!valid) { return }

    // 拖拽验证
    if (!isPassing.value && !window.$isDevelopment) {
      isClickPass.value = true
      return
    }

    loading.value = true

    // 获取公钥
    const { key, hash } = await fetchClientGetPublicKey()

    const { encryptData, smkey } = encryptLoginPayload(
      formData.value,
      key,
      hash,
    )

    const encryptedLoginParams = {
      data: encryptData,
      key: smkey,
    }

    // 登录请求
    const loginResult = await fetchClientLogin(encryptedLoginParams)

    // // 验证token
    if (!loginResult.token) {
      throw new Error('登录失败-未收到令牌')
    }

    // // 存储 token 和登录状态
    userStore.setToken(loginResult.token, '')

    userStore.setLoginStatus(true)

    const { userInfo } = await fetchClientGetUserInfo()

    userStore.setUserInfo(userInfo)
    userStore.checkAndClearWorkTabs()

    // // 登录成功处理
    showLoginSuccessNotice()

    // // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到客户端首页
    const redirect = route.query.redirect as string

    router.push(redirect || '/client')
  }
  catch (error) {
    if (error instanceof HttpError) {
      return
    }

    ElMessage.error('登录失败，请稍后重试')
    console.error('[登录]意外错误：', error)
  }
  finally {
    loading.value = false
    resetDragVerify()
  }
}

/**
 * 重置拖拽验证组件状态。
 */
function resetDragVerify() {
  dragVerify.value.reset()
}

/**
 * 显示登录成功通知。
 */
function showLoginSuccessNotice() {
  setTimeout(() => {
    ElNotification({
      title: t('client.login.success.title'),
      type: 'success',
      duration: 2500,
      zIndex: 10000,
      message: `${t('client.login.success.message')}, ${systemName}!`,
    })
  }, 1000)
}
</script>

<template>
  <div
    class="flex h-screen w-full"
  >
    <LoginLeftView
      i18n-path="client.login"
    />

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
            {{ $t('client.login.title') }}
          </h3>

          <p
            class="sub-title"
          >
            {{ $t('client.login.subTitle') }}
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
              prop="username"
            >
              <ElInput
                v-model.trim="formData.username"
                class="custom-height"
                :placeholder="$t('client.login.placeholder.username')"
              />
            </ElFormItem>

            <ElFormItem
              prop="password"
            >
              <ElInput
                v-model.trim="formData.password"
                class="custom-height"
                :placeholder="$t('client.login.placeholder.password')"
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
                class="border border-transparent rounded-lg select-none tad-300 relative z-2 overflow-hidden"
                :class="{ 'border-[#FF4E4F]!  border border-solid': !isPassing && isClickPass }"
              >
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  :text="$t('client.login.sliderText')"
                  text-color="var(--art-gray-700)"
                  :success-text="$t('client.login.sliderSuccessText')"
                  progress-bar-bg="var(--main-color)"
                  :background="isDark ? '#26272F' : '#F1F1F4'"
                  handler-bg="var(--default-box-color)"
                />
              </div>

              <p
                class="text-xs text-[#f56c6c] mt-2 px-px tad-300 top-0 absolute z-1"
                :class="{ 'translate-y-10': !isPassing && isClickPass }"
              >
                {{ $t('client.login.placeholder.slider') }}
              </p>
            </div>

            <div
              class="text-sm mt-2 flex-cb"
            >
              <ElCheckbox
                v-model="formData.rememberPassword"
              >
                {{
                  $t('client.login.rememberPwd')
                }}
              </ElCheckbox>

              <RouterLink
                class="text-theme"
                :to="{ name: 'ClientForgetPassword' }"
              >
                {{
                  $t('client.login.forgetPwd')
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
                {{ $t('client.login.btnText') }}
              </ElButton>
            </div>

            <div
              class="text-sm text-gray-600 mt-5"
            >
              <span>{{ $t('client.login.noAccount') }}</span>

              <RouterLink
                class="text-theme"
                :to="{ name: 'ClientRegister' }"
              >
                {{
                  $t('client.login.register')
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

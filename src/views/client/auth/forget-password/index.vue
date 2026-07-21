<!------  2026-07-21---16:23---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { FieldRule } from 'vant'

import { showNotify } from 'vant'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const router = useRouter()

const loading = ref(false)

const navTitle = computed(() => {
  return String(route.meta?.title || '')
})

function onBack() {
  if (window.history.state.back) {
    history.back()
  }
  else {
    router.replace('/client/auth/login')
  }
}

const postData = ref({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const rules: Record<string, FieldRule[]> = {

  email: [
    {
      required: true,
      message: '请输入邮箱',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '请确认密码',
    },
    {
      required: true,
      validator: (val: string) => val === postData.value.password,
      message: '两次密码不一致',
    },
  ],
}

const isGettingCode = ref(false)

const buttonText = computed(() => {
  return isGettingCode.value ? '获取中' : '发送验证码'
})

async function getCode() {
  isGettingCode.value = true

  if (!postData.value.email) {
    // showNotify({
    //   type: 'warning',
    //   message: t('forgotPassword.pleaseEnterEmail'),
    // })
    window.$toast('请输入邮箱')
  }

  // isGettingCode.value = true
  // const res = await userStore.getCode()

  // if (res.code === 0) {
  //   showNotify({
  //     type: 'success',
  //     message: `验证码发送成功`,
  //   })
  // }

  // isGettingCode.value = false

  showNotify({
    type: 'success',
    message: `验证码发送成功`,
  })
  isGettingCode.value = false
}

async function handleSubmit() {
  // await formRef.value.validate()
}
</script>

<template>
  <div
    class=""
  >
    <VanNavBar
      :title="navTitle"
      :fixed="true"
      :left-arrow="!route.meta.hideClientBack"
      placeholder
      clickable
      @click-left="onBack"
    />

  </div>

  <div
    class="mx-auto p-3 text-center w-full"
  >
    <van-form
      :model="postData"
      :rules="rules"
      validate-trigger="onSubmit"
      class="grid gap-5"
      @submit="handleSubmit"
    >

      <div
        class="rounded-md overflow-hidden"
      >
        <van-field
          v-model.trim="postData.email"
          :rules="rules.email"
          name="email"
          placeholder="请输入邮箱"
        />
      </div>

      <div
        class="mt-4 rounded-md overflow-hidden"
      >
        <van-field
          v-model.trim="postData.code"
          :rules="rules.code"
          name="code"
          placeholder="请输入验证码"
        >
          <template
            #button
          >
            <van-button
              size="small"
              type="primary"
              plain
              @click="getCode"
            >
              {{ buttonText }}
            </van-button>
          </template>
        </van-field>
      </div>

      <div
        class="mt-4 rounded-md overflow-hidden"
      >
        <van-field
          v-model.trim="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          placeholder="请输入密码"
        />
      </div>

      <div
        class="mt-4 rounded-md overflow-hidden"
      >
        <van-field
          v-model.trim="postData.confirmPassword"
          type="password"
          :rules="rules.confirmPassword"
          name="confirmPassword"
          placeholder="再次输入密码"
        />
      </div>

      <van-button
        :loading="loading"
        block
        type="primary"
        native-type="submit"
      >
        注册
      </van-button>
    </van-form>

    <nav
      class="mt-7 grid justify-items-center gap-10 text-[18px] [&_a]:leading-1.5 [&_a]:text-[#2589ed] [&_a]:no-underline"
    >

      <RouterLink
        :to="{ name: 'ClientLogin' }"
      >
        返回登录
      </RouterLink>
    </nav>

  </div>
</template>

<style lang="scss" scoped>

</style>

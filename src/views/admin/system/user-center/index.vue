<!-- 个人中心页面 -->
<script setup lang="ts">
import type { FormInstance } from 'element-plus'

import { useAdminUserStore } from '@/store/modules/adminUser'

defineOptions({
  name: 'UserCenter',
})

const userStore = useAdminUserStore()

const isEdit = ref(false)

const date = ref('')

const ruleFormRef = ref<FormInstance>()

onMounted(() => {
  getDate()
})

/**
   * 根据当前时间获取问候语
   */
function getDate() {
  const h = new Date().getHours()

  if (h >= 6 && h < 9) {
    date.value = '早上好'
  }
  else if (h >= 9 && h < 11) {
    date.value = '上午好'
  }
  else if (h >= 11 && h < 13) {
    date.value = '中午好'
  }
  else if (h >= 13 && h < 18) {
    date.value = '下午好'
  }
  else if (h >= 18 && h < 24) {
    date.value = '晚上好'
  }
  else { date.value = '很晚了，早点睡' }
}

</script>

<template>
  <div
    class="w-full h-full p-0 bg-transparent border-none shadow-none"
  >
    <div
      class="relative flex-b mt-2.5 max-md:block max-md:mt-1"
    >

      <div
        class="flex-1 overflow-hidden max-md:w-full max-md:mt-3.5"
      >
        <div
          class="art-card-sm"
        >
          <h1
            class="p-4 text-xl font-normal border-b border-g-300"
          >
            用户信息
          </h1>

          <ElForm
            ref="ruleFormRef"
            class="box-border p-5 [&>.el-row_.el-form-item]:w-[calc(50%-10px)] [&>.el-row_.el-input]:w-full [&>.el-row_.el-select]:w-full"
            label-width="86px"
            label-position="top"
          >
            <ElRow>
              <ElFormItem
                label="用户名"
                prop="realName"
              >
                <ElInput
                  v-model="userStore.userInfo.userName"
                  :disabled="!isEdit"
                />
              </ElFormItem>

              <ElFormItem
                label="邮箱号"
                prop="email"
                class="ml-5"
              >
                <ElInput
                  v-model="userStore.userInfo.email"
                  :disabled="!isEdit"
                />
              </ElFormItem>

              <ElFormItem
                label="手机号"
                prop="mobile"
              >
                <ElInput
                  v-model="userStore.userInfo.mobile"
                  :disabled="!isEdit"
                />
              </ElFormItem>
            </ElRow>

          </ElForm>
        </div>

      </div>
    </div>
  </div>
</template>

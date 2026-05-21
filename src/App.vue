<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus'

import en from 'element-plus/es/locale/lang/en'

import zh from 'element-plus/es/locale/lang/zh-cn'

import { createTextVNode } from 'vue'

import { useRoute } from 'vue-router'

import { getUserStoreByPath } from '@/store'

import { initializeTheme } from './hooks/core/useTheme'

import { toggleTransition } from './utils/ui/animation'

const route = useRoute()

const language = computed(() => getUserStoreByPath(route.path).language)

const locales = {
  zh,
  en,
}

/**
   * 上下文持有者组件
   * 用于注册全局消息组件
   */
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    /**
       * 注册全局消息组件
       */
    function registerGlobalComponents() {
      try {
        window.$notification = ElNotification

        window.$messageBox = ElMessageBox

        window.$message = ElMessage

        window.$isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

        watchEffect(() => {
          window.$isClientRoute = route.path.startsWith('/client')
        })

        console.log('[AppProvider] 全局组件注册成功', {
          $notification: typeof window.$notification,
          $message: typeof window.$message,
          $messageBox: typeof window.$messageBox,
        })
      }
      catch (error) {
        console.error('[AppProvider] 注册全局组件失败', error)
      }
    }

    onMounted(() => {
      registerGlobalComponents()
    })

    onUnmounted(() => {})

    return () => createTextVNode()
  },
})

onBeforeMount(() => {
  toggleTransition(true)
  initializeTheme()
})

onMounted(() => {
  toggleTransition(false)
})
</script>

<template>
  <ElConfigProvider
    size="default"
    :locale="locales[language]"
    :z-index="3000"
    :card="{
      shadow: 'never',
    }"
  >
    <ContextHolder />

    <RouterView />
  </ElConfigProvider>
</template>

<!------  2026-05-21---11:46---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { LanguageEnum } from '@/enums/appEnum'

import { useI18n } from 'vue-i18n'

import { useCommon } from '@/hooks/core/useCommon'

import { languageOptions } from '@/locales'

import { useClientUserStore } from '@/store'

defineOptions({
  name: 'ClientUserLanguage',
})

const { locale } = useI18n()

const clientUserStore = useClientUserStore()

const { language } = storeToRefs(clientUserStore)

const { refresh } = useCommon()

/**
   * 刷新页面
   * @param {number} time - 延迟时间，默认为0毫秒
   */
function reload(time: number = 0): void {
  setTimeout(() => {
    refresh()
  }, time)
}

/**
   * 切换系统语言
   * @param {LanguageEnum} lang - 目标语言类型
   */
function changeLanguage(lang: LanguageEnum): void {
  if (locale.value === lang) { return }

  locale.value = lang
  clientUserStore.setLanguage(lang)
  reload(50)
}

/**
   * 初始化语言设置
   */
function initLanguage(): void {
  locale.value = language.value
}

onMounted(() => {
  initLanguage()
})
</script>

<template>
  <div
    class=""
  >
    <ElDropdown
      popper-class="langDropDownStyle"
      @command="changeLanguage"
    >
      <ArtButton
        icon="ri:translate-2"
        class="language-btn text-[19px]"
      />

      <template
        #dropdown
      >
        <ElDropdownMenu>
          <div
            v-for="item in languageOptions"
            :key="item.value"
            class="lang-btn-item"
          >
            <ElDropdownItem
              :command="item.value"
              :class="{ 'is-selected': locale === item.value }"
            >
              <span
                class="menu-txt"
              >{{ item.label }}</span>

              <ArtSvgIcon
                v-if="locale === item.value"
                icon="ri:check-fill"
              />
            </ElDropdownItem>
          </div>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style lang="scss" scoped>

</style>

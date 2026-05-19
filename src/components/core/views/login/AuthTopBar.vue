<!-- 授权页右上角组件 -->
<script setup lang="ts">
import type { LanguageEnum } from '@/enums/appEnum'

import { useI18n } from 'vue-i18n'

import AppConfig from '@/config'

import { useHeaderBar } from '@/hooks/core/useHeaderBar'

import { languageOptions } from '@/locales'

import { useCurrentUserStore } from '@/store'

import { useSettingStore } from '@/store/modules/setting'

import { themeAnimation } from '@/utils/ui/animation'

defineOptions({
  name: 'AuthTopBar',
})

const settingStore = useSettingStore()

const userStore = useCurrentUserStore()

const { isDark, systemThemeColor } = storeToRefs(settingStore)

const { shouldShowThemeToggle, shouldShowLanguage } = useHeaderBar()

const { locale } = useI18n()

const mainColors = AppConfig.systemMainColor

const color = systemThemeColor // css v-bind 使用

function changeLanguage(lang: LanguageEnum) {
  if (locale.value === lang) { return }

  locale.value = lang
  userStore.setLanguage(lang)
}

function changeThemeColor(color: string) {
  if (systemThemeColor.value === color) { return }

  settingStore.setElementTheme(color)
  settingStore.reload()
}
</script>

<template>
  <div
    class="flex-c flex-cb w-full top-4.5 absolute z-10 justify-end! max-[1180px]:justify-between!"
  >
    <div
      class="ml-2 flex-cc max-sm:ml-6 hidden! max-[1180px]:flex!"
    >
      <ArtLogo
        class="icon"
        size="46"
      />

      <h1
        class="ont-mediumf text-xl ml-2"
      >
        {{ AppConfig.systemInfo.name }}
      </h1>
    </div>

    <div
      class="mr-2 flex-cc gap-1.5 max-sm:mr-5"
    >
      <div
        class="color-picker-expandable flex-c relative max-sm:hidden!"
      >
        <div
          class="color-dots px-2.5 py-2 pl-2.5 pr-9 rounded-5 rounded-full opacity-0 flex-c gap-2 right-0 absolute"
        >
          <div
            v-for="(color, index) in mainColors"
            :key="color"
            class="color-dot rounded-full opacity-0 flex-cc size-5 c-p relative"
            :class="{ active: color === systemThemeColor }"
            :style="{ 'background': color, '--index': index }"
            @click="changeThemeColor(color)"
          >
            <ArtSvgIcon
              v-if="color === systemThemeColor"
              icon="ri:check-fill"
              class="text-white"
            />
          </div>
        </div>

        <div
          class="btn palette-btn flex-cc h-8 w-8 c-p tad-300 relative z-2"
        >
          <ArtSvgIcon
            icon="ri:palette-line"
            class="text-xl text-g-800 transition-colors duration-300"
          />
        </div>
      </div>

      <ElDropdown
        v-if="shouldShowLanguage"
        popper-class="langDropDownStyle"
        @command="changeLanguage"
      >
        <div
          class="btn language-btn flex-cc h-8 w-8 c-p tad-300"
        >
          <ArtSvgIcon
            icon="ri:translate-2"
            class="text-[19px] text-g-800 transition-colors duration-300"
          />
        </div>

        <template
          #dropdown
        >
          <ElDropdownMenu>
            <div
              v-for="lang in languageOptions"
              :key="lang.value"
              class="lang-btn-item"
            >
              <ElDropdownItem
                :command="lang.value"
                :class="{ 'is-selected': locale === lang.value }"
              >
                <span
                  class="menu-txt"
                >{{ lang.label }}</span>

                <ArtSvgIcon
                  v-if="locale === lang.value"
                  icon="ri:check-fill"
                  class="text-base"
                />
              </ElDropdownItem>
            </div>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div
        v-if="shouldShowThemeToggle"
        class="btn theme-btn flex-cc h-8 w-8 c-p tad-300"
        @click="themeAnimation"
      >
        <ArtSvgIcon
          :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'"
          class="text-xl text-g-800 transition-colors duration-300"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .color-dots {
  pointer-events: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px var(--art-gray-300);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transform: translateX(10px);
}

.color-dot {
  box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--index) * 0.05s);
  transform: translateX(20px) scale(0.8);
}

.color-dot:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateX(0) scale(1.1);
}

.color-picker-expandable:hover .color-dots {
  pointer-events: auto;
  opacity: 1;
  transform: translateX(0);
}

.color-picker-expandable:hover .color-dot {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.dark .color-dots {
  background-color: var(--art-gray-200);
  box-shadow: none;
}

.color-picker-expandable:hover .palette-btn :deep(.art-svg-icon) {
  color: v-bind(color);
}
</style>

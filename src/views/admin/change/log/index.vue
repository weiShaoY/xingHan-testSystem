<!-- 更新日志页面 -->
<script setup lang="ts">
import { upgradeLogList } from '@/mock/upgrade/changeLog'

defineOptions({
  name: 'ChangeLog',
})
</script>

<template>
  <div
    class="mx-auto mb-5 pt-5"
  >
    <!-- 标题 -->
    <h3
      class="text-2xl text-g-900 font-medium mb-8"
    >
      更新日志
    </h3>

    <!-- 日志列表 -->
    <div
      class="space-y-5"
    >
      <div
        v-for="item in upgradeLogList"
        :key="item.version"
        class="art-card-sm p-6 rounded-lg transition-shadow max-md:p-4"
      >
        <!-- 版本和日期 -->
        <div
          class="mb-4 flex-cb flex-wrap gap-3"
        >
          <span
            class="text-sm text-theme font-medium px-3 py-1 rounded-full bg-theme/10"
          >
            {{ item.version }}
          </span>

          <span
            class="text-sm text-g-500"
          >{{ item.date }}</span>
        </div>

        <!-- 标题 -->
        <h4
          class="text-lg text-g-900 font-medium mb-3"
        >
          {{ item.title }}
        </h4>

        <!-- 详情列表 -->
        <ul
          v-if="item.detail?.length"
          class="mb-4 space-y-2"
        >
          <li
            v-for="(detail, index) in item.detail"
            :key="index"
            class="text-sm text-g-600 flex-c gap-2"
          >
            <span
              class="mt-0.5"
            >•</span>

            <span
              class="text-g-700"
            >{{ detail }}</span>
          </li>
        </ul>

        <!-- 备注 -->
        <div
          v-if="item.remark"
          class="text-sm text-g-800 mb-3 p-3 rounded bg-g-300/60"
        >
          {{ item.remark }}
        </div>

        <!-- 标签 -->
        <ElTag
          v-if="item.requireReLogin"
          type="warning"
          size="small"
        >
          需要重新登录
        </ElTag>
      </div>
    </div>
  </div>
</template>

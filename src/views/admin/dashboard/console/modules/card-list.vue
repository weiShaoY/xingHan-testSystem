<script setup lang="ts">
type CardDataItem = {
  des: string
  icon: string
  startVal: number
  duration: number
  num: number
  change: string
}

/**
   * 卡片统计数据列表
   * 展示总访问次数、在线访客数、点击量和新用户等核心数据指标
   */
const dataList = reactive<CardDataItem[]>([
  {
    des: '总访问次数',
    icon: 'ri:pie-chart-line',
    startVal: 0,
    duration: 1000,
    num: 9120,
    change: '+20%',
  },
  {
    des: '在线访客数',
    icon: 'ri:group-line',
    startVal: 0,
    duration: 1000,
    num: 182,
    change: '+10%',
  },
  {
    des: '点击量',
    icon: 'ri:fire-line',
    startVal: 0,
    duration: 1000,
    num: 9520,
    change: '-12%',
  },
  {
    des: '新用户',
    icon: 'ri:progress-2-line',
    startVal: 0,
    duration: 1000,
    num: 156,
    change: '+30%',
  },
])
</script>

<template>
  <ElRow
    :gutter="20"
    class="flex"
  >
    <ElCol
      v-for="(item, index) in dataList"
      :key="index"
      :sm="12"
      :md="6"
      :lg="6"
    >
      <div
        class="art-card mb-5 px-5 flex flex-col h-35 justify-center relative max-sm:mb-4"
      >
        <span
          class="text-sm text-g-700"
        >{{ item.des }}</span>

        <ArtCountTo
          class="text-[26px] font-medium mt-2"
          :target="item.num"
          :duration="1300"
        />

        <div
          class="mt-1 flex-c"
        >
          <span
            class="text-xs text-g-600"
          >较上周</span>

          <span
            class="text-xs font-semibold ml-1"
            :class="[!item.change.includes('+') ? 'text-danger' : 'text-success']"
          >
            {{ item.change }}
          </span>
        </div>

        <div
          class="m-auto rounded-xl bg-theme/10 flex-cc size-12.5 bottom-0 right-5 top-0 absolute"
        >
          <ArtSvgIcon
            :icon="item.icon"
            class="text-xl text-theme"
          />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

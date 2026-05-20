<!------  2026-05-14---15:22---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import cover1 from '@imgs/cover/img1.webp'

import cover2 from '@imgs/cover/img2.webp'

import cover3 from '@imgs/cover/img3.webp'

import cover4 from '@imgs/cover/img4.webp'

import cover5 from '@imgs/cover/img5.webp'

import cover6 from '@imgs/cover/img6.webp'

type NavItem = {
  name: string
  path: string
  icon: string
  bgColor: string
}

type RecommendCourse = {
  title: string
  cover: string
  sections: number
  participants: number
}

const navList: NavItem[] = [
  {
    name: '我的任务',
    path: '/',
    icon: 'tdesign:task',
    bgColor: '#11bbd2',
  },
  {
    name: '报名的课程',
    path: '/',
    icon: 'tdesign:course',
    bgColor: '#f7979f',
  },
  {
    name: '学习历史',
    path: '/',
    icon: 'tdesign:history',
    bgColor: '#febd2d',
  },
  {
    name: '个人主页',
    path: '/',
    icon: 'tdesign:architecture-hui-style',
    bgColor: '#f4793e',
  },
]

const recommendList: RecommendCourse[] = [
  {
    title: '如何使用UMU设计有效果的在线学习项目',
    cover: cover1,
    sections: 19,
    participants: 54061,
  },
  {
    title: 'UMU 快速入门指南',
    cover: cover2,
    sections: 5,
    participants: 182550,
  },
  {
    title: 'UMU AI 微课：降低做课成本，提升业务价值',
    cover: cover3,
    sections: 26,
    participants: 10056,
  },
  {
    title: '考题本｜难题错题一手抓 知识盲点不落下',
    cover: cover4,
    sections: 3,
    participants: 6989,
  },
  {
    title: '语音微课、视频｜AI 自动生成课程字幕，人人都能快速上手',
    cover: cover5,
    sections: 12,
    participants: 9316,
  },
  {
    title: '如何将已有视频和文档形成UMU课程',
    cover: cover6,
    sections: 3,
    participants: 20362,
  },
]

function handleClick(item: NavItem) {
  console.log(item)
}

function handleCourseClick(item: RecommendCourse) {
  console.log(item)
}
</script>

<template>
  <div
    class="py-5 max-sm:py-3"
  >
    <!-- 导航栏 -->
    <div
      class="grid grid-cols-4 gap-4 max-md:gap-3 max-sm:gap-2.5"
    >
      <button
        v-for="item in navList"
        :key="item.name"
        type="button"
        class="min-h-[118px] min-w-0 flex items-center justify-start gap-4 overflow-hidden rounded-custom-sm border-0 px-5 py-4 text-white font-500 shadow-[0_8px_20px_rgb(0_0_0/8%)] transition-[transform,filter,box-shadow] duration-120 ease-in-out cursor-pointer select-none touch-manipulation hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgb(0_0_0/10%)] active:scale-[0.96] active:brightness-92 active:shadow-[0_3px_8px_rgb(0_0_0/10%)] max-md:min-h-[104px] max-md:flex-col max-md:justify-center max-md:gap-2 max-md:px-3 max-md:py-3 max-sm:aspect-square max-sm:min-h-0 max-sm:gap-1.5 max-sm:rounded-2xl max-sm:p-[8px_4px] [-webkit-tap-highlight-color:transparent]"
        :style="{ backgroundColor: item.bgColor }"
        :title="item.name"
        @click="handleClick(item)"
      >
        <div
          class="flex-c"
        >
          <ArtSvgIcon
            :icon="item.icon"
            class="text-[38px] max-md:text-[34px] max-sm:text-[32px]"
          />
        </div>

        <div
          class="line-clamp-2 min-w-0 flex-1 overflow-hidden text-left text-base leading-[1.35] text-ellipsis max-md:w-full max-md:flex-none max-md:text-center max-md:text-sm max-sm:text-xs max-sm:leading-[1.25]"
        >
          {{ item.name }}
        </div>
      </button>
    </div>

    <el-divider
      class="!my-6 max-sm:!my-4"
    />

    <!-- 推荐课程 -->
    <div
      class="pb-6"
    >
      <div
        class="mb-5 flex items-start justify-between gap-4 max-sm:mb-4"
      >
        <div>
          <h2
            class="m-0 text-xl text-g-900 font-semibold leading-8 max-sm:text-[22px]"
          >
            推荐
          </h2>

          <p
            class="mt-1 mb-0 text-sm text-g-600 leading-5 max-sm:mt-2 max-sm:text-[15px]"
          >
            10门课程 97个小节
          </p>
        </div>

        <button
          type="button"
          class="min-h-8 flex items-center gap-1 border-0 bg-transparent p-0 text-base text-g-900 font-500 cursor-pointer select-none touch-manipulation hover:text-primary active:opacity-60 [-webkit-tap-highlight-color:transparent]"
        >
          <span>查看全部</span>

          <ArtSvgIcon
            icon="ri:arrow-right-s-line"
            class="text-[22px]"
          />
        </button>
      </div>

      <div
        class="grid grid-cols-4 gap-x-5 gap-y-7 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-6"
      >
        <button
          v-for="item in recommendList"
          :key="item.title"
          type="button"
          class="group min-w-0 overflow-hidden rounded-custom-sm border-full-d bg-box p-0 text-left cursor-pointer select-none touch-manipulation transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgb(15_23_42/8%)] active:scale-[0.98] active:opacity-80 max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:hover:translate-y-0 max-sm:hover:shadow-none [-webkit-tap-highlight-color:transparent]"
          @click="handleCourseClick(item)"
        >
          <img
            :src="item.cover"
            :alt="item.title"
            class="aspect-16/9 w-full object-cover max-sm:rounded-[5px]"
          >

          <div
            class="px-4 pb-4 pt-3 max-sm:p-0"
          >
            <h3
              class="line-clamp-2 m-0 min-h-[44px] overflow-hidden text-base text-g-900 font-500 leading-[22px] text-ellipsis group-hover:text-primary max-sm:mt-2 max-sm:min-h-[40px] max-sm:text-[16px] max-sm:leading-5"
            >
              {{ item.title }}
            </h3>

            <p
              class="mt-2 mb-0 text-sm text-g-600 leading-5 max-sm:mt-1.5 max-sm:text-[14px]"
            >
              {{ item.sections }}个小节 {{ item.participants }}人参与
            </p>
          </div>
        </button>
      </div>
    </div>

  </div>
</template>

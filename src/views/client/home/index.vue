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
  <div>
    <!-- 导航栏 -->
    <div
      class="grid grid-cols-4 gap-2.5 w-full p-3"
    >
      <button
        v-for="item in navList"
        :key="item.name"
        type="button"
        class="aspect-square min-w-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-0 p-[8px_4px] text-white font-500 shadow-[0_6px_14px_rgb(0_0_0/8%)] transition-[transform,filter,box-shadow] duration-120 ease-in-out cursor-pointer select-none touch-manipulation active:scale-[0.96] active:brightness-92 active:shadow-[0_3px_8px_rgb(0_0_0/10%)] [-webkit-tap-highlight-color:transparent]"
        :style="{ backgroundColor: item.bgColor }"
        :title="item.name"
        @click="handleClick(item)"
      >
        <div
          class="flex-c"
        >
          <ArtSvgIcon
            :icon="item.icon"
            class="text-[32px]"
          />
        </div>

        <div
          class="line-clamp-2 w-full overflow-hidden text-center text-xs leading-[1.25] text-ellipsis"
        >
          {{ item.name }}
        </div>
      </button>
    </div>

    <el-divider />

    <!-- 推荐课程 -->
    <div
      class="px-3 pb-6"
    >
      <div
        class="mb-4 flex items-start justify-between"
      >
        <div>
          <h2
            class="m-0 text-[22px] text-[#202124] font-700 leading-8"
          >
            推荐
          </h2>

          <p
            class="mt-2 mb-0 text-[15px] text-[#6b6f76] leading-5"
          >
            10门课程 97个小节
          </p>
        </div>

        <button
          type="button"
          class="min-h-8 flex items-center gap-1 border-0 bg-transparent p-0 text-[16px] text-[#202124] font-500 cursor-pointer select-none touch-manipulation active:opacity-60 [-webkit-tap-highlight-color:transparent]"
        >
          <span>查看全部</span>

          <ArtSvgIcon
            icon="ri:arrow-right-s-line"
            class="text-[22px]"
          />
        </button>
      </div>

      <div
        class="grid grid-cols-2 gap-x-3 gap-y-6"
      >
        <button
          v-for="item in recommendList"
          :key="item.title"
          type="button"
          class="min-w-0 border-0 bg-transparent p-0 text-left cursor-pointer select-none touch-manipulation active:scale-[0.98] active:opacity-80 [-webkit-tap-highlight-color:transparent]"
          @click="handleCourseClick(item)"
        >
          <img
            :src="item.cover"
            :alt="item.title"
            class="aspect-16/9 w-full rounded-[5px] object-cover"
          >

          <h3
            class="line-clamp-2 mt-2 mb-0 min-h-[40px] overflow-hidden text-[16px] text-[#202124] font-500 leading-5 text-ellipsis"
          >
            {{ item.title }}
          </h3>

          <p
            class="mt-1.5 mb-0 text-[14px] text-[#6b6f76] leading-5"
          >
            {{ item.sections }}个小节 {{ item.participants }}人参与
          </p>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
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
  accentClass: string
  cardClass: string
}

type RecommendCourse = {
  id: number
  title: string
  cover: string
  sections: number
  participants: number
  tag: string
}

const router = useRouter()

const navList: NavItem[] = [
  {
    name: '我的任务',
    path: '/client/task',
    icon: 'tdesign:task',
    accentClass: 'bg-teal-500 shadow-[0_10px_18px_rgb(20_184_166/28%)]',
    cardClass: 'border-teal-100 bg-linear-to-b from-teal-50 to-white',
  },
  {
    name: '报名课程',
    path: '/client/course/list',
    icon: 'tdesign:course',
    accentClass: 'bg-rose-400 shadow-[0_10px_18px_rgb(251_113_133/28%)]',
    cardClass: 'border-rose-100 bg-linear-to-b from-rose-50 to-white',
  },
  {
    name: '学习历史',
    path: '/client/history/list',
    icon: 'tdesign:history',
    accentClass: 'bg-amber-500 shadow-[0_10px_18px_rgb(245_158_11/28%)]',
    cardClass: 'border-amber-100 bg-linear-to-b from-amber-50 to-white',
  },
  {
    name: '个人主页',
    path: '/client/user-center',
    icon: 'tdesign:architecture-hui-style',
    accentClass: 'bg-orange-500 shadow-[0_10px_18px_rgb(249_115_22/28%)]',
    cardClass: 'border-orange-100 bg-linear-to-b from-orange-50 to-white',
  },
]

const recommendList: RecommendCourse[] = [
  {
    id: 1,
    title: '如何使用UMU设计有效果的在线学习项目',
    cover: cover1,
    sections: 19,
    participants: 54061,
    tag: '热门',
  },
  {
    id: 2,
    title: 'UMU 快速入门指南',
    cover: cover2,
    sections: 5,
    participants: 182550,
    tag: '入门',
  },
  {
    id: 3,
    title: 'UMU AI 微课：降低做课成本，提升业务价值',
    cover: cover3,
    sections: 26,
    participants: 10056,
    tag: 'AI',
  },
  {
    id: 4,
    title: '考题本｜难题错题一手抓 知识盲点不落下',
    cover: cover4,
    sections: 3,
    participants: 6989,
    tag: '测评',
  },
  {
    id: 5,
    title: '语音微课、视频｜AI 自动生成课程字幕，人人都能快速上手',
    cover: cover5,
    sections: 12,
    participants: 9316,
    tag: '进阶',
  },
  {
    id: 6,
    title: '如何将已有视频和文档形成UMU课程',
    cover: cover6,
    sections: 3,
    participants: 20362,
    tag: '实践',
  },
]

const sectionTotal = computed(() => {
  return recommendList.reduce((total, item) => total + item.sections, 0)
})

function goToPath(path: string) {
  router.push(path)
}

function goToRecommendList() {
  router.push({
    name: 'ClientRecommendList',
  })
}

function goToRecommendDetail(item: RecommendCourse) {
  router.push({
    name: 'ClientRecommendDetail',
    params: {
      id: item.id,
    },
  })
}
</script>

<template>
  <div
    class="flex flex-col gap-4 px-0 pt-3 pb-6 sm:gap-5 sm:pt-4 sm:pb-7"
  >

    <van-grid
      :column-num="2"
      :border="false"
      gutter="12"
      class="[&_.van-grid-item__content]:bg-transparent [&_.van-grid-item__content]:p-0"
    >
      <van-grid-item
        v-for="item in navList"
        :key="item.path"
        clickable
        @click="goToPath(item.path)"
      >
        <div
          class="min-h-28 w-full flex items-center justify-center gap-3 rounded-5 border px-4 py-4 text-center shadow-[0_10px_24px_rgb(15_23_42/6%)]"
          :class="item.cardClass"
        >
          <div
            class="h-12 w-12 flex shrink-0 items-center justify-center rounded-4 text-white"
            :class="item.accentClass"
          >
            <ArtSvgIcon
              :icon="item.icon"
              class="text-7"
            />
          </div>

          <div
            class="min-w-0 flex-1 overflow-hidden"
          >
            <span
              class="block wrap-break-word text-4.5 text-slate-900 font-700 leading-1.35"
            >{{ item.name }}</span>
          </div>
        </div>
      </van-grid-item>
    </van-grid>

    <van-cell
      title="推荐课程"
      value="查看全部"
      is-link
      center
      class="bg-transparent! px-0!"
      @click="goToRecommendList"
    >
      <template
        #title
      >
        <span
          class="text-5 text-slate-900 font-700"
        >推荐课程</span>
      </template>

      <template
        #label
      >
        <span
          class="mt-1 block text-3.25 text-slate-500"
        >
          {{ recommendList.length }}门课程 · {{ sectionTotal }}个小节
        </span>
      </template>

      <template
        #value
      >
        <span
          class="text-3.5 text-teal-700"
        >查看全部</span>
      </template>
    </van-cell>

    <van-space
      direction="vertical"
      fill
      :size="14"
    >
      <div
        v-for="item in recommendList"
        :key="item.id"
        class="flex cursor-pointer flex-col gap-3.5 rounded-5 border border-slate-200 bg-white p-3.5 shadow-[0_10px_24px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992] sm:flex-row"
        @click="goToRecommendDetail(item)"
      >
        <van-image
          :src="item.cover"
          :alt="item.title"
          fit="cover"
          radius="16"
          class="h-44 w-full shrink-0 overflow-hidden sm:h-28 sm:w-28"
        />

        <div
          class="min-w-0 flex flex-1 flex-col overflow-hidden"
        >
          <van-cell
            center
            class="rounded-4 bg-transparent px-0 py-0 [&_.van-cell__value]:flex [&_.van-cell__value]:items-center [&_.van-cell__value]:justify-end"
          >
            <template
              #title
            >
              <van-tag
                plain
                round
                type="primary"
              >
                {{ item.tag }}
              </van-tag>
            </template>

            <template
              #value
            >
              <span
                class="shrink-0 text-3 text-slate-500"
              >
                {{ item.participants }}人参与
              </span>
            </template>
          </van-cell>

          <div
            class="mt-3 rounded-4 bg-slate-50/70 px-3 py-3 backdrop-blur-sm"
          >
            <h3
              class="m-0 min-h-[3.4rem] break-all text-4 text-slate-900 font-700 leading-[1.7]"
            >
              {{ item.title }}
            </h3>

            <div
              class="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"
            >
              <div
                class="flex flex-wrap gap-x-4 gap-y-2 text-3 text-teal-700"
              >
                <span
                  class="inline-flex items-center gap-1.5"
                >
                  <ArtSvgIcon
                    icon="ri:list-check-2"
                    class="text-4"
                  />
                  {{ item.sections }}个小节
                </span>
              </div>

              <van-button
                round
                size="small"
                type="primary"
                class="border-0 bg-linear-to-r from-teal-600 to-cyan-500 px-3 shadow-[0_10px_18px_rgb(20_184_166/22%)]!"
                @click.stop="goToRecommendDetail(item)"
              >
                进入学习
                <van-icon
                  name="arrow"
                  class="ml-1"
                />
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-space>
  </div>
</template>

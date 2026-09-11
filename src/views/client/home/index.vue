<script setup lang="ts">

type NavItem = {
  name: string
  path: string
  icon: string
  accentClass: string
  cardClass: string
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

  // {
  //   name: '报名课程',
  //   path: '/client/course/list',
  //   icon: 'tdesign:course',
  //   accentClass: 'bg-rose-400 shadow-[0_10px_18px_rgb(251_113_133/28%)]',
  //   cardClass: 'border-rose-100 bg-linear-to-b from-rose-50 to-white',
  // },

  {
    name: '学习历史',
    path: '/client/history/list',
    icon: 'tdesign:history',
    accentClass: 'bg-amber-500 shadow-[0_10px_18px_rgb(245_158_11/28%)]',
    cardClass: 'border-amber-100 bg-linear-to-b from-amber-50 to-white',
  },

  // {
  //   name: '个人主页',
  //   path: '/client/user-center',
  //   icon: 'tdesign:architecture-hui-style',
  //   accentClass: 'bg-orange-500 shadow-[0_10px_18px_rgb(249_115_22/28%)]',
  //   cardClass: 'border-orange-100 bg-linear-to-b from-orange-50 to-white',
  // },
]

const recommendList = ref<ClientApi.Course.CourseRecommendResponse>([])

function goToPath(path: string) {
  router.push(path)
}

function goToRecommendList() {
  router.push({
    name: 'ClientRecommendList',
  })
}

function goToRecommendItem(item: ClientApi.Course.CourseRecommendItem) {
  router.push({
    name: 'ClientCourseDetail',
    params: {
      couId: item.couId,
    },
  })
}

async function getRecommendList() {
  recommendList.value = await fetchClientCourseRecommend()
}

getRecommendList()
</script>

<template>
  <div>

    <van-grid
      :column-num="2"
      :border="false"
      gutter=""
      class=""
    >
      <van-grid-item
        v-for="item in navList"
        :key="item.path"
        clickable
        @click="goToPath(item.path)"
      >
        <div
          class="min-h-28 w-full flex items-center justify-center gap-3  border px-4 py-4 text-center shadow-[0_10px_24px_rgb(15_23_42/6%)] rounded-md"
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
          共 {{ recommendList.length }} 门推荐课程
        </span>
      </template>

      <!-- <template
        #value
      >
        <span
          class="text-3.5 text-teal-700"
        >
          查看全部
        </span>
      </template> -->
    </van-cell>

    <van-space
      v-if="recommendList.length"
      direction="vertical"
      fill
      :size="14"
    >
      <div
        v-for="item in recommendList"
        :key="item.couId"
        class="flex cursor-pointer flex-col gap-3.5 rounded-md border border-slate-200 bg-white p-3.5 shadow-[0_10px_24px_rgb(15_23_42/5%)] transition duration-200 active:scale-[0.992] sm:flex-row"
        @click="goToRecommendItem(item)"
      >
        <van-image
          :src="getFileUrl(item.couLogo)"
          :alt="item.couName"
          fit="cover"
          class="h-44 w-full shrink-0 overflow-hidden sm:h-28 sm:w-28 rounded-md!"
        />

        <div
          class="min-w-0 flex flex-1 flex-col overflow-hidden"
        >
          <div
            class="flex items-center justify-between gap-3"
          >
            <van-tag
              plain
              :type="item.couIsUse === 1 ? 'primary' : 'default'"
            >
              {{ item.couIsUse === 1 ? '已启用' : '已禁用' }}
            </van-tag>

            <span
              class="shrink-0 inline-flex items-center gap-1 text-3 text-slate-500"
            >
              <ArtSvgIcon
                icon="ri:group-line"
                class="text-3.5"
              />
              {{ item.couStudentSum }}人学习
            </span>
          </div>

          <div
            class="mt-3 rounded-4 bg-slate-50/70 px-3 py-3 backdrop-blur-sm"
          >
            <h3
              class="m-0 break-all text-4 text-slate-900 font-700 leading-[1.7]"
            >
              {{ item.couName }}
            </h3>

            <p
              class="mt-3 mb-0 line-clamp-2 text-3 text-slate-500 leading-5"
            >
              {{ item.couIntro || '暂无课程介绍' }}
            </p>

            <div
              class="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"
            >
              <div
                class="flex flex-wrap items-center gap-x-4 gap-y-2 text-3 text-slate-500"
              >
                <span
                  class="inline-flex items-center gap-1.5"
                >
                  <ArtSvgIcon
                    icon="ri:book-open-line"
                    class="text-4"
                  />
                  推荐课程
                </span>
              </div>

              <van-button
                size="small"
                type="primary"
                class=""
                @click.stop="goToRecommendItem(item)"
              >
                查看课程
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-space>

    <div
      v-else
      class="flex min-h-30 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-3.5 text-slate-500"
    >
      暂无推荐课程
    </div>
  </div>
</template>

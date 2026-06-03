<!------  2026-06-03---13:26---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
type RecommendCourse = {
  id: number
  title: string
  sections: number
  participants: number
}

const keyword = ref('')

const selectedCourseId = ref(1)

const courseList: RecommendCourse[] = [
  {
    id: 1,
    title: '如何使用UMU设计有效果的在线学习项目',
    sections: 19,
    participants: 54338,
  },
  {
    id: 2,
    title: 'UMU 快速入门指南',
    sections: 5,
    participants: 183290,
  },
  {
    id: 3,
    title: 'UMU AI 微课：降低做课成本，提升业务价值',
    sections: 8,
    participants: 10165,
  },
  {
    id: 4,
    title: '考题本｜难题错题一手抓 知识盲点不落下',
    sections: 3,
    participants: 7058,
  },
  {
    id: 5,
    title: '语音微课、视频｜AI 自动生成课程字幕，人人可教、人人可学',
    sections: 5,
    participants: 9393,
  },
  {
    id: 6,
    title: '如何将已有视频和文档形成UMU课程',
    sections: 3,
    participants: 20466,
  },
  {
    id: 7,
    title: '作业｜AI 关键词智能评分，提高反馈效率',
    sections: 6,
    participants: 2596,
  },
  {
    id: 8,
    title: '直播｜使用 OBS，创建更丰富的 UMU 互动式直播',
    sections: 8,
    participants: 3024,
  },
  {
    id: 9,
    title: 'AI 生成课程封面，高效完成课程设置',
    sections: 4,
    participants: 5852,
  },
]

const filteredCourses = computed(() => {
  const value = keyword.value.trim().toLowerCase()

  if (!value) {
    return courseList
  }

  return courseList.filter(item => item.title.toLowerCase().includes(value))
})

const sectionTotal = computed(() => {
  return courseList.reduce((total, item) => total + item.sections, 0)
})

function selectCourse(item: RecommendCourse) {
  selectedCourseId.value = item.id
}
</script>

<template>
  <div
    class="flex flex-col"
  >
    <ClientPageHeader
      title="推荐课程"
    >
      <template
        #extra
      >
        <el-input
          v-model="keyword"
          placeholder="搜索课程"
          clearable
          class="w-64 max-sm:w-full"
        >
          <template
            #prefix
          >
            <ArtSvgIcon
              icon="ri:search-line"
            />
          </template>
        </el-input>
      </template>
    </ClientPageHeader>

    <section
      class="mb-5 flex items-start justify-between gap-4 max-sm:flex-col max-sm:items-stretch"
    >
      <div>
        <h2
          class="m-0 text-xl text-g-900 font-semibold leading-8"
        >
          目录
        </h2>

        <p
          class="mt-1 mb-0 text-sm text-g-600"
        >
          {{ courseList.length }}门课程 {{ sectionTotal }}个小节
        </p>
      </div>

      <el-tag
        type="primary"
        effect="plain"
        size="large"
        class="self-center max-sm:self-start"
      >
        推荐学习
      </el-tag>
    </section>

    <section
      class="flex flex-col gap-4"
    >
      <button
        v-for="item in filteredCourses"
        :key="item.id"
        type="button"
        class="recommend-card art-card group flex items-center gap-4 p-5 text-left cursor-pointer transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgb(15_23_42/8%)] active:scale-[0.99] max-sm:items-start max-sm:p-4"
        @click="selectCourse(item)"
      >
        <span
          class="select-dot"
          :class="{ 'is-selected': selectedCourseId === item.id }"
        />

        <div
          class="min-w-0 flex-1"
        >
          <div
            class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span
              class="shrink-0 text-base text-primary font-semibold leading-6"
            >
              课程
            </span>

            <span
              class="h-4 w-px shrink-0 bg-(--art-card-border)"
            />

            <h3
              class="m-0 min-w-0 flex-1 text-lg text-g-900 font-500 leading-7 group-hover:text-primary max-sm:text-base"
            >
              {{ item.title }}
            </h3>
          </div>

          <div
            class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary"
          >
            <span
              class="inline-flex items-center gap-1"
            >
              <ArtSvgIcon
                icon="ri:list-check-2"
                class="text-base"
              />

              {{ item.sections }} 个小节
            </span>

            <span
              class="inline-flex items-center gap-1"
            >
              <ArtSvgIcon
                icon="ri:user-line"
                class="text-base"
              />

              {{ item.participants }}人参与
            </span>
          </div>
        </div>

        <ArtSvgIcon
          icon="ri:arrow-right-s-line"
          class="shrink-0 text-2xl text-g-400 transition group-hover:translate-x-0.5 group-hover:text-primary max-sm:hidden"
        />
      </button>

      <el-empty
        v-if="!filteredCourses.length"
        description="暂无匹配课程"
        :image-size="140"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.recommend-card {
  min-height: 112px;
}

.select-dot {
  position: relative;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border: 2px solid var(--art-card-border);
  border-radius: 50%;

  &::after {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 5px;
    height: 5px;
    content: '';
    background: transparent;
    border-radius: 50%;
  }

  &.is-selected::after {
    background: var(--el-color-success);
  }
}
</style>

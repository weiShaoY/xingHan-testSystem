<!------  2026-05-21---14:21---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import cover1 from '@imgs/cover/img1.webp'

type CourseItem = {
  id: number
  title: string
  status: string
  time: string
  action: string
  cover: string
}

const courseList: CourseItem[] = [
  {
    id: 1,
    title: '学过的课程1',
    status: '已通过',
    time: '2026-04-14 09:10',
    action: '报名',
    cover: cover1,
  },
  {
    id: 2,
    title: '未命名课程2',
    status: '已通过',
    time: '2026-04-14 09:10',
    action: '报名',
    cover: cover1,
  },
]

const router = useRouter()

/**
 * 跳转到详情页
 */
function goToDetail(item: CourseItem) {
  router.push({
    name: 'ClientHistoryDetail',
    params: {
      id: item.id,
    },
  })
}
</script>

<template>
  <div
    class="flex flex-col"
  >
    <ClientPageHeader />

    <section
      class="flex flex-col gap-4"
    >

      <div
        v-for="item in courseList"
        :key="item.id"
        class="art-card flex items-center justify-between gap-4"
        @click="goToDetail(item)"
      >
        <img
          :src="item.cover"
          :alt="item.title"
          class="h-24 w-38 shrink-0 rounded object-cover max-sm:h-18 max-sm:w-28"
        >

        <div
          class="min-w-0 flex-1"
        >
          <h3
            class="m-0 truncate text-base text-g-900 font-semibold leading-6"
          >
            {{ item.title }}
          </h3>

          <div
            class="mt-2 flex flex-wrap gap-2 items-center"
          >
            <el-tag
              type="success"
              effect="plain"
              size="small"
            >
              {{ item.status }}
            </el-tag>
          </div>

          <p
            class="mt-3 mb-0 text-sm text-g-600 leading-5 max-sm:mt-2"
          >
            {{ item.time }} {{ item.action }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

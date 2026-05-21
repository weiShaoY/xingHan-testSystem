<!------  2026-05-21---14:21---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import cover1 from '@imgs/cover/img1.webp'

type TabKey = 'course' | 'project'

type CourseItem = {
  id: number
  title: string
  status: string
  time: string
  action: string
  cover: string
}

const activeTab = ref<TabKey>('course')

const courseList: CourseItem[] = [
  {
    id: 1,
    title: '未命名课程',
    status: '已通过',
    time: '2026-04-14 09:10',
    action: '报名',
    cover: cover1,
  },
  {
    id: 2,
    title: '未命名课程',
    status: '已通过',
    time: '2026-04-14 09:10',
    action: '报名',
    cover: cover1,
  },
]
</script>

<template>
  <div
    class="flex flex-col"
  >
    <ClientPageHeader />

    <section
      class="flex flex-col gap-4"
    >
      <el-tabs
        v-model="activeTab"
      >
        <el-tab-pane
          label="课程"
          name="course"
        >
          <div
            class="flex flex-col gap-4"
          >
            <div
              v-for="item in courseList"
              :key="item.id"
              class="art-card flex items-center justify-between gap-4"
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
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="学习项目"
          name="project"
          class="art-card"
        >
          <div
            class="min-h-100 flex items-center justify-center"
          >
            <el-empty
              description="暂无报名的学习项目"
              :image-size="160"
            >
              <p
                class="m-0 text-g-600"
              >
                你可以到首页去发现更多课程
              </p>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

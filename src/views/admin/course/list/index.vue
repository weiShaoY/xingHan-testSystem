<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import AllocateCourseDialog from './AllocateCourseDialog.vue'

const router = useRouter()

const workTabStore = useWorkTabStore()

const loading = ref(false)

/**
 * 是否显示分配学习任务弹窗
 */
const isShowAllocateCourseDialog = ref(false)

/**
 *  请求参数
 */
const params = reactive<AdminApi.Course.CourseListParams>({
  name: '',
  pageSize: 10,
  currentPage: 1,
})

/**
 * 课程列表
 */
const courseList = ref<AdminApi.Course.CourseListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 获取课程列表
 */
async function getCourseList() {
  loading.value = true

  try {
    courseList.value = await fetchAdminCourseList(params)
  }
  catch {
    loading.value = false
  }
  finally {
    loading.value = false
  }
}

getCourseList()

/**
 * 跳转到创建页
 */
function goToCreate() {
  router.push({
    name: 'AdminCourseCreate',
  })
}

/**
 * 跳转到编辑页
 */
async function goToEdit(item: AdminApi.Course.CourseListItem) {
  const editRoute = router.resolve({
    name: 'AdminCourseEdit',
    params: {
      couId: item.couId,
    },
  })

  await router.push(editRoute)

  workTabStore.updateTabTitle(editRoute.path, `编辑课程-${item.couName}`)
}

/**
 * 跳转到详情页
 */
async function goToDetail(item: AdminApi.Course.CourseListItem) {
  const detailRoute = router.resolve({
    name: 'AdminCourseDetail',
    params: {
      couId: item.couId,
    },
  })

  await router.push(detailRoute)

  workTabStore.updateTabTitle(detailRoute.path, `课程详情-${item.couName}`)
}

/**
 * 每页条数变化
 */
function handleSizeChange(pageSize: number) {
  params.pageSize = pageSize
  params.currentPage = 1
  getCourseList()
}

/**
 * 当前页变化
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  getCourseList()
}

/**
 * 删除课程
 */
async function deleteCourse(item: AdminApi.Course.CourseListItem) {
  try {
    await fetchAdminDeleteCourse(String(item.couId))
    getCourseList()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
}

/**
 * 搜索课程
 */
function handleSearch() {
  params.currentPage = 1
  params.name = params.name.trim()
  getCourseList()
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <!-- 分配学习任务弹窗 -->
    <AllocateCourseDialog
      v-if="isShowAllocateCourseDialog"
      v-model="isShowAllocateCourseDialog"
    />

    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-sm:items-start"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          课程列表
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ courseList.totals }} 门课程
        </p>
      </div>

      <div
        class="flex flex-1 items-center justify-end gap-3 max-md:w-full max-md:justify-start max-sm:flex-col"
      >
        <el-input
          v-model="params.name"
          class="max-w-110 max-md:max-w-none max-sm:w-full"
          placeholder="请输入文件名称"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template
            #append
          >
            <ArtSvgIcon
              icon="tdesign:search"
            />
          </template>
        </el-input>

        <ArtIconButton
          type="add"
          @click="goToCreate"
        >
          创建课程
        </ArtIconButton>
      </div>
    </div>

    <div
      v-loading="loading"
      class="flex flex-col gap-4"
    >
      <div
        v-for="item in courseList.rows"
        :key="item.couId"
        class="grid grid-cols-[150px_8px_minmax(0,1fr)] gap-5 items-center max-md:grid-cols-1 max-md:gap-3"
        @click="goToDetail(item)"
      >
        <div
          class="flex flex-col items-end text-sm text-g-600 max-md:flex-row max-md:items-center max-md:justify-between max-md:rounded-custom-sm max-md:bg-box max-md:border-full-d max-md:px-4 max-md:py-3"
        >
          <div
            class="max-md:flex max-md:items-center max-md:gap-1"
          >
            <span
              class="font-medium text-primary"
            >
              {{ getDateSegment(item.createTime, 'year') }} 年
            </span>

            <span
              class="font-medium text-primary"
            >
              {{ getDateSegment(item.createTime, 'month') }} 月 {{ getDateSegment(item.createTime, 'day') }} 日
            </span>
          </div>

          <div
            class="mt-1 max-md:mt-0"
          >
            创建时间 {{ getDateSegment(item.createTime, 'hour') }}:{{ getDateSegment(item.createTime, 'minute') }}
          </div>
        </div>

        <div
          class="h-10 w-2 rounded-full bg-primary max-md:hidden"
        >
          <!-- 分隔符 -->
        </div>

        <div
          class="art-card flex flex-1 flex-col cursor-pointer justify-center relative transition hover:border-primary/30 max-sm:p-4"
          @click="goToDetail(item)"
        >
          <div
            class="flex items-start justify-between gap-4 max-sm:flex-col"
          >
            <div
              class="min-w-0"
            >
              <h3
                class="truncate text-base font-semibold text-g-900"
              >
                {{ item.couName }}
              </h3>

              <p
                class="mt-2 line-clamp-2 max-w-3xl text-sm text-g-600"
              >
                {{ item.couIntro }}
              </p>
            </div>

            <div
              class="flex shrink-0 gap-2 items-center justify-center max-sm:w-full max-sm:justify-end"
              @click.stop
            >
              <ArtIconButton
                type="edit"
                @click="goToEdit(item)"
              />

              <ArtIconButton
                type="delete"
                @click="deleteCourse(item)"
              />

              <ArtIconButton
                type="allocate"
                @click="isShowAllocateCourseDialog = true"
              />
            </div>
          </div>

          <el-divider />

          <div
            class="grid grid-cols-[1.2fr_1fr_1.4fr] gap-5 items-start max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <!-- 参与信息 -->
            <section>
              <p
                class="font-medium mb-2 text-g-900"
              >
                参与信息
              </p>

              <div
                class="text-sm text-g-600 flex flex-wrap gap-x-4 gap-y-2 items-center"
              >
                <span>
                  总课时: {{ }} 节
                </span>

                <span>
                  已完成: {{ }} 节
                </span>

                <span>
                  进度: {{ }} %
                </span>
              </div>
            </section>

            <!-- 课程标签 -->
            <!-- <section>
              <p
                class="font-medium mb-2 text-g-900"
              >
                课程标签
              </p>

              <div
                class="flex flex-wrap gap-2"
              >
                <el-tag
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </section> -->

            <!-- 更新时间 -->
            <section
              class="max-lg:col-span-2 max-sm:col-span-1"
            >
              <p
                class="font-medium mb-2 text-g-900"
              >
                更新时间
              </p>

              <p
                class="text-sm text-g-600"
              >
                {{ formatDateTime(item.updateTime) }}
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div
      v-if="courseList.totals > 0"
      class="mt-6 flex justify-center overflow-x-auto pb-4"
    >
      <ElPagination
        v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize"
        background
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="7"
        layout="total, prev, pager, next, sizes, jumper"
        :total="courseList.totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

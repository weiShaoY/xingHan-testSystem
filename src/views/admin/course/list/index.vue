<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import AllocateCourseDialog from './AllocateCourseDialog.vue'

/**
 * 分页条数选项。
 */
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

/**
 * Vue Router 实例，用于课程相关页面跳转。
 */
const router = useRouter()

/**
 * 工作标签页 Store，用于更新动态页面标签标题。
 */
const workTabStore = useWorkTabStore()

/**
 * 列表加载状态。
 */
const loading = ref(false)

/**
 * 分配学习任务弹窗显示状态。
 */
const isShowAllocateCourseDialog = ref(false)

/**
 * 列表查询参数。
 */
const params = reactive<AdminApi.Course.CourseListParams>({
  name: '',
  pageSize: PAGE_SIZE_OPTIONS[0],
  currentPage: 1,
})

/**
 * 列表响应数据。
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
    ElNotification.error('课程列表获取失败')
  }
  finally {
    loading.value = false
  }
}

/**
 * 重置到第一页并刷新课程列表。
 */
function refreshFirstPage() {
  params.currentPage = 1
  getCourseList()
}

/**
 * 按课程名称搜索课程。
 */
function handleSearch() {
  params.name = (params.name || '').trim()
  refreshFirstPage()
}

/**
 * 处理每页条数变化。
 *
 * @param pageSize 新的每页条数。
 */
function handleSizeChange(pageSize: number) {
  params.pageSize = pageSize
  refreshFirstPage()
}

/**
 * 处理当前页变化。
 *
 * @param currentPage 新的当前页码。
 */
function handleCurrentChange(currentPage: number) {
  params.currentPage = currentPage
  getCourseList()
}

/**
 * 打开分配学习任务弹窗。
 */
function openAllocateCourseDialog(item: AdminApi.Course.CourseListItem) {
  console.log('🚀 ~ file: index.vue:114 ~ item:', item)
  isShowAllocateCourseDialog.value = true
}

/**
 * 跳转到课程相关页面，并按课程名称更新工作标签标题。
 *
 * @param routeName 目标课程路由名称。
 * @param item 课程列表项。
 * @param titlePrefix 标签标题前缀。
 * @param isBlank 是否新标签页打开
 */
async function goToCoursePage(
  routeName: 'AdminCourseCreate' | 'AdminCourseSetting' | 'AdminCoursePreview' | 'AdminCourseOutline',
  titlePrefix: string,
  item?: AdminApi.Course.CourseListItem,
  isBlank?: boolean,
) {
  if (routeName !== 'AdminCourseCreate' && !item?.couId) {
    ElNotification.warning('课程信息缺失，无法跳转')
    return
  }

  /**
   * 解析后的目标路由。
   */
  const targetRoute = router.resolve({
    name: routeName,
    params: {
      couId: item?.couId,
    },
  })

  if (isBlank) {
    const openedWindow = window.open(targetRoute.href, '_blank')

    if (!openedWindow) {
      ElNotification.warning('浏览器阻止了新标签页打开')
      return
    }

    openedWindow.opener = null
    return
  }

  /**
   * 跳转到目标路由。
   */
  await router.push(targetRoute)

  const tabTitle = item?.couName ? `${titlePrefix}-${item.couName}` : titlePrefix

  /**
   * 更新工作标签标题。
   */
  workTabStore.updateTabTitle(targetRoute.path, tabTitle)
}

/**
 * 跳转到课程创建页。
 */
function goToCreate() {
  void goToCoursePage('AdminCourseCreate', '创建课程')
}

/**
 * 跳转到课程设置页。
 *
 * @param item 需要设置的课程。
 */
function goToSetting(item: AdminApi.Course.CourseListItem) {
  void goToCoursePage('AdminCourseSetting', '课程设置', item)
}

/**
 * 跳转到课程预览页
 */
function goToPreview(item: AdminApi.Course.CourseListItem) {
  void goToCoursePage('AdminCoursePreview', '课程预览', item, true)
}

/**
 * 跳转到课程大纲页。
 *
 * @param item 需要查看大纲的课程。
 */
function goToOutline(item: AdminApi.Course.CourseListItem) {
  void goToCoursePage('AdminCourseOutline', '课程大纲', item)
}

/**
 * 删除课程并刷新列表。
 * @param item 需要删除的课程。
 */
async function deleteCourse(item: AdminApi.Course.CourseListItem) {
  console.log('🚀 ~ file: index.vue:200 ~ item:', item.couId)
  try {
    await fetchAdminCourseDelete(item.couId)
    await getCourseList()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
}

getCourseList()
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
          placeholder="请输入课程名称"
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

        <ArtButton
          type="add"
          @click="goToCreate"
        >
          创建课程
        </ArtButton>
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
        @click="goToOutline(item)"
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
              <ArtButton
                type="preview"
                @click="goToPreview(item)"
              />

              <ArtButton
                type="edit"
                @click="goToSetting(item)"
              />

              <ArtButton
                type="delete"
                @click="deleteCourse(item)"
              />

              <ArtButton
                type="allocate"
                @click="openAllocateCourseDialog(item)"
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
        :page-sizes="PAGE_SIZE_OPTIONS"
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

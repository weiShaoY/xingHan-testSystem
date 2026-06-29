<script lang="ts" setup>
import { ref } from 'vue'

import AllocateProjectDialog from './AllocateProjectDialog.vue'

import CreateProjectDialog from './CreateProjectDialog.vue'

const inputVModel = ref('')

/**
 * 是否显示创建学习项目弹窗
 */
const isShowCreateProjectDialog = ref(false)

/**
 * 是否显示分配弹窗
 */
const isShowAllocateDialog = ref(false)

/**
 * 分页条数选项。
 */
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

/**
 * 列表查询参数。
 */
const params = reactive<AdminApi.Course.CourseListParams>({
  name: '',
  pageSize: PAGE_SIZE_OPTIONS[0],
  currentPage: 1,
})

/**
 * 重置到第一页并刷新课程列表。
 */
function refreshFirstPage() {
  params.currentPage = 1
  getCourseList()
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
 * 打开分配弹窗
 */
function openAllocateProjectDialog(item: AdminApi.Project.ProjectListItem) {
  console.log('🚀 ~ file: index.vue:83 ~ item:', item)
  isShowAllocateDialog.value = true
}

const router = useRouter()

/**
 * 列表加载状态。
 */
const loading = ref(false)

/**
 * 列表响应数据。
 */
const projectList = ref<AdminApi.Project.ProjectListResponse>({
  rows: [],
  totals: 0,
})

/**
 * 获取项目列表
 */
async function getProjectList() {
  loading.value = true

  try {
    projectList.value = await fetchAdminProjectList(params)
  }
  catch {
    ElNotification.error('项目列表获取失败')
  }
  finally {
    loading.value = false
  }
}

getProjectList()

/**
 * 工作标签页 Store，用于更新动态页面标签标题。
 */
const workTabStore = useWorkTabStore()

/**
 * 跳转到项目相关页面，并按项目名称更新工作标签标题。
 *
 * @param item 项目列表项。
 * @param routeName 目标项目路由名称。
 * @param titlePrefix 标签标题前缀。
 * @returns 页面跳转和标签标题更新完成。
 */
async function goToProjectPage(
  routeName: 'AdminProjectCreate' | 'AdminProjectSetting' | 'AdminProjectPreview' | 'AdminProjectStages',
  titlePrefix: string,
  item?: AdminApi.Project.ProjectListItem,
) {
  /**
   * 解析后的目标路由。
   */
  const targetRoute = router.resolve({
    name: routeName,
    params: {
      projId: item?.projId,
    },
  })

  /**
   * 跳转到目标路由。
   */
  await router.push(targetRoute)

  /**
   * 更新工作标签标题。
   */
  workTabStore.updateTabTitle(targetRoute.path, `${titlePrefix}-${item?.projName || ''}`)
}

/**
 * 跳转到项目创建页。
 */
function goToCreate() {
  void goToProjectPage('AdminProjectCreate', '创建项目')
}

/**
   *  跳转到项目预览页
   */
function goToPreview(item: AdminApi.Project.ProjectListItem) {
  void goToProjectPage('AdminProjectPreview', '项目预览', item)
}

/**
 * 跳转到项目设置页
 */
function goToSetting(item: AdminApi.Project.ProjectListItem) {
  void goToProjectPage('AdminProjectSetting', '项目设置', item)
}

/**
 * 跳转到项目阶段列表页。
 *
 * @param item 需要查看阶段的项目。
 */
function goToDetail(item: AdminApi.Project.ProjectListItem) {
  void goToProjectPage('AdminProjectStages', '项目阶段', item)
}

/**
 * 删除项目并刷新列表。
 *
 * @param item 需要删除的项目。
 */
async function deleteProject(item: AdminApi.Project.ProjectListItem) {
  try {
    await fetchAdminProjectDelete(item.projId)
    await getProjectList()
    ElNotification.success('删除成功')
  }
  catch {
    ElNotification.error('删除失败')
  }
}

</script>

<template>
  <div
    class="relative mx-auto max-w-7xl px-10 max-lg:px-6 max-sm:px-4"
  >
    <AllocateProjectDialog
      v-if="isShowAllocateDialog"
      v-model="isShowAllocateDialog"
    />

    <CreateProjectDialog
      v-if="isShowCreateProjectDialog"
      v-model="isShowCreateProjectDialog"
    />

    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
    >
      <div
        class="flex-1"
      >
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          学习项目
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ projectList.totals }} 个项目
        </p>
      </div>

      <div
        class="flex flex-1 items-center justify-end gap-3 max-md:w-full max-md:justify-start max-sm:flex-col"
      >
        <el-input
          v-model="inputVModel"
          class="max-w-110 max-md:max-w-none max-sm:w-full"
          placeholder="请输入项目名称"
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
          创建项目
        </ArtButton>
      </div>
    </div>

    <div
      v-loading="loading"
      class="flex flex-col gap-4"
    >

      <div
        v-for="item in projectList.rows"
        :key="item.projId"
        class="grid grid-cols-[150px_8px_minmax(0,1fr)] gap-5 items-center max-md:grid-cols-1 max-md:gap-3"
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
                {{ item.projName }}
              </h3>

              <p
                class="mt-2 line-clamp-2 text-sm text-g-600"
              >
                {{ item.projIntro }}
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
                @click="deleteProject(item)"
              />

              <ArtButton
                type="allocate"
                @click="openAllocateProjectDialog(item)"
              />
            </div>
          </div>

          <el-divider />

          <div
            class="grid grid-cols-[1fr_1fr_1.5fr] gap-4 items-center max-sm:grid-cols-1"
          >
            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3 text-primary"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.projStage }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                学习阶段
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3 text-primary"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.projStageCourse }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                课程
              </p>
            </div>

            <!-- <el-link
              :href="item.link"
              type="primary"
              class="justify-self-end max-sm:justify-self-start"
              @click.stop
            >
              {{ getCourseText(item) }} >
            </el-link> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div
      v-if="projectList.totals > 0"
      class="mt-6 flex justify-center overflow-x-auto pb-4"
    >
      <ElPagination
        v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize"
        background
        :page-sizes="PAGE_SIZE_OPTIONS"
        :pager-count="7"
        layout="total, prev, pager, next, sizes, jumper"
        :total="projectList.totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

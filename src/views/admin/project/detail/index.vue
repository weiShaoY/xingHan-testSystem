<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

const route = useRoute()

const router = useRouter()

/**
 * 当前项目ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

const projectStageList = ref<AdminApi.Project.ProjectStageListItem[]>([])

/**
   *  获取后台管理项目学习阶段列表
   */
async function getProjectStageList() {
  projectStageList.value = await fetchAdminProjectStageList(projId.value)
}

getProjectStageList()

/**
   * 跳转到编辑页
   */
function goToEdit() {
  router.push({
    name: 'AdminProjectEdit',
    params: {
      id: route.params.id,
    },
  })
}
</script>

<template>
  <div
    class="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-4 px-10 max-lg:px-6 max-sm:px-4"
  >
    <AdminPageHeader
      title="学习项目1 详情页"
    >
      <template
        #extra
      >
        <ArtButton
          type="edit"
          @click="goToEdit()"
        >
          编辑内容
        </ArtButton>
      </template>
    </AdminPageHeader>

    <div
      class="flex flex-col gap-4"
    >
      <div
        v-for="(item) in projectStageList"
        :key="item.stageId"
        class="art-card"
      >
        <div
          class=""
        >
          <div
            class="flex flex-wrap gap-3 items-center"
          >
            <div
              class="text-base font-semibold text-g-900"
            >
              <!-- 阶段 {{ index + 1 }}：{{ item.stageName }} -->
              {{ item.stageName }}
            </div>

            <!-- <el-tag
              :type="item.stageType === 1 ? 'danger' : 'info'"
              size="small"
            >
              {{ item.stageType === 1 ? '必修阶段' : '选修阶段' }}
            </el-tag> -->
          </div>

          <p
            class="mt-3 text-sm leading-relaxed text-g-600"
          >
            {{ item.stageIntro }}
          </p>

          <div
            class="mt-4 flex flex-col gap-3 text-sm text-g-700 "
          >

            <div
              v-for="(course) in item.course"
              :key="course.couID"
              class="flex items-center justify-between"
            >

              <div
                class="flex items-center gap-2"
              >
                <div
                  class=""
                >
                  <el-tag
                    :type="course.isRequired === 1 ? 'danger' : 'info'"
                    size="small"
                  >
                    {{ course.isRequired === 1 ? '必修课程' : '选修课程' }}
                  </el-tag>

                </div>

                <div
                  class=""
                >
                  {{ course.couName }}
                </div>

              </div>

              <div
                class="flex shrink-0 gap-2 items-center max-sm:w-full max-sm:justify-end"
              >
                <ArtButton
                  type="edit"
                />

                <ArtButton
                  type="view"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

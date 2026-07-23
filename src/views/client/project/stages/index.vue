<script lang="ts" setup>
const loading = ref(false)

const route = useRoute()

/**
 * 当前项目 ID
 */
const projId = computed(() => {
  return Number(route.params.projId || 0)
})

/**
 * 项目阶段列表
 */
const projectStageList = ref<ClientApi.Project.ProjectStagesListResponse>({
  projId: projId.value,
  projName: '',
  projIntro: '',
  projStage: 0,
  projStageCourseCount: 0,
  learningProgress: '',
  projectDirectory: [],
})

async function getClientProjectStagesList() {
  loading.value = true
  try {
    projectStageList.value = await fetchClientProjectStagesList(projId.value)
  }
  catch {
    loading.value = false
  }
  finally {
    loading.value = false
  }
}

getClientProjectStagesList()

function onRefresh() {
  getClientProjectStagesList()
}

const activeName = ref<number[]>([])

</script>

<template>
  <van-pull-refresh
    v-model="loading"
    class="h-full"
    @refresh="onRefresh"
  >
    <div
      class="flex flex-col gap-4"
    >
      <div>
        <div>
          {{ projectStageList.projName }}
        </div>

        <div>
          {{ projectStageList.projIntro }}
        </div>

        <div>
          {{ projectStageList.projStage }} 个阶段
        </div>

        <div>
          {{ projectStageList.projStageCourseCount }} 门课程
        </div>

      </div>

      <div
        class=""
      >
        学习进度
        <van-progress
          :percentage="50"
          :show-pivot="false"
        />
      </div>

      <van-collapse
        v-model="activeName"
      >
        <van-collapse-item
          v-for="item in projectStageList.projectDirectory"
          :key="item.stageId"
          :title="item.stageName"
          :name="item.stageId"
          class="mb-5"
        >
          <template
            #title
          >
            <div
              class="flex"
            >
              <div>
                {{ item.stageName }}
              </div>
            </div>
          </template>

          <template
            v-if="item.stageCourse.length > 0"
          >
            <div
              v-for="course in item.stageCourse"
              :key="course.couId"
              class="mb-3 flex cursor-pointer items-center justify-between rounded-md bg-#f5f5f5 p-3"
            >
              <div
                class="text-sm text-gray-500"
              >
                {{ course.couTitle }}
              </div>

              <div>
                <div
                  class="text-xs text-gray-500"
                >
                  {{ course.couIntro }}%
                </div>
              </div>

              <div
                class="flex items-center justify-between"
              >
                <div>
                  {{ 0 }}%
                </div>

                <van-progress
                  :percentage="50"
                  :show-pivot="false"
                />
              </div>
            </div>
          </template>

          <template
            v-else
          >
            <div
              class="text-center text-sm text-gray-500"
            >
              暂无课程
            </div>
          </template>

        </van-collapse-item>
      </van-collapse>
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped></style>

<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

const router = useRouter()

/**
 * 题库类型定义
 */
type QuestionBank = {
  id: number

  name: string

  /** 单选题数量 */
  singleChoiceCount: number

  /** 多选题数量 */
  multipleChoiceCount: number

  /** 开放式题数量 */
  openEndedCount: number

  /** 图标 */
  icon: string

  time: {
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }
}

/**
 * 题库列表
 */
const sourceList = ref<QuestionBank[]>([
  {
    id: 1,
    name: '前端基础通用题库',
    singleChoiceCount: 100,
    multipleChoiceCount: 50,
    openEndedCount: 20,
    icon: 'question',
    time: {
      year: 2026,
      month: 4,
      day: 15,
      hour: 16,
      minute: 8,
    },
  },
  {
    id: 2,
    name: '前端基础通用题库2',
    singleChoiceCount: 100,
    multipleChoiceCount: 50,
    openEndedCount: 20,
    icon: 'question',
    time: {
      year: 2026,
      month: 4,
      day: 15,
      hour: 16,
      minute: 8,
    },
  },
  {
    id: 3,
    name: '前端基础通用题库3',
    singleChoiceCount: 100,
    multipleChoiceCount: 50,
    openEndedCount: 20,
    icon: 'question',
    time: {
      year: 2026,
      month: 4,
      day: 15,
      hour: 16,
      minute: 8,
    },
  },
])

/**
 * 获取题库题目总数
 */
function getQuestionTotal(item: QuestionBank) {
  return item.singleChoiceCount + item.multipleChoiceCount + item.openEndedCount
}

/**
 * 获取题库创建时间文本
 */
function getCreateTimeText(item: QuestionBank) {
  const minute = item.time.minute < 10 ? `0${item.time.minute}` : item.time.minute

  return `${item.time.hour}:${minute}`
}

/**
 * 跳转到创建题库
 */
function goToCreateQuestion() {
  router.push({
    name: 'AdminQuestionCreate',
  })
}

/**
 * 跳转到编辑页
 */
function goToEdit(item: QuestionBank) {
  router.push({
    name: 'AdminQuestionEdit',
    params: {
      id: item.id,
    },
  })
}

/**
 * 跳转到详情页
 */
function goToDetail(item: QuestionBank) {
  router.push({
    name: 'AdminQuestionDetail',
    params: {
      id: item.id,
    },
  })
}

/**
 * 删除题库
 */
function deleteQuestionBank(item: QuestionBank) {
  sourceList.value = sourceList.value.filter(i => i.id !== item.id)
}

</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-sm:items-start"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          题库列表
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ sourceList.length }} 个题库
        </p>
      </div>

      <ArtIconButton
        type="add"
        @click="goToCreateQuestion"
      >
        创建题库
      </ArtIconButton>
    </div>

    <div
      class="flex flex-col gap-4"
    >
      <div
        v-for="item in sourceList"
        :key="item.id"
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
              {{ item.time.year }} 年
            </span>

            <span
              class="font-medium text-primary"
            >
              {{ item.time.month }} 月 {{ item.time.day }} 日
            </span>
          </div>

          <div
            class="mt-1 max-md:mt-0"
          >
            创建时间 {{ getCreateTimeText(item) }}
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
                {{ item.name }}
              </h3>

              <p
                class="mt-2 text-sm text-g-600"
              >
                共 {{ getQuestionTotal(item) }} 道题
              </p>
            </div>

            <div
              class="flex flex-shrink-0 gap-2 items-center justify-center max-sm:w-full max-sm:justify-end"
              @click.stop
            >
              <ArtIconButton
                type="delete"
                @click="deleteQuestionBank(item)"
              />

              <ArtIconButton
                type="export"
              />

              <ArtIconButton
                type="edit"
                @click="goToEdit(item)"
              />

              <ArtIconButton
                :loading="true"
              />
            </div>
          </div>

          <el-divider />

          <div
            class="grid grid-cols-3 gap-4 text-primary max-sm:grid-cols-1"
          >
            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.singleChoiceCount }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                单选题
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.multipleChoiceCount }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                多选题
              </p>
            </div>

            <div
              class="rounded-custom-sm bg-primary/10 px-4 py-3"
            >
              <p
                class="text-lg font-semibold"
              >
                {{ item.openEndedCount }}
              </p>

              <p
                class="mt-1 text-sm text-g-600"
              >
                开放式题
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

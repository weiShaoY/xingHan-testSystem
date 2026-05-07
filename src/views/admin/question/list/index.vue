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

  // 单选题数量
  singleChoiceCount: number

  // 多选题数量
  multipleChoiceCount: number

  // 开放式题数量
  openEndedCount: number

  // 图标
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

])

/**
   * 跳转到创建题库
   */
function goToCreateQuestionBank() {
  router.push({
    name: 'AdminQuestionCreate',
    params: {
      id: 'create',
    },
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
    class="mx-auto px-10 max-w-7xl relative max-sm:px-5"
  >
    <div
      class="my-5 flex w-full items-center justify-end"
    >
      <el-button
        class="ml-20"
        type="primary"
        @click="goToCreateQuestionBank"
      >
        新增题库
      </el-button>
    </div>

    <div
      v-for="item in sourceList"
      :key="item.id"
      class="flex-c gap-5"
    >
      <div
        class="flex flex-col items-end"
      >
        <div
          class="color-primary"
        >
          {{ item.time.year }} 年
        </div>

        <div
          class="color-primary"
        >
          {{ item.time.month }} 月 {{ item.time.day }} 日
        </div>

        <div
          class=""
        >
          创建时间   {{ item.time.hour }}:{{ item.time.minute < 10 ? `0${item.time.minute}` : item.time.minute }}
        </div>
      </div>

      <div
        class="bg-primary h-10 w-2"
      >
        <!-- 分隔符 -->
      </div>

      <div
        class="art-card mb-5 px-5 flex flex-1 flex-col h-35 cursor-cell justify-center relative max-sm:mb-4"
        @click="goToDetail(item)"
      >
        <div
          class="flex items-center justify-between"
        >
          <div
            class=""
          >
            {{ item.name }}
          </div>

          <div
            class="flex gap-2 items-center justify-center"
          >
            <ArtIconButton
              type="delete"
              class="ml-3 max-sm:ml-[7px]"
              @click="deleteQuestionBank(item)"
            />

            <ArtIconButton
              type="export"
              class="ml-3 max-sm:ml-[7px]"
            />

            <ArtIconButton
              type="edit"
              class="ml-3 max-sm:ml-[7px]"
              @click="goToEdit(item)"
            />

            <ArtIconButton
              :loading="true"
              class="ml-3 max-sm:ml-[7px]"
            />
          </div>
        </div>

        <el-divider />

        <div
          class="color-primary flex gap-3"
        >
          <div>
            {{ item.singleChoiceCount }} 单选题
          </div>

          <div>
            {{ item.multipleChoiceCount }} 多选题
          </div>

          <div>
            {{ item.openEndedCount }} 开放式题
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

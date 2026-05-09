<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

type QuestionOption = {

  /** 选项内容 */
  content: string

  /** 是否为正确答案 */
  isCorrect: boolean
}

/**
   * 阶段类型定义
   */
type Stage = {

  /** 阶段ID */
  id: string

  /** 阶段名称 */
  name: string

  /** 题目类型 */
  type: '单选题' | '多选题' | '开放式题'

  /** 分值 */
  score: number

  /** 难度 */
  difficulty: '简单' | '中等' | '困难'

  /** 标准答案 */
  standardAnswer?: string[]

  /** 单选或多选选项和答案 */
  answerOptions?: QuestionOption[]
}

/**
 * 获取题目类型标签颜色
 */
function getQuestionTypeTagType(type: Stage['type']) {
  const tagTypeMap: Record<Stage['type'], 'primary' | 'success' | 'warning'> = {
    单选题: 'primary',
    多选题: 'success',
    开放式题: 'warning',
  }

  return tagTypeMap[type]
}

/**
 * 获取题目分值标签颜色
 */
function getScoreTagType(score: number) {
  if (score >= 20) {
    return 'danger'
  }

  if (score >= 10) {
    return 'success'
  }

  return 'info'
}

/**
 * 获取题目难度标签颜色
 */
function getDifficultyTagType(difficulty: Stage['difficulty']) {
  const tagTypeMap: Record<Stage['difficulty'], 'success' | 'warning' | 'danger'> = {
    简单: 'success',
    中等: 'warning',
    困难: 'danger',
  }

  return tagTypeMap[difficulty]
}

/**
   * 阶段列表数据
   */
const stages = ref<Stage[]>([
  {
    id: '1',
    name: '学习阶段一',
    type: '单选题',
    score: 10,
    difficulty: '简单',
    answerOptions: [
      {
        content: '选项A',
        isCorrect: true,
      },
      {
        content: '选项B',
        isCorrect: false,
      },
      {
        content: '选项C',
        isCorrect: false,
      },
    ],
  },
  {
    id: '2',
    name: '学习阶段二',
    type: '多选题',
    score: 10,
    difficulty: '中等',
    answerOptions: [
      {
        content: '选项A',
        isCorrect: true,
      },
      {
        content: '选项B',
        isCorrect: true,
      },
      {
        content: '选项C',
        isCorrect: false,
      },
    ],
  },
  {
    id: '3',
    name: '学习阶段三',
    type: '开放式题',
    score: 20,
    difficulty: '困难',
    standardAnswer: ['学习阶段三标准答案1', '学习阶段三标准答案2'],
  },
  {
    id: '4',
    name: '学习阶段四',

    type: '开放式题',
    score: 20,
    difficulty: '困难',
    standardAnswer: ['学习阶段四标准答案1', '学习阶段四标准答案2'],
  },
])

/**
 * 获取正确选项内容列表
 */
function getCorrectOptionContents(stage: Stage) {
  return stage.answerOptions
    ?.filter(option => option.isCorrect)
    .map(option => option.content) ?? []
}

/**
 * 获取单选题正确选项内容
 */
function getCorrectSingleOption(stage: Stage) {
  return getCorrectOptionContents(stage)[0] ?? ''
}

/**
   * 跳转到编辑页
   */
function goToEdit() {
  router.push({
    name: 'AdminQuestionEdit',
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
    <ArtPageHeader
      title="题库1 详情页"
      :stats="[
        `单选题数量: ${stages.filter(stage => stage.type === '单选题').length}`,
        `多选题数量: ${stages.filter(stage => stage.type === '多选题').length}`,
        `开放式题数量: ${stages.filter(stage => stage.type === '开放式题').length}`,
      ]"
    >
      <template
        #extra
      >
        <ArtIconButton
          type="edit"
          @click="goToEdit()"
        />

        <ArtIconButton
          type="export"
        />

        <ArtIconButton
          type="delete"
        />
      </template>
    </ArtPageHeader>

    <div
      class="flex flex-col gap-4"
    >
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="art-card"
      >
        <div
          class="flex gap-6 items-start max-sm:flex-col"
        >
          <div
            class="flex h-9 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary"
          >
            Q{{ index + 1 }}
          </div>

          <div
            class="flex min-w-0 flex-1 flex-col gap-4"
          >
            <div
              class="flex flex-wrap gap-3 items-center"
            >
              <div
                class="text-base font-semibold text-g-900"
              >
                {{ stage.name }}
              </div>

              <el-tag
                :type="getQuestionTypeTagType(stage.type)"
                size="small"
              >
                {{ stage.type }}
              </el-tag>

              <el-tag
                :type="getScoreTagType(stage.score)"
                size="small"
              >
                {{ stage.score }} 分
              </el-tag>

              <el-tag
                :type="getDifficultyTagType(stage.difficulty)"
                size="small"
              >
                {{ stage.difficulty }}
              </el-tag>
            </div>

            <!-- 选项 -->
            <div
              v-if="stage.type !== '开放式题'"
              class="rounded-lg bg-[var(--art-gray-100)] p-4"
            >
              <!-- 单选题 -->
              <el-radio-group
                v-if="stage.type === '单选题'"
                :model-value="getCorrectSingleOption(stage)"
                disabled
                class="flex flex-col gap-2"
              >
                <el-radio
                  v-for="option in stage.answerOptions"
                  :key="option.content"
                  :value="option.content"
                  size="large"
                >
                  {{ option.content }}
                </el-radio>

              </el-radio-group>
              <!-- 多选题 -->
              <el-checkbox-group
                v-if="stage.type === '多选题'"
                :model-value="getCorrectOptionContents(stage)"
                disabled
                class="flex flex-col gap-2"
              >
                <el-checkbox
                  v-for="option in stage.answerOptions"
                  :key="option.content"
                  :value="option.content"
                  size="large"
                >
                  {{ option.content }}
                </el-checkbox>

              </el-checkbox-group>
            </div>

            <div
              v-if="stage.standardAnswer"
              class="rounded-lg bg-[var(--art-gray-100)] p-4"
            >
              <div
                class="mb-2 text-sm font-medium text-g-900"
              >
                标准答案
              </div>

              <div
                class="flex flex-col gap-2 text-sm text-g-700"
              >
                <span
                  v-for="answer in stage.standardAnswer"
                  :key="answer"
                >
                  {{ answer }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

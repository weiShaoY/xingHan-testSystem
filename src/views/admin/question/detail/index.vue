<!------  2026-04-15---16:08---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ref } from 'vue'

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

function getCorrectOptionContents(stage: Stage) {
  return stage.answerOptions
    ?.filter(option => option.isCorrect)
    .map(option => option.content) ?? []
}

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
      id: router.currentRoute.value.params.id,
    },
  })
}
</script>

<template>
  <div
    class="mb-10 flex flex-col gap-4"
  >
    <el-page-header
      class="art-card z-10"
      @back="$router.back()"
    >
      <template
        #content
      >
        <div
          class="flex gap-5 items-center"
        >
          <span>题库1 详情页</span>

          <div
            class="text-sm color-info font-normal flex gap-2"
          >
            <span>单选题数量: {{ stages.filter(stage => stage.type === '单选题').length }}</span>

            <span>多选题数量: {{ stages.filter(stage => stage.type === '多选题').length }}</span>

            <span>开放式题数量: {{ stages.filter(stage => stage.type === '开放式题').length }}</span>

          </div>

        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex items-center"
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
        </div>
      </template>
    </el-page-header>

    <div
      class="art-card flex flex-col gap-5"
    >
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class=""
      >
        <div
          class="flex gap-10"
        >
          <div
            class="color-primary"
          >
            Q{{ index + 1 }}
          </div>

          <div
            class="flex flex-col gap-3"
          >
            <!-- 上面 -->

            <div
              class="flex gap-10 items-center"
            >

              <div
                class="flex gap-2 items-center"
              >
                <span
                  class=""
                >
                  ({{ stage.type }})  {{ stage.score }}分
                </span>

              </div>

            </div>

            <!-- 选项 -->
            <div
              class="s"
            >
              <!-- 单选题 -->
              <el-radio-group
                v-if="stage.type === '单选题'"
                :model-value="getCorrectSingleOption(stage)"
                disabled
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
              class=""
            >
              难度: {{ stage.difficulty }}
            </div>

            <!-- 下面 -->
            <div
              v-if="stage.standardAnswer"
              class=""
            >
              标准答案: {{ stage.standardAnswer.join('  /  ') }}
            </div>

          </div>

        </div>

        <el-divider
          v-if="index < stages.length - 1"
          class="my-4"
        />

      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped></style>

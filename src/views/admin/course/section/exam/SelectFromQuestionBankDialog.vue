<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { ElNotification } from 'element-plus'

const visible = defineModel({
  type: Boolean,
})

/**
 * 题目类型
 */
type QuestionType = 'single' | 'multiple'

/**
 * 难度
 */
type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * 题目
 */
type Question = {
  id: number
  title: string
  type: QuestionType
  difficulty: Difficulty
  score: number
  selected?: boolean
}

/**
 * 表单数据
 */
const formData = ref<{

  /**
     *  题库ID
     */
  questionBankId: number

  /**
     *  选择类型
     */
  selectionType: 'manual' | 'random'

  /**
     *  随机选择时，需要选择的题目数
     */
  randomCount: number

  /**
     *  题目列表
     */
  questions: Question[]
}>({
  questionBankId: 1,
  selectionType: 'manual', // manual: 手动选择, random: 随机选择
  randomCount: 2,

  questions: [],
})

/**
 * 题库数据
 */
const questionBanks = ref([
  {
    id: 2,
    name: '前端基础题库',
    questionBank: [
      {
        id: 1,
        title: 'HTML5 新增了哪些语义化标签？',
        type: 'multiple',
        difficulty: 'easy',
        score: 8,
      },
      {
        id: 2,
        title: 'CSS 中 box-sizing 属性的作用是什么？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
      {
        id: 3,
        title: 'JavaScript 中什么是闭包？',
        type: 'single',
        difficulty: 'hard',
        score: 10,
      },
      {
        id: 4,
        title: 'JavaScript 中如何实现异步编程？',
        type: 'multiple',
        difficulty: 'hard',
        score: 10,
      },
      {
        id: 5,
        title: 'JavaScript 中如何实现事件委托？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
    ],
  },
  {
    id: 3,
    name: 'Vue 专项题库',
    questionBank: [
      {
        id: 1,
        title: 'Vue 3 中 setup 函数的作用是什么？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
      {
        id: 2,
        title: 'Vue 3 中 computed 和 watch 的区别是什么？',
        type: 'multiple',
        difficulty: 'hard',
        score: 10,
      },
      {
        id: 3,
        title: 'Vue 3 中如何使用 teleport 组件？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
    ],
  },
  {
    id: 4,
    name: 'React 专项题库',
    questionBank: [
      {
        id: 1,
        title: 'React 中什么是虚拟 DOM？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
      {
        id: 2,
        title: 'React 中如何实现组件间通信？',
        type: 'multiple',
        difficulty: 'hard',
        score: 10,
      },
      {
        id: 3,
        title: 'React 中 useEffect hook 的依赖数组作用是什么？',
        type: 'single',
        difficulty: 'medium',
        score: 5,
      },
    ],
  },
])

// 初始化题目列表
const banks = questionBanks.value

const firstBank = banks[0]

if (firstBank) {
  formData.value.questions = firstBank.questionBank.map(q => ({
    ...q,
    type: q.type as QuestionType,
    difficulty: q.difficulty as Difficulty,
  }))
  formData.value.questionBankId = firstBank.id
}

function handleBankChange() {
  const banks = questionBanks.value

  const selectedBank = banks.find(bank => bank.id === formData.value.questionBankId)

  if (selectedBank) {
    formData.value.questions = selectedBank.questionBank.map(q => ({
      ...q,
      type: q.type as QuestionType,
      difficulty: q.difficulty as Difficulty,
    }))
    formData.value.randomCount = 0
  }
}

/**
 * 随机筛选题目
 */
/**
 * 随机筛选题目（覆盖原数据）
 */
function handleRandomSelection() {
  const count = formData.value.randomCount

  const list = formData.value.questions

  if (count <= 0) {
    ElNotification.error('请输入随机选择的题目数')

    return
  }

  if (count > list.length) {
    ElNotification.warning('数量不能超过题目总数')
    return
  }

  // 👉 复制一份数组（避免污染原数据）
  const shuffled = [...list]

  // 👉 Fisher-Yates 洗牌算法（真正随机）
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))

    ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
  }

  // 👉 取前 N 条
  formData.value.questions = shuffled.slice(0, count)
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  visible.value = false
}

/**
 * 完成选择
 */
function completeSelection() {
  console.log('选择的题目:', formData.value.questions.filter(q => q.selected))
  visible.value = false
}

</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="从题库选题"
    width="70%"
    :show-close="false"
  >
    <el-form
      :model="formData"
      class="mb-4"
    >
      <el-form-item
        prop="questionBankId"
        label="选择题库"
      >
        <el-select
          v-model="formData.questionBankId"
          placeholder="请选择题库"
          @change="handleBankChange"
        >
          <el-option
            v-for="item in questionBanks"
            :key="item.id"
            :label="`${item.name}`"
            :value="item.id"
          />
        </el-select>

      </el-form-item>

      <el-form-item
        prop="selectionType"
        label="选择方式"
      >
        <div
          class="flex items-center"
        >
          <el-radio-group
            v-model="formData.selectionType"
          >
            <el-radio
              value="manual"
            >
              手动选择
            </el-radio>

            <el-radio
              value="random"
            >
              随机选择
            </el-radio>
          </el-radio-group>

          <div
            v-if="formData.selectionType === 'random'"
            class="ml-10 flex items-center gap-5"
          >
            <el-input-number
              v-model="formData.randomCount"
              :min="0"
              :max="formData.questions.length"
            />

            <span
              class="ml-5"
            >
              / {{ formData.questions.length }}道
            </span>

            <el-button
              plain
              @click="handleRandomSelection"
            >
              随机筛选
            </el-button>

          </div>

        </div>

      </el-form-item>

    </el-form>

    <el-table
      :data="formData.questions"
      style="width: 100%"
      border
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        label="问题"
        min-width="300"
      >
        <template
          #default="scope"
        >
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        width="100"
      >
        <template
          #default="scope"
        >
          <span
            v-if="scope.row.type === 'single'"
          >单选题</span>

          <span
            v-else-if="scope.row.type === 'multiple'"
          >多选题</span>
        </template>
      </el-table-column>

      <el-table-column
        label="难度"
        width="100"
      >
        <template
          #default="scope"
        >
          <span
            v-if="scope.row.difficulty === 'easy'"
            class="text-green-500"
          >易</span>

          <span
            v-else-if="scope.row.difficulty === 'medium'"
            class="text-yellow-500"
          >中</span>

          <span
            v-else-if="scope.row.difficulty === 'hard'"
            class="text-red-500"
          >难</span>
        </template>
      </el-table-column>

      <el-table-column
        label="分值"
        width="80"
      >
        <template
          #default="scope"
        >
          {{ scope.row.score }}分
        </template>
      </el-table-column>
    </el-table>

    <template
      #footer
    >
      <el-button
        @click="closeDialog"
      >
        取消
      </el-button>

      <el-button
        type="primary"
        @click="completeSelection"
      >
        完成
      </el-button>
    </template>
  </el-dialog>

</template>

<style lang="scss" scoped>

</style>

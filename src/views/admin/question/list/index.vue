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
  updateTime: string
  totalQuestions: number
  usedCount: number
  singleChoiceCount: number
  multipleChoiceCount: number
  judgmentCount: number
  difficulty: string
  category: string
  status: '启用' | '停用'
  tags: string[]
  description: string
  year: string
  date: string
  lastUpdateTime: string
}

/**
   * 跳转到创建题库
   */
function goToCreateQuestionBank() {
  router.push({
    name: 'AdminQuestionEdit',
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
   * 题库列表
   */
const sourceList = ref<QuestionBank[]>([
  {
    id: 1,
    name: '前端基础通用题库',
    updateTime: '2026-04-13 15:36',
    totalQuestions: 186,
    usedCount: 42,
    singleChoiceCount: 96,
    multipleChoiceCount: 58,
    judgmentCount: 32,
    difficulty: '基础',
    category: '前端开发',
    status: '启用',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description:
        '覆盖前端开发入门阶段的核心知识点，适用于新员工测评、课后练习和基础能力摸底。',
    year: '2026 年',
    date: '4月13日',
    lastUpdateTime: '最后更新15:36',
  },
  {
    id: 2,
    name: 'Vue3 进阶专项题库',
    updateTime: '2026-04-10 10:24',
    totalQuestions: 128,
    usedCount: 35,
    singleChoiceCount: 62,
    multipleChoiceCount: 44,
    judgmentCount: 22,
    difficulty: '进阶',
    category: '框架专项',
    status: '启用',
    tags: ['Vue', '组合式API', 'TypeScript'],
    description: '聚焦Vue3组合式API、组件通信、状态管理和工程化实践，适合项目实战考核。',
    year: '2026 年',
    date: '4月10日',
    lastUpdateTime: '最后更新10:24',
  },
  {
    id: 3,
    name: '后端接口设计题库',
    updateTime: '2026-04-08 14:15',
    totalQuestions: 94,
    usedCount: 18,
    singleChoiceCount: 45,
    multipleChoiceCount: 31,
    judgmentCount: 18,
    difficulty: '中级',
    category: '后端开发',
    status: '启用',
    tags: ['Node.js', 'RESTful', '数据库'],
    description: '包含接口规范、鉴权流程、错误处理和数据库访问等后端服务设计常见考点。',
    year: '2026 年',
    date: '4月8日',
    lastUpdateTime: '最后更新14:15',
  },
  {
    id: 4,
    name: '项目管理与协作题库',
    updateTime: '2026-04-05 09:30',
    totalQuestions: 76,
    usedCount: 12,
    singleChoiceCount: 38,
    multipleChoiceCount: 28,
    judgmentCount: 10,
    difficulty: '基础',
    category: '通用能力',
    status: '启用',
    tags: ['需求分析', '敏捷协作', '交付规范'],
    description: '用于考察团队协作、需求拆解、风险识别和项目交付流程中的基础认知。',
    year: '2026 年',
    date: '4月5日',
    lastUpdateTime: '最后更新09:30',
  },
  {
    id: 5,
    name: '数据库设计与优化题库',
    updateTime: '2026-04-01 16:45',
    totalQuestions: 112,
    usedCount: 0,
    singleChoiceCount: 52,
    multipleChoiceCount: 40,
    judgmentCount: 20,
    difficulty: '高级',
    category: '数据库',
    status: '停用',
    tags: ['MySQL', '索引', 'SQL优化'],
    description: '围绕表结构设计、索引策略、SQL执行计划和慢查询优化整理的高阶题库。',
    year: '2026 年',
    date: '4月1日',
    lastUpdateTime: '最后更新16:45',
  },
])
</script>

<template>
  <div
    class="relative mx-auto max-w-7xl px-10 max-sm:px-5"
  >
    <div
      class="my-5 w-full flex items-center justify-end"
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
      class="mb-6 flex justify-between gap-5 rounded-3"
      @click="goToDetail(item)"
    >
      <div
        class="flex flex-col gap-4 color-primary"
      >
        <div
          class="flex justify-end"
        >
          {{ item.year }}
        </div>

        <div
          class="text-10 font-bold"
        >
          {{ item.date }}
        </div>

        <div
          class="flex justify-end"
        >
          {{ item.lastUpdateTime }}
        </div>
      </div>

      <div
        class="flex-1 bg-[#f5f5f5] p-6"
      >
        <!-- 头部 -->
        <div
          class="flex items-center justify-between"
        >
          <div
            class="flex items-center gap-3 text-xl font-bold"
          >
            <span>{{ item.name }}</span>

            <el-tag
              :type="item.status === '启用' ? 'success' : 'info'"
              size="small"
            >
              {{ item.status }}
            </el-tag>
          </div>

          <div
            class="flex items-center gap-2"
          >
            <el-button
              class="flex items-center justify-center"
              @click.stop="goToEdit(item)"
            >
              <SvgIcon
                icon="admin-edit"
              />
            </el-button>
          </div>
        </div>

        <el-divider />

        <!-- 内容 -->
        <div
          class="flex justify-between border rounded-3 p-6"
        >
          <!-- 左侧 -->
          <div>
            <p
              class="mb-2 font-medium"
            >
              题库统计
            </p>

            <div
              class="flex items-center gap-4"
            >
              <p>
                总题数: {{ item.totalQuestions }}道
              </p>

              <p>
                已使用: {{ item.usedCount }}道
              </p>

              <p>
                难度: {{ item.difficulty }}
              </p>
            </div>
          </div>
          <!-- 中间 -->
          <div>
            <p
              class="mb-2 font-medium"
            >
              题型构成
            </p>

            <div
              class="flex flex-wrap gap-3"
            >
              <el-tag
                size="small"
              >
                单选 {{ item.singleChoiceCount }}
              </el-tag>

              <el-tag
                size="small"
                type="success"
              >
                多选 {{ item.multipleChoiceCount }}
              </el-tag>

              <el-tag
                size="small"
                type="warning"
              >
                判断 {{ item.judgmentCount }}
              </el-tag>
            </div>
          </div>
          <!-- 右侧 -->
          <div>
            <p
              class="mb-2 font-medium"
            >
              题库标签
            </p>

            <div
              class="flex max-w-60 flex-wrap gap-2"
            >
              <el-tag
                v-for="(tag, index) in item.tags"
                :key="index"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div
            class="max-w-md"
          >
            <p
              class="mb-2 font-medium"
            >
              题库说明
            </p>

            <p
              class="line-clamp-2 text-gray-600"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

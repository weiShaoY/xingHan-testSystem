<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const visible = defineModel({
  type: Boolean,
})

const textarea = ref('')

const value1 = ref('')

const value2 = ref('')

/**
   *  是否显示选择部门弹窗
   */
const isShowSelectDepartmentDialog = ref(false)

function generateData() {
  const data = []

  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }

  return data
}

const selectedDepartmentIds = ref([])

const selectedDepartmentData = ref(generateData())
</script>

<template>
  <el-dialog
    v-if="isShowSelectDepartmentDialog"
    v-model="isShowSelectDepartmentDialog"
    title="选择部门"
    width="50%"
    :show-close="false"
  >
    <el-transfer
      v-model="selectedDepartmentIds"
      :data="selectedDepartmentData"
      :titles="['待选', '已选']"
      filterable
    >
      1
    </el-transfer>

    <template
      #footer
    >
      <el-button
        @click="isShowSelectDepartmentDialog = false"
      >
        取消
      </el-button>

      <el-button
        type="primary"
      >
        分配任务
      </el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="visible"
    title="分配学习任务 "
    width="70%"
    :show-close="false"
  >
    <div
      class="flex items-center gap-2"
    >
      <span>学习者</span>

      <span
        class="color-primary"
      > 张三 </span>
    </div>

    <div
      class="mt-3 flex items-center gap-2"
    >
      <el-input
        v-model="textarea"
        placeholder="请输入账户信息、分组名、部门名、班级名称或班级访问码，用逗号分隔"
      >
        <template
          #append
        >
          <el-button
            type="primary"
            @click="isShowSelectDepartmentDialog = true"
          >
            选择部门
          </el-button>
        </template>
      </el-input>
    </div>

    <div
      class="mt-3 flex items-center gap-2"
    >
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
    </div>

    <div
      class="mt-3 flex items-center gap-2"
    >
      <div
        class=""
      >
        <p>
          分配时间
        </p>

        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="请选择分配时间"
        />
      </div>

      <div
        class=""
      >
        <p>
          到期时间
        </p>

        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="请选择到期时间"
        />
      </div>
    </div>

    <div
      class="mt-3 flex items-center gap-2"
    >
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
    </div>

    <template
      #footer
    >
      <el-button
        @click="visible = false"
      >
        取消
      </el-button>

      <el-button
        type="primary"
      >
        分配任务
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

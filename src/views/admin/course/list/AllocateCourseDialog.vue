<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

/**
 * 穿梭框选项
 */
type TransferOption = {

  /** 选项值 */
  key: number

  /** 选项名称 */
  label: string

  /** 是否禁用 */
  disabled: boolean
}

const visible = defineModel<boolean>()

/**
 * 学习者输入内容
 */
const learnerKeyword = ref('')

/**
 * 分配说明
 */
const assignmentContent = ref('')

/**
 * 备注内容
 */
const assignmentRemark = ref('')

/**
 * 分配时间
 */
const assignTime = ref('')

/**
 * 到期时间
 */
const expireTime = ref('')

/**
 * 是否显示选择部门弹窗
 */
const isShowSelectDepartmentDialog = ref(false)

/**
 * 已选部门 ID
 */
const selectedDepartmentIds = ref<number[]>([])

/**
 * 部门列表数据
 */
const departmentOptions = ref<TransferOption[]>(generateDepartmentOptions())

/**
 * 生成部门选项
 */
function generateDepartmentOptions() {
  return Array.from({
    length: 15,
  }, (_, index) => {
    const key = index + 1

    return {
      key,
      label: `部门 ${key}`,
      disabled: key % 4 === 0,
    }
  })
}

/**
 * 打开选择部门弹窗
 */
function openSelectDepartmentDialog() {
  isShowSelectDepartmentDialog.value = true
}

/**
 * 关闭选择部门弹窗
 */
function closeSelectDepartmentDialog() {
  isShowSelectDepartmentDialog.value = false
}

/**
 * 关闭分配学习任务弹窗
 */
function closeDialog() {
  visible.value = false
}

/**
 * 提交分配学习任务
 */
function submitAllocateTask() {
  closeDialog()
}
</script>

<template>
  <el-dialog
    v-if="isShowSelectDepartmentDialog"
    v-model="isShowSelectDepartmentDialog"
    title="选择部门"
    width="720px"
  >
    <el-transfer
      v-model="selectedDepartmentIds"
      :data="departmentOptions"
      :titles="['待选', '已选']"
      filterable
      class="w-full"
    />

    <template
      #footer
    >
      <div
        class="flex justify-end gap-2"
      >
        <el-button
          @click="closeSelectDepartmentDialog"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="closeSelectDepartmentDialog"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="visible"
    title="分配学习任务 "
    width="760px"
  >
    <div
      class="flex flex-wrap items-center gap-2 text-sm"
    >
      <span
        class="text-g-600"
      >学习者</span>

      <span
        class="text-primary"
      >
        张三
      </span>
    </div>

    <div
      class="mt-4"
    >
      <el-input
        v-model="learnerKeyword"
        placeholder="请输入账户信息、分组名、部门名、班级名称或班级访问码，用逗号分隔"
      >
        <template
          #append
        >
          <el-button
            type="primary"
            @click="openSelectDepartmentDialog"
          >
            选择部门
          </el-button>
        </template>
      </el-input>
    </div>

    <div
      class="mt-4"
    >
      <el-input
        v-model="assignmentContent"
        type="textarea"
        :rows="5"
        placeholder="请输入分配说明"
      />
    </div>

    <div
      class="mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1"
    >
      <div
        class="flex flex-col gap-2"
      >
        <p
          class="text-sm text-g-700"
        >
          分配时间
        </p>

        <el-date-picker
          v-model="assignTime"
          type="date"
          placeholder="请选择分配时间"
          class="w-full!"
        />
      </div>

      <div
        class="flex flex-col gap-2"
      >
        <p
          class="text-sm text-g-700"
        >
          到期时间
        </p>

        <el-date-picker
          v-model="expireTime"
          type="date"
          placeholder="请选择到期时间"
          class="w-full!"
        />
      </div>
    </div>

    <div
      class="mt-4"
    >
      <el-input
        v-model="assignmentRemark"
        type="textarea"
        :rows="5"
        placeholder="请输入备注"
      />
    </div>

    <template
      #footer
    >
      <div
        class="flex justify-end gap-2"
      >
        <el-button
          @click="closeDialog"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="submitAllocateTask"
        >
          分配任务
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

<!------  2026-08-04---16:02---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
/**
 * 弹窗显示状态。
 */
const visible = defineModel<boolean>({
  default: false,
})

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

/**
   *  待选数组
   */
const selectedDepartmentIds = ref([])

/**
   *  已选数组
   */
const selectedDepartmentData = ref(generateData())

</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="分配"
    width="72%"
    destroy-on-close
  >
    <el-transfer
      v-model="selectedDepartmentIds"
      class="w-full flex justify-between"
      :data="selectedDepartmentData"
      :titles="['待选', '已选']"
      filterable
    >
      1
    </el-transfer>

  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-transfer-panel) {
  flex: 2 !important;
}
</style>

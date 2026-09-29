<script lang="ts" setup>
import AssignmentPanel from './assignment-panel.vue'

defineProps<{

  /** 分配目标类型。 */
  type: 'course' | 'project'

  /** 课程或项目 ID。 */
  id: number

  /** 课程或项目名称。 */
  name: string
}>()

/** 控制分配用户弹窗的显示状态。 */
const visible = defineModel<boolean>({
  default: false,
})

const activeName = ref('customer')

const tabs = [
  {
    label: '客户',
    name: 'customer',
  },
  {
    label: '佐敦',
    name: 'jotun',
  },
] as const
</script>

<template>
  <ArtButton
    type="allocate"
    @click="visible = true"
  />

  <el-dialog
    v-if="visible"
    v-model="visible"
    title="分配用户"
    width="80%"
    destroy-on-close
  >
    <el-tabs
      v-model="activeName"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
        lazy
      >
        <AssignmentPanel
          :id="id"
          :type="type"
          :name="name"
          :category="tab.name"
          @close="visible = false"
        />
      </el-tab-pane>
    </el-tabs>

    <template
      #footer
    />
  </el-dialog>
</template>

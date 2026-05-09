<!-- 章节弹窗 -->
<script lang="ts" setup>
import { computed, watch } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  editData: undefined,
})

/**
 * 提交事件
 */
const emit = defineEmits<{

  /**
   * 新建章节
   */
  add: [data: typeof formData.value]

  /**
   * 编辑章节
   */
  edit: [data: typeof formData.value]
}>()

/**
 * 弹窗显示状态
 */
const visible = defineModel<boolean>()

type Props = {
  /**
   * 弹窗模式
   */
  mode?: 'add' | 'edit'

  /**
   * 编辑时的章节数据
   */
  editData?: {
    id?: string | number
    name: string
    description: string
    isVisible: string | number
  }
}

/**
 * 表单数据
 */
const formData = ref({
  name: '',
  description: '',
  isVisible: '1',
})

/**
 * 是否为编辑模式
 */
const isEditMode = computed(() => props.mode === 'edit')

/**
 * 弹窗标题
 */
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑章节' : '新建章节'
})

/**
 * 提交按钮文本
 */
const submitText = computed(() => {
  return isEditMode.value ? '保存' : '完成'
})

/**
 * 重置表单
 */
function resetFormData() {
  formData.value = {
    name: '',
    description: '',
    isVisible: '1',
  }
}

/**
 * 回显编辑数据
 */
function setEditFormData() {
  if (!props.editData) { return }

  formData.value = {
    name: props.editData.name,
    description: props.editData.description,
    isVisible: String(props.editData.isVisible),
  }
}

/**
 * 提交表单
 */
function handleSubmit() {
  if (isEditMode.value) {
    emit('edit', formData.value)
  }
  else {
    emit('add', formData.value)
  }

  visible.value = false
}

watch(
  () => visible.value,
  (value) => {
    if (!value) { return }

    if (isEditMode.value) {
      setEditFormData()
    }
    else {
      resetFormData()
    }
  },
)
</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    :title="dialogTitle"
    width="50%"
    :show-close="false"
  >
    <el-form
      :model="formData"
      label-position="top"
    >
      <el-form-item
        prop="name"
        label="章节名称"
      >
        <el-input
          v-model="formData.name"
          placeholder="请输入章节名称"
        />
      </el-form-item>

      <el-form-item
        prop="description"
        label="章节描述"
      >
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="5"
          placeholder="请填写章节描述，帮助学员理解章节内容"
        />
      </el-form-item>

      <el-form-item
        prop="isVisible"
      >
        <div
          class="flex flex-col gap-2"
        >
          <div
            class="flex gap-2 items-center"
          >
            <span>对学员可见</span>

            <el-switch
              v-model="formData.isVisible"
              active-value="1"
              inactive-value="0"
            />
          </div>

          <div
            class="color-textSecondary"
          >
            如果关闭对学员可见，学员将不能看到章节以及章节内的小节。
          </div>
        </div>
      </el-form-item>
    </el-form>

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
        @click="handleSubmit"
      >
        {{ submitText }}
      </el-button>
    </template>
  </el-dialog>
</template>

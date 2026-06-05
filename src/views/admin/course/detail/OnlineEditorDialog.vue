<!-- 章节新增或者编辑弹窗 -->
<script lang="ts" setup>

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
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
   * 课程 ID
   */
  couId: number
}

/**
 * 表单数据
 */
const formData = ref<AdminApi.Course.CourseOutlineEditor>({
  couId: props.couId,
  olType: 1,
  olLevel: 1,
  olName: '',
  olIntro: '',
  olIsUse: 1,
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
   * 提交按钮加载状态
   */
const loading = ref(false)

/**
 * 重置表单
 */
function resetFormData() {
  formData.value = {
    couId: props.couId,
    olType: 1,
    olLevel: 1,
    olName: '',
    olIntro: '',
    olIsUse: 1,
  }
}

/**
 * 获取章节详情
 */
async function getOutlineDetail() {

}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (isEditMode.value) {
    emit('edit', formData.value)
  }
  else {
    await fetchAdminCourseOutlineAdd(formData.value)
    emit('add', formData.value)
  }

  visible.value = false
}

onMounted(() => {
  if (isEditMode.value) {
    void getOutlineDetail()
  }
})
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
        prop="olName"
        required
        label="章节名称"
      >
        <el-input
          v-model="formData.olName"
          placeholder="请输入章节名称"
        />
      </el-form-item>

      <el-form-item
        prop="olIntro"
        required
        label="章节描述"
      >
        <el-input
          v-model="formData.olIntro"
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
              v-model="formData.olIsUse"
              :active-value="1"
              :inactive-value="0"
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

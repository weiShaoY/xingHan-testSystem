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
   * 提交成功
   */
  success: [data: typeof formData.value]
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

  /**
   * 章节 ID
   */
  olId?: number
}

/**
 * 章节表单数据
 */
const formData = ref<AdminApi.Course.CourseOutlineChapterEditor>({
  olId: props.olId,
  couId: props.couId,
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
   * 提交按钮加载状态
   */
const loading = ref(false)

/**
 * 获取课程章节详情
 */
async function getOutlineDetail() {
  if (!isEditMode.value) {
    return
  }

  if (!props.olId) {
    return
  }

  try {
    const res = await fetchAdminCourseOutlineChapterDetail(props.olId)

    formData.value = {
      olId: props.olId,
      ...res,
    }
  }
  catch {
    ElNotification.error('获取章节详情失败')
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (loading.value) {
    return
  }

  loading.value = true

  try {
    if (isEditMode.value) {
      await fetchAdminCourseOutlineChapterUpdate(formData.value)
    }
    else {
      await fetchAdminCourseOutlineChapterAdd(formData.value)
    }

    emit('success', formData.value)

    visible.value = false

    ElNotification.success(isEditMode.value ? '章节更新成功' : '章节新增成功')
  }
  catch {
    ElNotification.error(isEditMode.value ? '章节更新失败' : '章节新增失败')
  }
  finally {
    loading.value = false
  }
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
      v-loading="loading"
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
        完成
      </el-button>
    </template>
  </el-dialog>
</template>

<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const visible = defineModel({
  type: Boolean,
})

const formData = ref({
  name: '',
  description: '',
  isVisible: 1,
})

</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="新建章节"
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
            class="flex items-center gap-2"
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
      >
        完成
      </el-button>
    </template>
  </el-dialog>

</template>

<style lang="scss" scoped>

</style>

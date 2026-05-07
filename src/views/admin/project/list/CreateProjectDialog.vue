<!------  2026-04-15---16:52---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const visible = defineModel({
  type: Boolean,
})

const formModel = ref({
  a: '',
  b: '',
  c: '',
  d: '',
})

const contentCategoryOptions = ref([
  {
    key: 1,
    value: 1,
    label: '企业培训',
  },
  {
    key: 2,
    value: 2,
    label: '学科教学',
  },
  {
    key: 3,
    value: 3,
    label: '学习技术',
  },
])
</script>

<template>
  <el-dialog
    v-model="visible"
    title="创建学习项目 "
    width="70%"
    :show-close="false"
  >
    <el-form
      :model="formModel"
      label-width="120px"
      label-position="top"
    >
      <el-form-item
        prop="a"
        label="学习项目名称"
      >
        <el-input
          v-model="formModel.a"
          placeholder="请输入学习项目名称"
        />
      </el-form-item>

      <el-form-item
        prop="b"
        label="内容分类"
      >
        <el-select
          v-model="formModel.b"
          placeholder="请选择内容分类"
        >
          <el-option
            v-for="item in contentCategoryOptions"
            :key="item.key"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="c"
        label="学习项目标签"
      >
        <el-input
          v-model="formModel.c"
          placeholder="用逗号隔开，方便更多学员找到您的课程"
        />
      </el-form-item>

      <el-form-item
        prop="d"
        label="学习项目介绍"
      >
        <el-input
          v-model="formModel.d"
          type="textarea"
          :rows="5"
          placeholder="请输入学习项目介绍"
        />
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
        创建学习项目
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

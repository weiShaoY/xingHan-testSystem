<!------  2026-04-16---20:42---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'

</script>

<template>
  <div
    class="h-full"
  >
    <el-page-header
      @back="$router.back()"
    >
      <template
        #content
      >
        <div
          class="flex items-center"
        >
          创建小节页
        </div>
      </template>

      <template
        #extra
      >
        <div
          class="flex items-center gap-2"
        >

          <!-- 分配 -->
          <el-button
            class="flex items-center justify-center"
          >
            完成
          </el-button>
        </div>
      </template>
    </el-page-header>

    <!-- // 文件 或者 视频 -->
    <div
      class=""
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon
          class="el-icon--upload"
        >
          <UploadFilled />
        </el-icon>

        <div
          class="el-upload__text"
        >
          将文件拖到此处，或<em>点击上传</em>
        </div>

        <template
          #tip
        >
          <div
            class="el-upload__tip"
          >
            只能上传jpg/png文件，且不超过500kb
          </div>
        </template>
      </el-upload>

    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

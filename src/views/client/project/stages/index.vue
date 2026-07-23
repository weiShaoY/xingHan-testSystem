<script lang="ts" setup>
const loading = ref(false)

function onRefresh() {
  loading.value = false
}
</script>

<template>
  <van-pull-refresh
    v-model="loading"
    class="h-full"
    @refresh="onRefresh"
  >
    <van-space
      direction="vertical"
      fill
      :size="16"
    >
      <van-progress
        :percentage="50"
      />
    </van-space>
  </van-pull-refresh>
</template>

<style lang="scss" scoped></style>

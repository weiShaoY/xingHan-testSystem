<!------  2026-05-14---16:11---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
defineOptions({
  name: 'ClientLayout',
})
</script>

<template>
  <div
    class="client-layout"
  >
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.client-layout {
  min-height: 100vh;
  background: var(--default-bg-color);
}
</style>

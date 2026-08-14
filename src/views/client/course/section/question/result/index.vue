<!------  2026-08-14---10:41---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
async function getCourseQuestionResult() {
  const res = await fetchClientCourseQuestionResult({
    examId: Number(route.params.examId || 0),
  })
}
</script>

<template>
  <divs
    class=""
  >
    1
  </divs>
</template>

<style lang="scss" scoped>

</style>

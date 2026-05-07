<!-- 500页面 -->
<script setup lang="ts">
import imgUrl from '@imgs/svg/500.svg'

defineOptions({
  name: 'Exception500',
})
</script>

<template>
  <ArtException
    :data="{
      title: '500',
      desc: $t('exceptionPage.500'),
      btnText: $t('exceptionPage.gohome'),
      imgUrl,
    }"
  />
</template>

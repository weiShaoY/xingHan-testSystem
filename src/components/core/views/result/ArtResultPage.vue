<script setup lang="ts">
defineOptions({
  name: 'ArtResultPage',
})

withDefaults(defineProps<ResultPageProps>(), {
  type: 'success',
  title: '',
  message: '',
  iconCode: '',
})

type ResultPageProps = {

  /** 成功/失败 */
  type: 'success' | 'fail'

  /** 标题 */
  title: string

  /** 消息 */
  message: string

  /** 图标 */
  iconCode: string
}

</script>

<template>
  <div
    class="page-content py-3.5 text-center box-border !px-20 max-md:!px-5"
    :class="type"
  >
    <ArtSvgIcon
      class="icon mt-16 p-2 rounded-full size-22 block !text-white"
      :icon="iconCode"
      :class="type === 'success' ? 'bg-[#19BE6B]' : 'bg-[#ED4014]'"
    />

    <h1
      class="title text-3xl font-medium mt-8 max-md:text-2xl !text-g-900 max-md:mt-2.5"
    >
      {{
        title
      }}
    </h1>

    <p
      class="msg text-base text-g-600 mt-5"
    >
      {{ message }}
    </p>

    <div
      class="res mt-7.5 px-7.5 py-5.5 text-left rounded bg-g-200/80 [&_p]:text-sm [&_p]:text-[#808695] [&_p_i]:mr-1.5 [&_p]:py-2 max-md:px-7.5 max-md:py-2.5 dark:bg-g-300/40 [&_p]:flex [&_p]:items-center"
    >
      <slot
        name="content"
      />
    </div>

    <div
      class="btn-group mt-12.5"
    >
      <slot
        name="buttons"
      />
    </div>
  </div>
</template>

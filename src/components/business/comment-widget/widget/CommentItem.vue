<script setup lang="ts">
import { ref } from 'vue'

import AppConfig from '@/config'

type Comment = {
  id: number
  author: string
  content: string
  timestamp: string
  replies: Comment[]
}

const props = defineProps<{
  comment: Comment
  showReplyForm: number | null
}>()

const emit = defineEmits<{
  (event: 'toggle-reply', commentId: number): void
  (event: 'add-reply', commentId: number, replyAuthor: string, replyContent: string): void
}>()

const replyAuthor = ref('')

const replyContent = ref('')

function toggleReply(commentId: number) {
  emit('toggle-reply', commentId)
}

function addReply(commentId: number, author: string, content: string) {
  emit('add-reply', commentId, author, content)
  replyAuthor.value = ''
  replyContent.value = ''
}

function handleSubmit() {
  if (!replyAuthor.value.trim() || !replyContent.value.trim()) {
    return
  }

  emit('add-reply', props.comment.id, replyAuthor.value, replyContent.value)
  replyAuthor.value = ''
  replyContent.value = ''
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)

  return date.toLocaleString()
}

let lastColor: string | null = null

function randomColor() {
  let newColor: string

  do {
    const index = Math.floor(Math.random() * AppConfig.systemMainColor.length)

    newColor = AppConfig.systemMainColor[index]
  } while (newColor === lastColor)

  lastColor = newColor
  return newColor
}
</script>

<template>
  <li>
    <div>
      <div
        class="flex-c"
      >
        <div
          class="text-xs text-white font-medium mr-2.5 rounded-full flex-cc size-5"
          :style="{ background: randomColor() }"
        >
          {{ comment.author.substring(0, 1) }}
        </div>

        <strong
          class="text-sm font-medium block"
        >{{ comment.author }}</strong>
      </div>

      <span
        class="text-sm text-g-700 mt-2.5 block"
      >{{ comment.content }}</span>

      <div
        class="mt-2.5 flex-c"
      >
        <span
          class="text-xs text-g-700"
        >{{ formatDate(comment.timestamp) }}</span>

        <div
          class="text-xs text-g-700 ml-5 c-p select-none hover:text-theme"
          @click="toggleReply(comment.id)"
        >
          回复
        </div>
      </div>
    </div>

    <ul
      v-if="comment.replies.length > 0"
      class="pl-2.5"
    >
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :show-reply-form="showReplyForm"
        class="mt-5"
        @toggle-reply="toggleReply"
        @add-reply="addReply"
      />
    </ul>

    <ElForm
      v-if="showReplyForm === comment.id"
      class="mt-4"
      @submit.prevent="handleSubmit"
    >
      <ElFormItem
        prop="author"
      >
        <ElInput
          v-model="replyAuthor"
          placeholder="你的名称"
          clearable
        />
      </ElFormItem>

      <ElFormItem
        prop="content"
      >
        <ElInput
          v-model="replyContent"
          placeholder="你的回复..."
          type="textarea"
          :rows="3"
          clearable
        />
      </ElFormItem>

      <ElFormItem>
        <div
          class="flex gap-2 w-full justify-end"
        >
          <ElButton
            @click="toggleReply(comment.id)"
          >
            取消
          </ElButton>

          <ElButton
            type="primary"
            @click="handleSubmit"
          >
            发布
          </ElButton>
        </div>
      </ElFormItem>
    </ElForm>
  </li>
</template>

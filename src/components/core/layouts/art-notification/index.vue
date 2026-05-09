<!-- 通知组件 -->
<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'

import {
  computed,

  ref,

  watch,
} from 'vue'

import { useI18n } from 'vue-i18n'

// 导入头像图片
import avatar1 from '@/assets/images/avatar/avatar1.webp'

import avatar2 from '@/assets/images/avatar/avatar2.webp'

import avatar3 from '@/assets/images/avatar/avatar3.webp'

import avatar4 from '@/assets/images/avatar/avatar4.webp'

import avatar5 from '@/assets/images/avatar/avatar5.webp'

import avatar6 from '@/assets/images/avatar/avatar6.webp'

defineOptions({
  name: 'ArtNotification',
})

const props = defineProps<{
  value: boolean
}>()

const emit = defineEmits<{
  'update:value': [value: boolean]
}>()

type NoticeItem = {

  /** 标题 */
  title: string

  /** 时间 */
  time: string

  /** 类型 */
  type: NoticeType
}

type MessageItem = {

  /** 标题 */
  title: string

  /** 时间 */
  time: string

  /** 头像 */
  avatar: string
}

type PendingItem = {

  /** 标题 */
  title: string

  /** 时间 */
  time: string
}

type BarItem = {

  /** 名称 */
  name: ComputedRef<string>

  /** 数量 */
  num: number
}

type NoticeStyle = {

  /** 图标 */
  icon: string

  /** icon 样式 */
  iconClass: string
}

type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice'

const { t } = useI18n()

const show = ref(false)

const visible = ref(false)

const barActiveIndex = ref(0)

function useNotificationData() {
  // 通知数据
  const noticeList = ref<NoticeItem[]>([
    {
      title: '新增国际化',
      time: '2024-6-13 0:10',
      type: 'notice',
    },
    {
      title: '冷月呆呆给你发了一条消息',
      time: '2024-4-21 8:05',
      type: 'message',
    },
    {
      title: '小肥猪关注了你',
      time: '2020-3-17 21:12',
      type: 'collection',
    },
    {
      title: '新增使用文档',
      time: '2024-02-14 0:20',
      type: 'notice',
    },
    {
      title: '小肥猪给你发了一封邮件',
      time: '2024-1-20 0:15',
      type: 'email',
    },
    {
      title: '菜单mock本地真实数据',
      time: '2024-1-17 22:06',
      type: 'notice',
    },
  ])

  // 消息数据
  const msgList = ref<MessageItem[]>([
    {
      title: '池不胖 关注了你',
      time: '2021-2-26 23:50',
      avatar: avatar1,
    },
    {
      title: '唐不苦 关注了你',
      time: '2021-2-21 8:05',
      avatar: avatar2,
    },
    {
      title: '中小鱼 关注了你',
      time: '2020-1-17 21:12',
      avatar: avatar3,
    },
    {
      title: '何小荷 关注了你',
      time: '2021-01-14 0:20',
      avatar: avatar4,
    },
    {
      title: '誶誶淰 关注了你',
      time: '2020-12-20 0:15',
      avatar: avatar5,
    },
    {
      title: '冷月呆呆 关注了你',
      time: '2020-12-17 22:06',
      avatar: avatar6,
    },
  ])

  // 待办数据
  const pendingList = ref<PendingItem[]>([])

  // 标签栏数据
  const barList = computed<BarItem[]>(() => [
    {
      name: computed(() => t('notice.bar[0]')),
      num: noticeList.value.length,
    },
    {
      name: computed(() => t('notice.bar[1]')),
      num: msgList.value.length,
    },
    {
      name: computed(() => t('notice.bar[2]')),
      num: pendingList.value.length,
    },
  ])

  return {
    noticeList,
    msgList,
    pendingList,
    barList,
  }
}

// 样式管理
function useNotificationStyles() {
  const noticeStyleMap: Record<NoticeType, NoticeStyle> = {
    email: {
      icon: 'ri:mail-line',
      iconClass: 'bg-warning/12 text-warning',
    },
    message: {
      icon: 'ri:volume-down-line',
      iconClass: 'bg-success/12 text-success',
    },
    collection: {
      icon: 'ri:heart-3-line',
      iconClass: 'bg-danger/12 text-danger',
    },
    user: {
      icon: 'ri:volume-down-line',
      iconClass: 'bg-info/12 text-info',
    },
    notice: {
      icon: 'ri:notification-3-line',
      iconClass: 'bg-theme/12 text-theme',
    },
  }

  const getNoticeStyle = (type: NoticeType): NoticeStyle => {
    const defaultStyle: NoticeStyle = {
      icon: 'ri:arrow-right-circle-line',
      iconClass: 'bg-theme/12 text-theme',
    }

    return noticeStyleMap[type] || defaultStyle
  }

  return {
    getNoticeStyle,
  }
}

// 动画管理
function useNotificationAnimation() {
  const showNotice = (open: boolean) => {
    if (open) {
      visible.value = true
      setTimeout(() => {
        show.value = true
      }, 5)
    }
    else {
      show.value = false
      setTimeout(() => {
        visible.value = false
      }, 350)
    }
  }

  return {
    showNotice,
  }
}

// 标签页管理
function useTabManagement(noticeList: Ref<NoticeItem[]>, msgList: Ref<MessageItem[]>, pendingList: Ref<PendingItem[]>, businessHandlers: {
  handleNoticeAll: () => void
  handleMsgAll: () => void
  handlePendingAll: () => void
}) {
  const changeBar = (index: number) => {
    barActiveIndex.value = index
  }

  // 检查当前标签页是否为空
  const currentTabIsEmpty = computed(() => {
    const tabDataMap = [noticeList.value, msgList.value, pendingList.value]

    const currentData = tabDataMap[barActiveIndex.value]

    return currentData && currentData.length === 0
  })

  const handleViewAll = () => {
    // 查看全部处理器映射
    const viewAllHandlers: Record<number, () => void> = {
      0: businessHandlers.handleNoticeAll,
      1: businessHandlers.handleMsgAll,
      2: businessHandlers.handlePendingAll,
    }

    const handler = viewAllHandlers[barActiveIndex.value]

    handler?.()

    // 关闭通知面板
    emit('update:value', false)
  }

  return {
    changeBar,
    currentTabIsEmpty,
    handleViewAll,
  }
}

// 业务逻辑处理
function useBusinessLogic() {
  const handleNoticeAll = () => {
    // 处理查看全部通知
    console.log('查看全部通知')
  }

  const handleMsgAll = () => {
    // 处理查看全部消息
    console.log('查看全部消息')
  }

  const handlePendingAll = () => {
    // 处理查看全部待办
    console.log('查看全部待办')
  }

  return {
    handleNoticeAll,
    handleMsgAll,
    handlePendingAll,
  }
}

// 组合所有逻辑
const { noticeList, msgList, pendingList, barList } = useNotificationData()

const { getNoticeStyle } = useNotificationStyles()

const { showNotice } = useNotificationAnimation()

const { handleNoticeAll, handleMsgAll, handlePendingAll } = useBusinessLogic()

const { changeBar, currentTabIsEmpty, handleViewAll } = useTabManagement(
  noticeList,
  msgList,
  pendingList,
  {
    handleNoticeAll,
    handleMsgAll,
    handlePendingAll,
  },
)

// 监听属性变化
watch(
  () => props.value,
  (newValue) => {
    showNotice(newValue)
  },
)
</script>

<template>
  <div
    v-show="visible"
    class="art-notification-panel art-card-sm !shadow-xl"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0,
    }"
    @click.stop
  >
    <div
      class="mt-3.5 px-3.5 flex-cb"
    >
      <span
        class="text-base text-g-800 font-medium"
      >{{ $t('notice.title') }}</span>

      <span
        class="text-xs text-g-800 px-1.5 py-1 rounded c-p select-none hover:bg-g-200"
      >
        {{ $t('notice.btnRead') }}
      </span>
    </div>

    <ul
      class="px-3.5 border-b-d flex h-12.5 w-full items-end box-border"
    >
      <li
        v-for="(item, index) in barList"
        :key="index"
        class="text-[13px] text-g-700 leading-12 mr-5 h-12 c-p select-none overflow-hidden"
        :class="{ 'bar-active': barActiveIndex === index }"
        @click="changeBar(index)"
      >
        {{ item.name }} ({{ item.num }})
      </li>
    </ul>

    <div
      class="h-[calc(100%-95px)] w-full"
    >
      <div
        class="scrollbar-thin h-[calc(100%-60px)] overflow-y-scroll"
      >
        <!-- 通知 -->
        <ul
          v-show="barActiveIndex === 0"
        >
          <li
            v-for="(item, index) in noticeList"
            :key="index"
            class="px-3.5 py-3.5 flex-c c-p box-border last:border-b-0 hover:bg-g-200/60"
          >
            <div
              class="leading-9 text-center rounded-lg flex-cc size-9"
              :class="[getNoticeStyle(item.type).iconClass]"
            >
              <ArtSvgIcon
                class="text-lg !bg-transparent"
                :icon="getNoticeStyle(item.type).icon"
              />
            </div>

            <div
              class="ml-3.5 w-[calc(100%-45px)]"
            >
              <h4
                class="text-sm text-g-900 leading-5.5 font-normal"
              >
                {{ item.title }}
              </h4>

              <p
                class="text-xs text-g-500 mt-1.5"
              >
                {{ item.time }}
              </p>
            </div>
          </li>
        </ul>

        <!-- 消息 -->
        <ul
          v-show="barActiveIndex === 1"
        >
          <li
            v-for="(item, index) in msgList"
            :key="index"
            class="px-3.5 py-3.5 flex-c c-p box-border last:border-b-0 hover:bg-g-200/60"
          >
            <div
              class="h-9 w-9"
            >
              <img
                :src="item.avatar"
                class="rounded-lg h-full w-full"
              >
            </div>

            <div
              class="ml-3.5 w-[calc(100%-45px)]"
            >
              <h4
                class="text-xs leading-5.5 font-normal"
              >
                {{ item.title }}
              </h4>

              <p
                class="text-xs text-g-500 mt-1.5"
              >
                {{ item.time }}
              </p>
            </div>
          </li>
        </ul>

        <!-- 待办 -->
        <ul
          v-show="barActiveIndex === 2"
        >
          <li
            v-for="(item, index) in pendingList"
            :key="index"
            class="px-5 py-3.5 box-border last:border-b-0"
          >
            <h4>
              {{ item.title }}
            </h4>

            <p
              class="text-xs text-g-500"
            >
              {{ item.time }}
            </p>
          </li>
        </ul>

        <!-- 空状态 -->
        <div
          v-show="currentTabIsEmpty"
          class="text-g-500 text-center h-full top-25 relative !bg-transparent"
        >
          <ArtSvgIcon
            icon="system-uicons:inbox"
            class="text-5xl"
          />

          <p
            class="text-xs mt-3.5 !bg-transparent"
          >
            {{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}
          </p>
        </div>
      </div>

      <div
        class="px-3.5 w-full box-border relative"
      >
        <ElButton
          v-ripple
          class="mt-3 w-full"
          @click="handleViewAll"
        >
          {{ $t('notice.viewAll') }}
        </ElButton>
      </div>
    </div>

    <div
      class="h-25"
    />
  </div>
</template>

<style scoped>
  @reference '@styles/core/tailwind.css';

.art-notification-panel {
  @apply absolute
    top-14.5
    right-5
    w-90
    h-125
    overflow-hidden
    transition-all
    duration-300
    origin-top
    will-change-[top,left]
    max-[640px]:top-[65px]
    max-[640px]:right-0
    max-[640px]:w-full
    max-[640px]:h-[80vh];
}

.bar-active {
  color: var(--theme-color) !important;
  border-bottom: 2px solid var(--theme-color);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 5px !important;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background-color: var(--default-box-color);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #222 !important;
}
</style>

<!------  2026-05-10---05:14---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { ColumnOption } from '@/types'

type DocumentStatus = 'available' | 'processing' | 'failed'

type UserDocument = {
  id: string
  name: string
  status: DocumentStatus
  deletedTime: string
  size: string
  duration: string
  coverColor: string
}

const trashList = ref<UserDocument[]>([
  {
    id: '1',
    name: 'f97d905409094c599e43f18b8c6f0217.mp4',
    status: 'available',
    deletedTime: '2026-04-16 15:19:51',
    size: '578MB',
    duration: '12:48',
    coverColor: 'bg-primary/15 text-primary',
  },
  {
    id: '2',
    name: 'Vue3 进阶训练.mp4',
    status: 'available',
    deletedTime: '2025-10-09 10:13:30',
    size: '228MB',
    duration: '08:36',
    coverColor: 'bg-secondary/15 text-secondary',
  },
])

const selectedRows = ref<UserDocument[]>([])

const hasSelectedRows = computed(() => selectedRows.value.length > 0)

const columns: ColumnOption<UserDocument>[] = [
  {
    type: 'selection',
  },
  {
    label: '文件名称',
    prop: 'name',
    minWidth: 460,
    useSlot: true,
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 120,
    useSlot: true,
  },
  {
    label: '删除时间',
    prop: 'deletedTime',
    minWidth: 220,
    sortable: true,
    useSlot: true,
  },
  {
    label: '文件大小',
    prop: 'size',
    minWidth: 140,
    useSlot: true,
  },
  {
    label: '操作',
    prop: 'operation',
    width: 200,
    fixed: 'right',
    useSlot: true,
  },
]

function getStatusText(status: DocumentStatus) {
  const statusMap: Record<DocumentStatus, string> = {
    available: '可用',
    processing: '处理中',
    failed: '不可用',
  }

  return statusMap[status]
}

function handleSelectionChange(selection: UserDocument[]) {
  selectedRows.value = selection
}

function restoreSelectedFiles() {
  console.log('恢复选中文件:', selectedRows.value)
}

function deleteSelectedForever() {
  console.log('彻底删除选中文件:', selectedRows.value)
}

function restoreFile(item: UserDocument) {
  trashList.value = trashList.value.filter(file => file.id !== item.id)
  console.log('恢复文件:', item)
}

function deleteForever(item: UserDocument) {
  trashList.value = trashList.value.filter(file => file.id !== item.id)
  console.log('彻底删除:', item)
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-10 relative max-lg:px-6 max-sm:px-4"
  >
    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-sm:items-start"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          回收站
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ trashList.length }} 个文件
        </p>
      </div>
    </div>

    <div
      class="flex items-center gap-5"
    >
      <ArtIconButton
        icon="ri:arrow-go-back-line"
        :disabled="!hasSelectedRows"
        @click="restoreSelectedFiles"
      >
        恢复选中文件
      </ArtIconButton>

      <ArtIconButton
        type="delete"
        :disabled="!hasSelectedRows"
        @click="deleteSelectedForever"
      >
        彻底删除选中文件
      </ArtIconButton>
    </div>

    <!-- 回收站表格 -->
    <ArtTable
      :data="trashList"
      :columns="columns"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <template
        #name="{ row }"
      >
        <div
          class="flex items-center gap-18 max-md:gap-5"
        >
          <div
            class="relative flex h-23 w-41 shrink-0 items-center justify-center overflow-hidden rounded bg-g-200"
            :class="row.coverColor"
          >
            <ArtSvgIcon
              icon="ri:play-circle-line"
              class="text-8"
            />

            <span
              class="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white"
            >
              {{ row.duration }}
            </span>
          </div>

          <span
            class="min-w-0 truncate text-base text-g-900"
          >
            {{ row.name }}
          </span>
        </div>
      </template>

      <template
        #status="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ getStatusText(row.status) }}
        </span>
      </template>

      <template
        #deletedTime="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ row.deletedTime }}
        </span>
      </template>

      <template
        #size="{ row }"
      >
        <span
          class="text-base text-g-900"
        >
          {{ row.size }}
        </span>
      </template>

      <template
        #operation="{ row }"
      >
        <div
          class="flex items-center gap-5"
        >

          <ArtIconButton
            icon="ri:arrow-go-back-line"
            tooltip="恢复"
            @click="restoreFile(row)"
          />

          <ArtIconButton
            type="delete"
            tooltip="彻底删除"
            @click="deleteForever(row)"
          />

        </div>
      </template>
    </ArtTable>
  </div>
</template>

<style lang="scss" scoped>

</style>

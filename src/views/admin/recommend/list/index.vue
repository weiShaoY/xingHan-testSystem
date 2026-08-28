<script lang="ts" setup>
import type { ColumnOption } from '@/types'

import {
  ElButton,
  ElMessageBox,
  ElTag,
} from 'element-plus'

import { h } from 'vue'

import {
  fetchAdminRecommendApply,
  fetchAdminRecommendList,
} from '@/apis/admin/recommend'

import { useTable } from '@/hooks'

type RecommendItem = AdminApi.Recommend.RecommendListItem

const approvingId = ref<number>()

const statusTypeMap: Record<RecommendItem['approvalStatus'], 'info' | 'success' | 'danger' | 'warning'> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
  3: 'info',
  4: 'info',
}

const {
  columns,
  data,
  loading,
  pagination,
  refreshData,
  refreshUpdate,
  handleSizeChange,
  handleCurrentChange,
} = useTable<typeof fetchAdminRecommendList>({
  core: {
    apiFn: fetchAdminRecommendList,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
    },
    columnsFactory: (): ColumnOption<RecommendItem>[] => [
      {
        prop: 'applyNo',
        label: '申请编号',
        minWidth: 170,
        showOverflowTooltip: true,
      },
      {
        prop: 'applicant',
        label: '报名人',
        minWidth: 160,
        formatter: row => h('div', {
          class: 'min-w-0',
        }, [
          h('p', {
            class: 'm-0 truncate text-sm font-medium text-g-900',
          }, row.userName || '-'),
          h('p', {
            class: 'm-0 mt-1 truncate text-xs text-g-500',
          }, row.userAccount || '-'),
        ]),
      },
      {
        prop: 'target',
        label: '报名内容',
        minWidth: 260,
        formatter: row => h('div', {
          class: 'flex min-w-0 items-center gap-2',
        }, [
          h(ElTag, {
            size: 'small',
            effect: 'plain',
            type: row.applyType === 1 ? 'primary' : 'success',
          }, () => row.applyTypeName),
          h('span', {
            class: 'truncate text-sm text-g-900',
          }, row.targetName || '-'),
        ]),
      },
      {
        prop: 'applyTime',
        label: '申请时间',
        minWidth: 170,
        formatter: row => row.applyTime || '-',
      },
      {
        prop: 'approvalStatus',
        label: '审批状态',
        width: 120,
        align: 'center',
        formatter: row => h(ElTag, {
          size: 'small',
          type: statusTypeMap[row.approvalStatus],
        }, () => row.approvalStatusName),
      },
      {
        prop: 'operation',
        label: '操作',
        width: 150,
        fixed: 'right',
        align: 'right',
        formatter: (row) => {
          if (row.approvalStatus !== 0 || row.needApproval !== 1) {
            return h('span', {
              class: 'text-sm text-g-400',
            }, '无需操作')
          }

          return h('div', {
            class: 'flex justify-end gap-1',
          }, [
            h(ElButton, {
              type: 'primary',
              link: true,
              loading: approvingId.value === row.applyId,
              onClick: () => handleApproval(row, 1),
            }, () => '通过'),
            h(ElButton, {
              type: 'danger',
              link: true,
              loading: approvingId.value === row.applyId,
              onClick: () => handleApproval(row, 2),
            }, () => '驳回'),
          ])
        },
      },
    ],
  },
  hooks: {
    onError: () => {
      ElNotification.error('待审批报名列表获取失败')
    },
  },
})

async function handleApproval(item: RecommendItem, approvalAction: 1 | 2) {
  const actionLabel = approvalAction === 1 ? '通过' : '驳回'

  try {
    const { value } = await ElMessageBox.prompt(
      `确认${actionLabel}「${item.targetName}」的报名申请吗？`,
      `${actionLabel}报名`,
      {
        confirmButtonText: `确认${actionLabel}`,
        cancelButtonText: '取消',
        inputPlaceholder: '填写审批备注（选填）',
        inputType: 'textarea',
      },
    )

    approvingId.value = item.applyId
    await fetchAdminRecommendApply({
      applyId: item.applyId,
      approvalAction,
      approvalRemark: value?.trim() || '',
    })
    ElNotification.success(`报名申请已${actionLabel}`)
    await refreshUpdate()
  }
  catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElNotification.error(`${actionLabel}失败，请稍后重试`)
    }
  }
  finally {
    approvingId.value = undefined
  }
}
</script>

<template>
  <div
    class="relative mx-auto max-w-7xl px-10 max-lg:px-6 max-sm:px-4"
  >
    <div
      class="my-5 flex w-full items-center justify-between gap-4 max-md:flex-col max-md:items-stretch"
    >
      <div>
        <h2
          class="text-xl font-semibold text-g-900 max-sm:text-lg"
        >
          报名审批
        </h2>

        <p
          class="mt-1 text-sm text-g-600"
        >
          共 {{ pagination.total }} 条报名申请
        </p>
      </div>

      <div
        class="flex items-center justify-end"
      >
        <ElButton
          :loading="loading"
          @click="refreshData"
        >
          刷新列表
        </ElButton>
      </div>
    </div>

    <ArtTable
      :loading="loading || approvingId !== undefined"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      row-key="applyId"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    />
  </div>
</template>

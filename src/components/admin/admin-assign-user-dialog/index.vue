<script lang="ts" setup>
import {
  ArrowRight,
  FolderOpened,
  User,
} from '@element-plus/icons-vue'

/**
 * 弹窗确认事件。
 * 返回当前勾选的题库题目列表。
 */
const emit = defineEmits<{
  confirm: [questions: AdminApi.Organization.OrganizationTreeWithAllUsersResponse[]]
}>()

/** 控制分配用户弹窗的显示状态。 */
const visible = defineModel<boolean>({
  default: false,
})

/** 分配用户接口返回的组织树节点类型。 */
type OrganizationTreeItem = AdminApi.Organization.OrganizationTreeItem

/** 分配用户接口返回的用户节点类型。 */
type OrganizationUser = AdminApi.Organization.UserNode

/** 用于树组件展示的用户节点。 */
type UserNode = OrganizationUser & {
  id: string
  name: string
  account: string
  type: 'user'
}

/** 用于树组件展示的组织节点，子组织与直属用户统一放入 children。 */
type DepartmentNode = Omit<OrganizationTreeItem, 'children' | 'users'> & {
  children: TreeNode[]
  type: 'department'
}

/** 组织树中的节点类型。 */
type TreeNode = DepartmentNode | UserNode

/** 待选用户树实例，用于读取勾选节点。 */
const treeRef = ref()

/** 接口组织树转换后的完整组件树。 */
const departmentTree = ref<DepartmentNode[]>([])

/** 接口返回的原始组织树，用于保存和回显。 */
const organizationTree = ref<OrganizationTreeItem[]>([])

/** 完整组织树中的所有用户。 */
const users = computed(() => getUsers(departmentTree.value))

/** 当前已选用户的 ID 集合。 */
const selectedUserIds = ref<number[]>([])

/** 当前已选用户的完整信息。 */
const selectedUsers = computed(() => users.value.filter(user => selectedUserIds.value.includes(user.userId)))

/** 过滤掉已选用户后，在待选区域展示的组织树。 */
const availableDepartmentTree = computed(() => filterTree(departmentTree.value, user => !selectedUserIds.value.includes(user.userId)))

/** 仅保留已选用户后，在已选区域展示的组织树。 */
const selectedDepartmentTree = computed(() => filterTree(departmentTree.value, user => selectedUserIds.value.includes(user.userId)))

/** 保持接口数据结构的已选组织树，可直接用于保存。 */
const selectedOrganizationTree = computed(() => filterOrganizationTree(
  organizationTree.value,
  user => selectedUserIds.value.includes(user.userId),
))

/** Element Plus 树组件的节点字段映射。 */
const treeProps = {
  children: 'children',
  label: 'name',
}

/** 将待选树中勾选的用户加入已选列表。 */
function addUsers() {
  const checkedUsers = (treeRef.value?.getCheckedNodes(false, true) ?? [])
    .filter((node: DepartmentNode | UserNode): node is UserNode => node.type === 'user')

  selectedUserIds.value = Array.from(new Set([
    ...selectedUserIds.value,
    ...checkedUsers.map((user: UserNode) => user.userId),
  ]))
}

/** 从已选列表中移除指定用户。 */
function removeUser(userId: number) {
  selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId)
}

/** 从已选列表中移除指定组织及其所有后代组织的用户。 */
function removeDepartment(department: DepartmentNode) {
  const departmentUserIds = getUsers([department]).map(user => user.userId)

  selectedUserIds.value = selectedUserIds.value.filter(id => !departmentUserIds.includes(id))
}

/** 获取接口组织树并转换为树组件需要的统一节点结构。 */
async function getUserList() {
  const res = await fetchAdminGetOrganizationTreeWithAllUsers()

  organizationTree.value = res
  departmentTree.value = res.map(toDepartmentNode)
}

/**
 * 将接口组织节点递归转换为组件树节点。
 * 子组织和直属用户都放入 children，使有 children 的节点按文件夹展示。
 */
function toDepartmentNode(department: OrganizationTreeItem): DepartmentNode {
  return {
    ...department,
    type: 'department',
    children: [
      ...department.children.map(toDepartmentNode),
      ...department.users.map((user: OrganizationUser) => ({
        ...user,
        id: `user-${user.userId}`,
        name: user.userName,
        account: user.userAccount,
        type: 'user' as const,
      })),
    ],
  }
}

/** 从任意层级的树节点中递归获取全部用户。 */
function getUsers(nodes: TreeNode[]): UserNode[] {
  return nodes.flatMap(node => node.type === 'user' ? [node] : getUsers(node.children))
}

/**
 * 按用户条件过滤组织树，并保留包含匹配用户的祖先组织节点。
 *
 * @param nodes 待过滤的组织节点
 * @param predicate 用户保留条件
 */
function filterTree(nodes: DepartmentNode[], predicate: (user: UserNode) => boolean): DepartmentNode[] {
  return nodes
    .map(department => ({
      ...department,
      children: department.children.flatMap((node): TreeNode[] => {
        if (node.type === 'user') {
          return predicate(node) ? [node] : []
        }

        const children = filterTree([node], predicate)

        return children
      }),
    }))
    .filter(department => department.children.length)
}

/**
 * 按用户条件筛选接口原始组织树，并保留包含匹配用户的组织节点。
 * 返回结构与 getOrganizationTreeWithAllUsers 接口完全一致。
 *
 * @param nodes 接口返回的组织节点
 * @param predicate 用户保留条件
 */
function filterOrganizationTree(
  nodes: OrganizationTreeItem[],
  predicate: (user: OrganizationUser) => boolean,
): OrganizationTreeItem[] {
  return nodes
    .map(node => ({
      ...node,
      children: filterOrganizationTree(node.children, predicate),
      users: node.users.filter(predicate),
    }))
    .filter(node => node.children.length || node.users.length)
}

getUserList()

/**
 * 关闭弹窗。
 */
function closeDialog() {
  visible.value = false
}

/**
 * 确认当前选择的题目。
 * 未选择题目时给出提示，否则将结果回传给父组件。
 */
function confirmSelectQuestions() {
  if (!selectedOrganizationTree.value.length) {
    ElNotification.warning('请先选择用户')

    return
  }

  console.log('🚀 ~ file: index.vue:157 ~ selectedOrganizationTree.value:', selectedOrganizationTree.value)

  emit('confirm', selectedOrganizationTree.value)

  visible.value = false
}

</script>

<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="分配用户"
    width="72%"
    destroy-on-close
  >
    <div
      class="flex h-[min(640px,calc(100vh-200px))] min-h-0 gap-5"
    >
      <section
        class="flex min-w-0 flex-1 flex-col rounded border border-info p-4"
      >
        <div
          class="mb-4 font-600"
        >
          待选
        </div>

        <el-input
          placeholder="搜索部门或用户"
          clearable
          class="mb-3"
        />

        <div
          class="min-h-0 flex-1 overflow-auto"
        >
          <el-tree
            ref="treeRef"
            :data="availableDepartmentTree"
            :props="treeProps"
            node-key="id"
            show-checkbox
            default-expand-all
            :expand-on-click-node="false"
            :indent="40"
          >
            <template
              #default="{ data }"
            >
              <span
                class="flex items-center gap-2"
              >
                <el-icon
                  v-if="data.children?.length"
                >
                  <FolderOpened />
                </el-icon>

                <el-icon
                  v-else
                >
                  <User />
                </el-icon>

                <span>{{ data.name }}</span>

                <span
                  v-if="data.type === 'user'"
                  class="text-12px "
                >{{ data.account }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </section>

      <div
        class="flex items-center"
      >
        <el-button
          type="primary"
          @click="addUsers"
        >
          添加 <el-icon
            class="ml-1"
          >
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>

      <section
        class="flex min-w-0 flex-1 flex-col rounded border border-info p-4"
      >
        <div
          class="mb-4 font-600"
        >
          已选（{{ selectedUsers.length }}）
        </div>

        <div
          class="min-h-0 flex-1 overflow-auto"
        >
          <el-empty
            v-if="!selectedUsers.length"
            description="暂未选择用户"
            :image-size="72"
          />

          <el-tree
            v-else
            :data="selectedDepartmentTree"
            :props="treeProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :indent="40"
          >
            <template
              #default="{ data }"
            >
              <span
                class="flex w-full items-center gap-2"
              >
                <el-icon
                  v-if="data.children?.length"
                ><FolderOpened /></el-icon>

                <el-avatar
                  v-else
                  :size="24"
                >{{ data.name.slice(0, 1) }}</el-avatar>

                <span>{{ data.name }}</span>

                <span
                  v-if="data.type === 'user'"
                  class="text-12px "
                >
                  {{ data.account }}
                </span>

                <el-button
                  class="ml-auto"
                  link
                  type="danger"
                  @click.stop="data.children?.length ? removeDepartment(data) : removeUser(data.userId)"
                >
                  移除
                </el-button>
              </span>
            </template>
          </el-tree>
        </div>
      </section>
    </div>

    <template
      #footer
    >
      <div
        class="flex items-center justify-end gap-3"
      >
        <el-button
          @click="closeDialog"
        >
          取消
        </el-button>

        <ArtButton
          type="primary"
          @click="confirmSelectQuestions"
        >
          添加所选题目
        </ArtButton>
      </div>
    </template>
  </el-dialog>
</template>

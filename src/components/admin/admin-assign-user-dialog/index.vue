<script lang="ts" setup>
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

getUserList()
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
  </el-dialog>
</template>

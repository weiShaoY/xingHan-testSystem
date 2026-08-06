<script lang="ts" setup>
import {
  ArrowRight,
  FolderOpened,
  User,
} from '@element-plus/icons-vue'

/**
 * 弹窗确认事件。
 * 返回当前勾选的组织树。
 */
const emit = defineEmits<{
  confirm: [organizationTree: AdminApi.Organization.OrganizationTreeWithAllUsersResponse]
}>()

/** 控制分配用户弹窗的显示状态。 */
const visible = defineModel<boolean>({
  default: false,
})

/** 分配用户接口返回的组织树节点类型。 */
type OrganizationTreeItem = AdminApi.Organization.OrganizationTreeItem

/** 分配用户接口返回的完整组织树类型。 */
type OrganizationTree = AdminApi.Organization.OrganizationTreeWithAllUsersResponse

/** 分配用户接口返回的用户节点类型。 */
type OrganizationUser = AdminApi.Organization.UserNode

/** 接口返回的原始组织树，用于保存和回显。 */
const organizationTree = ref<OrganizationTree>([])

/** 完整组织树中的所有用户。 */
const users = computed(() => getUsers(organizationTree.value))

/** 当前已选用户的 ID 集合。 */
const selectedUserIds = ref<number[]>([])

/** 待选区域当前勾选、尚未添加的用户 ID 集合。 */
const pendingUserIds = ref<number[]>([])

/** 当前已选用户的完整信息。 */
const selectedUsers = computed(() => users.value.filter(user => selectedUserIds.value.includes(user.userId)))

/** 过滤掉已选用户后，在待选区域展示的组织树。 */
const availableDepartmentTree = computed<OrganizationTree>(() => filterOrganizationTree(
  organizationTree.value,
  user => !selectedUserIds.value.includes(user.userId),
))

/** 仅保留已选用户后，在已选区域展示的组织树。 */
const selectedDepartmentTree = computed<OrganizationTree>(() => filterOrganizationTree(
  organizationTree.value,
  user => selectedUserIds.value.includes(user.userId),
))

/** 保持接口数据结构的已选组织树，可直接用于保存。 */
const selectedOrganizationTree = computed<OrganizationTree>(() => filterOrganizationTree(
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
  selectedUserIds.value = Array.from(new Set([
    ...selectedUserIds.value,
    ...pendingUserIds.value,
  ]))
  pendingUserIds.value = []
}

/** 从已选列表中移除指定用户。 */
function removeUser(userId: number) {
  selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId)
}

/** 更新待添加的用户勾选状态。 */
function togglePendingUser(userId: number, checked: boolean) {
  pendingUserIds.value = checked
    ? Array.from(new Set([...pendingUserIds.value, userId]))
    : pendingUserIds.value.filter(id => id !== userId)
}

/** 从已选列表中移除指定组织及其所有后代组织的用户。 */
function removeDepartment(department: OrganizationTreeItem) {
  const departmentUserIds = getUsers([department]).map(user => user.userId)

  selectedUserIds.value = selectedUserIds.value.filter(id => !departmentUserIds.includes(id))
}

/** 获取接口组织树。 */
async function getOrganizationTree() {
  const res = await fetchAdminGetOrganizationTreeWithAllUsers()

  organizationTree.value = res
}

/** 从任意层级的树节点中递归获取全部用户。 */
function getUsers(nodes: OrganizationTreeItem[]): OrganizationUser[] {
  return nodes.flatMap(node => [...node.users, ...getUsers(node.children)])
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

getOrganizationTree()

/**
 * 关闭弹窗。
 */
function closeDialog() {
  visible.value = false
}

/**
 * 确认当前选择的用户。
 * 未选择用户时给出提示，否则将结果回传给父组件。
 */
function confirmSelectQuestions() {
  if (!selectedOrganizationTree.value.length) {
    ElNotification.warning('请先选择用户')

    return
  }

  console.log('🚀 ~ file: index.vue:157 ~ selectedOrganizationTree.value:', selectedOrganizationTree.value)

  emit('confirm', selectedOrganizationTree.value)

  // visible.value = false
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
            class="assign-user-tree"
            :data="availableDepartmentTree"
            :props="treeProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :indent="40"
          >
            <template
              #default="{ data }"
            >
              <div
                class="tree-node"
              >
                <div
                  class="flex items-center gap-2"
                >
                  <el-icon>
                    <FolderOpened />
                  </el-icon>

                  <span>{{ data.name }}</span>

                  <span
                    class="text-12px"
                  >（{{ data.users.length }}）</span>
                </div>

                <div
                  v-if="data.users.length"
                  class="ml-7 mt-2 flex flex-col gap-2"
                  @click.stop
                >
                  <el-checkbox
                    v-for="user in data.users"
                    :key="user.userId"
                    :model-value="pendingUserIds.includes(user.userId)"
                    @update:model-value="togglePendingUser(user.userId, $event === true)"
                  >
                    <el-icon
                      class="mr-1"
                    >
                      <User />
                    </el-icon>
                    {{ user.userName }}
                    <span
                      class="ml-2 text-12px"
                    >{{ user.userAccount }}</span>
                  </el-checkbox>
                </div>
              </div>
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
            class="assign-user-tree"
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
              <div
                class="tree-node"
              >
                <div
                  class="flex w-full items-center gap-2"
                >
                  <el-icon>
                    <FolderOpened />
                  </el-icon>

                  <span>{{ data.name }}</span>

                  <el-button
                    class="ml-auto"
                    link
                    type="danger"
                    @click.stop="removeDepartment(data)"
                  >
                    移除
                  </el-button>
                </div>

                <div
                  v-if="data.users.length"
                  class="ml-7 mt-2 flex flex-col gap-2"
                >
                  <div
                    v-for="user in data.users"
                    :key="user.userId"
                    class="flex items-center gap-2"
                  >
                    <el-avatar
                      :size="24"
                    >
                      {{ user.userName.slice(0, 1) }}
                    </el-avatar>

                    <span>{{ user.userName }}</span>

                    <span
                      class="text-12px"
                    >{{ user.userAccount }}</span>

                    <el-button
                      class="ml-auto"
                      link
                      type="danger"
                      @click.stop="removeUser(user.userId)"
                    >
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
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
          :disabled="!selectedOrganizationTree.length"
          @click="confirmSelectQuestions"
        >
          添加所选题目
        </ArtButton>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.assign-user-tree :deep(.el-tree-node__content) {
  height: auto;
  min-height: 32px;
  align-items: flex-start;
}

.assign-user-tree :deep(.el-tree-node__expand-icon) {
  margin-top: 8px;
}

.tree-node {
  min-width: 0;
  flex: 1;
  padding: 4px 0;
}
</style>

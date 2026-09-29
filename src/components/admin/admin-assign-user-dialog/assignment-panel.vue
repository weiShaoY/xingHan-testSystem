<script lang="ts" setup>
import {
  ArrowRight,
  FolderOpened,
  Search,
  User,
} from '@element-plus/icons-vue'

import {
  fetchAdminAssignmentCreateAssignment,
  fetchAdminGetOrganizationTreeWithAllUsersCustomer,
  fetchAdminGetOrganizationTreeWithAllUsersJotun,
  fetchAdminGetPartialOrganizationTreeCustomer,
  fetchAdminGetPartialOrganizationTreeJotun,
} from '@/apis/admin/organization'

const props = defineProps<{

  /** 分配目标类型。 */
  type: 'course' | 'project'

  /** 用户分类，决定组织树和回显接口。 */
  category: 'customer' | 'jotun'

  /** 课程或项目 ID。 */
  id: number

  /** 课程或项目名称。 */
  name: string
}>()

const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)

const saving = ref(false)

const loadFailed = ref(false)

/** 两类用户共用选择和保存逻辑，仅查询接口不同。 */
const organizationApis = {
  customer: {
    getTree: fetchAdminGetOrganizationTreeWithAllUsersCustomer,
    getAssignedTree: fetchAdminGetPartialOrganizationTreeCustomer,
  },
  jotun: {
    getTree: fetchAdminGetOrganizationTreeWithAllUsersJotun,
    getAssignedTree: fetchAdminGetPartialOrganizationTreeJotun,
  },
}

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

/** 待选组织树搜索关键字。 */
const keyword = ref('')

/** 当前已选用户的完整信息。 */
const selectedUsers = computed(() => users.value.filter(user => selectedUserIds.value.includes(user.userId)))

/** 过滤掉已选用户后，在待选区域展示的组织树。 */
const availableDepartmentTree = computed<OrganizationTree>(() => filterOrganizationTree(
  organizationTree.value,
  user => !selectedUserIds.value.includes(user.userId) && matchesKeyword(user),
))

/** 仅保留已选用户后，在已选区域展示的组织树。 */
const selectedDepartmentTree = computed<OrganizationTree>(() => filterOrganizationTree(
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

/** 获取文件夹下当前可选的用户。 */
function getDepartmentUsers(department: OrganizationTreeItem) {
  return getUsers([department])
}

/** 获取文件夹复选框状态。 */
function getDepartmentCheckedState(department: OrganizationTreeItem) {
  const userIds = getDepartmentUsers(department).map(user => user.userId)

  return userIds.length > 0 && userIds.every(userId => pendingUserIds.value.includes(userId))
}

/** 获取文件夹复选框半选状态。 */
function getDepartmentIndeterminateState(department: OrganizationTreeItem) {
  const userIds = getDepartmentUsers(department).map(user => user.userId)

  const selectedCount = userIds.filter(userId => pendingUserIds.value.includes(userId)).length

  return selectedCount > 0 && selectedCount < userIds.length
}

/** 切换文件夹下所有用户的待选状态。 */
function toggleDepartmentUsers(department: OrganizationTreeItem, checked: boolean) {
  const userIds = getDepartmentUsers(department).map(user => user.userId)

  pendingUserIds.value = checked
    ? Array.from(new Set([...pendingUserIds.value, ...userIds]))
    : pendingUserIds.value.filter(userId => !userIds.includes(userId))
}

/** 从已选列表中移除指定组织及其所有后代组织的用户。 */
function removeDepartment(department: OrganizationTreeItem) {
  const departmentUserIds = getUsers([department]).map(user => user.userId)

  selectedUserIds.value = selectedUserIds.value.filter(id => !departmentUserIds.includes(id))
}

/** 从任意层级的树节点中递归获取全部用户。 */
function getUsers(nodes: OrganizationTreeItem[]): OrganizationUser[] {
  return nodes.flatMap(node => [...node.users, ...getUsers(node.children)])
}

/** 判断用户信息是否符合待选区搜索关键字。 */
function matchesKeyword(user: OrganizationUser) {
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return !normalizedKeyword
    || user.userName.toLowerCase().includes(normalizedKeyword)
    || user.userAccount.toLowerCase().includes(normalizedKeyword)
}

/**
 * 按用户条件筛选接口原始组织树，并保留包含匹配用户的组织节点。
 * 保留查询接口的组织树结构，用于回显和保存。
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

/** 用于忽略过期请求和弹窗关闭后的响应。 */
let loadVersion = 0

/** 加载当前分类的完整组织树和已分配用户。 */
async function loadOrganizationTree() {
  const version = ++loadVersion

  const api = organizationApis[props.category]

  loading.value = true
  loadFailed.value = false
  organizationTree.value = []
  selectedUserIds.value = []
  pendingUserIds.value = []
  keyword.value = ''

  try {
    const [tree, assignedTree] = await Promise.all([
      api.getTree(),
      api.getAssignedTree({
        targetId: props.id,
        targetType: props.type === 'project' ? 1 : 2,
      }),
    ])

    if (version !== loadVersion) { return }

    organizationTree.value = tree
    console.log('🚀 ~ file: assignment-panel.vue:219 ~ organizationTree.value:', organizationTree.value)
    selectedUserIds.value = getUsers(assignedTree).map(user => user.userId)
  }
  catch {
    if (version !== loadVersion) { return }

    loadFailed.value = true
    ElNotification.error('获取组织架构或已分配用户失败，请重试')
  }
  finally {
    if (version === loadVersion) { loading.value = false }
  }
}

/** 保存当前分类的已选用户。 */
async function confirmSelectUsers() {
  if (loading.value || saving.value || loadFailed.value) { return }

  if (!selectedDepartmentTree.value.length) {
    ElNotification.warning('请先选择用户')

    return
  }

  const version = loadVersion

  saving.value = true

  try {
    await fetchAdminAssignmentCreateAssignment({
      targetId: props.id,
      targetName: props.name,
      targetType: props.type === 'project' ? 1 : 2,
      targetAudience: props.category === 'jotun' ? 0 : 1,
      recipients: selectedDepartmentTree.value,
    })

    if (version !== loadVersion) { return }

    ElNotification.success('分配成功')
    emit('close')
  }
  catch {
    if (version === loadVersion) { ElNotification.error('分配失败') }
  }
  finally {
    saving.value = false
  }
}

watch(
  () => [props.category, props.id, props.type],
  loadOrganizationTree,
  {
    immediate: true,
  },
)

onScopeDispose(() => {
  loadVersion++
})
</script>

<template>
  <el-alert
    v-if="loadFailed"
    title="获取用户失败，请重试"
    type="error"
    :closable="false"
    class="mb-4"
  >
    <el-button
      link
      type="primary"
      @click="loadOrganizationTree"
    >
      重新加载
    </el-button>
  </el-alert>

  <div
    v-loading="loading || saving"
    class="assign-user-layout"
  >
    <section
      class="assign-user-panel"
    >
      <div
        class="mb-4 flex items-center justify-between"
      >
        <div>
          <div
            class="font-600 text-g-900"
          >
            待选用户
          </div>

          <div
            class="mt-1 text-xs text-g-500"
          >
            按部门或人员选择
          </div>
        </div>

        <span
          class="assign-user-count"
        >{{ pendingUserIds.length }}</span>
      </div>

      <el-input
        v-model="keyword"
        placeholder="搜索用户姓名或账号"
        clearable
        class="mb-4"
      >
        <template
          #prefix
        >
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <div
        class="assign-user-scroll"
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
              class="tree-node tree-node-available"
            >
              <div
                class="flex items-center gap-2"
                @click.stop
              >
                <el-checkbox
                  :model-value="getDepartmentCheckedState(data)"
                  :indeterminate="getDepartmentIndeterminateState(data)"
                  @update:model-value="toggleDepartmentUsers(data, $event === true)"
                />

                <el-icon>
                  <FolderOpened />
                </el-icon>

                <span
                  class="truncate font-500"
                >{{ data.name }}</span>

                <span
                  class="text-12px"
                >{{ getDepartmentUsers(data).length }}</span>
              </div>

              <div
                v-if="data.users.length"
                class="ml-7 mt-2 flex flex-col gap-1"
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

                  <span
                    class="font-500"
                  >{{ user.userName }}</span>

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
      class="assign-user-transfer"
    >
      <el-button
        type="primary"
        circle
        :disabled="!pendingUserIds.length"
        title="添加所选用户"
        @click="addUsers"
      >
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>

    <section
      class="assign-user-panel assign-user-panel-selected"
    >
      <div
        class="mb-4 flex items-center justify-between"
      >
        <div>
          <div
            class="font-600 text-g-900"
          >
            已选用户
          </div>

          <div
            class="mt-1 text-xs text-g-500"
          >
            保存后将获得访问权限
          </div>
        </div>

        <span
          class="assign-user-count assign-user-count-selected"
        >{{ selectedUsers.length }}</span>
      </div>

      <div
        class="assign-user-scroll"
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
              class="tree-node tree-node-selected"
            >
              <div
                class="flex w-full items-center gap-2"
              >
                <el-icon>
                  <FolderOpened />
                </el-icon>

                <span
                  class="truncate font-500"
                >{{ data.name }}</span>

                <el-button
                  class="ml-auto mr-2"
                  link
                  type="danger"
                  @click.stop="removeDepartment(data)"
                >
                  移除
                </el-button>
              </div>

              <div
                v-if="data.users.length"
                class="ml-7 mt-2 flex flex-col gap-1"
              >
                <div
                  v-for="user in data.users"
                  :key="user.userId"
                  class="selected-user-row"
                >
                  <el-avatar
                    :size="24"
                  >
                    {{ user.userName.slice(0, 1) }}
                  </el-avatar>

                  <span
                    class="font-500"
                  >{{ user.userName }}</span>

                  <span
                    class="text-12px"
                  >{{ user.userAccount }}</span>

                  <el-button
                    class="ml-auto mr-2"
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

  <div
    class="mt-4 flex items-center justify-end gap-3"
  >
    <el-button
      @click="emit('close')"
    >
      取消
    </el-button>

    <ArtButton
      type="primary"
      :loading="saving"
      :disabled="loading || saving || loadFailed || !selectedDepartmentTree.length"
      @click="confirmSelectUsers"
    >
      保存分配
    </ArtButton>
  </div>
</template>

<style scoped>
.assign-user-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr);
  height: min(640px, calc(100vh - 200px));
  min-height: 0;
  gap: 20px;
}

.assign-user-panel {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-fill-color-blank);
  overflow: hidden;
}

.assign-user-panel-selected {
  border-color: var(--el-color-primary-light-7);
  background: var(--el-color-primary-light-9);
}

.assign-user-count {
  display: grid;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  place-items: center;
  border-radius: 13px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.assign-user-count-selected {
  background: var(--el-color-primary);
  color: #fff;
}

.assign-user-scroll {
  min-height: 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;
}

.assign-user-transfer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.assign-user-tree :deep(.el-tree-node__content) {
  height: auto;
  min-height: 36px;
  align-items: flex-start;
  border-radius: 6px;
}

.assign-user-tree :deep(.el-tree-node__expand-icon) {
  margin-top: 10px;
}

.tree-node {
  min-width: 0;
  flex: 1;
  padding: 4px;
}

.tree-node-available:hover,
.tree-node-selected:hover {
  border-radius: 6px;
  background: var(--el-fill-color-light);
}

.selected-user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 2px 4px;
}

@media (max-width: 640px) {
  .assign-user-layout {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 44px minmax(0, 1fr);
    height: min(680px, calc(100vh - 180px));
  }

  .assign-user-panel {
    min-height: 0;
  }

  .assign-user-transfer {
    height: 44px;
  }

  .assign-user-transfer :deep(.el-button) {
    transform: rotate(90deg);
  }
}
</style>

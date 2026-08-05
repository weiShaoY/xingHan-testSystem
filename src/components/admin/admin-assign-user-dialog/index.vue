<script lang="ts" setup>
const visible = defineModel<boolean>({
  default: false,
})

type UserNode = {
  id: number
  name: string
  account: string
  type: 'user'
}

type DepartmentNode = {
  id: number
  name: string
  type: 'department'
  children: UserNode[]
}

const treeRef = ref()

const departmentTree: DepartmentNode[] = [
  {
    id: 1,
    name: '研发中心',
    type: 'department',
    children: [
      {
        id: 101,
        name: '张三',
        account: 'zhangsan',
        type: 'user',
      },
      {
        id: 102,
        name: '李四',
        account: 'lisi',
        type: 'user',
      },
      {
        id: 103,
        name: '王五',
        account: 'wangwu',
        type: 'user',
      },
    ],
  },
  {
    id: 2,
    name: '市场部',
    type: 'department',
    children: [
      {
        id: 201,
        name: '赵六',
        account: 'zhaoliu',
        type: 'user',
      },
      {
        id: 202,
        name: '钱七',
        account: 'qianqi',
        type: 'user',
      },
    ],
  },
  {
    id: 3,
    name: '人力资源部',
    type: 'department',
    children: [
      {
        id: 301,
        name: '孙八',
        account: 'sunba',
        type: 'user',
      },
      {
        id: 302,
        name: '周九',
        account: 'zhoujiu',
        type: 'user',
      },
    ],
  },
]

const users = departmentTree.flatMap(department => department.children)

const selectedUserIds = ref<number[]>([102])

const selectedUsers = computed(() => users.filter(user => selectedUserIds.value.includes(user.id)))

const availableDepartmentTree = computed(() => departmentTree
  .map(department => ({
    ...department,
    children: department.children.filter(user => !selectedUserIds.value.includes(user.id)),
  }))
  .filter(department => department.children.length))

const selectedDepartmentTree = computed(() => departmentTree
  .map(department => ({
    ...department,
    children: department.children.filter(user => selectedUserIds.value.includes(user.id)),
  }))
  .filter(department => department.children.length))

const treeProps = {
  children: 'children',
  label: 'name',
}

function addUsers() {
  const checkedUsers = (treeRef.value?.getCheckedNodes(false, true) ?? [])
    .filter((node: DepartmentNode | UserNode): node is UserNode => node.type === 'user')

  selectedUserIds.value = Array.from(new Set([
    ...selectedUserIds.value,
    ...checkedUsers.map(user => user.id),
  ]))
}

function removeUser(userId: number) {
  selectedUserIds.value = selectedUserIds.value.filter(id => id !== userId)
}

function removeDepartment(department: DepartmentNode) {
  const departmentUserIds = department.children.map(user => user.id)

  selectedUserIds.value = selectedUserIds.value.filter(id => !departmentUserIds.includes(id))
}

async function getUserList() {
  const res = await fetchAdminGetOrganizationTreeWithAllUsers()

  console.log('🚀 ~ file: index.vue:135 ~ res:', res)
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
      class="flex min-h-95 gap-5"
    >
      <section
        class="flex-1 overflow-auto rounded border border-info p-4"
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
                v-if="data.type === 'department'"
              ><FolderOpened /></el-icon>

              <el-icon
                v-else
              ><User /></el-icon>

              <span>{{ data.name }}</span>

              <span
                v-if="data.type === 'user'"
                class="text-12px "
              >{{ data.account }}</span>
            </span>
          </template>
        </el-tree>
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
        class="flex-1 overflow-auto rounded border border-info p-4"
      >
        <div
          class="mb-4 font-600"
        >
          已选（{{ selectedUsers.length }}）
        </div>

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
                v-if="data.type === 'department'"
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
                @click.stop="data.type === 'department' ? removeDepartment(data) : removeUser(data.id)"
              >
                移除
              </el-button>
            </span>
          </template>
        </el-tree>
      </section>
    </div>
  </el-dialog>
</template>

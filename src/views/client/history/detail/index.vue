<!------  2026-06-03---12:49---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
type CatalogItem = {
  id: number
  title: string
  type: 'file' | 'exam'
  label: string
  likes?: number
  participants: number
  questions?: number
  done: boolean
}

type CatalogSection = {
  id: number
  title: string
  done: boolean
  expanded: boolean
  children: CatalogItem[]
}

const keyword = ref('')

const isDesc = ref(false)

const sections = ref<CatalogSection[]>([
  {
    id: 1,
    title: '11',
    done: true,
    expanded: true,
    children: [
      {
        id: 3,
        title: '3. PackagePart.xlsx',
        type: 'file',
        label: 'tst',
        likes: 1,
        participants: 2,
        done: true,
      },
      {
        id: 4,
        title: '4. test 2',
        type: 'exam',
        label: '考试',
        participants: 2,
        questions: 2,
        done: false,
      },
    ],
  },
  {
    id: 2,
    title: '22',
    done: false,
    expanded: false,
    children: [],
  },
])

const sectionTotal = computed(() => sections.value.length)

const sortedSections = computed(() => {
  const list = [...sections.value]

  return isDesc.value
    ? list.reverse()
    : list
})

const filteredSections = computed(() => {
  const value = keyword.value.trim().toLowerCase()

  if (!value) {
    return sortedSections.value
  }

  return sortedSections.value
    .map((section) => {
      const sectionMatched = section.title.toLowerCase().includes(value)

      const children = section.children.filter((item) => {
        return item.title.toLowerCase().includes(value) || item.label.toLowerCase().includes(value)
      })

      if (!sectionMatched && !children.length) {
        return null
      }

      return {
        ...section,
        expanded: true,
        children: sectionMatched
          ? section.children
          : children,
      }
    })
    .filter((section): section is CatalogSection => Boolean(section))
})

/**
 * 切换章节展开状态
 * @param section 章节
 */
function toggleSection(section: CatalogSection) {
  const target = sections.value.find(item => item.id === section.id)

  if (target) {
    target.expanded = !target.expanded
  }
}

function toggleSort() {
  isDesc.value = !isDesc.value
}
</script>

<template>
  <div
    class="mb-10 flex flex-col"
  >
    <ClientPageHeader
      title="课程详情"
    />

    <section
      class="art-card course-catalog p-0"
    >
      <div
        class="flex items-center justify-between gap-4 border-b border-(--art-card-border) px-5 py-4 max-sm:flex-col max-sm:items-stretch max-sm:px-4"
      >
        <div
          class="min-w-0"
        >
          <h2
            class="m-0 text-xl text-g-900 font-semibold leading-8"
          >
            目录（{{ sectionTotal }}）
          </h2>

          <p
            class="mt-1 mb-0 text-sm text-g-600"
          >
            已完成 2 个内容
          </p>
        </div>

        <div
          class="flex min-w-0 flex-1 items-center justify-end gap-3 max-sm:w-full"
        >
          <el-input
            v-model="keyword"
            placeholder="搜索小节"
            clearable
            class="max-w-110 flex-1"
          >
            <template
              #prefix
            >
              <ArtSvgIcon
                icon="ri:search-line"
              />
            </template>
          </el-input>

          <button
            type="button"
            class="h-8 shrink-0 flex items-center gap-1 border-0 bg-transparent px-0 text-sm text-g-700 font-500 cursor-pointer hover:text-primary"
            @click="toggleSort"
          >
            <ArtSvgIcon
              :icon="isDesc ? 'ri:sort-desc' : 'ri:sort-asc'"
              class="text-lg"
            />

            <span>{{ isDesc ? '倒序' : '正序' }}</span>
          </button>
        </div>
      </div>

      <div
        class="px-5 max-sm:px-4"
      >
        <template
          v-for="section in filteredSections"
          :key="section.id"
        >
          <div
            class="catalog-row section-row"
          >
            <div
              class="status-line"
            >
              <span
                class="status-dot"
                :class="{ 'is-done': section.done }"
              >
                <ArtSvgIcon
                  icon="ri:check-line"
                />
              </span>
            </div>

            <button
              type="button"
              class="min-w-0 flex flex-1 items-center justify-between gap-4 border-0 bg-transparent py-5 pl-0 pr-1 text-left cursor-pointer"
              @click="toggleSection(section)"
            >
              <div
                class="min-w-0 flex items-center gap-5"
              >
                <h3
                  class="m-0 truncate text-lg text-g-900 font-500"
                >
                  {{ section.title }}
                </h3>

                <span
                  class="shrink-0 text-base text-g-800"
                >
                  （{{ section.children.length }} 个小节）
                </span>
              </div>

              <ArtSvgIcon
                icon="ri:arrow-down-s-line"
                class="shrink-0 text-2xl text-g-500 transition"
                :class="{ 'rotate-180': !section.expanded }"
              />
            </button>
          </div>

          <div
            v-show="section.expanded"
          >
            <div
              v-for="item in section.children"
              :key="item.id"
              class="catalog-row item-row"
            >
              <div
                class="status-line"
              >
                <span
                  class="status-dot"
                  :class="{ 'is-done': item.done, 'is-current': !item.done }"
                >
                  <ArtSvgIcon
                    :icon="item.done ? 'ri:check-line' : 'ri:book-open-line'"
                  />
                </span>
              </div>

              <div
                class="flex min-w-0 flex-1 items-center gap-5 py-5 max-sm:gap-3"
              >
                <div
                  class="resource-badge"
                  :class="`is-${item.type}`"
                >
                  <ArtSvgIcon
                    :icon="item.type === 'file' ? 'ri:file-list-3-line' : 'ri:survey-line'"
                    class="text-2xl"
                  />
                </div>

                <div
                  class="min-w-0 flex-1"
                >
                  <h4
                    class="m-0 truncate text-lg text-g-900 font-500 leading-7"
                  >
                    {{ item.title }}
                  </h4>

                  <div
                    class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-g-600"
                  >
                    <span>{{ item.label }}</span>

                    <span
                      v-if="item.likes"
                      class="inline-flex items-center gap-1"
                    >
                      <ArtSvgIcon
                        icon="ri:thumb-up-fill"
                      />

                      {{ item.likes }}
                    </span>

                    <span
                      class="inline-flex items-center gap-1"
                    >
                      <ArtSvgIcon
                        icon="ri:user-fill"
                      />

                      {{ item.participants }}人参与
                    </span>

                    <span
                      v-if="item.questions"
                      class="inline-flex items-center gap-1"
                    >
                      <ArtSvgIcon
                        icon="ri:question-fill"
                      />

                      {{ item.questions }}个问题
                    </span>
                  </div>
                </div>

                <el-dropdown
                  trigger="click"
                >
                  <button
                    type="button"
                    class="size-8 flex items-center justify-center border-0 rounded bg-transparent text-g-500 cursor-pointer hover:bg-g-100 hover:text-primary"
                  >
                    <ArtSvgIcon
                      icon="ri:more-2-fill"
                      class="text-xl"
                    />
                  </button>

                  <template
                    #dropdown
                  >
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        查看详情
                      </el-dropdown-item>

                      <el-dropdown-item>
                        标记完成
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </template>

        <el-empty
          v-if="!filteredSections.length"
          description="暂无匹配的小节"
          :image-size="120"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.course-catalog {
  overflow: hidden;
}

.catalog-row {
  display: flex;
  min-height: 88px;

  & + & {
    border-top: 1px solid var(--art-card-border);
  }
}

.section-row {
  min-height: 84px;
}

.item-row {
  min-height: 104px;
}

.status-line {
  position: relative;
  width: 52px;
  flex: 0 0 52px;

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 18px;
    width: 1px;
    content: '';
    background: var(--art-card-border);
  }
}

.status-dot {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: var(--art-gray-500);
  background: var(--default-box-color);
  border: 2px solid var(--art-card-border);
  border-radius: 50%;
  transform: translateY(-50%);

  &.is-done {
    color: #fff;
    background: var(--el-color-success);
    border-color: var(--el-color-success);
  }

  &.is-current {
    color: var(--el-color-success);
    border-color: var(--el-color-success);
  }
}

.resource-badge {
  display: flex;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 6px;

  &.is-file {
    background: #f7b731;
  }

  &.is-exam {
    background: #6f42c1;
  }
}
</style>

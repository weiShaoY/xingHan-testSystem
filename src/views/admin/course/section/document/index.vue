<!------  2026-04-16---20:42---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'

/**
 * 文档表单数据
 */
const documentForm = ref({
  name: 'proxy.txt',
  description: '',
  tags: '',
  requiredType: 'required',
  scoreMultiplier: 1,
  sectionTypeTag: '',
  minStudyTimeEnabled: false,
  minStudyTime: '',
  maxStudyTimeEnabled: false,
  maxStudyTime: '',
  allowDownload: false,
  completionCondition: 'open',
  showCreatorInfo: true,
  commentEnabled: true,
  showCommentSubmitTime: true,
  includeKeywords: '',
  excludeKeywords: '',
})

/**
 * 是否展开高级设置
 */
const isAdvancedExpanded = ref(true)

/**
 * 小节基本分
 */
const baseScore = 10

/**
 * 小节积分
 */
const sectionScore = computed(() => {
  return baseScore * Number(documentForm.value.scoreMultiplier || 0)
})

/**
 * 文档信息
 */
const documentInfo = {
  uploadTime: '2026-04-16 15:19',
  size: '578KB',
}

/**
 * 预览内容
 */
const previewLines = [
  'accessibility_permission',
  'accounts.google.com',
  'android.googleapis.com',
  'api.github.com',
  'appleid.apple.com',
  'cdn.jsdelivr.net',
  'chat.openai.com',
  'docs.google.com',
  'fonts.googleapis.com',
  'github.com',
  'localhost',
  'npmjs.com',
  'registry.npmjs.org',
  'stackoverflow.com',
  'vitejs.dev',
  'vuejs.org',
]

/**
 * 富文本工具栏图标
 */
const editorTools = [
  'ri:font-size',
  'ri:font-color',
  'ri:bold',
  'ri:list-ordered',
  'ri:list-unordered',
  'ri:align-left',
  'ri:align-center',
  'ri:link',
  'ri:image-line',
  'ri:subtract-line',
]

/**
 * 提交文档小节
 */
function handleSubmit() {
  console.log('文档小节表单:', {
    ...documentForm.value,
    ...documentInfo,
  })
}

/**
 * 更换文档
 */
function replaceDocument() {
  console.log('更换文档')
}

/**
 * 切换高级设置展开状态
 */
function toggleAdvancedSettings() {
  isAdvancedExpanded.value = !isAdvancedExpanded.value
}
</script>

<template>
  <div
    class="mb-10 flex flex-col gap-4 "
  >
    <AdminPageHeader
      title="添加文档"
    >
      <template
        #extra
      >
        <el-button
          class="flex items-center justify-center"
        >
          完成
        </el-button>
      </template>
    </AdminPageHeader>

    <!-- // 文件 或者 视频 -->
    <div
      class="mx-auto w-full max-w-3xl"
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon
          class="el-icon--upload"
        >
          <UploadFilled />
        </el-icon>

        <div
          class="el-upload__text"
        >
          上传文档
        </div>

        <div
          class="el-upload__text"
        >
          将文件拖到此处，或<em>点击上传</em>
        </div>

        <template
          #tip
        >
          <div
            class="el-upload__tip mt-4 space-y-2 text-left text-sm leading-relaxed text-g-600"
          >
            <p>
              1. 点击上方图标，选取转码、审核完成的文档；
            </p>

            <p>
              文档支持 ppt、pptx、xls、xlsx、doc、docx、pdf、xlsm、txt 格式。
            </p>

            <p>
              3. 文件大小须在 100MB 以内，如需上传 100MB 以上的文件，请联系 support@umu.com；
            </p>

            <p>
              4. 选择文档上传，代表您已同意
              <a
                href="javascript:void(0)"
                class="text-primary"
              >
                用户使用条款
              </a>。
            </p>
          </div>
        </template>
      </el-upload>

    </div>

    <div
      class="art-card"
    >
      <div
        class="grid grid-cols-[260px_minmax(0,1fr)] gap-10 max-lg:grid-cols-1"
      >
        <!-- 文档预览与信息 -->
        <aside
          class="flex flex-col gap-6"
        >
          <div
            class="h-72 overflow-hidden rounded-lg border border-(--art-card-border) bg-(--art-gray-100) p-4"
          >
            <div
              class="space-y-1 text-[10px] leading-tight text-g-500"
            >
              <div
                v-for="line in previewLines"
                :key="line"
                class="truncate"
              >
                {{ line }}
              </div>
            </div>
          </div>

          <div
            class="space-y-4 text-sm text-g-600"
          >
            <div
              class="text-lg font-semibold text-g-900"
            >
              文档信息
            </div>

            <div>
              <div>
                文档名称
              </div>

              <div>
                {{ documentForm.name }}
              </div>
            </div>

            <div>
              <div>
                上传时间：
              </div>

              <div>
                {{ documentInfo.uploadTime }}
              </div>
            </div>

            <div>
              <div>
                文档大小
              </div>

              <div>
                {{ documentInfo.size }}
              </div>
            </div>
          </div>
        </aside>

        <!-- 文档表单 -->
        <el-form
          :model="documentForm"
          label-position="top"
          class="min-w-0"
        >
          <el-form-item
            label="文档名称"
            required
          >
            <el-input
              v-model="documentForm.name"
              placeholder="请输入文档名称"
            />
          </el-form-item>

          <div
            class="mb-6 border border-(--art-card-border)"
          >
            <button
              type="button"
              class="flex h-14 w-full items-center gap-4 px-5 text-primary"
              @click="toggleAdvancedSettings"
            >
              <ArtSvgIcon
                :icon="isAdvancedExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                class="text-7"
              />

              <span
                class="text-base"
              >高级设置</span>
            </button>

            <div
              v-if="isAdvancedExpanded"
              class="border-t border-(--art-card-border) px-8 py-8 max-sm:px-4"
            >
              <div
                class="flex flex-col gap-7"
              >
                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>是否必修</span>

                    <el-tooltip
                      content="设置学员是否必须完成该文档"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <el-radio-group
                    v-model="documentForm.requiredType"
                    class="flex flex-wrap gap-x-10 gap-y-2"
                  >
                    <el-radio
                      value="required"
                    >
                      必修
                    </el-radio>

                    <el-radio
                      value="optional"
                    >
                      选修
                    </el-radio>
                  </el-radio-group>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>小节基本积分</span>

                    <el-tooltip
                      content="完成该小节后获得的积分"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <div
                    class="flex flex-wrap gap-6 items-center"
                  >
                    <span
                      class="text-warning"
                    >+ {{ sectionScore }}</span>

                    <span
                      class="h-6 w-px bg-(--art-card-border)"
                    />

                    <span>基本分 {{ baseScore }} ×</span>

                    <el-input-number
                      v-model="documentForm.scoreMultiplier"
                      :min="0"
                      :controls="false"
                      class="!w-36"
                    />

                    <el-tooltip
                      content="可通过倍数调整小节积分"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="text-g-900"
                  >
                    小节类型标签
                  </div>

                  <div
                    class="flex gap-5 items-center max-sm:flex-col max-sm:items-stretch"
                  >
                    <el-input
                      v-model="documentForm.sectionTypeTag"
                      class="max-w-72 max-sm:max-w-none"
                    />

                    <span
                      class="text-g-700"
                    >预览</span>
                  </div>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>最小学习时长</span>

                    <el-tooltip
                      content="设置学员最少学习时长"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <div
                    class="flex flex-wrap gap-6 items-center"
                  >
                    <el-radio-group
                      v-model="documentForm.minStudyTimeEnabled"
                      class="flex flex-wrap gap-x-8 gap-y-2"
                    >
                      <el-radio
                        :value="false"
                      >
                        不设置
                      </el-radio>

                      <el-radio
                        :value="true"
                      >
                        设置为
                      </el-radio>
                    </el-radio-group>

                    <el-time-picker
                      v-model="documentForm.minStudyTime"
                      placeholder="请选择时间"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                      :disabled="!documentForm.minStudyTimeEnabled"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>学习时长统计上限</span>

                    <el-tooltip
                      content="设置学习时长统计的最大值"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <div
                    class="flex flex-wrap gap-6 items-center"
                  >
                    <el-radio-group
                      v-model="documentForm.maxStudyTimeEnabled"
                      class="flex flex-wrap gap-x-8 gap-y-2"
                    >
                      <el-radio
                        :value="false"
                      >
                        不设置
                      </el-radio>

                      <el-radio
                        :value="true"
                      >
                        设置为
                      </el-radio>
                    </el-radio-group>

                    <el-time-picker
                      v-model="documentForm.maxStudyTime"
                      placeholder="请选择时间"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                      :disabled="!documentForm.maxStudyTimeEnabled"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="text-g-900"
                  >
                    是否允许学员下载文档
                  </div>

                  <el-radio-group
                    v-model="documentForm.allowDownload"
                    class="flex flex-wrap gap-x-10 gap-y-2"
                  >
                    <el-radio
                      :value="false"
                    >
                      不允许
                    </el-radio>

                    <el-radio
                      :value="true"
                    >
                      允许
                    </el-radio>
                  </el-radio-group>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>设置小节完成条件</span>

                    <el-tooltip
                      content="设置学员完成该小节的判断条件"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <el-select
                    v-model="documentForm.completionCondition"
                    class="max-w-xl max-sm:max-w-none"
                  >
                    <el-option
                      label="打开文档即算完成"
                      value="open"
                    />

                    <el-option
                      label="达到最小学习时长后完成"
                      value="time"
                    />

                    <el-option
                      label="提交发言后完成"
                      value="comment"
                    />
                  </el-select>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="text-g-900"
                  >
                    展示课程创建者信息
                  </div>

                  <el-radio-group
                    v-model="documentForm.showCreatorInfo"
                    class="flex flex-wrap gap-x-10 gap-y-2"
                  >
                    <el-radio
                      :value="true"
                    >
                      展示
                    </el-radio>

                    <el-radio
                      :value="false"
                    >
                      不展示
                    </el-radio>
                  </el-radio-group>
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>开启发言区</span>

                    <el-tooltip
                      content="开启后学员可在该小节发言"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <el-switch
                    v-model="documentForm.commentEnabled"
                  />
                </div>

                <div
                  class="grid grid-cols-[220px_minmax(0,1fr)] gap-6 items-center max-md:grid-cols-1 max-md:gap-3"
                >
                  <div
                    class="text-g-900"
                  >
                    允许学员查看发言的提交时间
                  </div>

                  <el-radio-group
                    v-model="documentForm.showCommentSubmitTime"
                    class="flex flex-wrap gap-x-10 gap-y-2"
                  >
                    <el-radio
                      :value="true"
                    >
                      允许
                    </el-radio>

                    <el-radio
                      :value="false"
                    >
                      不允许
                    </el-radio>
                  </el-radio-group>
                </div>

                <div
                  class="flex flex-col gap-4"
                >
                  <div
                    class="flex items-center gap-2 text-g-900"
                  >
                    <span>发言区关键词标签设置（选填）</span>

                    <el-tooltip
                      content="可设置指定关键词或屏蔽关键词"
                      placement="top"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                      >?</span>
                    </el-tooltip>
                  </div>

                  <div
                    class="flex items-center gap-3 text-g-600"
                  >
                    <ArtSvgIcon
                      icon="ri:eye-line"
                    />

                    <span>指定关键词标签</span>
                  </div>

                  <el-input
                    v-model="documentForm.includeKeywords"
                    placeholder="最多10词，每词10字，使用逗号分隔"
                  />

                  <div
                    class="flex items-center gap-3 text-g-600"
                  >
                    <ArtSvgIcon
                      icon="ri:eye-off-line"
                    />

                    <span>屏蔽关键词标签</span>
                  </div>

                  <el-input
                    v-model="documentForm.excludeKeywords"
                    placeholder="最多10词，每词10字，使用逗号分隔"
                  />
                </div>
              </div>
            </div>
          </div>

          <el-form-item>
            <template
              #label
            >
              <div
                class="flex items-center gap-2"
              >
                <span>文档说明</span>

                <el-tooltip
                  content="用于向学员说明文档内容或学习要求"
                  placement="top"
                >
                  <span
                    class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-gray-400)] text-xs text-white"
                  >
                    ?
                  </span>
                </el-tooltip>
              </div>
            </template>

            <div
              class="w-full border border-(--art-card-border)"
            >
              <div
                class="flex h-12 items-center border-b border-(--art-card-border) text-sm"
              >
                <button
                  type="button"
                  class="h-full px-6 text-g-900"
                >
                  文本编辑
                </button>

                <button
                  type="button"
                  class="h-full border-l border-(--art-card-border) px-6 text-primary"
                >
                  图文编辑
                </button>
              </div>

              <div
                class="flex flex-wrap items-center gap-5 border-b border-(--art-card-border) px-4 py-3 text-g-500"
              >
                <span>16px</span>

                <ArtSvgIcon
                  v-for="tool in editorTools"
                  :key="tool"
                  :icon="tool"
                  class="text-5"
                />
              </div>

              <el-input
                v-model="documentForm.description"
                type="textarea"
                :rows="9"
                resize="none"
                class="document-description-editor"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="文档标签"
          >
            <el-input
              v-model="documentForm.tags"
              placeholder="用逗号隔开，方便搜索文档"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div
      class="sticky bottom-0 z-10 -mx-10 border-t border-(--art-card-border) bg-[var(--default-bg-color)] px-10 py-5 max-lg:-mx-6 max-lg:px-6 max-sm:-mx-4 max-sm:px-4"
    >
      <div
        class="mx-auto flex max-w-7xl justify-end gap-4 max-sm:flex-col"
      >
        <ArtIconButton
          type="warning"
          class="px-8 py-5 text-base"
          @click="replaceDocument"
        >
          更换文档
        </ArtIconButton>

        <ArtIconButton
          type="success"
          class="px-10 py-5 text-base"
          @click="handleSubmit"
        >
          完成
        </ArtIconButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.document-description-editor) {
  .el-textarea__inner {
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>

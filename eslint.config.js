// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    stylistic: {
      indent: 2,
    },
    ignores: [
      '**/components.d.ts',
      '**/dist/**',
      '**/iconFont.js',
      '**/assets/**',
    ],

    vue: {
      overrides: {
        // 强制执行第一个属性的位置
        'vue/first-attribute-linebreak': [
          'warn',
          {
            singleline: 'below',
            multiline: 'below',
          },
        ],

        // 强制每行的最大属性数
        'vue/max-attributes-per-line': [
          'warn',
          {
            singleline: { max: 1 },
            multiline: { max: 1 },
          },
        ],

        // 强制在多行元素的内容之前和之后进行换行
        'vue/multiline-html-element-content-newline': [
          'warn',
          {
            ignoreWhenEmpty: true, // 忽略空元素
            allowEmptyLines: true, // 允许空行
          },
        ],

        // vue 单行元素内容换行
        'vue/singleline-html-element-content-newline': [
          'warn',
          {
            ignoreWhenNoAttributes: false,
          },
        ],

        // 要求或禁止模板中同级标签之间的换行符
        'vue/padding-line-between-tags': [
          'warn',
          [
            {
              blankLine: 'always',
              prev: '*',
              next: '*',
            },
          ],
        ],

        // 强制要求每个 prop 都有一个记录它的注释
        'vue/require-prop-comment': [
          'warn',
          {
            type: 'JSDoc',
          },
        ],

        // 强制块标签换行
        'vue/block-tag-newline': [
          'warn',
          {
            singleline: 'always', // 单行标签后需要换行
            multiline: 'always', // 多行标签后也需要换行
            maxEmptyLines: 1, // 设置空行的最大数量为 1
          },
        ],

        // 强制自定义事件名称使用驼峰命名法
        'vue/custom-event-name-casing': ['warn', 'kebab-case'],
      },
    },

    typescript: {
      overrides: {
        // 禁止使用 alert
        'no-alert': 'off',

        // 禁止使用 console
        'no-console': 'off',

        // 强制块的括号样式一致
        // 'brace-style': [
        //   'warn',
        //   '1tbs',
        //   { allowSingleLine: false },
        // ],

        // 空行最多不能超过 3 行
        // 'no-multiple-empty-lines': ['error', { max: 3 }],

        // 禁止使用禁止 process
        'node/prefer-global/process': 'off',

        // 强制链式调用在每次调用后换行
        'newline-per-chained-call': 'warn',

        // 强制将对象属性放在单独的行上
        'object-property-newline': 'warn',

        // 强制在开括号后和闭括号前使用一致的换行符
        'object-curly-newline': [
          'warn',
          {
            ImportDeclaration: { multiline: true, minProperties: 3 },
            ExportDeclaration: { multiline: true, minProperties: 1 },
            ObjectExpression: 'always',
            ObjectPattern: { multiline: true },
          },
        ],

        // 强制使用一致的换行风格
        'curly': 'warn',

        // 行注释位置
        // 'line-comment-position': ['warn', { position: 'above' }],

        // 强制在注释中 // 或 /* 使用一致的空行
        'lines-around-comment': [
          'warn',
          {
            beforeBlockComment: true,
            beforeLineComment: true,
            allowBlockStart: true,
            allowObjectStart: true,
            allowArrayStart: true,
            ignorePattern: 'eslint|jshint|jslint|istanbul|global|exported|jscs|组件|弹窗',
          },
        ],

        // 在特定语句之前和之后添加空行
        'padding-line-between-statements': [
          'warn',
          {
            blankLine: 'always',
            prev: [
              'const',
              'let',
              'var',
              'block',
              'block-like',
              'import',
              'export',
              'class',
              'try',
              'return',
            ],
            next: '*',
          },
        ],

        // 强制所有的对象类型定义使用 type
        'ts/consistent-type-definitions': ['warn', 'type'],

        // 在注释中的 // 或 /*后面强制保持一致的间距
        'spaced-comment': [
          'warn',
          'always',
          {
            markers: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
          },
        ],

        // 要求三元表达式始终使用多行格式，除了在 JSX 中忽略此规则
        'style/multiline-ternary': [
          'warn',
          'always-multiline',
          { ignoreJSX: true },
        ],

        // 限制每行的最大语句数
        // 👉 允许一行存在多个语句（例如某些特殊写法或压缩代码）
        // 默认 ESLint 不推荐一行写多个语句，因此这里关闭限制
        'max-statements-per-line': 'off',

        // 关闭 @stylistic 插件中的同名规则
        // 👉 防止与 ESLint 原生规则重复冲突
        'style/max-statements-per-line': 'off',

        // 禁止要求正则表达式必须是静态常量
        // 👉 允许动态创建 RegExp，例如 new RegExp(variable)
        'e18e/prefer-static-regex': 'off',

        // 强制使用 function 声明函数
        // 👉 不允许使用 const fn = () => {} 定义顶级函数
        // 👉 统一团队函数风格，提升函数提升（hoist）能力与可读性
        'func-style': [
          'warn',
          'declaration',
          {
            // 不允许使用箭头函数定义普通函数
            allowArrowFunctions: false,
          },
        ],
      },
    },
  },
  {
    rules: {
      'max-statements-per-line': 'off',
      'style/max-statements-per-line': 'off',
    },
  },
)

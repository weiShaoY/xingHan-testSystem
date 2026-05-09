import path from 'node:path'

import { fileURLToPath } from 'node:url'

import TailwindCSS from '@tailwindcss/vite'

import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'

import ElementPlus from 'unplugin-element-plus/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Components from 'unplugin-vue-components/vite'

import { defineConfig, loadEnv } from 'vite'

import viteCompression from 'vite-plugin-compression'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

import vueDevTools from 'vite-plugin-vue-devtools'

function resolvePath(paths: string) {
  return path.resolve(__dirname, paths)
}

export default ({ mode }: { mode: string }) => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  const { VITE_APP_VERSION, VITE_APP_PORT, VITE_APP_BASE_URL, VITE_APP_API_URL, VITE_APP_API_PROXY_URL } = env

  console.log(`🚀 API_URL = ${VITE_APP_API_URL}`)
  console.log(`🚀 VERSION = ${VITE_APP_VERSION}`)

  return defineConfig({

    define: {
      __APP_VERSION__: JSON.stringify(VITE_APP_VERSION),
    },

    base: VITE_APP_BASE_URL,

    server: {
      port: Number(VITE_APP_PORT),
      proxy: {
        '/api': {
          target: VITE_APP_API_PROXY_URL,
          changeOrigin: true,
        },
      },
      host: true,
    },

    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': resolvePath('src/views'),
        '@imgs': resolvePath('src/assets/images'),
        '@icons': resolvePath('src/assets/icons'),
        '@utils': resolvePath('src/utils'),
        '@stores': resolvePath('src/store'),
        '@plugins': resolvePath('src/plugins'),
        '@styles': resolvePath('src/assets/styles'),
      },
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除 console
          drop_console: true,

          // 生产环境去除 debugger
          drop_debugger: true,
        },
      },
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [],
        include: ['src/views/**/*.vue'],
      },
    },
    plugins: [
      vue(),

      TailwindCSS(),

      // 自动按需导入 API
      AutoImport({
        // 👇 配置需要自动导入的库
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],

        // 👇 自动扫描指定目录下的文件导出
        dirs: ['src/composables', 'src/stores', 'src/utils', 'src/directives', 'src/configs'],

        // 👇 生成的类型声明文件路径
        dts: 'src/types/core/auto-imports.d.ts',

        // 👇 解析器（此处配置 Element Plus 按需导入）
        resolvers: [ElementPlusResolver()],

        // 👇 启用 Vue 模板中的自动导入
        vueTemplate: true,

        // 👇 生成 ESLint 配置（解决未导入报错问题）
        eslintrc: {
          enabled: true,
          filepath: './.auto-import.json',
          globalsPropValue: true,
        },
      }),
      // 自动按需导入组件
      Components({
        dts: 'src/types/core/components.d.ts',
        resolvers: [ElementPlusResolver()],
      }),

      // 按需定制主题配置
      ElementPlus({
        useSource: true,
      }),

      // 压缩
      viteCompression({
        verbose: false, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 压缩后的文件名后缀
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240B = 10KB
        deleteOriginFile: false, // 压缩后是否删除原文件
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
      }),

      vueDevTools(),

    ],

    // 依赖预构建：避免运行时重复请求与转换，提升首次加载速度
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'xlsx',
        'xgplayer',
        'crypto-js',
        'file-saver',
        'vue-img-cutter',
        'element-plus/es',
        'element-plus/es/components/*/style/css',
        'element-plus/es/components/*/style/index',
      ],
    },
    css: {
      preprocessorOptions: {
        // sass variable and mixin
        scss: {
          additionalData: `
            @use "@styles/core/el-light.scss" as *;
            @use "@styles/core/mixin.scss" as *;
          `,
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
    },
  })
}

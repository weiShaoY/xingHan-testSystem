import { createApp } from 'vue'

import App from './App.vue'

import { setupGlobDirectives } from './directives'

import language from './locales' // 国际化

import { setupPlugins } from './plugins'

import { initRouter } from './routers' // Router

import { initStore } from './store' // Store

import { setupErrorHandle } from './utils/sys/error-handle'

import '@styles/core/tailwind.css' // tailwind

import '@styles/index.scss' // 样式

import '@utils/sys/console' // 控制台输出内容

document.addEventListener(
  'touchstart',
  () => {},
  {
    passive: false,
  },
)

const app = createApp(App)

initStore(app)
initRouter(app)
setupGlobDirectives(app)
setupErrorHandle(app)
setupPlugins(app)
app.use(language)
app.mount('#app')

import { createApp } from 'vue'

import App from './App.vue'

import { setupGlobDirectives } from './directives'

import language from './locales' // 国际化

import { setupPlugins } from './plugins'

import { initRouter } from './routers'

import { initStore } from './store'

import { setupErrorHandle } from './utils/sys/error-handle'

import '@styles/core/tailwind.css'

import '@styles/index.scss'

import '@styles/core/vant.css'

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

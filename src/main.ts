import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/space-grotesk'
import '@/assets/styles/tokens.css'
import '@/assets/styles/base.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

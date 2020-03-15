import { createApp } from 'vue'
import store from './store'
import App from './components/App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')

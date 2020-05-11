import { createApp } from 'vue'
import App from './components/App.vue'
import store from './store'
import { getAllMessages } from './store/actions'

const app = createApp(App)

app.use(store)

app.mount('#app')

getAllMessages(store)

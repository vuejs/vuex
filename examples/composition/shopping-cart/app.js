import { createApp } from 'vue'
import App from './components/App.vue'
import store from './store'
import { currency } from './currency'

const app = createApp(App)

app.use(store)

app.mount('#app')

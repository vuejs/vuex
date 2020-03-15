import { createApp } from 'vue'
import store from './store'
import CounterControls from './CounterControls.vue'

const app = createApp(CounterControls)

app.use(store)

app.mount('#app')

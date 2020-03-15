import 'babel-polyfill'
import { createApp } from 'vue'
import App from './components/App.vue'
import store from './store'
import { currency } from './currency'

// Vue.filter('currency', currency)

const app = createApp(App)

app.use(store)

app.mount('#app')

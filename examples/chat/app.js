import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './vuex/store'
import { getAllMessages } from './vuex/actions'

Vue.config.debug = true

Vue.filter('time', timestamp => {
  return new Date(timestamp).toLocaleTimeString()
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

getAllMessages(store)

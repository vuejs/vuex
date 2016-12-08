import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './store/store'

Vue.config.debug = true

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

import 'babel-polyfill'
import Vue from 'vue'
import store from './vuex/store'
import App from './components/App.vue'

new Vue({
  store, // inject store to all children
  el: '#app',
  render: h => h(App)
})

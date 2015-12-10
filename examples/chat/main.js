import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'

Vue.filter('time', timestamp => {
  return new Date(timestamp).toLocaleTimeString()
})

new Vue({
  el: 'body',
  components: { App }
})

store.actions.getAllMessages()

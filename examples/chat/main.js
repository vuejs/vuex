import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import vuex from './vuex'

Vue.filter('time', timestamp => {
  return new Date(timestamp).toLocaleTimeString()
})

new Vue({
  el: 'body',
  components: { App }
})

vuex.actions.getAllMessages()

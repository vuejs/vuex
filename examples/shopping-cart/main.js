import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'

new Vue({
  el: 'body',
  store,
  components: { App }
})

import 'babel-polyfill'
import Vue from 'vue'
import MapStore from './MapStore.vue'
import store from './store'

window.vm = new Vue({
  el: '#app',
  store,
  render: h => h(MapStore)
})

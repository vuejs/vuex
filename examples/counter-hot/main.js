import Vue from 'vue'
import store from './vuex/store'
import Counter from './Counter.vue'

new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})

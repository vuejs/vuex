import Vue from 'vue'
import store from './store'
import Counter from './Counter.vue'

new Vue({
  el: 'body',
  store,
  components: { Counter }
})

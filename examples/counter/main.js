import Vue from 'vue'
import Counter from './Counter.vue'
import store from './store'

new Vue({
  el: 'body',
  store,
  components: { Counter }
})

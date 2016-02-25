import Vue from 'vue'
import store from './vuex/store'
import Counter from './Counter.vue'

new Vue({
  el: 'body',
  store,
  components: { Counter }
})

import Vue from 'vue'
import Vuex from '../../src'
import todosStore from './stores/todos'
import appOptions from './components/main.vue'

// install vuex
Vue.use(Vuex)

// define app component
const App = Vuex.create(appOptions, {
  stores: [todosStore],
  debug: process.env.NODE_ENV !== 'production'
})

new App().$mount('#app')

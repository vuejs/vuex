import Vue from 'vue'
import Vuex from '../../../src'
import actions from './actions'
import mutations from './mutations'
import middlewares from './middlewares'

Vue.use(Vuex)

export const STORAGE_KEY = 'todos-vuejs'
const state = {
  todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  middlewares
})

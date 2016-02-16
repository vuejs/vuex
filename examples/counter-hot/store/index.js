import Vue from 'vue'
import Vuex from '../../../src'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  count: 0,
  history: []
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

if (module.hot) {
  module.hot.accept(['./actions', './mutations', './getters'], () => {
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    const newGetters = require('./getters').default
    store.hotUpdate({
      actions: newActions,
      mutations: newMutations,
      getters: newGetters
    })
  })
}

export default store

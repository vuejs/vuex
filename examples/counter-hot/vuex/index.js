import Vue from 'vue'
import Vuex from '../../../src'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  count: 0
}

const vuex = new Vuex({
  state,
  actions,
  mutations
})

if (module.hot) {
  module.hot.accept(['./actions', './mutations'], () => {
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    vuex.hotUpdate({
      actions: newActions,
      mutations: newMutations
    })
  })
}

export default vuex

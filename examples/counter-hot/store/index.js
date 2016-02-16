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
  mutations
})

if (module.hot) {
  module.hot.accept(['./mutations'], () => {
    const mutations = require('./mutations').default
    store.hotUpdate({
      mutations
    })
  })
}

export default store

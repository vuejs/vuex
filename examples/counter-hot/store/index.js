import Vue from 'vue'
import Vuex from '../../../src'
import mutations from './mutations'

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
  /**
   * Mutations need to be handled by the store during hot reloading,
   * to remove any unused mutations. Any actions and getters files can be
   * handled by the HMR by browserify or webpack by including the files.
   */
  module.hot.accept(['./mutations', './actions', './getters'], () => {
    const mutations = require('./mutations').default
    store.hotUpdate({
      mutations
    })
  })
}

export default store

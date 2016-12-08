import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from '../../../src/plugins/logger'
import user from './modules/user'

Vue.use(Vuex)

const state = {}
const getters = {}
const actions = {}
const mutations = {}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    user
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})

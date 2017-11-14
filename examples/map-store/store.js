import Vue from 'vue'
import Vuex from 'vuex'
import { mapStoreGetters, mapStoreSetters } from 'vuex'

Vue.use(Vuex)

const state = {
  name: null,
  value: 0
}

const mutations = mapStoreSetters(['name', 'value'])

const getters = mapStoreGetters(['name', 'value'])

export default new Vuex.Store({
  state,
  getters,
  mutations
})

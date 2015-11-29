import Vue from 'vue'
import Vuex from '../../src'

Vue.use(Vuex)

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

const state = {
  count: 0
}

const actions = {
  increment: INCREMENT,
  decrement: DECREMENT,
  incrementIfOdd: () => (dispatch, state) => {
    if (state.count % 2 === 1) {
      dispatch(INCREMENT)
    }
  },
  incrementAsync: () => (dispatch, state) => {
    setTimeout(() => {
      dispatch(INCREMENT)
    }, 1000)
  }
}

const mutations = {
  [INCREMENT] (state) {
    state.count++
  },
  [DECREMENT] (state) {
    state.count--
  }
}

export default new Vuex({
  state,
  actions,
  mutations
})

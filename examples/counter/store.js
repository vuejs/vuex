import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  increment (state) {
    state.count++
  },
  decrement (state) {
    state.count--
  }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  increment: ({ dispatch }) => dispatch('increment'),
  decrement: ({ dispatch }) => dispatch('decrement'),
  incrementIfOdd ({ dispatch, state }) {
    if ((state.count + 1) % 2 === 0) {
      dispatch('increment')
    }
  },
  incrementAsync ({ dispatch }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch('increment')
        resolve()
      }, 1000)
    })
  }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters. Components should prefer interacting with the store via
// getters and actions.
export default new Vuex.Store({
  state,
  getters: {
    count: state => state.count
  },
  actions,
  mutations
})

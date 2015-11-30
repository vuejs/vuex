import Vue from 'vue'
import Vuex from '../../src'

Vue.use(Vuex)

// mutation types
// optional if you don't like constants.
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0
}

// actions are what components will be able to
// call as vuex.actions.xxx
// note these are not the final functions the
// components will be calling.
const actions = {

  // for simple actions that just dispatches a single mutation,
  // we can just provide the mutation type.
  increment: INCREMENT,
  decrement: DECREMENT,

  // for conditional actions that depend on the state,
  // we can provide a thunk (a function that returns a function)
  // the returned function will get two arguments,
  // the first being the dispatch function and the second is
  // the state tree.
  incrementIfOdd: () => (dispatch, state) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch(INCREMENT)
    }
  },

  // we also use thunks for async actions.
  // you can dispatch multiple mutations inside a thunk action.
  incrementAsync: () => dispatch => {
    setTimeout(() => {
      dispatch(INCREMENT)
    }, 1000)
  }
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by middlewares
// for debugging purposes.
const mutations = {
  [INCREMENT] (state) {
    state.count++
  },
  [DECREMENT] (state) {
    state.count--
  }
}

// A Vuex instance is created by combining the state, the actions,
// and the mutations. Because the actions and mutations are just
// functions that do not depend on the instance itself, they can
// be easily tested.
// 
// You can also provide middlewares, which is just an array of
// objects containing before/after hooks that will get called for
// each mutation.
export default new Vuex({
  state,
  actions,
  mutations
})

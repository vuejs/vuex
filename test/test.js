import { expect } from 'chai'
import Vue from 'vue'
import Vuex from '../src'
import * as util from '../src/util'

Vue.use(Vuex)

const TEST = 'TEST'

describe('Vuex', () => {
  it('direct dispatch', () => {
    const vuex = new Vuex({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    vuex.dispatch(TEST, 2)
    expect(vuex.state.a).to.equal(3)
  })

  it('simple action', function () {
    const vuex = new Vuex({
      state: {
        a: 1
      },
      actions: {
        test: TEST
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    vuex.actions.test(2)
    expect(vuex.state.a).to.equal(3)
  })

  it('async action', function (done) {
    const TEST = 'TEST'
    const vuex = new Vuex({
      state: {
        a: 1,
        timeout: 10
      },
      actions: {
        test: (n) => (dispatch, state) => {
          setTimeout(() => {
            dispatch(TEST, n)
          }, state.timeout)
        }
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    vuex.actions.test(2)
    setTimeout(() => {
      expect(vuex.state.a).to.equal(3)
      done()
    }, vuex.state.timeout)
  })

  it('array option syntax', function () {
    const TEST2 = 'TEST2'
    const vuex = new Vuex({
      state: {
        a: 1,
        b: 1,
        c: 1
      },
      actions: [{ test: TEST }, { test2: TEST2 }],
      mutations: [
        {
          [TEST] (state, n) {
            state.a += n
          }
        },
        // allow multiple handlers for the same mutation type
        {
          [TEST] (state, n) {
            state.b += n
          },
          [TEST2] (state, n) {
            state.c += n
          }
        }
      ]
    })
    vuex.actions.test(2)
    expect(vuex.state.a).to.equal(3)
    expect(vuex.state.b).to.equal(3)
    expect(vuex.state.c).to.equal(1)
    vuex.actions.test2(2)
    expect(vuex.state.c).to.equal(3)
  })

  it('hot reload', function () {
    const vuex = new Vuex({
      state: {
        a: 1
      },
      actions: {
        test: TEST
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    const test = vuex.actions.test
    test(2)
    expect(vuex.state.a).to.equal(3)
    vuex.hotUpdate({
      actions: {
        test: n => dispatch => dispatch(TEST, n + 1)
      },
      mutations: {
        [TEST] (state, n) {
          state.a = n
        }
      }
    })
    test(999)
    expect(vuex.state.a).to.equal(1000)
  })

  it('middleware', function () {
    let initState
    const mutations = []
    const vuex = new Vuex({
      state: {
        a: 1
      },
      actions: {
        test: TEST
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      middlewares: [
        {
          onInit (state) {
            initState = state
          },
          onMutation (mut, state) {
            expect(state).to.equal(vuex.state)
            mutations.push(mut)
          }
        }
      ]
    })
    expect(initState).to.equal(vuex.state)
    vuex.actions.test(2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[0].payload[0]).to.equal(2)
  })

  it('middleware with snapshot', function () {
    let initState
    const mutations = []
    const vuex = new Vuex({
      state: {
        a: 1
      },
      actions: {
        test: TEST
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      middlewares: [
        {
          snapshot: true,
          onInit (state) {
            initState = state
          },
          onMutation (mutation, nextState, prevState) {
            mutations.push({
              mutation,
              nextState,
              prevState
            })
          }
        }
      ]
    })
    expect(initState).not.to.equal(vuex.state)
    expect(initState.a).to.equal(1)
    vuex.actions.test(2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].mutation.type).to.equal(TEST)
    expect(mutations[0].mutation.payload[0]).to.equal(2)
    expect(mutations[0].nextState).not.to.equal(vuex.state)
    expect(mutations[0].prevState.a).to.equal(1)
    expect(mutations[0].nextState.a).to.equal(3)
  })
})

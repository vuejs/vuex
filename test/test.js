import { expect } from 'chai'
import Vue from 'vue'
import Vuex from '../src'
import * as util from '../src/util'

Vue.use(Vuex)

const TEST = 'TEST'

describe('Vuex', () => {
  it('direct dispatch', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    store.dispatch(TEST, 2)
    expect(store.state.a).to.equal(3)
  })

  it('simple action', function () {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      actions: {
        test: TEST
      },
      getters: {
        getA (state) {
          return state.a
        }
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    store.actions.test(2)
    expect(store.state.a).to.equal(3)
    expect(store.getters.getA()).to.equal(3)
  })

  it('async action', function (done) {
    const TEST = 'TEST'
    const store = new Vuex.Store({
      state: {
        a: 1,
        timeout: 10
      },
      actions: {
        test: ({ dispatch, state }, n) => {
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
    store.actions.test(2)
    setTimeout(() => {
      expect(store.state.a).to.equal(3)
      done()
    }, store.state.timeout)
  })

  it('array option syntax', function () {
    const TEST2 = 'TEST2'
    const store = new Vuex.Store({
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
      ],
      getters: [
        {
          getA (state) {
            return state.a
          }
        },
        {
          getB (state) {
            return state.b
          },

          getC (state) {
            return state.c
          }
        }
      ]
    })
    store.actions.test(2)
    expect(store.state.a).to.equal(3)
    expect(store.state.b).to.equal(3)
    expect(store.state.c).to.equal(1)
    expect(store.getters.getA()).to.equal(3)
    expect(store.getters.getB()).to.equal(3)
    expect(store.getters.getC()).to.equal(1)
    store.actions.test2(2)
    expect(store.state.c).to.equal(3)
  })

  it('hot reload', function () {
    const store = new Vuex.Store({
      state: {
        a: 1,
        b: 2
      },
      actions: {
        test: TEST
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      getters: {
        getA (state) {
          return state.b
        }
      }
    })
    const test = store.actions.test
    test(2)
    expect(store.state.a).to.equal(3)
    expect(store.getters.getA()).to.equal(2)
    store.hotUpdate({
      actions: {
        test: ({ dispatch }, n) => dispatch(TEST, n + 1)
      },
      mutations: {
        [TEST] (state, n) {
          state.a = n
        }
      },
      getters: {
        getA (state) {
          return state.a
        }
      }
    })
    test(999)
    expect(store.state.a).to.equal(1000)
    expect(store.getters.getA()).to.equal(1000)
  })

  it('middleware', function () {
    let initState
    const mutations = []
    const store = new Vuex.Store({
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
            expect(state).to.equal(store.state)
            mutations.push(mut)
          }
        }
      ]
    })
    expect(initState).to.equal(store.state)
    store.actions.test(2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[0].payload[0]).to.equal(2)
  })

  it('middleware with snapshot', function () {
    let initState
    const mutations = []
    const store = new Vuex.Store({
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
    expect(initState).not.to.equal(store.state)
    expect(initState.a).to.equal(1)
    store.actions.test(2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].mutation.type).to.equal(TEST)
    expect(mutations[0].mutation.payload[0]).to.equal(2)
    expect(mutations[0].nextState).not.to.equal(store.state)
    expect(mutations[0].prevState.a).to.equal(1)
    expect(mutations[0].nextState.a).to.equal(3)
  })

  it('strict mode: warn mutations outside of handlers', function () {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      actions: {
        test: ({ dispatch, state }) => {
          state.a++
        }
      },
      strict: true
    })
    expect(() => {
      store.actions.test(2)
    }).to.throw(/Do not mutate vuex store state outside mutation handlers/)
  })
})

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import Vue from 'vue'
import Vuex from '../../src'

Vue.use(Vuex)
chai.use(sinonChai)

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

  it('injecting state and action to components', function () {
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
    const vm = new Vue({
      store,
      vuex: {
        getters: {
          a: state => state.a
        },
        actions: {
          test: ({ dispatch }, n) => dispatch(TEST, n)
        }
      }
    })
    vm.test(2)
    expect(vm.a).to.equal(3)
    expect(store.state.a).to.equal(3)
  })

  it('modules', function () {
    const mutations = {
      [TEST] (state, n) {
        state.a += n
      }
    }
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations,
      modules: {
        nested: {
          state: { a: 2 },
          mutations,
          modules: {
            one: {
              state: { a: 3 },
              mutations
            },
            nested: {
              modules: {
                two: {
                  state: { a: 4 },
                  mutations
                },
                three: {
                  state: { a: 5 },
                  mutations
                }
              }
            }
          }
        },
        four: {
          state: { a: 6 },
          mutations
        }
      }
    })
    store.dispatch(TEST, 1)
    expect(store.state.a).to.equal(2)
    expect(store.state.nested.a).to.equal(3)
    expect(store.state.nested.one.a).to.equal(4)
    expect(store.state.nested.nested.two.a).to.equal(5)
    expect(store.state.nested.nested.three.a).to.equal(6)
    expect(store.state.four.a).to.equal(7)
  })

  it('hot reload', function () {
    const mutations = {
      [TEST] (state, n) {
        state.a += n
      }
    }
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations,
      modules: {
        nested: {
          state: { a: 2 },
          mutations,
          modules: {
            one: {
              state: { a: 3 },
              mutations
            },
            nested: {
              modules: {
                two: {
                  state: { a: 4 },
                  mutations
                },
                three: {
                  state: { a: 5 },
                  mutations
                }
              }
            }
          }
        },
        four: {
          state: { a: 6 },
          mutations
        }
      }
    })
    store.dispatch(TEST, 1)
    expect(store.state.a).to.equal(2)
    expect(store.state.nested.a).to.equal(3)
    expect(store.state.nested.one.a).to.equal(4)
    expect(store.state.nested.nested.two.a).to.equal(5)
    expect(store.state.nested.nested.three.a).to.equal(6)
    expect(store.state.four.a).to.equal(7)

    // hot reload only root mutations
    store.hotUpdate({
      mutations: {
        [TEST] (state, n) {
          state.a = n
        }
      }
    })
    store.dispatch(TEST, 1)
    expect(store.state.a).to.equal(1) // only root mutation updated
    expect(store.state.nested.a).to.equal(4)
    expect(store.state.nested.one.a).to.equal(5)
    expect(store.state.nested.nested.two.a).to.equal(6)
    expect(store.state.nested.nested.three.a).to.equal(7)
    expect(store.state.four.a).to.equal(8)

    // hot reload modules
    store.hotUpdate({
      modules: {
        nested: {
          state: { a: 234 },
          mutations,
          modules: {
            one: {
              state: { a: 345 },
              mutations
            },
            nested: {
              modules: {
                two: {
                  state: { a: 456 },
                  mutations
                },
                three: {
                  state: { a: 567 },
                  mutations
                }
              }
            }
          }
        },
        four: {
          state: { a: 678 },
          mutations
        }
      }
    })
    store.dispatch(TEST, 2)
    expect(store.state.a).to.equal(2)
    expect(store.state.nested.a).to.equal(6) // should not reload initial state
    expect(store.state.nested.one.a).to.equal(7) // should not reload initial state
    expect(store.state.nested.nested.two.a).to.equal(8) // should not reload initial state
    expect(store.state.nested.nested.three.a).to.equal(9) // should not reload initial state
    expect(store.state.four.a).to.equal(10) // should not reload initial state

    // hot reload all
    store.hotUpdate({
      mutations: {
        [TEST] (state, n) {
          state.a -= n
        }
      },
      modules: {
        nested: {
          state: { a: 234 },
          mutations: {
            [TEST] (state, n) {
              state.a += n
            }
          },
          modules: {
            one: {
              state: { a: 345 },
              mutations: {
                [TEST] (state, n) {
                  state.a += n
                }
              }
            },
            nested: {
              modules: {
                two: {
                  state: { a: 456 },
                  mutations: {
                    [TEST] (state, n) {
                      state.a += n
                    }
                  }
                },
                three: {
                  state: { a: 567 },
                  mutations: {
                    [TEST] (state, n) {
                      state.a -= n
                    }
                  }
                }
              }
            }
          }
        },
        four: {
          state: { a: 678 },
          mutations: {
            [TEST] (state, n) {
              state.a -= n
            }
          }
        }
      }
    })
    store.dispatch(TEST, 3)
    expect(store.state.a).to.equal(-1)
    expect(store.state.nested.a).to.equal(9)
    expect(store.state.nested.one.a).to.equal(10)
    expect(store.state.nested.nested.two.a).to.equal(11)
    expect(store.state.nested.nested.three.a).to.equal(6)
    expect(store.state.four.a).to.equal(7)
  })

  it('plugins', function () {
    let initState
    const mutations = []
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      plugins: [
        store => {
          initState = store.state
          store.subscribe((mut, state) => {
            expect(state).to.equal(store.state)
            mutations.push(mut)
          })
        }
      ]
    })
    expect(initState).to.equal(store.state)
    store.dispatch(TEST, 2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[0].payload[0]).to.equal(2)
  })

  it('plugins should ignore silent mutations', function () {
    let initState
    const mutations = []
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, { payload }) {
          state.a += payload
        }
      },
      plugins: [
        store => {
          initState = store.state
          store.subscribe((mut, state) => {
            expect(state).to.equal(store.state)
            mutations.push(mut)
          })
        }
      ]
    })
    expect(initState).to.equal(store.state)
    store.dispatch(TEST, 1)
    store.dispatch({
      type: TEST,
      payload: 2
    })
    store.dispatch({
      type: TEST,
      silent: true,
      payload: 3
    })
    expect(mutations.length).to.equal(2)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[1].type).to.equal(TEST)
    expect(mutations[0].payload[0]).to.equal(1) // normal dispatch
    expect(mutations[1].payload).to.equal(2) // object dispatch
  })

  it('watch', function (done) {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST]: state => state.a++
      }
    })
    let watchedValueOne
    store.watch(({ a }) => a, val => {
      watchedValueOne = val
    })
    store.dispatch(TEST)
    Vue.nextTick(() => {
      expect(watchedValueOne).to.equal(2)
      done()
    })
  })

  it('strict mode: warn mutations outside of handlers', function () {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      strict: true
    })
    expect(() => {
      store.state.a++
    }).to.throw(/Do not mutate vuex store state outside mutation handlers/)
  })

  it('option merging', function () {
    const store = new Vuex.Store({
      state: {
        a: 1,
        b: 2
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    const Comp = Vue.extend({
      vuex: {
        getters: {
          a: state => state.a
        },
        actions: {
          test: ({ dispatch }, n) => dispatch(TEST, n)
        }
      },
      mixins: [{
        vuex: {
          getters: {
            b: state => state.b
          },
          actions: {
            testPlusOne: ({ dispatch }, n) => dispatch(TEST, n + 1)
          }
        }
      }]
    })
    const vm = new Comp({ store })
    expect(vm.a).to.equal(1)
    expect(vm.b).to.equal(2)
    vm.test(2)
    expect(vm.a).to.equal(3)
    expect(store.state.a).to.equal(3)
    vm.testPlusOne(2)
    expect(vm.a).to.equal(6)
    expect(store.state.a).to.equal(6)
  })

  it('shared getters should evaluate only once', function (done) {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state) {
          state.a++
        }
      }
    })

    let getterCalls = 0
    let watcherCalls = 0
    const getter = state => {
      getterCalls++
      return state.a
    }

    const vm1 = new Vue({
      store,
      vuex: {
        getters: {
          a: getter
        }
      },
      watch: {
        a: () => {
          watcherCalls++
        }
      }
    })

    const vm2 = new Vue({
      store,
      vuex: {
        getters: {
          a: getter
        }
      },
      watch: {
        a: () => {
          watcherCalls++
        }
      }
    })

    expect(vm1.a).to.equal(1)
    expect(vm2.a).to.equal(1)
    expect(getterCalls).to.equal(1)
    expect(watcherCalls).to.equal(0)

    store.dispatch('TEST')
    Vue.nextTick(() => {
      expect(vm1.a).to.equal(2)
      expect(vm2.a).to.equal(2)
      expect(getterCalls).to.equal(2)
      expect(watcherCalls).to.equal(2)
      done()
    })
  })

  it('object-format mutations', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, { by }) {
          state.a += by
        }
      }
    })
    store.dispatch({
      type: TEST,
      by: 2
    })
    expect(store.state.a).to.equal(3)
  })

  it('console.warn when action is not a function', function () {
    sinon.spy(console, 'warn')

    new Vue({
      vuex: {
        actions: {
          test: undefined
        }
      }
    })

    expect(console.warn).to.have.been.calledWith('[vuex] Action bound to key \'vuex.actions.test\' is not a function.')
    console.warn.restore()
  })

  it('console.warn when getter is not a function', function () {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, amount) {
          state.a += amount
        }
      }
    })
    sinon.spy(console, 'warn')

    new Vue({
      store,
      vuex: {
        getters: {
          test: undefined
        }
      }
    })

    expect(console.warn).to.have.been.calledWith('[vuex] Getter bound to key \'vuex.getters.test\' is not a function.')
    console.warn.restore()
  })
})

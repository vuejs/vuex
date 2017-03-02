import Vue from 'vue/dist/vue.common.js'
import Vuex from '../../dist/vuex.js'

const TEST = 'TEST'

describe('Store', () => {
  it('committing mutations', () => {
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
    store.commit(TEST, 2)
    expect(store.state.a).toBe(3)
  })

  it('committing with object style', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, payload) {
          state.a += payload.amount
        }
      }
    })
    store.commit({
      type: TEST,
      amount: 2
    })
    expect(store.state.a).toBe(3)
  })

  it('committing with array style multiple mutations', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, payload) {
          state.a += payload.amount
        }
      }
    })
    store.commit([{
      type: TEST,
      amount: 1
    }, {
      type: TEST,
      amount: 2
    }])
    expect(store.state.a).toBe(4)
  })

  it('asserts committed type', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        // Maybe registered with undefined type accidentally
        // if the user has typo in a constant type
        undefined (state, n) {
          state.a += n
        }
      }
    })
    expect(() => {
      store.commit(undefined, 2)
    }).toThrowError(/Expects string as the type, but found undefined/)
    expect(store.state.a).toBe(1)
  })

  it('dispatching actions, sync', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        [TEST] ({ commit }, n) {
          commit(TEST, n)
        }
      }
    })
    store.dispatch(TEST, 2)
    expect(store.state.a).toBe(3)
  })

  it('dispatching with object style', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        [TEST] ({ commit }, payload) {
          commit(TEST, payload.amount)
        }
      }
    })
    store.dispatch({
      type: TEST,
      amount: 2
    })
    expect(store.state.a).toBe(3)
  })

  it('dispatching actions, with returned Promise', done => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        [TEST] ({ commit }, n) {
          return new Promise(resolve => {
            setTimeout(() => {
              commit(TEST, n)
              resolve()
            }, 0)
          })
        }
      }
    })
    expect(store.state.a).toBe(1)
    store.dispatch(TEST, 2).then(() => {
      expect(store.state.a).toBe(3)
      done()
    })
  })

  it('composing actions with async/await', done => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        [TEST] ({ commit }, n) {
          return new Promise(resolve => {
            setTimeout(() => {
              commit(TEST, n)
              resolve()
            }, 0)
          })
        },
        two: async ({ commit, dispatch }, n) => {
          await dispatch(TEST, 1)
          expect(store.state.a).toBe(2)
          commit(TEST, n)
        }
      }
    })
    expect(store.state.a).toBe(1)
    store.dispatch('two', 3).then(() => {
      expect(store.state.a).toBe(5)
      done()
    })
  })

  it('detecting action Promise errors', done => {
    const store = new Vuex.Store({
      actions: {
        [TEST] () {
          return new Promise((resolve, reject) => {
            reject('no')
          })
        }
      }
    })
    const spy = jasmine.createSpy()
    store._devtoolHook = {
      emit: spy
    }
    const thenSpy = jasmine.createSpy()
    store.dispatch(TEST)
      .then(thenSpy)
      .catch(err => {
        expect(thenSpy).not.toHaveBeenCalled()
        expect(err).toBe('no')
        expect(spy).toHaveBeenCalledWith('vuex:error', 'no')
        done()
      })
  })

  it('asserts dispatched type', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        // Maybe registered with undefined type accidentally
        // if the user has typo in a constant type
        undefined ({ commit }, n) {
          commit(TEST, n)
        }
      }
    })
    expect(() => {
      store.dispatch(undefined, 2)
    }).toThrowError(/Expects string as the type, but found undefined/)
    expect(store.state.a).toBe(1)
  })

  it('getters', () => {
    const store = new Vuex.Store({
      state: {
        a: 0
      },
      getters: {
        state: state => state.a > 0 ? 'hasAny' : 'none'
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        check ({ getters }, value) {
          // check for exposing getters into actions
          expect(getters.state).toBe(value)
        }
      }
    })
    expect(store.getters.state).toBe('none')
    store.dispatch('check', 'none')

    store.commit(TEST, 1)

    expect(store.getters.state).toBe('hasAny')
    store.dispatch('check', 'hasAny')
  })

  it('store injection', () => {
    const store = new Vuex.Store()
    const vm = new Vue({
      store
    })
    const child = new Vue({ parent: vm })
    expect(child.$store).toBe(store)
  })

  it('should warn silent option depreciation', function () {
    spyOn(console, 'warn')

    const store = new Vuex.Store({
      mutations: {
        [TEST] () {}
      }
    })
    store.commit(TEST, {}, { silent: true })

    expect(console.warn).toHaveBeenCalledWith(
      `[vuex] mutation type: ${TEST}. Silent option has been removed. ` +
      'Use the filter functionality in the vue-devtools'
    )
  })

  it('strict mode: warn mutations outside of handlers', function () {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      strict: true
    })
    Vue.config.silent = true
    expect(() => { store.state.a++ }).toThrow()
    Vue.config.silent = false
  })

  it('watch: with resetting vm', done => {
    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        [TEST]: state => state.count++
      }
    })

    const spy = jasmine.createSpy()
    store.watch(state => state.count, spy)

    // reset store vm
    store.registerModule('test', {})

    Vue.nextTick(() => {
      store.commit(TEST)
      expect(store.state.count).toBe(1)

      Vue.nextTick(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
  })

  it('watch: getter function has access to store\'s getters object', done => {
    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        [TEST]: state => state.count++
      },
      getters: {
        getCount: state => state.count
      }
    })

    const getter = function getter (state, getters) {
      return state.count
    }
    const spy = spyOn({ getter }, 'getter').and.callThrough()
    const spyCb = jasmine.createSpy()

    store.watch(spy, spyCb)

    Vue.nextTick(() => {
      store.commit(TEST)
      expect(store.state.count).toBe(1)

      Vue.nextTick(() => {
        expect(spy).toHaveBeenCalledWith(store.state, store.getters)
        done()
      })
    })
  })
})

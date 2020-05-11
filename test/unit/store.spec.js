import { nextTick } from 'vue'
import { mount } from 'test/helpers'
import Vuex from '@/index'

const TEST = 'TEST'
const isSSR = process.env.VUE_ENV === 'server'

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
    }).toThrowError(/expects string as the type, but found undefined/)
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
    const spy = jest.fn()
    store._devtoolHook = {
      emit: spy
    }
    const thenSpy = jest.fn()
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
    }).toThrowError(/expects string as the type, but found undefined/)
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
    const vm = mount(store, {})
    expect(vm.$store).toBe(store)
  })

  it('should warn silent option depreciation', () => {
    jest.spyOn(console, 'warn').mockImplementation()

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

  it('asserts the call with the new operator', () => {
    expect(() => {
      Vuex.Store({})
    }).toThrowError(/Cannot call a class as a function/)
  })

  it('should accept state as function', () => {
    const store = new Vuex.Store({
      state: () => ({
        a: 1
      }),
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      }
    })
    expect(store.state.a).toBe(1)
    store.commit(TEST, 2)
    expect(store.state.a).toBe(3)
  })

  it('should not call root state function twice', () => {
    const spy = jest.fn().mockReturnValue(1)
    new Vuex.Store({
      state: spy
    })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('subscribe: should handle subscriptions / unsubscriptions', () => {
    const subscribeSpy = jest.fn()
    const secondSubscribeSpy = jest.fn()
    const testPayload = 2
    const store = new Vuex.Store({
      state: {},
      mutations: {
        [TEST]: () => {}
      }
    })

    const unsubscribe = store.subscribe(subscribeSpy)
    store.subscribe(secondSubscribeSpy)
    store.commit(TEST, testPayload)
    unsubscribe()
    store.commit(TEST, testPayload)

    expect(subscribeSpy).toHaveBeenCalledWith(
      { type: TEST, payload: testPayload },
      store.state
    )
    expect(secondSubscribeSpy).toHaveBeenCalled()
    expect(subscribeSpy).toHaveBeenCalledTimes(1)
    expect(secondSubscribeSpy).toHaveBeenCalledTimes(2)
  })

  it('subscribe: should handle subscriptions with synchronous unsubscriptions', () => {
    const subscribeSpy = jest.fn()
    const testPayload = 2
    const store = new Vuex.Store({
      state: {},
      mutations: {
        [TEST]: () => {}
      }
    })

    const unsubscribe = store.subscribe(() => unsubscribe())
    store.subscribe(subscribeSpy)
    store.commit(TEST, testPayload)

    expect(subscribeSpy).toHaveBeenCalledWith(
      { type: TEST, payload: testPayload },
      store.state
    )
    expect(subscribeSpy).toHaveBeenCalledTimes(1)
  })

  it('subscribeAction: should handle subscriptions with synchronous unsubscriptions', () => {
    const subscribeSpy = jest.fn()
    const testPayload = 2
    const store = new Vuex.Store({
      state: {},
      actions: {
        [TEST]: () => {}
      }
    })

    const unsubscribe = store.subscribeAction(() => unsubscribe())
    store.subscribeAction(subscribeSpy)
    store.dispatch(TEST, testPayload)

    expect(subscribeSpy).toHaveBeenCalledWith(
      { type: TEST, payload: testPayload },
      store.state
    )
    expect(subscribeSpy).toHaveBeenCalledTimes(1)
  })

  // store.watch should only be asserted in non-SSR environment
  if (!isSSR) {
    it('watch: with resetting vm', done => {
      const store = new Vuex.Store({
        state: {
          count: 0
        },
        mutations: {
          [TEST]: state => state.count++
        }
      })

      const spy = jest.fn()
      store.watch(state => state.count, spy)

      // reset store vm
      store.registerModule('test', {})

      nextTick(() => {
        store.commit(TEST)
        expect(store.state.count).toBe(1)

        nextTick(() => {
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
      const spy = jest.spyOn({ getter }, 'getter')
      const spyCb = jest.fn()

      store.watch(spy, spyCb)

      nextTick(() => {
        store.commit(TEST)
        expect(store.state.count).toBe(1)

        nextTick(() => {
          expect(spy).toHaveBeenCalledWith(store.state, store.getters)
          done()
        })
      })
    })
  }
})

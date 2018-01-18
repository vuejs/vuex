import Vuex from '../../dist/vuex.common.js'
import { unifyObjectStyle,
         getNestedState,
         install,
         enableStrictMode,
         registerGetter,
         registerMutation,
         registerAction
       } from '../../src/store'
// without vuex
import Vue from 'vue/dist/vue.js'
const isSSR = process.env.VUE_ENV === 'server'

describe('Basic function', () => {
  it('unifyObjectStyle function', () => {
    expect(unifyObjectStyle('submit', { name: 'vuex' }, { op1: 1, op2: 2 })).toEqual({ type: 'submit', payload: { name: 'vuex' }, options: { op1: 1, op2: 2 }})

    expect(unifyObjectStyle({ type: 'submit', name: 'vuex' }, { op1: 1, op2: 2 })).toEqual({ type: 'submit', payload: { type: 'submit', name: 'vuex' }, options: { op1: 1, op2: 2 }})

    expect(unifyObjectStyle.bind(null, { type: 12, name: 'vuex' }, { op1: 1, op2: 2 })).toThrowError('[vuex] Expects string as the type, but found number.')
  })

  it('getNestedState function', () => {
    const a = {
      name: 'a',
      age: 12
    }

    const b = {
      a: a,
      name: 'b',
      age: 23
    }

    const state = {
      name: 'vuex',
      age: 3,
      b: b
    }

    expect(getNestedState(state, [])).toEqual(state)
    expect(getNestedState(state, ['b'])).toEqual(b)
    expect(getNestedState(state, ['b', 'a'])).toEqual(a)
    expect(getNestedState(state, ['name'])).toEqual('vuex')
  })

  it('install function', () => {
    // before install
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        mutation1: () => {},
        mutation2: () => {}
      },
      getters: {
        getter1: () => {},
        getter2: () => {}
      }
    })

    const vue1 = new Vue({
      attr1: {
        start: true
      },
      store: store
    })

    expect(vue1.$store).toEqual(undefined)

    // after install
    install(Vue)

    const vue2 = new Vue({
      attr1: {
        start: true
      },
      store: store
    })
    expect(vue2.$store).toEqual(store)
  })

  if (!isSSR) {
    it('enableStrictMode', () => {
      const store = new Vuex.Store({
        state: {
          a: 1
        },
        mutations: {
          mutation1: () => {},
          mutation2: () => {}
        },
        getters: {
          getter1: () => {},
          getter2: () => {}
        }
      })

      function change () {
        // different object
        store.state.a = Object.create({})
      }

      expect(change()).toEqual(undefined)

      enableStrictMode(store)

      expect(change.bind(null)).toThrow(new Error('[vuex] Do not mutate vuex store state outside mutation handlers.'))
    })
  }

  it('registerGetter function', () => {
    const example = {
      state: {
        name: 'example',
        age: 23
      },
      getters: {
        getter1: () => {},
        getter2: () => {}
      }
    }
    const rootStore = {
      _wrappedGetters: Object.create(null)
    }

    const store = {
      state: {
        name: 'vuex',
        age: 12
      },
      getters: {
        getter1: () => {}
      }
    }

    const rawGetterFunction = function () {
      return arguments
    }

    registerGetter(rootStore, 'example', rawGetterFunction, example)
    const result = rootStore._wrappedGetters['example'].call(null, store)

    expect(result[0]).toBe(example.state)
    expect(result[1]).toBe(example.getters)
    expect(result[2]).toBe(store.state)
    expect(result[3]).toBe(store.getters)
  })

  it('registerMutation function', () => {
    const local = {
      state: 1000
    }

    const store = {
      number: 10,
      _mutations: Object.create(null)
    }

    function inspect (localState, payload) {
      expect(localState).toBe(1000)
      expect(this).toBe(store)
    }

    function double (localState, payload) {
      this.number = this.number * localState * payload
    }

    registerMutation(store, 'DOUBLE_NUMBER', double, local)
    store._mutations['DOUBLE_NUMBER'].pop()(2)
    expect(store.number).toBe(20000)

    registerMutation(store, 'INSPECT', inspect, local)
    store._mutations['INSPECT'].pop()(2)
  })

  it('registerAction function', () => {
    const local = {
      dispatch: () => {},
      commit: () => {},
      getters: {
        local1: 1,
        local2: 2
      },
      state: {
        state1: 1,
        state2: 2
      }
    }

    const store = {
      number: 1,
      getters: {
        rState1: 1,
        rState2: 2
      },
      state: {
        rGetter1: 1,
        rGetter2: 2
      },
      _actions: Object.create(null)
    }

    function plusNumber (attribute, payload, cb) {
      this.number = this.number + 10 + payload
      this.success = false
      cb.call(this)
    }

    function inspect (attribute, payload, cb) {
      expect(this).toBe(store)
      Array(...['commit', 'dispatch', 'state', 'getters']).forEach(function (item) {
        expect(attribute[item]).toBe(local[item])
      })

      expect(attribute['rootState']).toBe(store['state'])
      expect(attribute['rootGetters']).toBe(store['getters'])
    }

    // callback
    const callback = function () {
      this.success = true
    }

    registerAction(store, 'PLUS_NUMBER', plusNumber, local)
    store._actions['PLUS_NUMBER'].pop()(100, callback)
    expect(store.number).toBe(111)
    expect(store.success).toBe(true)

    registerAction(store, 'INSPECT', inspect, local)
    store._actions['INSPECT'].pop()(100, callback)
    expect(store.number).toBe(111)
    expect(store.success).toBe(true)
  })
})

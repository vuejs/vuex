import Vue from 'vue/dist/vue.common.js'
import Vuex from '../../dist/vuex.js'

const TEST = 'TEST'

describe('Plugins', () => {
  it('executes plugins function', function () {
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
            expect(state).toBe(store.state)
            mutations.push(mut)
          })
        }
      ]
    })
    expect(initState).toBe(store.state)
    store.commit(TEST, 2)
    expect(mutations.length).toBe(1)
    expect(mutations[0].type).toBe(TEST)
    expect(mutations[0].payload).toBe(2)
  })

  it('can inject into store context', async function (done) {
    const store = new Vuex.Store({
      state: { a: 1 },
      actions: {
        useFoo: ({ foo }) => foo
      },
      modules: {
        module: {
          actions: {
            moduleAction: ({ foo }) => foo
          }
        }
      },
      plugins: [
        (store, { registerInContext }) => {
          registerInContext('foo', 'foo')
        }
      ]
    })
    expect(await store.dispatch('useFoo')).toBe('foo')
    expect(await store.dispatch('moduleAction')).toBe(undefined)
    done()
  })

  it('can inject into modules context', async function (done) {
    const store = new Vuex.Store({
      state: { a: 1 },
      actions: {
        useFoo: ({ foo }) => foo
      },
      modules: {
        module: {
          actions: {
            moduleAction: ({ foo }) => foo
          }
        }
      },
      plugins: [
        (store, { registerInContext }) => {
          registerInContext('module', 'foo', 'foo')
        }
      ]
    })
    expect(await store.dispatch('moduleAction')).toBe('foo')
    expect(await store.dispatch('useFoo')).toBe(undefined)
    done()
  })
})

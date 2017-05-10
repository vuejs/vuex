import Vuex from '../../dist/vuex.js'

const TEST = 'TEST'

describe('Modules', () => {
  describe('plugins in modules', () => {
    it('just in root', function () {
      const mutations = {
        [TEST] (state, n) {
          state.a += n
        }
      }
      let total = 0
      const plugins = [
        store => store.subscribe(({ payload }, state) => {
          total += payload
        })
      ]
      const store = new Vuex.Store({
        state: { a: 1 },
        mutations,
        plugins
      })
      store.commit(TEST, 1)
      expect(store.state.a).toBe(2)
      expect(total).toBe(1)
    })

    it('always call root subscriptions', function () {
      const mutations = {
        [TEST] (state, n) {
          state.a += n
        }
      }
      let total = 0
      const plugins = [
        store => store.subscribe(({ payload }, state) => {
          total += payload
        })
      ]
      const store = new Vuex.Store({
        state: { a: 1 },
        mutations,
        plugins, // +1 +1
        modules: {
          one: {
            namespaced: true,
            state: { a: 2 },
            mutations,
            plugins // +1
          }
        }
      })
      store.commit(TEST, 1)
      // mocking local commit
      store.commit(`one/${TEST}`, 1, null, 'one/')
      expect(store.state.a).toBe(2)
      expect(store.state.one.a).toBe(3)
      expect(total).toBe(3)
    })

    it('nested two level', function () {
      const mutations = {
        [TEST] (state, n) {
          state.a += n
        }
      }
      let total = 0
      const plugins = [
        store => store.subscribe(({ payload }, state) => {
          total += payload
        })
      ]
      const store = new Vuex.Store({
        state: { a: 1 },
        mutations,
        plugins, // +1 +1 +1
        modules: {
          one: {
            namespaced: true,
            state: { a: 2 },
            mutations,
            plugins, // +1 +1
            modules: {
              two: {
                namespaced: true,
                state: { a: 3 },
                mutations,
                plugins // +1
              }
            }
          }
        }
      })
      store.commit(TEST, 1)
      // mocking local commit
      store.commit(`one/${TEST}`, 1, null, 'one/')
      store.commit(`one/two/${TEST}`, 1, null, 'one/two/')
      expect(store.state.a).toBe(2)
      expect(store.state.one.a).toBe(3)
      expect(store.state.one.two.a).toBe(4)
      expect(total).toBe(6)
    })

    it('nested two level with siblings', function () {
      const mutations = {
        [TEST] (state, n) {
          state.a += n
        }
      }
      let total = 0
      const plugins = [
        store => store.subscribe(({ payload }, state) => {
          total += payload
        })
      ]
      const store = new Vuex.Store({
        state: { a: 1 },
        mutations,
        plugins, // +1 +1 +1 +1
        modules: {
          one: {
            namespaced: true,
            state: { a: 2 },
            mutations,
            plugins, // +1 +1
            modules: {
              two: {
                namespaced: true,
                state: { a: 3 },
                mutations,
                plugins // +1
              }
            }
          },
          another: {
            namespaced: true,
            state: { a: 4 },
            mutations,
            plugins // +1
          }
        }
      })
      store.commit(TEST, 1)
      // mocking local commit
      store.commit(`one/${TEST}`, 1, null, 'one/')
      store.commit(`another/${TEST}`, 1, null, 'another/')
      store.commit(`one/two/${TEST}`, 1, null, 'one/two/')
      expect(store.state.a).toBe(2)
      expect(store.state.one.a).toBe(3)
      expect(store.state.one.two.a).toBe(4)
      expect(total).toBe(8)
    })
  })
})

import 'babel-polyfill'
import Vue from 'vue/dist/vue.common.js'
import Vuex, { mapState, mapMutations, mapGetters, mapActions } from '../../dist/vuex.js'

Vue.use(Vuex)

const TEST = 'TEST'
const TEST2 = 'TEST2'

describe('Vuex', () => {
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

  it('getters', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      getters: {
        hasAny: state => state.a > 1
      },
      mutations: {
        [TEST] (state, n) {
          state.a += n
        }
      },
      actions: {
        check ({ getters }, value) {
          // check for exposing getters into actions
          expect(getters.hasAny).toBe(value)
        }
      }
    })
    expect(store.getters.hasAny).toBe(false)
    store.dispatch('check', false)

    store.commit(TEST, 1)

    expect(store.getters.hasAny).toBe(true)
    store.dispatch('check', true)
  })

  it('dynamic module registration', () => {
    const store = new Vuex.Store({
      strict: true,
      modules: {
        foo: {
          state: { bar: 1 },
          mutations: { inc: state => state.bar++ },
          actions: { incFoo: ({ commit }) => commit('inc') },
          getters: { bar: state => state.bar }
        }
      }
    })
    expect(() => {
      store.registerModule('hi', {
        state: { a: 1 },
        mutations: { inc: state => state.a++ },
        actions: { inc: ({ commit }) => commit('inc') },
        getters: { a: state => state.a }
      })
    }).not.toThrow()

    expect(store._mutations.inc.length).toBe(2)
    expect(store.state.hi.a).toBe(1)
    expect(store.getters.a).toBe(1)

    // assert initial modules work as expected after dynamic registration
    expect(store.state.foo.bar).toBe(1)
    expect(store.getters.bar).toBe(1)

    // test dispatching actions defined in dynamic module
    store.dispatch('inc')
    expect(store.state.hi.a).toBe(2)
    expect(store.getters.a).toBe(2)
    expect(store.state.foo.bar).toBe(2)
    expect(store.getters.bar).toBe(2)

    // unregister
    store.unregisterModule('hi')
    expect(store.state.hi).toBeUndefined()
    expect(store.getters.a).toBeUndefined()
    expect(store._mutations.inc.length).toBe(1)
    expect(store._actions.inc).toBeUndefined()

    // assert initial modules still work as expected after unregister
    store.dispatch('incFoo')
    expect(store.state.foo.bar).toBe(3)
    expect(store.getters.bar).toBe(3)
  })

  it('dynamic module registration with namespace inheritance', () => {
    const store = new Vuex.Store({
      modules: {
        a: {
          namespace: 'prefix/'
        }
      }
    })
    const actionSpy = jasmine.createSpy()
    const mutationSpy = jasmine.createSpy()
    store.registerModule(['a', 'b'], {
      state: { value: 1 },
      getters: { foo: state => state.value },
      actions: { foo: actionSpy },
      mutations: { foo: mutationSpy }
    })

    expect(store.state.a.b.value).toBe(1)
    expect(store.getters['prefix/foo']).toBe(1)

    store.dispatch('prefix/foo')
    expect(actionSpy).toHaveBeenCalled()

    store.commit('prefix/foo')
    expect(mutationSpy).toHaveBeenCalled()
  })

  it('store injection', () => {
    const store = new Vuex.Store()
    const vm = new Vue({
      store
    })
    const child = new Vue({ parent: vm })
    expect(child.$store).toBe(store)
  })

  it('helper: mapState (array)', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      }
    })
    const vm = new Vue({
      store,
      computed: mapState(['a'])
    })
    expect(vm.a).toBe(1)
    store.state.a++
    expect(vm.a).toBe(2)
  })

  it('helper: mapState (object)', () => {
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      getters: {
        b: () => 2
      }
    })
    const vm = new Vue({
      store,
      computed: mapState({
        a: (state, getters) => {
          return state.a + getters.b
        }
      })
    })
    expect(vm.a).toBe(3)
    store.state.a++
    expect(vm.a).toBe(4)
  })

  it('helper: mapMutations (array)', () => {
    const store = new Vuex.Store({
      state: { count: 0 },
      mutations: {
        inc: state => state.count++,
        dec: state => state.count--
      }
    })
    const vm = new Vue({
      store,
      methods: mapMutations(['inc', 'dec'])
    })
    vm.inc()
    expect(store.state.count).toBe(1)
    vm.dec()
    expect(store.state.count).toBe(0)
  })

  it('helper: mapMutations (object)', () => {
    const store = new Vuex.Store({
      state: { count: 0 },
      mutations: {
        inc: state => state.count++,
        dec: state => state.count--
      }
    })
    const vm = new Vue({
      store,
      methods: mapMutations({
        plus: 'inc',
        minus: 'dec'
      })
    })
    vm.plus()
    expect(store.state.count).toBe(1)
    vm.minus()
    expect(store.state.count).toBe(0)
  })

  it('helper: mapGetters (array)', () => {
    const store = new Vuex.Store({
      state: { count: 0 },
      mutations: {
        inc: state => state.count++,
        dec: state => state.count--
      },
      getters: {
        hasAny: ({ count }) => count > 0,
        negative: ({ count }) => count < 0
      }
    })
    const vm = new Vue({
      store,
      computed: mapGetters(['hasAny', 'negative'])
    })
    expect(vm.hasAny).toBe(false)
    expect(vm.negative).toBe(false)
    store.commit('inc')
    expect(vm.hasAny).toBe(true)
    expect(vm.negative).toBe(false)
    store.commit('dec')
    store.commit('dec')
    expect(vm.hasAny).toBe(false)
    expect(vm.negative).toBe(true)
  })

  it('helper: mapGetters (object)', () => {
    const store = new Vuex.Store({
      state: { count: 0 },
      mutations: {
        inc: state => state.count++,
        dec: state => state.count--
      },
      getters: {
        hasAny: ({ count }) => count > 0,
        negative: ({ count }) => count < 0
      }
    })
    const vm = new Vue({
      store,
      computed: mapGetters({
        a: 'hasAny',
        b: 'negative'
      })
    })
    expect(vm.a).toBe(false)
    expect(vm.b).toBe(false)
    store.commit('inc')
    expect(vm.a).toBe(true)
    expect(vm.b).toBe(false)
    store.commit('dec')
    store.commit('dec')
    expect(vm.a).toBe(false)
    expect(vm.b).toBe(true)
  })

  it('helper: mapActions (array)', () => {
    const a = jasmine.createSpy()
    const b = jasmine.createSpy()
    const store = new Vuex.Store({
      actions: {
        a,
        b
      }
    })
    const vm = new Vue({
      store,
      methods: mapActions(['a', 'b'])
    })
    vm.a()
    expect(a).toHaveBeenCalled()
    expect(b).not.toHaveBeenCalled()
    vm.b()
    expect(b).toHaveBeenCalled()
  })

  it('helper: mapActions (object)', () => {
    const a = jasmine.createSpy()
    const b = jasmine.createSpy()
    const store = new Vuex.Store({
      actions: {
        a,
        b
      }
    })
    const vm = new Vue({
      store,
      methods: mapActions({
        foo: 'a',
        bar: 'b'
      })
    })
    vm.foo()
    expect(a).toHaveBeenCalled()
    expect(b).not.toHaveBeenCalled()
    vm.bar()
    expect(b).toHaveBeenCalled()
  })

  it('module: mutation', function () {
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
    store.commit(TEST, 1)
    expect(store.state.a).toBe(2)
    expect(store.state.nested.a).toBe(3)
    expect(store.state.nested.one.a).toBe(4)
    expect(store.state.nested.nested.two.a).toBe(5)
    expect(store.state.nested.nested.three.a).toBe(6)
    expect(store.state.four.a).toBe(7)
  })

  it('module: action', function () {
    let calls = 0
    const makeAction = n => {
      return {
        [TEST] ({ state, rootState }) {
          calls++
          expect(state.a).toBe(n)
          expect(rootState).toBe(store.state)
        }
      }
    }
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      actions: makeAction(1),
      modules: {
        nested: {
          state: { a: 2 },
          actions: makeAction(2),
          modules: {
            one: {
              state: { a: 3 },
              actions: makeAction(3)
            },
            nested: {
              modules: {
                two: {
                  state: { a: 4 },
                  actions: makeAction(4)
                },
                three: {
                  state: { a: 5 },
                  actions: makeAction(5)
                }
              }
            }
          }
        },
        four: {
          state: { a: 6 },
          actions: makeAction(6)
        }
      }
    })
    store.dispatch(TEST)
    expect(calls).toBe(6)
  })

  it('module: getters', function () {
    const makeGetter = n => ({
      [`getter${n}`]: (state, getters, rootState) => {
        expect(getters.constant).toBe(0)
        expect(rootState).toBe(store.state)
        return state.a
      }
    })
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      getters: {
        constant: () => 0,
        ...makeGetter(1)
      },
      modules: {
        nested: {
          state: { a: 2 },
          getters: makeGetter(2),
          modules: {
            one: {
              state: { a: 3 },
              getters: makeGetter(3)
            },
            nested: {
              modules: {
                two: {
                  state: { a: 4 },
                  getters: makeGetter(4)
                },
                three: {
                  state: { a: 5 },
                  getters: makeGetter(5)
                }
              }
            }
          }
        },
        four: {
          state: { a: 6 },
          getters: makeGetter(6)
        }
      }
    })
    ;[1, 2, 3, 4, 5, 6].forEach(n => {
      expect(store.getters[`getter${n}`]).toBe(n)
    })
  })

  it('module: namespace string', () => {
    const actionSpy = jasmine.createSpy()
    const mutationSpy = jasmine.createSpy()

    const store = new Vuex.Store({
      modules: {
        a: {
          namespace: 'prefix/',
          state: {
            a: 1
          },
          getters: {
            b: () => 2
          },
          actions: {
            [TEST]: actionSpy
          },
          mutations: {
            [TEST]: mutationSpy
          }
        }
      }
    })

    expect(store.state.a.a).toBe(1)
    expect(store.getters['prefix/b']).toBe(2)
    store.dispatch('prefix/' + TEST)
    expect(actionSpy).toHaveBeenCalled()
    store.commit('prefix/' + TEST)
    expect(mutationSpy).toHaveBeenCalled()
  })

  it('module: namespace generator function', () => {
    const namespace = (type, category) => {
      return category + '/' + type
    }

    const actionSpy = jasmine.createSpy()
    const mutationSpy = jasmine.createSpy()

    const store = new Vuex.Store({
      modules: {
        a: {
          namespace,
          state: {
            a: 1
          },
          getters: {
            b: () => 2
          },
          actions: {
            [TEST]: actionSpy
          },
          mutations: {
            [TEST]: mutationSpy
          }
        }
      }
    })

    expect(store.state.a.a).toBe(1)
    expect(store.getters['getter/b']).toBe(2)
    store.dispatch('action/' + TEST)
    expect(actionSpy).toHaveBeenCalled()
    store.commit('mutation/' + TEST)
    expect(mutationSpy).toHaveBeenCalled()
  })

  it('module: nested namespace', () => {
    const prefixCategory = namespace => (type, category) => {
      return category + '-' + namespace + type
    }

    // mock module generator
    const actionSpys = []
    const mutationSpys = []
    const createModule = (name, namespace, children) => {
      const actionSpy = jasmine.createSpy()
      const mutationSpy = jasmine.createSpy()

      actionSpys.push(actionSpy)
      mutationSpys.push(mutationSpy)

      return {
        namespace,
        state: {
          [name]: true
        },
        getters: {
          [name]: state => state[name]
        },
        actions: {
          [name]: actionSpy
        },
        mutations: {
          [name]: mutationSpy
        },
        modules: children
      }
    }

    // mock module
    const modules = {
      a: createModule('a', 'a/', { // a/a
        b: createModule('b', null, { // a/b - does not add namespace
          c: createModule('c', 'c/') // a/c/c
        }),
        d: createModule('d', 'd/'), // a/d/d
        e: createModule('e', prefixCategory('e/'), { // a/(category)-e/e
          f: createModule('f', prefixCategory('f/')) // a/(category)-e/(category)-f/f
        })
      })
    }

    const store = new Vuex.Store({ modules })

    const expectedTypes = category => [
      'a/a', 'a/b', 'a/c/c', 'a/d/d',
      `a/${category}-e/e`, `a/${category}-e/${category}-f/f`
    ]

    // getters
    expectedTypes('getter').forEach(type => {
      expect(store.getters[type]).toBe(true)
    })

    // actions
    expectedTypes('action').forEach(type => {
      store.dispatch(type)
    })
    actionSpys.forEach(spy => {
      expect(spy.calls.count()).toBe(1)
    })

    // mutations
    expectedTypes('mutation').forEach(type => {
      store.commit(type)
    })
    mutationSpys.forEach(spy => {
      expect(spy.calls.count()).toBe(1)
    })
  })

  it('module: getters are namespaced in namespaced module', () => {
    const store = new Vuex.Store({
      state: { value: 'root' },
      getters: {
        foo: state => state.value
      },
      modules: {
        a: {
          namespace: 'prefix/',
          state: { value: 'module' },
          getters: {
            foo: state => state.value,
            bar: (state, getters) => getters.foo,
            baz: (state, getters, rootState, rootGetters) => rootGetters.foo
          }
        }
      }
    })

    expect(store.getters['prefix/foo']).toBe('module')
    expect(store.getters['prefix/bar']).toBe('module')
    expect(store.getters['prefix/baz']).toBe('root')
  })

  it('module: action context is namespaced in namespaced module', done => {
    const rootActionSpy = jasmine.createSpy()
    const rootMutationSpy = jasmine.createSpy()
    const moduleActionSpy = jasmine.createSpy()
    const moduleMutationSpy = jasmine.createSpy()

    const store = new Vuex.Store({
      state: { value: 'root' },
      getters: { foo: state => state.value },
      actions: { foo: rootActionSpy },
      mutations: { foo: rootMutationSpy },
      modules: {
        a: {
          namespace: 'prefix/',
          state: { value: 'module' },
          getters: { foo: state => state.value },
          actions: {
            foo: moduleActionSpy,
            test ({ dispatch, commit, getters, rootGetters }) {
              expect(getters.foo).toBe('module')
              expect(rootGetters.foo).toBe('root')

              dispatch('foo')
              expect(moduleActionSpy.calls.count()).toBe(1)
              dispatch('foo', null, { root: true })
              expect(rootActionSpy.calls.count()).toBe(1)

              commit('foo')
              expect(moduleMutationSpy.calls.count()).toBe(1)
              commit('foo', null, { root: true })
              expect(rootMutationSpy.calls.count()).toBe(1)

              done()
            }
          },
          mutations: { foo: moduleMutationSpy }
        }
      }
    })

    store.dispatch('prefix/test')
  })

  it('dispatching multiple actions in different modules', done => {
    const store = new Vuex.Store({
      modules: {
        a: {
          actions: {
            [TEST] () {
              return 1
            }
          }
        },
        b: {
          actions: {
            [TEST] () {
              return new Promise(r => r(2))
            }
          }
        }
      }
    })
    store.dispatch(TEST).then(res => {
      expect(res[0]).toBe(1)
      expect(res[1]).toBe(2)
      done()
    })
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

  it('plugins should ignore silent mutations', function () {
    let initState
    const mutations = []
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      mutations: {
        [TEST] (state, { n }) {
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
    store.commit(TEST, { n: 1 })
    store.commit({
      type: TEST,
      n: 2
    })
    store.commit(TEST, { n: 3 }, { silent: true })
    store.commit({
      type: TEST,
      n: 4
    }, {
      silent: true
    })
    expect(mutations.length).toBe(2)
    expect(mutations[0].type).toBe(TEST)
    expect(mutations[1].type).toBe(TEST)
    expect(mutations[0].payload.n).toBe(1) // normal commit
    expect(mutations[1].payload.n).toBe(2) // object commit
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

  it('hot reload: mutations', function () {
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
    store.commit(TEST, 1)
    expect(store.state.a).toBe(2)
    expect(store.state.nested.a).toBe(3)
    expect(store.state.nested.one.a).toBe(4)
    expect(store.state.nested.nested.two.a).toBe(5)
    expect(store.state.nested.nested.three.a).toBe(6)
    expect(store.state.four.a).toBe(7)

    // hot reload only root mutations
    store.hotUpdate({
      mutations: {
        [TEST] (state, n) {
          state.a = n
        }
      }
    })
    store.commit(TEST, 1)
    expect(store.state.a).toBe(1) // only root mutation updated
    expect(store.state.nested.a).toBe(4)
    expect(store.state.nested.one.a).toBe(5)
    expect(store.state.nested.nested.two.a).toBe(6)
    expect(store.state.nested.nested.three.a).toBe(7)
    expect(store.state.four.a).toBe(8)

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
    store.commit(TEST, 2)
    expect(store.state.a).toBe(2)
    expect(store.state.nested.a).toBe(6) // should not reload initial state
    expect(store.state.nested.one.a).toBe(7) // should not reload initial state
    expect(store.state.nested.nested.two.a).toBe(8) // should not reload initial state
    expect(store.state.nested.nested.three.a).toBe(9) // should not reload initial state
    expect(store.state.four.a).toBe(10) // should not reload initial state

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
    store.commit(TEST, 3)
    expect(store.state.a).toBe(-1)
    expect(store.state.nested.a).toBe(9)
    expect(store.state.nested.one.a).toBe(10)
    expect(store.state.nested.nested.two.a).toBe(11)
    expect(store.state.nested.nested.three.a).toBe(6)
    expect(store.state.four.a).toBe(7)
  })

  it('hot reload: actions', () => {
    const store = new Vuex.Store({
      state: {
        list: []
      },
      mutations: {
        [TEST] (state, n) {
          state.list.push(n)
        }
      },
      actions: {
        [TEST] ({ commit }) {
          commit(TEST, 1)
        }
      },
      modules: {
        a: {
          actions: {
            [TEST] ({ commit }) {
              commit(TEST, 2)
            }
          }
        }
      }
    })
    store.dispatch(TEST)
    expect(store.state.list.join()).toBe('1,2')

    // update root
    store.hotUpdate({
      actions: {
        [TEST] ({ commit }) {
          commit(TEST, 3)
        }
      }
    })
    store.dispatch(TEST)
    expect(store.state.list.join()).toBe('1,2,3,2')

    // update modules
    store.hotUpdate({
      actions: {
        [TEST] ({ commit }) {
          commit(TEST, 4)
        }
      },
      modules: {
        a: {
          actions: {
            [TEST] ({ commit }) {
              commit(TEST, 5)
            }
          }
        }
      }
    })
    store.dispatch(TEST)
    expect(store.state.list.join()).toBe('1,2,3,2,4,5')
  })

  it('hot reload: getters', done => {
    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        inc: state => state.count++
      },
      getters: {
        count: state => state.count
      },
      actions: {
        check ({ getters }, value) {
          expect(getters.count).toBe(value)
        }
      }
    })

    const spy = jasmine.createSpy()
    const vm = new Vue({
      computed: {
        a: () => store.getters.count
      },
      watch: {
        a: spy
      }
    })

    expect(vm.a).toBe(0)
    store.dispatch('check', 0)

    store.commit('inc')

    expect(vm.a).toBe(1)
    store.dispatch('check', 1)

    // update getters
    store.hotUpdate({
      getters: {
        count: state => state.count * 10
      }
    })

    expect(vm.a).toBe(10)
    store.dispatch('check', 10)

    Vue.nextTick(() => {
      expect(spy).toHaveBeenCalled()
      done()
    })
  })

  it('hot reload: provide warning if a new module is given', () => {
    const store = new Vuex.Store({})

    spyOn(console, 'warn')

    store.hotUpdate({
      modules: {
        test: {
          state: {
            count: 0
          }
        }
      }
    })

    expect(console.warn).toHaveBeenCalledWith(
      '[vuex] trying to add a new module \'test\' on hot reloading, ' +
      'manual reload is needed'
    )
  })

  it('hot reload: update namespace', () => {
    // prevent to print notification of unknown action/mutation
    spyOn(console, 'error')

    const actionSpy = jasmine.createSpy()
    const mutationSpy = jasmine.createSpy()

    const store = new Vuex.Store({
      modules: {
        a: {
          namespace: 'prefix/',
          state: { value: 1 },
          getters: { foo: state => state.value },
          actions: { foo: actionSpy },
          mutations: { foo: mutationSpy }
        }
      }
    })

    expect(store.state.a.value).toBe(1)
    expect(store.getters['prefix/foo']).toBe(1)
    store.dispatch('prefix/foo')
    expect(actionSpy.calls.count()).toBe(1)
    store.commit('prefix/foo')
    expect(actionSpy.calls.count()).toBe(1)

    store.hotUpdate({
      modules: {
        a: {
          namespace: 'prefix-changed/'
        }
      }
    })

    expect(store.state.a.value).toBe(1)
    expect(store.getters['prefix/foo']).toBe(undefined) // removed
    expect(store.getters['prefix-changed/foo']).toBe(1) // renamed

    // should not be called
    store.dispatch('prefix/foo')
    expect(actionSpy.calls.count()).toBe(1)

    // should be called
    store.dispatch('prefix-changed/foo')
    expect(actionSpy.calls.count()).toBe(2)

    // should not be called
    store.commit('prefix/foo')
    expect(mutationSpy.calls.count()).toBe(1)

    // should be called
    store.commit('prefix-changed/foo')
    expect(mutationSpy.calls.count()).toBe(2)
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
})

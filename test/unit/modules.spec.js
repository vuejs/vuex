import Vue from 'vue/dist/vue.common.js'
import Vuex from '../../dist/vuex.js'

const TEST = 'TEST'

describe('Modules', () => {
  describe('module registration', () => {
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
            namespaced: true
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
      expect(store.getters['a/foo']).toBe(1)

      store.dispatch('a/foo')
      expect(actionSpy).toHaveBeenCalled()

      store.commit('a/foo')
      expect(mutationSpy).toHaveBeenCalled()
    })
  })

  // #524
  it('should not fire an unrelated watcher', done => {
    const spy = jasmine.createSpy()
    const store = new Vuex.Store({
      modules: {
        a: {
          state: { value: 1 }
        },
        b: {}
      }
    })

    store.watch(state => state.a, spy)
    store.registerModule(['b', 'c'], {
      state: { value: 2 }
    })
    Vue.nextTick(() => {
      expect(spy).not.toHaveBeenCalled()
      done()
    })
  })

  describe('modules usage', () => {
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

    it('module: namespace', () => {
      const actionSpy = jasmine.createSpy()
      const mutationSpy = jasmine.createSpy()

      const store = new Vuex.Store({
        modules: {
          a: {
            namespaced: true,
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
      expect(store.getters['a/b']).toBe(2)
      store.dispatch('a/' + TEST)
      expect(actionSpy).toHaveBeenCalled()
      store.commit('a/' + TEST)
      expect(mutationSpy).toHaveBeenCalled()
    })

    it('module: nested namespace', () => {
      // mock module generator
      const actionSpys = []
      const mutationSpys = []
      const createModule = (name, namespaced, children) => {
        const actionSpy = jasmine.createSpy()
        const mutationSpy = jasmine.createSpy()

        actionSpys.push(actionSpy)
        mutationSpys.push(mutationSpy)

        return {
          namespaced,
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
        a: createModule('a', true, { // a/a
          b: createModule('b', false, { // a/b - does not add namespace
            c: createModule('c', true) // a/c/c
          }),
          d: createModule('d', true), // a/d/d
        })
      }

      const store = new Vuex.Store({ modules })

      const expectedTypes = [
        'a/a', 'a/b', 'a/c/c', 'a/d/d'
      ]

      // getters
      expectedTypes.forEach(type => {
        expect(store.getters[type]).toBe(true)
      })

      // actions
      expectedTypes.forEach(type => {
        store.dispatch(type)
      })
      actionSpys.forEach(spy => {
        expect(spy.calls.count()).toBe(1)
      })

      // mutations
      expectedTypes.forEach(type => {
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
            namespaced: true,
            state: { value: 'module' },
            getters: {
              foo: state => state.value,
              bar: (state, getters) => getters.foo,
              baz: (state, getters, rootState, rootGetters) => rootGetters.foo
            }
          }
        }
      })

      expect(store.getters['a/foo']).toBe('module')
      expect(store.getters['a/bar']).toBe('module')
      expect(store.getters['a/baz']).toBe('root')
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
            namespaced: true,
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

      store.dispatch('a/test')
    })

    it('module: use other module that has same namespace', done => {
      const actionSpy = jasmine.createSpy()
      const mutationSpy = jasmine.createSpy()

      const store = new Vuex.Store({
        modules: {
          parent: {
            namespaced: true,

            modules: {
              a: {
                state: { value: 'a' },
                getters: { foo: state => state.value },
                actions: { foo: actionSpy },
                mutations: { foo: mutationSpy }
              },

              b: {
                state: { value: 'b' },
                getters: { bar: (state, getters) => getters.foo },
                actions: {
                  test ({ dispatch, commit, getters }) {
                    expect(getters.foo).toBe('a')
                    expect(getters.bar).toBe('a')

                    dispatch('foo')
                    expect(actionSpy).toHaveBeenCalled()

                    commit('foo')
                    expect(mutationSpy).toHaveBeenCalled()

                    done()
                  }
                }
              }
            }
          }
        }
      })

      store.dispatch('parent/test')
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
  })
})

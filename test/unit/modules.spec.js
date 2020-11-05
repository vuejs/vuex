import Vue from 'vue'
import Vuex from '../../src/index'

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
      const actionSpy = jest.fn()
      const mutationSpy = jest.fn()
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

    it('dynamic module existance test', () => {
      const store = new Vuex.Store({})

      store.registerModule('bonjour', {})

      expect(store.hasModule('bonjour')).toBe(true)
      store.unregisterModule('bonjour')
      expect(store.hasModule('bonjour')).toBe(false)
    })

    it('dynamic module existance test with nested modules', () => {
      const store = new Vuex.Store({})

      store.registerModule('a', {})
      store.registerModule(['a', 'b'], {})

      expect(store.hasModule(['a'])).toBe(true)
      expect(store.hasModule(['a', 'b'])).toBe(true)
      expect(store.hasModule(['c'])).toBe(false)
      expect(store.hasModule(['c', 'd'])).toBe(false)
    })

    it('dynamic module registration preserving hydration', () => {
      const store = new Vuex.Store({})
      store.replaceState({ a: { foo: 'state' }})
      const actionSpy = jest.fn()
      const mutationSpy = jest.fn()
      store.registerModule('a', {
        namespaced: true,
        getters: { foo: state => state.foo },
        actions: { foo: actionSpy },
        mutations: { foo: mutationSpy }
      }, { preserveState: true })

      expect(store.state.a.foo).toBe('state')
      expect(store.getters['a/foo']).toBe('state')

      store.dispatch('a/foo')
      expect(actionSpy).toHaveBeenCalled()

      store.commit('a/foo')
      expect(mutationSpy).toHaveBeenCalled()
    })
  })

  // #524
  it('should not fire an unrelated watcher', done => {
    const spy = jest.fn()
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
    it('state as function (multiple module in same store)', () => {
      const module = {
        state () {
          return { a: 0 }
        },
        mutations: {
          [TEST] (state, n) {
            state.a += n
          }
        }
      }

      const store = new Vuex.Store({
        modules: {
          one: module,
          two: module
        }
      })

      expect(store.state.one.a).toBe(0)
      expect(store.state.two.a).toBe(0)

      store.commit(TEST, 1)
      expect(store.state.one.a).toBe(1)
      expect(store.state.two.a).toBe(1)
    })

    it('state as function (same module in multiple stores)', () => {
      const module = {
        state () {
          return { a: 0 }
        },
        mutations: {
          [TEST] (state, n) {
            state.a += n
          }
        }
      }

      const storeA = new Vuex.Store({
        modules: {
          foo: module
        }
      })

      const storeB = new Vuex.Store({
        modules: {
          bar: module
        }
      })

      expect(storeA.state.foo.a).toBe(0)
      expect(storeB.state.bar.a).toBe(0)

      storeA.commit(TEST, 1)
      expect(storeA.state.foo.a).toBe(1)
      expect(storeB.state.bar.a).toBe(0)

      storeB.commit(TEST, 2)
      expect(storeA.state.foo.a).toBe(1)
      expect(storeB.state.bar.a).toBe(2)
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

    it('module: namespace', () => {
      const actionSpy = jest.fn()
      const mutationSpy = jest.fn()

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
        const actionSpy = jest.fn()
        const mutationSpy = jest.fn()

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
          d: createModule('d', true) // a/d/d
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
        expect(spy).toHaveBeenCalledTimes(1)
      })

      // mutations
      expectedTypes.forEach(type => {
        store.commit(type)
      })
      mutationSpys.forEach(spy => {
        expect(spy).toHaveBeenCalledTimes(1)
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
      const rootActionSpy = jest.fn()
      const rootMutationSpy = jest.fn()
      const moduleActionSpy = jest.fn()
      const moduleMutationSpy = jest.fn()

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
                expect(moduleActionSpy).toHaveBeenCalledTimes(1)
                dispatch('foo', null, { root: true })
                expect(rootActionSpy).toHaveBeenCalledTimes(1)

                commit('foo')
                expect(moduleMutationSpy).toHaveBeenCalledTimes(1)
                commit('foo', null, { root: true })
                expect(rootMutationSpy).toHaveBeenCalledTimes(1)

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
      const actionSpy = jest.fn()
      const mutationSpy = jest.fn()

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

    it('module: warn when module overrides state', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      const store = new Vuex.Store({
        modules: {
          foo: {
            state () {
              return { value: 1 }
            },
            modules: {
              value: {
                state: () => 2
              }
            }
          }
        }
      })
      expect(store.state.foo.value).toBe(2)
      expect(console.warn).toHaveBeenCalledWith(
        `[vuex] state field "value" was overridden by a module with the same name at "foo.value"`
      )
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

    it('root actions dispatched in namespaced modules', done => {
      const store = new Vuex.Store({
        modules: {
          a: {
            namespaced: true,
            actions: {
              [TEST]: {
                root: true,
                handler () {
                  return 1
                }
              }
            }
          },
          b: {
            namespaced: true,
            actions: {
              [TEST]: {
                root: true,
                handler () {
                  return new Promise(r => r(2))
                }
              }
            }
          },
          c: {
            namespaced: true,
            actions: {
              [TEST]: {
                handler () {
                  // Should not be called
                  return 3
                }
              }
            }
          },
          d: {
            namespaced: true,
            actions: {
              [TEST] () {
                // Should not be called
                return 4
              }
            }
          }
        }
      })
      store.dispatch(TEST).then(res => {
        expect(res.length).toBe(2)
        expect(res[0]).toBe(1)
        expect(res[1]).toBe(2)
        done()
      })
    })

    it('plugins', function () {
      let initState
      const actionSpy = jest.fn()
      const mutations = []
      const subscribeActionSpy = jest.fn()
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
          [TEST]: actionSpy
        },
        plugins: [
          store => {
            initState = store.state
            store.subscribe((mut, state) => {
              expect(state).toBe(state)
              mutations.push(mut)
            })
            store.subscribeAction(subscribeActionSpy)
          }
        ]
      })
      expect(initState).toBe(store.state)
      store.commit(TEST, 2)
      store.dispatch(TEST, 2)
      expect(mutations.length).toBe(1)
      expect(mutations[0].type).toBe(TEST)
      expect(mutations[0].payload).toBe(2)
      expect(actionSpy).toHaveBeenCalled()
      expect(subscribeActionSpy).toHaveBeenCalledWith(
        { type: TEST, payload: 2 },
        store.state
      )
    })

    it('action before/after subscribers', (done) => {
      const beforeSpy = jest.fn()
      const afterSpy = jest.fn()
      const store = new Vuex.Store({
        actions: {
          [TEST]: () => Promise.resolve()
        },
        plugins: [
          store => {
            store.subscribeAction({
              before: beforeSpy,
              after: afterSpy
            })
          }
        ]
      })
      store.dispatch(TEST, 2)
      expect(beforeSpy).toHaveBeenCalledWith(
        { type: TEST, payload: 2 },
        store.state
      )
      expect(afterSpy).not.toHaveBeenCalled()
      Vue.nextTick(() => {
        expect(afterSpy).toHaveBeenCalledWith(
          { type: TEST, payload: 2 },
          store.state
        )
        done()
      })
    })
  })

  it('action error subscribers', (done) => {
    const beforeSpy = jest.fn()
    const afterSpy = jest.fn()
    const errorSpy = jest.fn()
    const error = new Error()
    const store = new Vuex.Store({
      actions: {
        [TEST]: () => Promise.reject(error)
      },
      plugins: [
        store => {
          store.subscribeAction({
            before: beforeSpy,
            after: afterSpy,
            error: errorSpy
          })
        }
      ]
    })
    store.dispatch(TEST, 2).catch(() => {
      expect(beforeSpy).toHaveBeenCalledWith(
        { type: TEST, payload: 2 },
        store.state
      )
      expect(afterSpy).not.toHaveBeenCalled()
      Vue.nextTick(() => {
        expect(afterSpy).not.toHaveBeenCalledWith(
          { type: TEST, payload: 2 },
          store.state
        )
        expect(errorSpy).toHaveBeenCalledWith(
          { type: TEST, payload: 2 },
          store.state,
          error
        )
        done()
      })
    })
  })

  it('asserts a mutation should be a function', () => {
    expect(() => {
      new Vuex.Store({
        mutations: {
          test: null
        }
      })
    }).toThrowError(
      /mutations should be function but "mutations\.test" is null/
    )

    expect(() => {
      new Vuex.Store({
        modules: {
          foo: {
            modules: {
              bar: {
                mutations: {
                  test: 123
                }
              }
            }
          }
        }
      })
    }).toThrowError(
      /mutations should be function but "mutations\.test" in module "foo\.bar" is 123/
    )
  })

  it('asserts an action should be a function', () => {
    expect(() => {
      new Vuex.Store({
        actions: {
          test: 'test'
        }
      })
    }).toThrowError(
      /actions should be function or object with "handler" function but "actions\.test" is "test"/
    )

    expect(() => {
      new Vuex.Store({
        modules: {
          foo: {
            modules: {
              bar: {
                actions: {
                  test: 'error'
                }
              }
            }
          }
        }
      })
    }).toThrowError(
      /actions should be function or object with "handler" function but "actions\.test" in module "foo\.bar" is "error"/
    )
  })

  it('asserts a getter should be a function', () => {
    expect(() => {
      new Vuex.Store({
        getters: {
          test: undefined
        }
      })
    }).toThrowError(
      /getters should be function but "getters\.test" is undefined/
    )

    expect(() => {
      new Vuex.Store({
        modules: {
          foo: {
            modules: {
              bar: {
                getters: {
                  test: true
                }
              }
            }
          }
        }
      })
    }).toThrowError(
      /getters should be function but "getters\.test" in module "foo\.bar" is true/
    )
  })
})

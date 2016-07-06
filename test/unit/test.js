import 'babel-polyfill'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import Vue from 'vue'
import Vuex, { mapGetters, mapActions } from '../../build/dev-entry'

Vue.use(Vuex)
chai.use(sinonChai)

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
    expect(store.state.a).to.equal(3)
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
    expect(store.state.a).to.equal(3)
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
    expect(store.state.a).to.equal(1)
    store.dispatch(TEST, 2).then(() => {
      expect(store.state.a).to.equal(3)
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
          expect(store.state.a).to.equal(2)
          commit(TEST, n)
        }
      }
    })
    expect(store.state.a).to.equal(1)
    store.dispatch('two', 3).then(() => {
      expect(store.state.a).to.equal(5)
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
    const spy = sinon.spy()
    store._devtoolHook = {
      emit: spy
    }
    const thenSpy = sinon.spy()
    store.dispatch(TEST)
      .then(thenSpy)
      .catch(err => {
        expect(thenSpy).not.to.have.been.called
        expect(err).to.equal('no')
        expect(spy).to.have.been.calledWith('vuex:error', 'no')
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
      }
    })
    expect(store.getters.hasAny).to.equal(false)
    store.commit(TEST, 1)
    expect(store.getters.hasAny).to.equal(true)
  })

  it('store injection', () => {
    const store = new Vuex.Store()
    const vm = new Vue({
      store
    })
    const child = new Vue({ parent: vm })
    expect(child.$store).to.equal(store)
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
    expect(vm.hasAny).to.equal(false)
    expect(vm.negative).to.equal(false)
    store.commit('inc')
    expect(vm.hasAny).to.equal(true)
    expect(vm.negative).to.equal(false)
    store.commit('dec')
    store.commit('dec')
    expect(vm.hasAny).to.equal(false)
    expect(vm.negative).to.equal(true)
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
    expect(vm.a).to.equal(false)
    expect(vm.b).to.equal(false)
    store.commit('inc')
    expect(vm.a).to.equal(true)
    expect(vm.b).to.equal(false)
    store.commit('dec')
    store.commit('dec')
    expect(vm.a).to.equal(false)
    expect(vm.b).to.equal(true)
  })

  it('helper: mapActions (array)', () => {
    const a = sinon.spy()
    const b = sinon.spy()
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
    expect(a).to.have.been.called
    expect(b).not.to.have.been.called
    vm.b()
    expect(b).to.have.been.called
  })

  it('helper: mapActions (object)', () => {
    const a = sinon.spy()
    const b = sinon.spy()
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
    expect(a).to.have.been.called
    expect(b).not.to.have.been.called
    vm.bar()
    expect(b).to.have.been.called
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
    expect(store.state.a).to.equal(2)
    expect(store.state.nested.a).to.equal(3)
    expect(store.state.nested.one.a).to.equal(4)
    expect(store.state.nested.nested.two.a).to.equal(5)
    expect(store.state.nested.nested.three.a).to.equal(6)
    expect(store.state.four.a).to.equal(7)
  })

  it('module: action', function () {
    let calls = 0
    const makeAction = n => {
      return {
        [TEST] ({ state }) {
          calls++
          expect(state.a).to.equal(n)
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
    expect(calls).to.equal(6)
  })

  it('module: getters', function () {
    const makeGetter = n => ({
      [`getter${n}`]: state => state.a
    })
    const store = new Vuex.Store({
      state: {
        a: 1
      },
      getters: makeGetter(1),
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
      expect(store.getters[`getter${n}`]).to.equal(n)
    })
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
      expect(res[0]).to.equal(1)
      expect(res[1]).to.equal(2)
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
            expect(state).to.equal(store.state)
            mutations.push(mut)
          })
        }
      ]
    })
    expect(initState).to.equal(store.state)
    store.commit(TEST, 2)
    expect(mutations.length).to.equal(1)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[0].payload).to.equal(2)
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
            expect(state).to.equal(store.state)
            mutations.push(mut)
          })
        }
      ]
    })
    expect(initState).to.equal(store.state)
    store.commit(TEST, { n: 1 })
    store.commit({
      type: TEST,
      n: 2
    })
    store.commit({
      type: TEST,
      silent: true,
      n: 3
    })
    expect(mutations.length).to.equal(2)
    expect(mutations[0].type).to.equal(TEST)
    expect(mutations[1].type).to.equal(TEST)
    expect(mutations[0].payload.n).to.equal(1) // normal dispatch
    expect(mutations[1].n).to.equal(2) // object dispatch
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
    store.commit(TEST, 1)
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
    store.commit(TEST, 2)
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
    store.commit(TEST, 3)
    expect(store.state.a).to.equal(-1)
    expect(store.state.nested.a).to.equal(9)
    expect(store.state.nested.one.a).to.equal(10)
    expect(store.state.nested.nested.two.a).to.equal(11)
    expect(store.state.nested.nested.three.a).to.equal(6)
    expect(store.state.four.a).to.equal(7)
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
    expect(store.state.list.join()).to.equal('1,2')

    // update root
    store.hotUpdate({
      actions: {
        [TEST] ({ commit }) {
          commit(TEST, 3)
        }
      }
    })
    store.dispatch(TEST)
    expect(store.state.list.join()).to.equal('1,2,3,2')

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
    expect(store.state.list.join()).to.equal('1,2,3,2,4,5')
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
        hasAny: state => state.count > 0
      }
    })

    const spy = sinon.spy()
    const vm = new Vue({
      computed: {
        a: () => store.getters.hasAny
      },
      watch: {
        a: spy
      }
    })

    expect(vm.a).to.equal(false)
    store.commit('inc')
    expect(vm.a).to.equal(true)
    Vue.nextTick(() => {
      expect(spy).to.have.been.called
      done()
    })
  })
})

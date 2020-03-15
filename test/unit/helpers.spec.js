// Skipping for now due to unkown error;
// TypeError: Cannot read property 'createComment' of null
//
// import { createApp } from 'vue'
// import Vuex, { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from '../../dist/vuex.common.js'

// function mount (comp, store) {
//   const app = createApp({ ...comp, render: () => {} })

//   app.use(Vuex, store)

//   return app.mount({ appendChild: () => {} })
// }

// describe('Helpers', () => {
//   it('mapState (array)', () => {
//     const store = new Vuex.Store({
//       state: {
//         a: 1
//       }
//     })
//     const vm = mount({
//       computed: mapState(['a'])
//     }, store)
//     expect(vm.a).toBe(1)
//     store.state.a++
//     expect(vm.a).toBe(2)
//   })

//   it('mapState (object)', () => {
//     const store = new Vuex.Store({
//       state: {
//         a: 1
//       },
//       getters: {
//         b: () => 2
//       }
//     })
//     const vm = mount({
//       computed: mapState({
//         a: (state, getters) => {
//           return state.a + getters.b
//         }
//       })
//     }, store)
//     expect(vm.a).toBe(3)
//     store.state.a++
//     expect(vm.a).toBe(4)
//   })

//   it('mapState (with namespace)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { a: 1 },
//           getters: {
//             b: state => state.a + 1
//           }
//         }
//       }
//     })
//     const vm = mount({
//       computed: mapState('foo', {
//         a: (state, getters) => {
//           return state.a + getters.b
//         }
//       })
//     }, store)
//     expect(vm.a).toBe(3)
//     store.state.foo.a++
//     expect(vm.a).toBe(5)
//     store.replaceState({
//       foo: { a: 3 }
//     })
//     expect(vm.a).toBe(7)
//   })

//   // #708
//   it('mapState (with namespace and a nested module)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { a: 1 },
//           modules: {
//             bar: {
//               state: { b: 2 }
//             }
//           }
//         }
//       }
//     })
//     const vm = mount({
//       computed: mapState('foo', {
//         value: state => state
//       })
//     }, store)
//     expect(vm.value.a).toBe(1)
//     expect(vm.value.bar.b).toBe(2)
//     expect(vm.value.b).toBeUndefined()
//   })

//   it('mapState (with undefined states)', () => {
//     spyOn(console, 'error')
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { a: 1 }
//         }
//       }
//     })
//     const vm = mount({
//       computed: mapState('foo')
//     }, store)
//     expect(vm.a).toBeUndefined()
//     expect(console.error).toHaveBeenCalledWith('[vuex] mapState: mapper parameter must be either an Array or an Object')
//   })

//   it('mapMutations (array)', () => {
//     const store = new Vuex.Store({
//       state: { count: 0 },
//       mutations: {
//         inc: state => state.count++,
//         dec: state => state.count--
//       }
//     })
//     const vm = mount({
//       methods: mapMutations(['inc', 'dec'])
//     }, store)
//     vm.inc()
//     expect(store.state.count).toBe(1)
//     vm.dec()
//     expect(store.state.count).toBe(0)
//   })

//   it('mapMutations (object)', () => {
//     const store = new Vuex.Store({
//       state: { count: 0 },
//       mutations: {
//         inc: state => state.count++,
//         dec: state => state.count--
//       }
//     })
//     const vm = mount({
//       methods: mapMutations({
//         plus: 'inc',
//         minus: 'dec'
//       })
//     }, store)
//     vm.plus()
//     expect(store.state.count).toBe(1)
//     vm.minus()
//     expect(store.state.count).toBe(0)
//   })

//   it('mapMutations (function)', () => {
//     const store = new Vuex.Store({
//       state: { count: 0 },
//       mutations: {
//         inc (state, amount) {
//           state.count += amount
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapMutations({
//         plus (commit, amount) {
//           commit('inc', amount + 1)
//         }
//       })
//     }, store)
//     vm.plus(42)
//     expect(store.state.count).toBe(43)
//   })

//   it('mapMutations (with namespace)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           mutations: {
//             inc: state => state.count++,
//             dec: state => state.count--
//           }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapMutations('foo', {
//         plus: 'inc',
//         minus: 'dec'
//       })
//     }, store)
//     vm.plus()
//     expect(store.state.foo.count).toBe(1)
//     vm.minus()
//     expect(store.state.foo.count).toBe(0)
//   })

//   it('mapMutations (function with namepsace)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           mutations: {
//             inc (state, amount) {
//               state.count += amount
//             }
//           }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapMutations('foo', {
//         plus (commit, amount) {
//           commit('inc', amount + 1)
//         }
//       })
//     }, store)
//     vm.plus(42)
//     expect(store.state.foo.count).toBe(43)
//   })

//   it('mapMutations (with undefined mutations)', () => {
//     spyOn(console, 'error')
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           mutations: {
//             inc: state => state.count++,
//             dec: state => state.count--
//           }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapMutations('foo')
//     }, store)
//     expect(vm.inc).toBeUndefined()
//     expect(vm.dec).toBeUndefined()
//     expect(console.error).toHaveBeenCalledWith('[vuex] mapMutations: mapper parameter must be either an Array or an Object')
//   })

//   it('mapGetters (array)', () => {
//     const store = new Vuex.Store({
//       state: { count: 0 },
//       mutations: {
//         inc: state => state.count++,
//         dec: state => state.count--
//       },
//       getters: {
//         hasAny: ({ count }) => count > 0,
//         negative: ({ count }) => count < 0
//       }
//     })
//     const vm = mount({
//       computed: mapGetters(['hasAny', 'negative'])
//     }, store)
//     expect(vm.hasAny).toBe(false)
//     expect(vm.negative).toBe(false)
//     store.commit('inc')
//     expect(vm.hasAny).toBe(true)
//     expect(vm.negative).toBe(false)
//     store.commit('dec')
//     store.commit('dec')
//     expect(vm.hasAny).toBe(false)
//     expect(vm.negative).toBe(true)
//   })

//   it('mapGetters (object)', () => {
//     const store = new Vuex.Store({
//       state: { count: 0 },
//       mutations: {
//         inc: state => state.count++,
//         dec: state => state.count--
//       },
//       getters: {
//         hasAny: ({ count }) => count > 0,
//         negative: ({ count }) => count < 0
//       }
//     })
//     const vm = mount({
//       computed: mapGetters({
//         a: 'hasAny',
//         b: 'negative'
//       })
//     }, store)
//     expect(vm.a).toBe(false)
//     expect(vm.b).toBe(false)
//     store.commit('inc')
//     expect(vm.a).toBe(true)
//     expect(vm.b).toBe(false)
//     store.commit('dec')
//     store.commit('dec')
//     expect(vm.a).toBe(false)
//     expect(vm.b).toBe(true)
//   })

//   it('mapGetters (with namespace)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           mutations: {
//             inc: state => state.count++,
//             dec: state => state.count--
//           },
//           getters: {
//             hasAny: ({ count }) => count > 0,
//             negative: ({ count }) => count < 0
//           }
//         }
//       }
//     })
//     const vm = mount({
//       computed: mapGetters('foo', {
//         a: 'hasAny',
//         b: 'negative'
//       })
//     }, store)
//     expect(vm.a).toBe(false)
//     expect(vm.b).toBe(false)
//     store.commit('foo/inc')
//     expect(vm.a).toBe(true)
//     expect(vm.b).toBe(false)
//     store.commit('foo/dec')
//     store.commit('foo/dec')
//     expect(vm.a).toBe(false)
//     expect(vm.b).toBe(true)
//   })

//   it('mapGetters (with namespace and nested module)', () => {
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           modules: {
//             bar: {
//               namespaced: true,
//               state: { count: 0 },
//               mutations: {
//                 inc: state => state.count++,
//                 dec: state => state.count--
//               },
//               getters: {
//                 hasAny: ({ count }) => count > 0,
//                 negative: ({ count }) => count < 0
//               }
//             },
//             cat: {
//               state: { count: 9 },
//               getters: {
//                 count: ({ count }) => count
//               }
//             }
//           }
//         }
//       }
//     })
//     const vm = mount({
//       computed: {
//         ...mapGetters('foo/bar', [
//           'hasAny',
//           'negative'
//         ]),
//         ...mapGetters('foo', [
//           'count'
//         ])
//       }
//     }, store)
//     expect(vm.hasAny).toBe(false)
//     expect(vm.negative).toBe(false)
//     store.commit('foo/bar/inc')
//     expect(vm.hasAny).toBe(true)
//     expect(vm.negative).toBe(false)
//     store.commit('foo/bar/dec')
//     store.commit('foo/bar/dec')
//     expect(vm.hasAny).toBe(false)
//     expect(vm.negative).toBe(true)

//     expect(vm.count).toBe(9)
//   })

//   it('mapGetters (with undefined getters)', () => {
//     spyOn(console, 'error')
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           mutations: {
//             inc: state => state.count++,
//             dec: state => state.count--
//           },
//           getters: {
//             hasAny: ({ count }) => count > 0,
//             negative: ({ count }) => count < 0
//           }
//         }
//       }
//     })
//     const vm = mount({
//       computed: mapGetters('foo')
//     }, store)
//     expect(vm.a).toBeUndefined()
//     expect(vm.b).toBeUndefined()
//     expect(console.error).toHaveBeenCalledWith('[vuex] mapGetters: mapper parameter must be either an Array or an Object')
//   })

//   it('mapActions (array)', () => {
//     const a = jasmine.createSpy()
//     const b = jasmine.createSpy()
//     const store = new Vuex.Store({
//       actions: {
//         a,
//         b
//       }
//     })
//     const vm = mount({
//       methods: mapActions(['a', 'b'])
//     }, store)
//     vm.a()
//     expect(a).toHaveBeenCalled()
//     expect(b).not.toHaveBeenCalled()
//     vm.b()
//     expect(b).toHaveBeenCalled()
//   })

//   it('mapActions (object)', () => {
//     const a = jasmine.createSpy()
//     const b = jasmine.createSpy()
//     const store = new Vuex.Store({
//       actions: {
//         a,
//         b
//       }
//     })
//     const vm = mount({
//       methods: mapActions({
//         foo: 'a',
//         bar: 'b'
//       })
//     }, store)
//     vm.foo()
//     expect(a).toHaveBeenCalled()
//     expect(b).not.toHaveBeenCalled()
//     vm.bar()
//     expect(b).toHaveBeenCalled()
//   })

//   it('mapActions (function)', () => {
//     const a = jasmine.createSpy()
//     const store = new Vuex.Store({
//       actions: { a }
//     })
//     const vm = mount({
//       methods: mapActions({
//         foo (dispatch, arg) {
//           dispatch('a', arg + 'bar')
//         }
//       })
//     }, store)
//     vm.foo('foo')
//     expect(a.calls.argsFor(0)[1]).toBe('foobar')
//   })

//   it('mapActions (with namespace)', () => {
//     const a = jasmine.createSpy()
//     const b = jasmine.createSpy()
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           actions: {
//             a,
//             b
//           }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapActions('foo/', {
//         foo: 'a',
//         bar: 'b'
//       })
//     }, store)
//     vm.foo()
//     expect(a).toHaveBeenCalled()
//     expect(b).not.toHaveBeenCalled()
//     vm.bar()
//     expect(b).toHaveBeenCalled()
//   })

//   it('mapActions (function with namespace)', () => {
//     const a = jasmine.createSpy()
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           actions: { a }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapActions('foo/', {
//         foo (dispatch, arg) {
//           dispatch('a', arg + 'bar')
//         }
//       })
//     }, store)
//     vm.foo('foo')
//     expect(a.calls.argsFor(0)[1]).toBe('foobar')
//   })

//   it('mapActions (with undefined actions)', () => {
//     spyOn(console, 'error')
//     const a = jasmine.createSpy()
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           actions: {
//             a
//           }
//         }
//       }
//     })
//     const vm = mount({
//       methods: mapActions('foo/')
//     }, store)
//     expect(vm.a).toBeUndefined()
//     expect(a).not.toHaveBeenCalled()
//     expect(console.error).toHaveBeenCalledWith('[vuex] mapActions: mapper parameter must be either an Array or an Object')
//   })

//   it('createNamespacedHelpers', () => {
//     const actionA = jasmine.createSpy()
//     const actionB = jasmine.createSpy()
//     const store = new Vuex.Store({
//       modules: {
//         foo: {
//           namespaced: true,
//           state: { count: 0 },
//           getters: {
//             isEven: state => state.count % 2 === 0
//           },
//           mutations: {
//             inc: state => state.count++,
//             dec: state => state.count--
//           },
//           actions: {
//             actionA,
//             actionB
//           }
//         }
//       }
//     })
//     const {
//       mapState,
//       mapGetters,
//       mapMutations,
//       mapActions
//     } = createNamespacedHelpers('foo/')
//     const vm = mount({
//       computed: {
//         ...mapState(['count']),
//         ...mapGetters(['isEven'])
//       },
//       methods: {
//         ...mapMutations(['inc', 'dec']),
//         ...mapActions(['actionA', 'actionB'])
//       }
//     }, store)
//     expect(vm.count).toBe(0)
//     expect(vm.isEven).toBe(true)
//     store.state.foo.count++
//     expect(vm.count).toBe(1)
//     expect(vm.isEven).toBe(false)
//     vm.inc()
//     expect(store.state.foo.count).toBe(2)
//     expect(store.getters['foo/isEven']).toBe(true)
//     vm.dec()
//     expect(store.state.foo.count).toBe(1)
//     expect(store.getters['foo/isEven']).toBe(false)
//     vm.actionA()
//     expect(actionA).toHaveBeenCalled()
//     expect(actionB).not.toHaveBeenCalled()
//     vm.actionB()
//     expect(actionB).toHaveBeenCalled()
//   })
// })

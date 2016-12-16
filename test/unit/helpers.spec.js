import Vue from 'vue/dist/vue.common.js'
import Vuex, { mapState, mapMutations, mapGetters, mapActions } from '../../dist/vuex.js'

describe('Helpers', () => {
  it('mapState (array)', () => {
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

  it('mapState (object)', () => {
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

  it('mapState (with namespace)', () => {
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          state: { a: 1 },
          getters: {
            b: state => state.a + 1
          }
        }
      }
    })
    const vm = new Vue({
      store,
      computed: mapState('foo', {
        a: (state, getters) => {
          return state.a + getters.b
        }
      })
    })
    expect(vm.a).toBe(3)
    store.state.foo.a++
    expect(vm.a).toBe(5)
  })

  it('mapMutations (array)', () => {
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

  it('mapMutations (object)', () => {
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

  it('mapMutations (with namespace)', () => {
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          state: { count: 0 },
          mutations: {
            inc: state => state.count++,
            dec: state => state.count--
          }
        }
      }
    })
    const vm = new Vue({
      store,
      methods: mapMutations('foo', {
        plus: 'inc',
        minus: 'dec'
      })
    })
    vm.plus()
    expect(store.state.foo.count).toBe(1)
    vm.minus()
    expect(store.state.foo.count).toBe(0)
  })

  it('mapGetters (array)', () => {
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

  it('mapGetters (object)', () => {
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

  it('mapGetters (with namespace)', () => {
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          state: { count: 0 },
          mutations: {
            inc: state => state.count++,
            dec: state => state.count--
          },
          getters: {
            hasAny: ({ count }) => count > 0,
            negative: ({ count }) => count < 0
          }
        }
      }
    })
    const vm = new Vue({
      store,
      computed: mapGetters('foo', {
        a: 'hasAny',
        b: 'negative'
      })
    })
    expect(vm.a).toBe(false)
    expect(vm.b).toBe(false)
    store.commit('foo/inc')
    expect(vm.a).toBe(true)
    expect(vm.b).toBe(false)
    store.commit('foo/dec')
    store.commit('foo/dec')
    expect(vm.a).toBe(false)
    expect(vm.b).toBe(true)
  })

  it('mapActions (array)', () => {
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

  it('mapActions (object)', () => {
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

  it('mapActions (with namespace)', () => {
    const a = jasmine.createSpy()
    const b = jasmine.createSpy()
    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          actions: {
            a,
            b
          }
        }
      }
    })
    const vm = new Vue({
      store,
      methods: mapActions('foo/', {
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
})

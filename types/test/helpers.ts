import Vue from "vue";

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  createNamespacedHelpers
} from "../index";

const helpers = createNamespacedHelpers('foo');

new Vue({
  computed: {
    ...mapState(["a"]),
    ...mapState('foo', ["b"]),
    ...mapState({
      c: "c"
    }),
    ...mapState('foo', {
      d: "d"
    }),
    ...mapState({
      e: (state: any, getters: any) => {
        return state.a + getters.a
      }
    }),
    ...mapState('foo', {
      f: (state: any, getters: any) => {
        return state.c + getters.c
      },
      useThis (state: any, getters: any) {
        return state.c + getters.c + this.whatever
      }
    }),

    ...helpers.mapState(["g"]),
    ...helpers.mapState({
      h: "h"
    }),
    ...helpers.mapState({
      i: (state: any, getters: any) => state.k + getters.k
    })
  },

  created () {
    this.a
    this.b
    this.c
    this.d
    this.e
    this.f
    this.g
    this.h
    this.i
  }
})

new Vue({
  computed: {
    ...mapGetters(["a"]),
    ...mapGetters('foo', ["b"]),
    ...mapGetters({
      c: "c"
    }),
    ...mapGetters('foo', {
      d: "d"
    }),

    ...helpers.mapGetters(["e"]),
    ...helpers.mapGetters({
      f: "f"
    }),

    otherComputed () {
      return "g";
    }
  },

  created () {
    this.a
    this.b
    this.c
    this.d
    this.e
    this.f
    this.otherComputed
  }
})

new Vue({
  methods: {
    ...mapActions(["a"]),
    ...mapActions({
      b: "b"
    }),
    ...mapActions({
      c (dispatch, a: string, b: number, c: boolean): void {
        dispatch('c', { a, b, c })
        dispatch({
          type: 'c',
          a,
          b,
          c
        })
      }
    }),
    ...mapActions('foo', ["d"]),
    ...mapActions('foo', {
      e: "e"
    }),
    ...mapActions('foo', {
      f (dispatch, a: string, b: number, c: boolean): void {
        dispatch('f', { a, b, c })
        dispatch({
          type: 'f',
          a,
          b,
          c
        })
      }
    }),

    ...helpers.mapActions(["g"]),
    ...helpers.mapActions({
      h: "h"
    }),
    ...helpers.mapActions({
      i (dispatch, value: string) {
        dispatch('i', value)
      }
    })
  },

  created () {
    this.a(1)
    this.b(2)
    this.c('a', 3, true)
    this.d(4)
    this.e(5)
    this.f(6)
    this.g(7)
    this.h(8)
    this.i(9)
  }
})

new Vue({
  methods: {
    ...mapMutations(["a"]),
    ...mapMutations({
      b: "b"
    }),
    ...mapMutations({
      c (commit, a: string, b: number, c: boolean): void {
        commit('c', { a, b, c })
        commit({
          type: 'c',
          a,
          b,
          c
        })
      }
    }),
    ...mapMutations('foo', ["d"]),
    ...mapMutations('foo', {
      e: "e"
    }),
    ...mapMutations('foo', {
      f (commit, a: string, b: number, c: boolean): void {
        commit('f', { a, b, c })
        commit({
          type: 'f',
          a,
          b,
          c
        })
      }
    }),

    ...helpers.mapMutations(["g"]),
    ...helpers.mapMutations({
      h: "h"
    }),
    ...helpers.mapMutations({
      i (commit, value: string) {
        commit('i', value)
      }
    }),

    otherMethod () {}
  },

  created () {
    this.a(1)
    this.b(2)
    this.c('a', 3, true)
    this.d(4)
    this.e(5)
    this.f(6)
    this.g(7)
    this.h(8)
    this.i(9)
    this.otherMethod()
  }
});

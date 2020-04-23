import { createApp } from "vue";

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  createNamespacedHelpers
} from "../index";

const helpers = createNamespacedHelpers('foo');

createApp({
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
      e: (state: any, getters: any) => state.a + getters.g
    }),
    ...mapState('foo', {
      f: (state: any, getters: any) => state.a + getters.g
    }),

    ...mapGetters(["g"]),
    ...mapGetters('foo', ["h"]),
    ...mapGetters({
      i: "i"
    }),
    ...mapGetters('foo', {
      j: "j"
    }),

    ...helpers.mapState(["k"]),
    ...helpers.mapState({
      l: "l"
    }),
    ...helpers.mapState({
      m: (state: any, getters: any) => state.a + getters.g,
      useThis(state: any, getters: any): any {
        return state.a + getters.g + this.whatever
      }
    }),

    ...helpers.mapGetters(["n"]),
    ...helpers.mapGetters({
      o: "o"
    }),


    otherComputed () {
      return "";
    }
  },

  methods: {
    ...mapActions(["p"]),
    ...mapActions({
      q: "q"
    }),
    ...mapActions({
      r (dispatch, a: string, b: number, c: boolean) {
        dispatch('p', { a, b, c })
        dispatch({
          type: 'p',
          a,
          b,
          c
        })
      }
    }),
    ...mapActions('foo', ["s"]),
    ...mapActions('foo', {
      t: "t"
    }),
    ...mapActions('foo', {
      u (dispatch, a: string, b: number, c: boolean) {
        dispatch('p', { a, b, c })
        dispatch({
          type: 'p',
          a,
          b,
          c
        })
      }
    }),

    ...mapMutations(["v"]),
    ...mapMutations({
      w: "w"
    }),
    ...mapMutations({
      x (commit, a: string, b: number, c: boolean) {
        commit('v', { a, b, c })
        commit({
          type: 'v',
          a,
          b,
          c
        })
      }
    }),
    ...mapMutations('foo', ["y"]),
    ...mapMutations('foo', {
      z: "z"
    }),
    ...mapMutations('foo', {
      aa (commit, a: string, b: number, c: boolean) {
        commit('v', { a, b, c })
        commit({
          type: 'v',
          a,
          b,
          c
        })
      }
    }),

    ...helpers.mapActions(["ab"]),
    ...helpers.mapActions({
      ac: "ac"
    }),
    ...helpers.mapActions({
      ad (dispatch, value: string) {
        dispatch('p', value)
      }
    }),

    ...helpers.mapMutations(["ae"]),
    ...helpers.mapMutations({
      af: "af"
    }),
    ...helpers.mapMutations({
      ag (commit, value: string) {
        commit('v', value)
      }
    }),

    otherMethod () {}
  },

  created() {
    // Computed
    this.a
    this.b
    this.c
    this.d
    this.e
    this.f
    this.g
    this.h
    this.i
    this.j
    this.k
    this.l
    this.m
    this.n
    this.o
    this.otherComputed

    // Methods
    this.p()
    this.q()
    this.r('', 0, true)
    this.s()
    this.t()
    this.u('', 0, true)
    this.v()
    this.w()
    this.x('', 0, true)
    this.y()
    this.z()
    this.aa('', 0, true)
    this.ab()
    this.ac()
    this.ad('')
    this.ae()
    this.af()
    this.ag('')
    this.otherMethod()
  }
});

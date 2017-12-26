import Vue from "vue";

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  createNamespacedHelpers,
  Commit,
  Dispatch
} from "../index";

const helpers = createNamespacedHelpers('foo');

new Vue({
  computed: Object.assign({},
    mapState(["a"]),
    mapState('foo', ["a"]),
    mapState({
      b: "b"
    }),
    mapState('foo', {
      b: "b"
    }),
    mapState({
      c: (state: any, getters: any) => state.c + getters.c
    }),
    mapState('foo', {
      c: (state: any, getters: any) => state.c + getters.c
    }),

    mapGetters(["d"]),
    mapGetters('foo', ["d"]),
    mapGetters({
      e: "e"
    }),
    mapGetters('foo', {
      e: "e"
    }),

    helpers.mapState(["k"]),
    helpers.mapState({
      k: "k"
    }),
    helpers.mapState({
      k: (state: any, getters: any) => state.k + getters.k
    }),

    helpers.mapGetters(["l"]),
    helpers.mapGetters({
      l: "l"
    }),

    {
      otherComputed () {
        return "f";
      }
    }
  ),

  methods: Object.assign({},
    mapActions(["g"]),
    mapActions({
      h: "h"
    }),
    mapActions({
      g (dispatch: Dispatch, a: string, b: number, c: boolean): void {
        dispatch('g', { a, b, c })
        dispatch({
          type: 'g',
          a,
          b,
          c
        })
      }
    }),
    mapActions('foo', ["g"]),
    mapActions('foo', {
      h: "h"
    }),
    mapActions('foo', {
      g (dispatch: Dispatch, a: string, b: number, c: boolean): void {
        dispatch('g', { a, b, c })
        dispatch({
          type: 'g',
          a,
          b,
          c
        })
      }
    }),

    mapMutations(["i"]),
    mapMutations({
      j: "j"
    }),
    mapMutations({
      i (commit: Commit, a: string, b: number, c: boolean): void {
        commit('i', { a, b, c })
        commit({
          type: 'i',
          a,
          b,
          c
        })
      }
    }),
    mapMutations('foo', ["i"]),
    mapMutations('foo', {
      j: "j"
    }),
    mapMutations('foo', {
      i (commit: Commit, a: string, b: number, c: boolean): void {
        commit('i', { a, b, c })
        commit({
          type: 'i',
          a,
          b,
          c
        })
      }
    }),

    helpers.mapActions(["m"]),
    helpers.mapActions({
      m: "m"
    }),
    helpers.mapActions({
      m (dispatch: Dispatch, value: string) {
        dispatch('m', value)
      }
    }),

    helpers.mapMutations(["n"]),
    helpers.mapMutations({
      n: "n"
    }),
    helpers.mapMutations({
      n (commit: Commit, value: string) {
        commit('m', value)
      }
    }),
    helpers.mapMutations({
      n: "n",
      m: "m"
    }),

    {
      otherMethod () {}
    }
  )
});

const actions = mapActions({
  mAlias: "m"
})

actions.mAlias()

const actionsNamespaced = mapActions('namespace', {
  mAlias: "m"
})

actionsNamespaced.mAlias()

const actionsNamespaced2 = helpers.mapActions({
  mAlias: "m"
})

actionsNamespaced2.mAlias()

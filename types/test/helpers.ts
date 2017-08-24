import Vue = require("vue");

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  createNamespacedHelpers
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
    mapActions('foo', ["g"]),
    mapActions('foo', {
      h: "h"
    }),

    mapMutations(["i"]),
    mapMutations({
      j: "j"
    }),
    mapMutations('foo', ["i"]),
    mapMutations('foo', {
      j: "j"
    }),

    helpers.mapActions(["m"]),
    helpers.mapActions({
      m: "m"
    }),

    helpers.mapMutations(["n"]),
    helpers.mapMutations({
      n: "n"
    }),

    {
      otherMethod () {}
    }
  )
});

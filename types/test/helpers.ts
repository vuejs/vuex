import Vue = require("vue");

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from "../index";

new Vue({
  computed: Object.assign({},
    mapState(["a"]),
    mapState({
      b: "b"
    }),
    mapState({
      c: (state: any, getters: any) => state.c + getters.c
    }),

    mapGetters(["d"]),
    mapGetters({
      e: "e"
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

    mapMutations(["i"]),
    mapMutations({
      j: "j"
    }),

    {
      otherMethod () {}
    }
  )
});

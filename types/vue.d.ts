/**
 * Extends interfaces in Vue.js
 */

import Vue from "vue";
import { TStore } from "@imsunhao/vuex/types/default/store";

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: TStore;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: TStore;
  }
}

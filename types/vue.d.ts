/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from "vue";
import { Store } from "./index";

declare module "vue/types/options" {
  interface ComponentOptions<Data, Methods, Computed, Props> {
    store?: Store<any>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<any>;
  }
}

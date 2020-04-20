/**
 * Extends interfaces in Vue.js
 */

import { ComponentCustomOptions, ComponentCustomProperties } from "vue";
import { Store } from "./index";

declare module "@vue/runtime-core" {
  interface ComponentCustomOptions {
    store?: Store<any>;
  }
}

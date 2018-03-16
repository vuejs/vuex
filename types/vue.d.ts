/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from "vue";
import { Store } from "./index";

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: Store<PermissiveAny<RootState>>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<PermissiveAny<RootState>>;
  }
}

export type PermissiveAny<T> = {} extends T ? any : T

// stub for user augmentation
export interface RootState {}
export interface RootActions {}
export interface RootMutations {}
export interface RootGetters {}

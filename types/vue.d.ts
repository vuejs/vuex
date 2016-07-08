/**
 * Extends interfaces in Vue.js
 */

import { VuexComponentOption, Store } from './index'

declare global {
  namespace vuejs {
    interface ComponentOption {
      vuex?: VuexComponentOption<any>;
      store?: Store<any>;
    }

    interface Vue {
      $store?: Store<any>;
    }
  }
}

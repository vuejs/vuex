/**
 * Extends interfaces in Vue.js
 */

import { Store } from './index'

declare global {
  namespace vuejs {
    interface ComponentOption {
      store?: Store<any>;
    }

    interface Vue {
      $store?: Store<any>;
    }
  }
}

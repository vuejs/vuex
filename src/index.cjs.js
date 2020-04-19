import { createStore, Store } from './store'
import { useStore } from './injectKey'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  version: '__VERSION__',
  createStore,
  Store,
  useStore,
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}

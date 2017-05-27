import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}

export {
  Store,
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}

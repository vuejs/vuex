import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  Store,
  install,
  version: '__VERSION__',
  mapState, // why is not this plural?
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}

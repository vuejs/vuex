import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions } from './helpers'

export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions
}

export {
  Store,
  mapState,
  mapMutations,
  mapGetters,
  mapActions
}

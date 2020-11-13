import assert from 'assert'
import { createRequire } from 'module'
import Vuex, {
  Store,
  install,
  version,
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers,
  createLogger
} from 'vuex'

const require = createRequire(import.meta.url)
const cjs = require('vuex')
assert.equal(Vuex, cjs)
assert.equal(Store, cjs.Store)
assert.equal(install, cjs.install)
assert.equal(version, cjs.version)
assert.equal(mapState, cjs.mapState)
assert.equal(mapMutations, cjs.mapMutations)
assert.equal(mapGetters, cjs.mapGetters)
assert.equal(mapActions, cjs.mapActions)
assert.equal(createNamespacedHelpers, cjs.createNamespacedHelpers)
assert.equal(createLogger, cjs.createLogger)

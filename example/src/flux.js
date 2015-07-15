import Vue from 'vue'
import Flux from '../../src'

export default new Flux({
  injectMixin: Vue,
  debug: true,
  debugHandler (actionRecord) {
    const storeRecord = actionRecord.affectedStores[0]
    console.log(JSON.stringify(storeRecord, null, 2))
  }
})

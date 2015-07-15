import Vue from 'vue'
import Flux from '../../src'

export default new Flux({
  debug: true,
  injectMixin: Vue,
  debugHandler (actionRecord) {
    const storeRecord = actionRecord.affectedStores[0]
    console.log(JSON.stringify(storeRecord, null, 2))
  }
})

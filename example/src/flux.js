import Vue from 'vue'
import Flux from '../../src'

export default new Flux({
  injectMixin: Vue,
  debug: process.env.NODE_ENV !== 'production',
  debugHandler (actionRecord) {
    console.log(actionRecord)
  }
})

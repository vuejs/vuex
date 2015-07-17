import Flux from '../../src'

export default new Flux({
  debug: process.env.NODE_ENV !== 'production',
  debugHandler (actionRecord) {
    console.log(actionRecord)
  }
})

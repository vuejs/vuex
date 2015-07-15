var Flux = require('../../src')

module.exports = new Flux({
  debug: true,
  injectMixin: true,
  debugHandler: function (actionRecord) {
    var storeRecord = actionRecord.affectedStores[0]
    console.log(JSON.stringify(storeRecord, null, 2))
  }
})

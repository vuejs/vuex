function Store (name, state, owner) {
  this.name = name
  this.owner = owner
  Object.defineProperty(this, 'state', {
    get: function () {
      return state
    },
    set: function () {
      console.warn('You should never change a store\'s state reference.')
    }
  })
  this.actions = {}
}

Store.prototype.handleAction = function (action, args, debug) {
  var handler = this.actions[action]
  if (handler) {
    var record
    if (debug) {
      record = {
        name: this.name,
        beforeState: JSON.parse(JSON.stringify(this.state))
      }
      var history = this.owner.history
      history[history.length - 1].affectedStores.push(record)
    }
    // actually apply the handler
    handler.apply(this, args)
    if (debug) {
      record.afterState = JSON.parse(JSON.stringify(this.state))
    }
  }
}

Store.prototype.on = function (action, handler) {
  if (this.actions[action]) {
    console.warn('action already defined: ' + action)
    return
  }
  this.actions[action] = handler
  this.owner.registerAction(action)
}

module.exports = Store

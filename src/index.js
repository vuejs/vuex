var Store = require('./store')
var Action = require('./action')
var slice = [].slice

/**
 * Vuex instance constructor.
 *
 * @param {Object} options
 *        - {Boolean} debug
 *        - {Function} debugHandler
 *        - {Function} injectActions
 */

function Vuex (options) {
  options = options || {}
  this.debug = options.debug
  this.debugHandler = options.debugHandler
  this.actions = {}
  this.history = []
  this.stores = []
  this.mixin = createMixin(this)
}

/**
 * Public dispatch method that takes flat arguments.
 *
 * @param {String} action
 */

Vuex.prototype.dispatch = function (action) {
  var args = slice.call(arguments, 1)
  this._dispatch(action, args)
}

/**
 * Internal dispatch, send actions to all registered stores
 * and do history bookkeeping if in debug mode.
 *
 * @param {String} action
 * @param {Array} args
 */

Vuex.prototype._dispatch = function (action, args) {
  var record
  if (this.debug) {
    record = {
      action: action,
      args: args,
      timestamp: Date.now(),
      affectedStores: []
    }
    this.history.push(record)
  }
  for (var i = 0; i < this.stores.length; i++) {
    this.stores[i]._handleAction(action, args, this.debug)
  }
  if (this.debug) {
    if (this.debugHandler) {
      this.debugHandler(record)
    } else {
      console.log(record)
    }
  }
}

/**
 * Register an action type globally.
 * If "injectActions" is enabled, inject the action
 * dispatcher function into all Vue instances.
 *
 * @param {String} action
 */

Vuex.prototype._registerAction = function (action) {
  var self = this
  if (!this.actions[action]) {
    this.actions[action] = function dispatch () {
      self._dispatch(action, slice.call(arguments))
    }
  }
}

/**
 * Create a store.
 *
 * @param {Object} options
 * @return {Store}
 */

Vuex.prototype.createStore = function (options) {
  var store = new Store(options, this)
  this.stores.push(store)
  return store
}

/**
 * Create a mixin that is specific for a flux instance.
 * Injects the registered actions into a Vue instance.
 *
 * @param {Vuex} flux
 * @return {Object} mixin
 */

function createMixin (flux) {
  return {
    created: function () {
      this.$actions = flux.actions
    },
    directives: {
      action: Action
    }
  }
}

module.exports = Vuex

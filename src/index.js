var Store = require('./store')
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
  this.subs = []
  this.actions = {}
  this.history = []
  this.stores = []
  var mixin = createMixin(this)
  var Vue = options.injectActions
  if (Vue) {
    if (typeof Vue !== 'function' || !Vue.options) {
      console.warn(
        '[vuex]: "injectActions" option expects ' +
        'the Vue singleton, not a boolean value.'
      )
    } else {
      injectMixin(Vue, mixin)
    }
  } else {
    this.mixin = mixin
  }
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
  function dispatch () {
    self._dispatch(action, slice.call(arguments))
  }
  if (!this.actions[action]) {
    this.actions[action] = dispatch
  }
  this.subs.forEach(function (sub) {
    sub[action] = dispatch
  })
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
      var vm = this
      Object.keys(flux.actions).forEach(function (action) {
        vm[action] = flux.actions[action]
      })
      flux.subs.push(this)
    },
    beforeDestroy: function () {
      flux.subs.$remove(this)
    }
  }
}

/**
 * Inject the mixin globally, so that every regsitered
 * action automatically gets injected as a dispatcher
 * function into every Vue instance. Requires the Vue
 * singleton.
 *
 * @param {Function} Vue
 * @param {Object} mixin
 */

function injectMixin (Vue, mixin) {
  Object.keys(mixin).forEach(function (hook) {
    var existing = Vue.options[hook]
    var inject = [mixin[hook]]
    Vue.options[hook] = existing
      ? inject.concat(existing)
      : inject
  })
}

module.exports = Vuex

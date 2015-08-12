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
  this.actions = {}
  this.history = []
  var self = this
  this.stores = options.stores.map(function (storeOption) {
    return new Store(storeOption, self)
  })
}

/**
 * Send actions to all registered stores
 * and do history bookkeeping if in debug mode.
 *
 * @param {String} action
 * @param {Array} args
 */

Vuex.prototype.dispatch = function (action, args) {
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
    this.stores[i].handleAction(action, args, this.debug)
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
 * Register an action as a callable function.
 *
 * @param {String} action
 */

Vuex.prototype.registerAction = function (action) {
  if (!this.actions[action]) {
    var self = this
    this.actions[action] = function () {
      self.dispatch(action, slice.call(arguments))
    }
  }
}

// API

var Vue

/**
 * Installation method. Locate root vuex instance and
 * expose its actions on current component.
 *
 * @param {Function} _Vue
 */

Vuex.install = function (_Vue) {
  Vue = _Vue
  Vue.options = Vue.util.mergeOptions(Vue.options, {
    created: function () {
      var p = this.$parent
      while (p) {
        if (!p.hasOwnProperty('$vuex')) {
          p = p.$parent
        } else {
          def(this, '$actions', p.$vuex.actions)
          break
        }
      }
    }
  })
}

/**
 * Create/extend a Component constructor as the root
 * component of a vuex application. Holds the vuex instance
 * in the closure.
 *
 * @param {Function|Object} Component
 * @param {Object} [vuexOptions]
 */

Vuex.create = function (Component, vuexOptions) {
  if (!Vue) {
    throw new Error(
      '[vuex]: please install with Vue.use() ' +
      'before creating App component.'
    )
  }
  if (typeof Component !== 'function') {
    Component = Vue.extend(Component)
  }
  var vuex = new Vuex(vuexOptions)
  Component.options = Vue.util.mergeOptions(Component.options, {
    created: function () {
      def(this, '$vuex', vuex)
      def(this, '$actions', vuex.actions)
    }
  })
  return Component
}

/**
 * Helper for defining access-only properties.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val
  })
}

module.exports = Vuex

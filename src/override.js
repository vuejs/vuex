import { getWatcher, getDep } from './util'

export default function (Vue) {
  // override init and inject vuex init procedure
  const _init = Vue.prototype._init
  Vue.prototype._init = function (options = {}) {
    options.init = options.init
      ? [vuexInit].concat(options.init)
      : vuexInit
    _init.call(this, options)
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    const { store, vuex } = options
    // store injection
    if (store) {
      this.$store = store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
    // vuex option handling
    if (vuex) {
      if (!this.$store) {
        console.warn(
          '[vuex] store not injected. make sure to ' +
          'provide the store option in your root component.'
        )
      }
      let { state, getters, actions } = vuex
      // handle deprecated state option
      if (state && !getters) {
        console.warn(
          '[vuex] vuex.state option will been deprecated in 1.0. ' +
          'Use vuex.getters instead.'
        )
        getters = state
      }
      // getters
      if (getters) {
        options.computed = options.computed || {}
        for (let key in getters) {
          defineVuexGetter(this, key, getters[key])
        }
      }
      // actions
      if (actions) {
        options.methods = options.methods || {}
        for (let key in actions) {
          options.methods[key] = makeBoundAction(this.$store, actions[key])
        }
      }
    }
  }

  /**
   * Setter for all getter properties.
   */

  function setter () {
    throw new Error('vuex getter properties are read-only.')
  }

  /**
   * Define a Vuex getter on an instance.
   *
   * @param {Vue} vm
   * @param {String} key
   * @param {Function} getter
   */

  function defineVuexGetter (vm, key, getter) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: makeComputedGetter(vm.$store, getter),
      set: setter
    })
  }

  /**
   * Make a computed getter, using the same caching mechanism of computed
   * properties. In addition, it is cached on the raw getter function using
   * the store's unique cache id. This makes the same getter shared
   * across all components use the same underlying watcher, and makes
   * the getter evaluated only once during every flush.
   *
   * @param {Store} store
   * @param {Function} getter
   */

  function makeComputedGetter (store, getter) {
    const id = store._getterCacheId
    // cached
    if (getter[id]) {
      return getter[id]
    }
    const vm = store._vm
    const Watcher = getWatcher(vm)
    const Dep = getDep(vm)
    const watcher = new Watcher(
      vm,
      state => getter(state),
      null,
      { lazy: true }
    )
    const computedGetter = () => {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
    getter[id] = computedGetter
    return computedGetter
  }

  /**
   * Make a bound-to-store version of a raw action function.
   *
   * @param {Store} store
   * @param {Function} action
   */

  function makeBoundAction (store, action) {
    return function vuexBoundAction (...args) {
      return action.call(this, store, ...args)
    }
  }

  // option merging
  const merge = Vue.config.optionMergeStrategies.computed
  Vue.config.optionMergeStrategies.vuex = (toVal, fromVal) => {
    if (!toVal) return fromVal
    if (!fromVal) return toVal
    return {
      getters: merge(toVal.getters, fromVal.getters),
      state: merge(toVal.state, fromVal.state),
      actions: merge(toVal.actions, fromVal.actions)
    }
  }
}

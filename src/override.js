export default function (Vue) {
  // override init and inject vuex init procedure
  const _init = Vue.prototype._init
  Vue.prototype._init = function (options = {}) {
    options.init = options.init
      ? [vuexInit].concat(options.init)
      : vuexInit
    _init.call(this, options)
  }

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
          options.computed[key] = makeBoundGetter(getters[key])
        }
      }
      // actions
      if (actions) {
        options.methods = options.methods || {}
        for (let key in actions) {
          options.methods[key] = makeBoundAction(actions[key])
        }
      }
    }
  }

  function makeBoundGetter (getter) {
    return function vuexBoundGetter () {
      return getter.call(this, this.$store.state)
    }
  }

  function makeBoundAction (action) {
    return function vuexBoundAction (...args) {
      return action.call(this, this.$store, ...args)
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

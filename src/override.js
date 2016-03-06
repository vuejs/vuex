// export install function
export default function (Vue) {
  const _init = Vue.prototype._init
  Vue.prototype._init = function (options) {
    options = options || {}
    const componentOptions = this.constructor.options
    // store injection
    const store = options.store || componentOptions.store
    if (store) {
      this.$store = store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
    // vuex option handling
    const vuex = options.vuex || componentOptions.vuex
    if (vuex) {
      if (!this.$store) {
        console.warn(
          '[vuex] store not injected. make sure to ' +
          'provide the store option in your root component.'
        )
      }
      let { state, getters, actions } = vuex
      // getters
      if (state && !getters) {
        console.warn(
          '[vuex] vuex.state option has been deprecated. ' +
          'Use vuex.getters instead.'
        )
        getters = state
      }
      if (getters) {
        options.computed = options.computed || {}
        Object.keys(getters).forEach(key => {
          options.computed[key] = function vuexBoundGetter () {
            return getters[key].call(this, this.$store.state)
          }
        })
      }
      // actions
      if (actions) {
        options.methods = options.methods || {}
        Object.keys(actions).forEach(key => {
          options.methods[key] = function vuexBoundAction (...args) {
            return actions[key].call(this, this.$store, ...args)
          }
        })
      }
    }
    _init.call(this, options)
  }
}

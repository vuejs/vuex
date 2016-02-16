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
      const { state, actions } = vuex
      // state
      if (state) {
        options.computed = options.computed || {}
        Object.keys(state).forEach(key => {
          options.computed[key] = function vuexBoundGetter () {
            return state[key](this.$store.state)
          }
        })
      }
      // actions
      if (actions) {
        options.methods = options.methods || {}
        Object.keys(actions).forEach(key => {
          options.methods[key] = function vuexBoundAction (...args) {
            return actions[key](this.$store, ...args)
          }
        })
      }
    }
    _init.call(this, options)
  }
}

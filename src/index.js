import {
  mergeObjects, isObject,
  getNestedState, getWatcher
} from './util'
import devtoolPlugin from './plugins/devtool'
import override from './override'

let Vue
let uid = 0

class Store {

  /**
   * @param {Object} options
   *        - {Object} state
   *        - {Object} actions
   *        - {Object} mutations
   *        - {Array} plugins
   *        - {Boolean} strict
   */

  constructor ({
    state = {},
    mutations = {},
    modules = {},
    plugins = [],
    strict = false
  } = {}) {
    this._getterCacheId = 'vuex_store_' + uid++
    this._dispatching = false
    this._rootMutations = this._mutations = mutations
    this._modules = modules
    this._subscribers = []
    // bind dispatch to self
    const dispatch = this.dispatch
    this.dispatch = (...args) => {
      dispatch.apply(this, args)
    }
    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    if (!Vue) {
      throw new Error(
        '[vuex] must call Vue.use(Vuex) before creating a store instance.'
      )
    }
    const silent = Vue.config.silent
    Vue.config.silent = true
    this._vm = new Vue({
      data: {
        state
      }
    })
    Vue.config.silent = silent
    this._setupModuleState(state, modules)
    this._setupModuleMutations(modules)
    // add extra warnings in strict mode
    if (strict) {
      this._setupMutationCheck()
    }
    // apply plugins
    devtoolPlugin(this)
    plugins.forEach(plugin => plugin(this))
  }

  /**
   * Getter for the entire state tree.
   * Read only.
   *
   * @return {Object}
   */

  get state () {
    return this._vm.state
  }

  set state (v) {
    throw new Error('[vuex] Use store.replaceState() to explicit replace store state.')
  }

  /**
   * Replace root state.
   *
   * @param {Object} state
   */

  replaceState (state) {
    this._dispatching = true
    this._vm.state = state
    this._dispatching = false
  }

  /**
   * Dispatch an action.
   *
   * @param {String} type
   */

  dispatch (type, ...payload) {
    let silent = false
    let isObjectStyleDispatch = false
    // compatibility for object actions, e.g. FSA
    if (typeof type === 'object' && type.type && arguments.length === 1) {
      isObjectStyleDispatch = true
      payload = type
      if (type.silent) silent = true
      type = type.type
    }

    if (typeof type !== 'string') {
      throw new Error(
        `Expects string as the type, but found ${typeof type}.`
      )
    }

    const handler = this._mutations[type]
    const state = this.state
    if (handler) {
      this._dispatching = true
      // apply the mutation
      if (Array.isArray(handler)) {
        handler.forEach(h => {
          isObjectStyleDispatch
            ? h(state, payload)
            : h(state, ...payload)
        })
      } else {
        isObjectStyleDispatch
          ? handler(state, payload)
          : handler(state, ...payload)
      }
      this._dispatching = false
      if (!silent) {
        const mutation = isObjectStyleDispatch
          ? payload
          : { type, payload }
        this._subscribers.forEach(sub => sub(mutation, state))
      }
    } else {
      console.warn(`[vuex] Unknown mutation: ${type}`)
    }
  }

  /**
   * Watch state changes on the store.
   * Same API as Vue's $watch, except when watching a function,
   * the function gets the state as the first argument.
   *
   * @param {Function} fn
   * @param {Function} cb
   * @param {Object} [options]
   */

  watch (fn, cb, options) {
    if (typeof fn !== 'function') {
      console.error('Vuex store.watch only accepts function.')
      return
    }
    return this._vm.$watch(() => fn(this.state), cb, options)
  }

  /**
   * Subscribe to state changes. Fires after every mutation.
   */

  subscribe (fn) {
    const subs = this._subscribers
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  }

  /**
   * Hot update mutations & modules.
   *
   * @param {Object} options
   *        - {Object} [mutations]
   *        - {Object} [modules]
   */

  hotUpdate ({ mutations, modules } = {}) {
    this._rootMutations = this._mutations = mutations || this._rootMutations
    this._setupModuleMutations(modules || this._modules)
  }

  /**
   * Attach sub state tree of each module to the root tree.
   *
   * @param {Object} state
   * @param {Object} modules
   */

  _setupModuleState (state, modules) {
    if (!isObject(modules)) return

    Object.keys(modules).forEach(key => {
      const module = modules[key]

      // set this module's state
      Vue.set(state, key, module.state || {})

      // retrieve nested modules
      this._setupModuleState(state[key], module.modules)
    })
  }

  /**
   * Bind mutations for each module to its sub tree and
   * merge them all into one final mutations map.
   *
   * @param {Object} updatedModules
   */

  _setupModuleMutations (updatedModules) {
    const modules = this._modules
    Object.keys(updatedModules).forEach(key => {
      modules[key] = updatedModules[key]
    })
    const updatedMutations = this._createModuleMutations(modules, [])
    this._mutations = mergeObjects([this._rootMutations, ...updatedMutations])
  }

  /**
   * Helper method for _setupModuleMutations.
   * The method retrieve nested sub modules and
   * bind each mutations to its sub tree recursively.
   *
   * @param {Object} modules
   * @param {Array<String>} nestedKeys
   * @return {Array<Object>}
   */

  _createModuleMutations (modules, nestedKeys) {
    if (!isObject(modules)) return []

    return Object.keys(modules).map(key => {
      const module = modules[key]
      const newNestedKeys = nestedKeys.concat(key)

      // retrieve nested modules
      const nestedMutations = this._createModuleMutations(module.modules, newNestedKeys)

      if (!module || !module.mutations) {
        return mergeObjects(nestedMutations)
      }

      // bind mutations to sub state tree
      const mutations = {}
      Object.keys(module.mutations).forEach(name => {
        const original = module.mutations[name]
        mutations[name] = (state, ...args) => {
          original(getNestedState(state, newNestedKeys), ...args)
        }
      })

      // merge mutations of this module and nested modules
      return mergeObjects([
        mutations,
        ...nestedMutations
      ])
    })
  }

  /**
   * Setup mutation check: if the Vuex instance's state is mutated
   * outside of a mutation handler, we throw en error. This effectively
   * enforces all mutations to the state to be trackable and hot-reloadable.
   * However, this comes at a run time cost since we are doing a deep
   * watch on the entire state tree, so it is only enabled if the
   * strict option is set to true.
   */

  _setupMutationCheck () {
    const Watcher = getWatcher(this._vm)
    /* eslint-disable no-new */
    new Watcher(this._vm, 'state', () => {
      if (!this._dispatching) {
        throw new Error(
          '[vuex] Do not mutate vuex store state outside mutation handlers.'
        )
      }
    }, { deep: true, sync: true })
    /* eslint-enable no-new */
  }
}

function install (_Vue) {
  if (Vue) {
    console.warn(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  override(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  Store,
  install
}

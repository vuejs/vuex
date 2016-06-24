import {
  mergeObjects, deepClone, isObject,
  getNestedState, getWatcher
} from './util'
import devtoolMiddleware from './middlewares/devtool'
import override from './override'

let Vue
let uid = 0

class Store {

  /**
   * @param {Object} options
   *        - {Object} state
   *        - {Object} actions
   *        - {Object} mutations
   *        - {Array} middlewares
   *        - {Boolean} strict
   */

  constructor ({
    state = {},
    mutations = {},
    modules = {},
    middlewares = [],
    strict = false
  } = {}) {
    this._getterCacheId = 'vuex_store_' + uid++
    this._dispatching = false
    this._rootMutations = this._mutations = mutations
    this._modules = modules
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
      data: state
    })
    Vue.config.silent = silent
    this._setupModuleState(state, modules)
    this._setupModuleMutations(modules)
    this._setupMiddlewares(middlewares, state)
    // add extra warnings in strict mode
    if (strict) {
      this._setupMutationCheck()
    }
  }

  /**
   * Getter for the entire state tree.
   * Read only.
   *
   * @return {Object}
   */

  get state () {
    return this._vm._data
  }

  set state (v) {
    throw new Error('[vuex] Vuex root state is read only.')
  }

  /**
   * Dispatch an action.
   *
   * @param {String} type
   */

  dispatch (type, ...payload) {
    let silent = false
    // compatibility for object actions, e.g. FSA
    if (typeof type === 'object' && type.type && arguments.length === 1) {
      payload = [type.payload]
      if (type.silent) silent = true
      type = type.type
    }
    const mutation = this._mutations[type]
    const state = this.state
    if (mutation) {
      this._dispatching = true
      // apply the mutation
      if (Array.isArray(mutation)) {
        mutation.forEach(m => m(state, ...payload))
      } else {
        mutation(state, ...payload)
      }
      this._dispatching = false
      if (!silent) this._applyMiddlewares(type, payload)
    } else {
      console.warn(`[vuex] Unknown mutation: ${type}`)
    }
  }

  /**
   * Watch state changes on the store.
   * Same API as Vue's $watch, except when watching a function,
   * the function gets the state as the first argument.
   *
   * @param {String|Function} expOrFn
   * @param {Function} cb
   * @param {Object} [options]
   */

  watch (expOrFn, cb, options) {
    return this._vm.$watch(() => {
      return typeof expOrFn === 'function'
        ? expOrFn(this.state)
        : this._vm.$get(expOrFn)
    }, cb, options)
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
   * Setup mutation check: if the vuex instance's state is mutated
   * outside of a mutation handler, we throw en error. This effectively
   * enforces all mutations to the state to be trackable and hot-reloadble.
   * However, this comes at a run time cost since we are doing a deep
   * watch on the entire state tree, so it is only enalbed with the
   * strict option is set to true.
   */

  _setupMutationCheck () {
    const Watcher = getWatcher(this._vm)
    /* eslint-disable no-new */
    new Watcher(this._vm, '$data', () => {
      if (!this._dispatching) {
        throw new Error(
          '[vuex] Do not mutate vuex store state outside mutation handlers.'
        )
      }
    }, { deep: true, sync: true })
    /* eslint-enable no-new */
  }

  /**
   * Setup the middlewares. The devtools middleware is always
   * included, since it does nothing if no devtool is detected.
   *
   * A middleware can demand the state it receives to be
   * "snapshots", i.e. deep clones of the actual state tree.
   *
   * @param {Array} middlewares
   * @param {Object} state
   */

  _setupMiddlewares (middlewares, state) {
    this._middlewares = [devtoolMiddleware].concat(middlewares)
    this._needSnapshots = middlewares.some(m => m.snapshot)
    if (this._needSnapshots) {
      console.log(
        '[vuex] One or more of your middlewares are taking state snapshots ' +
        'for each mutation. Make sure to use them only during development.'
      )
    }
    const initialSnapshot = this._prevSnapshot = this._needSnapshots
      ? deepClone(state)
      : null
    // call init hooks
    this._middlewares.forEach(m => {
      if (m.onInit) {
        m.onInit(m.snapshot ? initialSnapshot : state, this)
      }
    })
  }

  /**
   * Apply the middlewares on a given mutation.
   *
   * @param {String} type
   * @param {Array} payload
   */

  _applyMiddlewares (type, payload) {
    const state = this.state
    const prevSnapshot = this._prevSnapshot
    let snapshot, clonedPayload
    if (this._needSnapshots) {
      snapshot = this._prevSnapshot = deepClone(state)
      clonedPayload = deepClone(payload)
    }
    this._middlewares.forEach(m => {
      if (m.onMutation) {
        if (m.snapshot) {
          m.onMutation({ type, payload: clonedPayload }, snapshot, prevSnapshot, this)
        } else {
          m.onMutation({ type, payload }, state, this)
        }
      }
    })
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

function createLogger () {
  console.warn(
    '[vuex] Vuex.createLogger has been deprecated.' +
    'Use `import createLogger from \'vuex/logger\' instead.'
  )
}

export default {
  Store,
  install,
  createLogger
}

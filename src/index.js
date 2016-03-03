import { mergeObjects, deepClone } from './util'
import devtoolMiddleware from './middlewares/devtool'
import createLogger from './middlewares/logger'
import override from './override'

let Vue

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
    this._dispatching = false
    this._rootMutations = this._mutations = mutations
    this._modules = modules
    // bind dispatch to self
    const dispatch = this.dispatch
    this.dispatch = (...args) => {
      dispatch.apply(this, args)
    }
    // use a Vue instance to store the state tree
    this._vm = new Vue({
      data: state
    })
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
    const mutation = this._mutations[type]
    const prevSnapshot = this._prevSnapshot
    const state = this.state
    let snapshot, clonedPayload
    if (mutation) {
      this._dispatching = true
      // apply the mutation
      if (Array.isArray(mutation)) {
        mutation.forEach(m => m(state, ...payload))
      } else {
        mutation(state, ...payload)
      }
      this._dispatching = false
      // invoke middlewares
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
   * Hot update actions and mutations.
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
    const { setPath } = Vue.parsers.path
    Object.keys(modules).forEach(key => {
      setPath(state, key, modules[key].state || {})
    })
  }

  /**
   * Bind mutations for each module to its sub tree and
   * merge them all into one final mutations map.
   *
   * @param {Object} modules
   */

  _setupModuleMutations (modules) {
    this._modules = modules
    const { getPath } = Vue.parsers.path
    const allMutations = [this._rootMutations]
    Object.keys(modules).forEach(key => {
      const module = modules[key]
      if (!module || !module.mutations) return
      // bind mutations to sub state tree
      const mutations = {}
      Object.keys(module.mutations).forEach(name => {
        const original = module.mutations[name]
        mutations[name] = (state, ...args) => {
          original(getPath(state, key), ...args)
        }
      })
      allMutations.push(mutations)
    })
    this._mutations = mergeObjects(allMutations)
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
    // a hack to get the watcher constructor from older versions of Vue
    // mainly because the public $watch method does not allow sync
    // watchers.
    const unwatch = this._vm.$watch('__vuex__', a => a)
    const Watcher = this._vm._watchers[0].constructor
    unwatch()
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
}

function install (_Vue) {
  Vue = _Vue
  override(Vue)
}

export default {
  Store,
  install,
  createLogger
}

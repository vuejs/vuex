import { createAction, mergeObjects, deepClone } from './util'
import devtoolMiddleware from './middlewares/devtool'
import createLogger from './middlewares/logger'

let Vue

export class Store {

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
    actions = {},
    mutations = {},
    middlewares = [],
    strict = false
  } = {}) {
    // bind dispatch to self
    const dispatch = this.dispatch
    this.dispatch = (...args) => {
      dispatch.apply(this, args)
    }
    // use a Vue instance to store the state tree
    this._vm = new Vue({
      data: state
    })
    this._dispatching = false
    this.actions = Object.create(null)
    this._setupActions(actions)
    this._setupMutations(mutations)
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
            m.onMutation({ type, payload: clonedPayload }, snapshot, prevSnapshot)
          } else {
            m.onMutation({ type, payload }, state)
          }
        }
      })
    } else {
      console.warn(`[vuex] Unknown mutation: ${ type }`)
    }
  }

  /**
   * Hot update actions and mutations.
   *
   * @param {Object} options
   *        - {Object} [actions]
   *        - {Object} [mutations]
   */

  hotUpdate ({ actions, mutations } = {}) {
    if (actions) {
      this._setupActions(actions, true)
    }
    if (mutations) {
      this._setupMutations(mutations)
    }
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
    new Watcher(this._vm, '$data', () => {
      if (!this._dispatching) {
        throw new Error(
          '[vuex] Do not mutate vuex store state outside mutation handlers.'
        )
      }
    }, { deep: true, sync: true })
  }

  /**
   * Set up the callable action functions exposed to components.
   * This method can be called multiple times for hot updates.
   * We keep the real action functions in an internal object,
   * and expose the public object which are just wrapper
   * functions that point to the real ones. This is so that
   * the reals ones can be hot reloaded.
   *
   * @param {Object} actions
   * @param {Boolean} [hot]
   */

  _setupActions (actions, hot) {
    this._actions = Object.create(null)
    actions = Array.isArray(actions)
      ? mergeObjects(actions)
      : actions
    Object.keys(actions).forEach(name => {
      this._actions[name] = createAction(actions[name], this)
      if (!this.actions[name]) {
        this.actions[name] = (...args) => this._actions[name](...args)
      }
    })
    // delete public actions that are no longer present
    // after a hot reload
    if (hot) {
      Object.keys(this.actions).forEach(name => {
        if (!actions[name]) {
          delete this.actions[name]
        }
      })
    }
  }

  /**
   * Setup the mutation handlers. Effectively a event listener.
   * This method can be called multiple times for hot updates.
   *
   * @param {Object} mutations
   */

  _setupMutations (mutations) {
    this._mutations = Array.isArray(mutations)
      ? mergeObjects(mutations, true)
      : mutations
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
        m.onInit(m.snapshot ? initialSnapshot : state)
      }
    })
  }
}

// export logger factory
export { createLogger }

// export install function
export function install (_Vue) {
  Vue = _Vue
  const _init = Vue.prototype._init
  Vue.prototype._init = function (options) {
    options = options || {}
    if (options.store) {
      this.$store = options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
    _init.call(this, options)
  }
}

// also export the default
export default {
  Store,
  createLogger,
  install
}

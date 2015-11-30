import { createAction, mergeObjects, deepClone } from './util'
import devtoolMiddleware from './middlewares/devtool'

let Vue

export default class Vuex {

  /**
   * @param {Object} options
   *        - {Object} state
   *        - {Object} actions
   *        - {Object} mutations
   *        - {Array} middlewares
   */

  constructor ({
    state = {},
    actions = {},
    mutations = {},
    middlewares = []
  } = {}) {
    // use a Vue instance to store the state tree
    this._vm = new Vue({
      data: state
    })
    this.actions = Object.create(null)
    this._setupActions(actions)
    this._setupMutations(mutations)
    this._setupMiddlewares(middlewares, state)
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
      // apply the mutation
      if (Array.isArray(mutation)) {
        mutation.forEach(m => m(state, ...payload))
      } else {
        mutation(state, ...payload)
      }
      // invoke middlewares
      if (this._needSnapshots) {
        snapshot = this._prevSnapshot = deepClone(state)
        clonedPayload = deepClone(payload)
      }
      this._middlewares.forEach(m => {
        if (m.snapshot) {
          m.onMutation({ type, payload: clonedPayload }, snapshot, prevSnapshot)
        } else {
          m.onMutation({ type, payload }, state)
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

  _setupActions (actions, hot) {
    // keep the real action functions in an internal object,
    // and expose the public object which are just wrapper
    // functions that point to the real ones. This is so that
    // the reals ones can be hot reloaded.
    this._actions = Object.create(null)
    actions = Array.isArray(actions)
      ? mergeObjects(actions)
      : actions
    Object.keys(actions).forEach(name => {
      this._actions[name] = createAction(actions[name], this)
      if (!this.actions[name]) {
        this.actions[name] = () => this._actions[name]()
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

  _setupMutations (mutations) {
    this._mutations = Array.isArray(mutations)
      ? mergeObjects(mutations, true)
      : mutations
  }

  _setupMiddlewares (middlewares, state) {
    this._middlewares = [devtoolMiddleware].concat(middlewares)
    this._needSnapshots = middlewares.some(m => m.snapshot)
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

/**
 * Exposed install method
 */

Vuex.install = function (_Vue) {
  Vue = _Vue
}

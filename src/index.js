import mixin from './mixin'
import Cursor from './cursor'

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
    middlewares = [],
    debug = false
  } = {}) {

    this._debug = debug

    // use a Vue instance to store the state tree
    this._vm = new Vue({
      data: state
    })

    // create actions
    this.actions = Object.create(null)
    actions = Array.isArray(actions)
      ? mergeObjects(actions)
      : actions
    Object.keys(actions).forEach(name => {
      this.actions[name] = createAction(actions[name], this)
    })

    // mutations
    this._mutations = Array.isArray(mutations)
      ? mergeObjects(mutations, true)
      : mutations

    // middlewares
    this._middlewares = middlewares
  }

  /**
   * "Get" the store's state, or a part of it.
   * Returns a Cursor, which can be subscribed to for change,
   * and disposed of when no longer needed.
   *
   * @param {String} [path]
   * @return {Cursor}
   */

  get (path) {
    return new Cursor(this._vm, path)
  }

  /**
   * Dispatch an action.
   *
   * @param {String} type
   */

  dispatch (type, ...payload) {
    const mutation = this._mutations[type]
    if (mutation) {
      if (Array.isArray(mutation)) {
        mutation.forEach(m => m(this.state, ...payload))
      } else {
        mutation(this.state, ...payload)
      }
      this._middlewares.forEach(middleware => {
        middleware({ type, payload }, this.state)
      })
    } else {
      console.warn(`[vuex] Unknown mutation: ${ type }`)
    }
  }

  /**
   * Getter for the entire state tree.
   *
   * @return {Object}
   */

  get state () {
    return this._vm._data
  }
}

/**
 * Exposed install method
 */

Vuex.install = function (_Vue) {
  Vue = _Vue
  Vue.mixin(mixin)
}

/**
 * Create a actual callable action function.
 *
 * @param {String|Function} action
 * @param {Vuex} vuex
 * @return {Function} [description]
 */

function createAction (action, vuex) {
  if (typeof action === 'string') {
    // simple action string shorthand
    return (...payload) => {
      vuex.dispatch(action, ...payload)
    }
  } else if (typeof action === 'function') {
    // thunk action
    return (...args) => {
      const dispatch = (...args) => {
        vuex.dispatch(...args)
      }
      action(...args)(dispatch, vuex.state)
    }
  }
}

/**
 * Merge an array of objects into one.
 *
 * @param {Array<Object>} arr
 * @param {Boolean} allowDuplicate
 * @return {Object}
 */

function mergeObjects (arr, allowDuplicate) {
  return arr.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const existing = prev[key]
      if (existing) {
        // allow multiple mutation objects to contain duplicate
        // handlers for the same mutation type
        if (allowDuplicate) {
          if (Array.isArray(existing)) {
            existing.push(obj[key])
          } else {
            prev[key] = [prev[key], obj[key]]
          }
        } else {
          console.warn(`[vuex] Duplicate action: ${ key }`)
        }
      } else {
        prev[key] = obj[key]
      }
    })
    return prev
  }, {})
}

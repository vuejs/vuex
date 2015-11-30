/**
 * Create a actual callable action function.
 *
 * @param {String|Function} action
 * @param {Vuex} vuex
 * @return {Function} [description]
 */

export function createAction (action, vuex) {
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

export function mergeObjects (arr, allowDuplicate) {
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

/**
 * Deep clone an object. Faster than JSON.parse(JSON.stringify()).
 *
 * @param {*} obj
 * @return {*}
 */

export function deepClone (obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  } else if (obj && typeof obj === 'object') {
    var cloned = {}
    var keys = Object.keys(obj)
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      cloned[key] = deepClone(obj[key])
    }
    return cloned
  } else {
    return obj
  }
}

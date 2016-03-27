/**
 * Merge an array of objects into one.
 *
 * @param {Array<Object>} arr
 * @return {Object}
 */

export function mergeObjects (arr) {
  return arr.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const existing = prev[key]
      if (existing) {
        // allow multiple mutation objects to contain duplicate
        // handlers for the same mutation type
        if (Array.isArray(existing)) {
          existing.push(obj[key])
        } else {
          prev[key] = [prev[key], obj[key]]
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

export function mutatorNameToCamelCase (name) {
  var len = name.length
  var newName = ''
  for (var i = 0; i < len; i++) {
    if (name[i] === '_') {
      continue
    }
    if (name[i - 1] && name[i - 1] === '_') {
      newName += name[i].toUpperCase()
    } else {
      newName += name[i].toLowerCase()
    }
  }

  return newName
}

/**
 * Hacks to get access to Vue internals.
 * Maybe we should expose these...
 */

let Watcher
export function getWatcher (vm) {
  if (!Watcher) {
    const unwatch = vm.$watch('__vuex__', a => a)
    Watcher = vm._watchers[0].constructor
    unwatch()
  }
  return Watcher
}

let Dep
export function getDep (vm) {
  if (!Dep) {
    Dep = vm._data.__ob__.dep.constructor
  }
  return Dep
}

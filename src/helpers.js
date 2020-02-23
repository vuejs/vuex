import { isObject } from './util'

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {Object} [store] - Vuex Store Object
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
export const mapState = normalizeNamespace((store, namespace, states) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(states)) {
    console.error(
      '[vuex] mapState: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      const $store = store || this.$store
      let state = $store.state
      let getters = $store.getters
      if (namespace) {
        const module = getModuleByNamespace($store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {Object} [store] - Vuex Store Object
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept anthor params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
export const mapMutations = normalizeNamespace(
  (store, namespace, mutations) => {
    const res = {}
    if (process.env.NODE_ENV !== 'production' && !isValidMap(mutations)) {
      console.error(
        '[vuex] mapMutations: mapper parameter must be either an Array or an Object'
      )
    }
    normalizeMap(mutations).forEach(({ key, val }) => {
      res[key] = function mappedMutation (...args) {
        const $store = store || this.$store
        // Get the commit method from store
        let commit = $store.commit
        if (namespace) {
          const module = getModuleByNamespace(
            $store,
            'mapMutations',
            namespace
          )
          if (!module) {
            return
          }
          commit = module.context.commit
        }
        return typeof val === 'function'
          ? val.apply(this, [commit].concat(args))
          : commit.apply($store, [val].concat(args))
      }
    })
    return res
  }
)

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {Object} [store] - Vuex Store Object
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
export const mapGetters = normalizeNamespace((store, namespace, getters) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(getters)) {
    console.error(
      '[vuex] mapGetters: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(getters).forEach(({ key, val }) => {
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val
    res[key] = function mappedGetter () {
      const $store = store || this.$store
      if (namespace && !getModuleByNamespace($store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in $store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`)
        return
      }
      return $store.getters[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {Object} [store] - Vuex Store Object
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the first param, it can accept anthor params. You can dispatch action and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
export const mapActions = normalizeNamespace((store, namespace, actions) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(actions)) {
    console.error(
      '[vuex] mapActions: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction (...args) {
      const $store = store || this.$store
      // get dispatch function from store
      let dispatch = $store.dispatch
      if (namespace) {
        const module = getModuleByNamespace($store, 'mapActions', namespace)
        if (!module) {
          return
        }
        dispatch = module.context.dispatch
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply($store, [val].concat(args))
    }
  })
  return res
})

/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @param {Object} [store] Vuex Store bject
 * @return {Object}
 */
export const createNamespacedHelpers = (namespace, store = null) => ({
  mapState: mapState.bind(null, store, namespace),
  mapGetters: mapGetters.bind(null, store, namespace),
  mapMutations: mapMutations.bind(null, store, namespace),
  mapActions: mapActions.bind(null, store, namespace)
})

/**
 * Wrap a store object in order to gain ability to createNamespacedHelpers outside vue components system.
 * @param {Object} [store] Vuex Store bject
 * @return {Object}
 */
export const wrapHelpers = store => ({
  createNamespacedHelpers: namespace =>
    createNamespacedHelpers(namespace, store)
})

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap (map) {
  return Array.isArray(map) || isObject(map)
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return (store, namespace, map) => {
    if (store !== null && (Array.isArray(store) || !(isObject(store) && isObject(store.state)))) {
      map = namespace
      namespace = store
      store = null
    }
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(store, namespace, map)
  }
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(
      `[vuex] module namespace not found in ${helper}(): ${namespace}`
    )
  }
  return module
}

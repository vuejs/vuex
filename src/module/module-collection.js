import Module from './module'
import { assert, forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }

  /**
   * Get the module by special paths which store in array
   * @param {Array} path - Module's path store in array
   * @return {Object} - Special module
   */
  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  /**
   * Generate namespace by special paths which store in array
   * @param {Array} path - Module's path store in array
   * @return {String} - Special namespace
   */
  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  /**
   * Update the root module
   * @param {Object} rawRootModule - Module Object customized by developer
   * @return {Void}
   */
  update (rawRootModule) {
    updateModule([], this.root, rawRootModule)
  }

  /**
   * Register the module, initialize the modules collection by raw module which passed from Vuex.Store
   * @param {Array} path
   * @param {Object} rawModule - customized by developer
   * @param {Boolean} runtime - default to true
   * @return {Void}
   */
  register (path, rawModule, runtime = true) {
    if (process.env.NODE_ENV !== 'production') {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) {
      this.root = newModule
    } else {
      // get module's parent by parent's path
      const parent = this.get(path.slice(0, -1))

      // add child by child's path and the Module's object
      const key = path[path.length - 1]
      parent.addChild(key, newModule)
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  /**
   * Unregister the module by path. First of all the child module must be runtime, and we can provide the path like ['order'] to remove the special child module of root module.
   * @param {Array} path
   * @return {Boolean}
   */
  unregister (path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    if (!parent.getChild(key).runtime) return false

    parent.removeChild(key)
    return true
  }
}

/**
 * Update the special module
 * @param {Array} path
 * @param {Object} targetModule - Module object which is existing
 * @param {Object} newModule - customized by developer
 * @return {Void}
 */
export function updateModule (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule)
  }

  // update target module
  targetModule.update(newModule)

  // update nested modules
  if (newModule.modules) {
    for (const key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[vuex] trying to add a new module '${key}' on hot reloading, ` +
            'manual reload is needed'
          )
        }
        return
      }
      updateModule(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      )
    }
  }
}

const functionAssert = {
  assert: value => typeof value === 'function',
  expected: 'function'
}

const objectAssert = {
  assert: value => typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'),
  expected: 'function or object with "handler" function'
}

const assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
}

/**
 * Check if the item of rawModule's `getters`, `mutations`, `actions` is valid. if not throw error to developer
 * @param {Array} path - Path of the module
 * @param {Object} rawModule - customized by developer
 * @return {Void}
 */
export function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(key => {
    if (!rawModule[key]) return

    const assertOptions = assertTypes[key]

    forEachValue(rawModule[key], (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      )
    })
  })
}

/**
 * Format the error message
 * @param {Array} path - Path of module
 * @param {String} key - Special key of the module like `getters`, `mutations`, `actions`
 * @param {String} type - Attribute name in module's `getters`, `mutations` or `actions`
 * @param {String} value - Value of special attribute in module's `getters`, `mutations` or `actions`
 * @param {String} expected - Expected string for assert
 */
export function makeAssertionMessage (path, key, type, value, expected) {
  let buf = `${key} should be ${expected} but "${key}.${type}"`
  if (path.length > 0) {
    buf += ` in module "${path.join('.')}"`
  }
  buf += ` is ${JSON.stringify(value)}.`
  return buf
}

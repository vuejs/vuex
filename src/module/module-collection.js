import Module from './module'
import { forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.root = new Module(rawRootModule, false)

    // register all nested modules
    if (rawRootModule.modules) {
      forEachValue(rawRootModule.modules, (rawModule, key) => {
        this.register([key], rawModule, false)
      })
    }
  }

  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  getParent (path) {
    return this.get(path.slice(0, -1))
  }

  getKey (path) {
    return path[path.length - 1]
  }

  update (rawRootModule) {
    update(this.root, rawRootModule)
  }

  register (path, rawModule, runtime = true) {
    const parent = this.getParent(path)
    const newModule = new Module(rawModule, runtime)
    parent.addChild(this.getKey(path), newModule)

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  unregister (path) {
    const parent = this.getParent(path)
    const key = this.getKey(path)
    if (!parent.getChild(key).runtime) return

    parent.removeChild(key)
  }
}

function update (targetModule, newModule) {
  // update target module
  targetModule.update(newModule)

  // update nested modules
  if (newModule.modules) {
    for (const key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        console.warn(
          `[vuex] trying to add a new module '${key}' on hot reloading, ` +
          'manual reload is needed'
        )
        return
      }
      update(targetModule.getChild(key), newModule.modules[key])
    }
  }
}

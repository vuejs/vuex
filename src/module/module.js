import { forEachValue } from '../util'

export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    this._children = Object.create(null)
    this._rawModule = rawModule
  }

  get state () {
    return this._rawModule.state
  }

  get hasNamespace () {
    return this._rawModule.namespace != null && this._rawModule.namespace !== ''
  }

  get namespacer () {
    // if the namespace option is string value, convert it to a function
    let namespacer = this._rawModule.namespace || ''
    if (typeof namespacer === 'string') {
      const prefix = namespacer
      namespacer = (type, category) => prefix + type
    }
    return namespacer
  }

  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }

  update (rawModule) {
    this._rawModule.namespace = rawModule.namespace
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}

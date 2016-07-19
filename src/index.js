import devtoolPlugin from './plugins/devtool'
import applyMixin from './mixin'
import { mapState, mapMutations, mapGetters, mapActions } from './helpers'

let Vue // bind on install

class Store {
  constructor (options = {}) {
    assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
    assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)

    const {
      state = {},
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._options = options
    this._committing = false
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._subscribers = []
    this._pendingActions = []

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload) {
      return commit.call(store, type, payload)
    }

    // strict mode
    this.strict = strict

    // init internal vm with root state
    // other options and sub modules will be
    // initialized in this.module method
    initStoreVM(this, state, {})

    // apply root module
    this.module([], options)

    // apply plugins
    plugins.concat(devtoolPlugin).forEach(plugin => plugin(this))
  }

  get state () {
    return this._vm.state
  }

  set state (v) {
    assert(false, `Use store.replaceState() to explicit replace store state.`)
  }

  replaceState (state) {
    this._committing = true
    this._vm.state = state
    this._committing = false
  }

  module (path, module, hot) {
    this._committing = true
    if (typeof path === 'string') path = [path]
    assert(Array.isArray(path), `module path must be a string or an Array.`)

    initModule(this, path, module, hot)

    initStoreVM(this, this.state, this._wrappedGetters)

    this._committing = false
  }

  mutation (type, handler, path = []) {
    const entry = this._mutations[type] || (this._mutations[type] = [])
    const store = this
    entry.push(function wrappedMutationHandler (payload) {
      handler(getNestedState(store.state, path), payload)
    })
  }

  action (type, handler, path = []) {
    const entry = this._actions[type] || (this._actions[type] = [])
    const store = this
    const { dispatch, commit } = this
    entry.push(function wrappedActionHandler (payload, cb) {
      let res = handler({
        dispatch,
        commit,
        getters: store.getters,
        state: getNestedState(store.state, path),
        rootState: store.state
      }, payload, cb)
      if (!isPromise(res)) {
        res = Promise.resolve(res)
      }
      if (store._devtoolHook) {
        return res.catch(err => {
          store._devtoolHook.emit('vuex:error', err)
          throw err
        })
      } else {
        return res
      }
    })
  }

  commit (type, payload) {
    // check object-style commit
    let mutation
    if (isObject(type) && type.type) {
      payload = mutation = type
      type = type.type
    } else {
      mutation = { type, payload }
    }
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`[vuex] unknown mutation type: ${type}`)
      return
    }
    this._committing = true
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
    this._committing = false
    if (!payload || !payload.silent) {
      this._subscribers.forEach(sub => sub(mutation, this.state))
    }
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error(`[vuex] unknown action type: ${type}`)
      return
    }
    const res = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
    const pending = this._pendingActions
    pending.push(res)
    return res.then(value => {
      pending.splice(pending.indexOf(res), 1)
      return value
    })
  }

  onActionsResolved (cb) {
    Promise.all(this._pendingActions).then(cb)
  }

  subscribe (fn) {
    const subs = this._subscribers
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  }

  watch (getter, cb, options) {
    assert(typeof getter === 'function', `store.watch only accepts a function.`)
    return this._vm.$watch(() => getter(this.state), cb, options)
  }

  hotUpdate (newOptions) {
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    const options = this._options
    if (newOptions.actions) {
      options.actions = newOptions.actions
    }
    if (newOptions.mutations) {
      options.mutations = newOptions.mutations
    }
    if (newOptions.getters) {
      options.getters = newOptions.getters
    }
    if (newOptions.modules) {
      for (const key in newOptions.modules) {
        options.modules[key] = newOptions.modules[key]
      }
    }
    this.module([], options, true)
  }
}

function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

function initStoreVM (store, state, getters) {
  const oldVm = store._vm

  // bind getters
  store.getters = {}
  const computed = {}
  Object.keys(getters).forEach(key => {
    const fn = getters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: { state },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._committing = true
    oldVm.state = null
    store._committing = false
    Vue.nextTick(() => oldVm.$destroy())
  }
}

function initModule (store, path, module, hot) {
  const isRoot = !path.length
  const {
    state,
    actions,
    mutations,
    getters,
    modules
  } = module

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(store.state, path.slice(0, -1))
    if (!parentState) debugger
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, state || {})
  }

  if (mutations) {
    Object.keys(mutations).forEach(key => {
      store.mutation(key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(key => {
      store.action(key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store._wrappedGetters, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(key => {
      initModule(store, path.concat(key), modules[key], hot)
    })
  }
}

function wrapGetters (getters, moduleGetters, modulePath) {
  Object.keys(moduleGetters).forEach(getterKey => {
    const rawGetter = moduleGetters[getterKey]
    if (getters[getterKey]) {
      console.error(`[vuex] duplicate getter key: ${getterKey}`)
      return
    }
    getters[getterKey] = function wrappedGetter (store) {
      return rawGetter(
        getNestedState(store.state, modulePath), // local state
        store.getters, // getters
        store.state // root state
      )
    }
  })
}

function enableStrictMode (store) {
  store._vm.$watch('state', () => {
    assert(store._committing, `Do not mutate vuex store state outside mutation handlers.`)
  }, { deep: true, sync: true })
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  Store,
  install,
  mapState,
  mapMutations,
  mapGetters,
  mapActions
}

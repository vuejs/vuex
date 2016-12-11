# Modules

Due to using a single state tree, all state of our application is contained inside one big object. However, as our application grows in scale, the store can get really bloated.

To help with that, Vuex allows us to divide our store into **modules**. Each module can contain its own state, mutations, actions, getters, and even nested modules - it's fractal all the way down:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### Module Local State

Inside a module's mutations and getters, The first argument received will be **the module's local state**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state is the local module state
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Similarly, inside module actions, `context.state` will expose the local state, and root state will be exposed as `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Also, inside module getters, the root state will be exposed as their 3rd argument:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Namespacing

> This feature is not released yet! It will be out soon in vuex@2.1.0.

Note that actions, mutations and getters inside modules are still registered under the **global namespace** - this allows multiple modules to react to the same mutation/action type. You probably should namespace your Vuex module if you are writing a reusable one that will be used in unknown environments. To support namespacing for avoiding name clashing, Vuex provides `namespace` option. If you specify string value to `namespace` option, module assets types are prefixed by the given value:

``` js
export default {
  namespace: 'account/',

  // module assets
  state: { ... }, // module state will not be changed by prefix option
  getters: {
    isAdmin () { ... } // -> getters['account/isAdmin']
  },
  actions: {
    login () { ... } // -> dispatch('account/login')
  },
  mutations: {
    login () { ... } // -> commit('account/login')
  },

  // nested modules
  modules: {
    // inherit the namespace from parent module
    myPage: {
      state: { ... },
      getters: {
        profile () { ... } // -> getters['account/profile']
      }
    },

    // nest the namespace
    posts: {
      namespace: 'posts/',

      state: { ... },
      getters: {
        popular () { ... } // -> getters['account/posts/popular']
      }
    }
  }
}
```

Namespaced getters and actions will receive localized `getters`, `dispatch` and `commit`. In other words, you can use the module assets without writing prefix in the same module. If you want to use the global ones, `rootGetters` is passed to the 4th argument of getter functions and the property of the action context. In addition, `dispatch` and `commit` receives `root` option on their last argument.

``` js
export default {
  namespace: 'prefix/',

  getters: {
    // `getters` is localized to this module's getters
    // you can use rootGetters via 4th argument of getters
    someGetter (state, getters, rootState, rootGetters) {
      getters.someOtherGetter // -> 'prefix/someOtherGetter'
      rootGetters.someOtherGetter // -> 'someOtherGetter'
    },
    someOtherGetter: state => { ... }
  },

  actions: {
    // dispatch and commit are also localized for this module
    // they will accept `root` option for the root dispatch/commit
    someAction ({ dispatch, commit, getters, rootGetters }) {
      getters.someGetter // -> 'prefix/someGetter'
      rootGetters.someGetter // -> 'someGetter'

      dispatch('someOtherAction') // -> 'prefix/someOtherAction'
      dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

      commit('someMutation') // -> 'prefix/someMutation'
      commit('someMutation', null, { root: true }) // -> 'someMutation'
    },
    someOtherAction (ctx, payload) { ... }
  }
}
```

#### Caveat for Plugin Developers

You may care about unpredictable namespacing for your modules when you create a [plugin](plugins.md) that provides the modules and let users add them to a Vuex store. Your modules will be also namespaced if the plugin users add your modules under a namespaced module. To adapt this situation, you may need to receive a namespace value via your plugin option:

``` js
// get namespace value via plugin option
// and returns Vuex plugin function
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Dynamic Module Registration

You can register a module **after** the store has been created with the `store.registerModule` method:

``` js
store.registerModule('myModule', {
  // ...
})
```

The module's state will be exposed as `store.state.myModule`.

Dynamic module registration makes it possible for other Vue plugins to also leverage Vuex for state management by attaching a module to the application's store. For example, the [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) library integrates vue-router with vuex by managing the application's route state in a dynamically attached module.

You can also remove a dynamically registered module with `store.unregisterModule(moduleName)`. Note you cannot remove static modules (declared at store creation) with this method.

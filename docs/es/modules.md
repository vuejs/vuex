# Módulos

Debido al uso de un único árbol de estado, todo el estado de nuestra aplicación se encuentra dentro de un gran objeto. Sin embargo, a medida que nuestra aplicación crece, el almacén puede 'desbordarse'.

Para aliviar esta situación, Vuex permite la división de nuestro almacén en **módulos**. Cada módulo puede contener su propio estado, mutaciones, acciones, getters e incluso módulos anidados:

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

store.state.a // -> Estado del módulo A
store.state.b // -> Estado del módulo B
```

### Estado Local de un Módulo

En las mutaciones y getters de un módulo, el primer argumento recibido será el **estado local del módulo**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state es el estado local del módulo
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

De manera similar, en las acciones del módulo `context.state` expone el estado local y el estado root (estado del almacén raiz) estará expuesto en `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Asi mismo, en los getters de un módulo el estado root será recibido como el tercer argumento:

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

Por defecto, las acciones, mutaciones y getters de un módulo estarás registradas bajo el **namespace global**. Esto permite que múltiples módulos puedan reaccionas ante las mismas mutaciones/acciones.

Si quieres que tu módulo está mejor auto-contenido y sea más reutilizable, puedes marcarlo como namespaced con la propiedad `namespaced: true`. Cuando un módulo es registrado de esta manera, todos sus getters, acciones y mutaciones serán automáticamente registradas bajo un namespace basado en el path del módulo. Por ejemplo:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // assets del módulo
      state: { ... }, // el estado está anidado por defecto y no se verá afectado por el namespace
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // módulos anidados
      modules: {
        // hereda el namespace del padre
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // namespace anidado
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Los getters y acciones bajo un namespace reciben `getters`, `dispatch` y `commit` localizados. En otras palabras, puedes usar el asset sin necesidad de usar escribir el prefijo dentro del mismo módulo. Así, cambiar entre estado namespaced y no-namespaced no afecta al código.

#### Accessing Global Assets in Namespaced Modules

If you want to use global state and getters, `rootState` and `rootGetters` are passed as the 3rd and 4th arguments to getter functions, and also exposed as properties on the `context` object passed to action functions.

To dispatch actions or commit mutations in the global namespace, pass `{ root: true }` as the 3rd argument to `dispatch` and `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` is localized to this module's getters
      // you can use rootGetters via 4th argument of getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch and commit are also localized for this module
      // they will accept `root` option for the root dispatch/commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### Binding Helpers with Namespace

When binding a namespaced module to components with the `mapState`, `mapGetters`, `mapActions` and `mapMutations` helpers, it can get a bit verbose:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

In such cases, you can pass the module namespace string as the first argument to the helpers so that all bindings are done using that module as the context. The above can be simplified to:

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
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
// register a module `myModule`
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

The module's state will be exposed as `store.state.myModule` and `store.state.nested.myModule`.

Dynamic module registration makes it possible for other Vue plugins to also leverage Vuex for state management by attaching a module to the application's store. For example, the [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) library integrates vue-router with vuex by managing the application's route state in a dynamically attached module.

You can also remove a dynamically registered module with `store.unregisterModule(moduleName)`. Note you cannot remove static modules (declared at store creation) with this method.

# Módulos

Debido al uso de un único árbol de estado, todo el estado de nuestra aplicación se encuentra dentro de un gran objeto. Sin embargo, a medida que nuestra aplicación crece, el almacén puede _'desbordarse'_.

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

Así mismo, en los getters de un módulo el estado root será recibido como el tercer argumento:

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

Los getters y acciones bajo un namespace reciben `getters`, `dispatch` y `commit` localizados. En otras palabras, puedes usar el asset sin necesidad de escribir el prefijo dentro del mismo módulo. Así, cambiar entre estado namespaced y no-namespaced no afecta al código.

#### Acceso a Assets Globales desde un Módulo con Namespace

Si quieres usar estado y getters globales, `rootState` y `rootGetters` son pasados como tercer y cuarto argumentos a las funciones getter de un módulo. También son expuestos como propiedades en el objeto `context` que reciben las acciones.

Para ejecutar acciones ó commitear mutaciones en el namespace global, pasa `{ root: true }` como tercer argumento a `dispatch` y `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` se limita a los getters de este módulo
      // Puedes user rootGetters a través del 4º argumento de un getter
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch y commit también están limitados a este módulo.
      // Aceptan la opción `root` para ejectuar dispatch/commit root
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

#### Helpers de Mapeo con Namespaces

Cuando mapeamos un módulo con namespace en componentes mediante el uso de `mapState`, `mapGetters`, `mapActions` y `mapMutations`, puede resultar algo verboso:

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

En estos casos puedes pasar el namespace del módulo como primer argumento al helper. De este modo, todas los mapeos usarán ese módulo como contexto. El ejemplo anterior quedaría simplificado de la siguiente manera:

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

#### Advertencia para Desarrolladores de Plugins

Es posible que al crear un [plugin](plugins.md) que provee módulos quieras tener en cuenta lo imprevisible que puede ser el nombre de un namespace. Si un usuario añade tu módulo dentro de otro con un namespace, tu módulo será registrado bajo el mismo namespace que el padre. Para adaptar a estar situación tal vez necesites recibir el valor del namespace a través de la opción plugin:

``` js
// Obtener el valor del namespace a través de la opción plugin
// y devolver la función plugin Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // Añadir namespace donde sea requerido dentro del módulo
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro Dinámico de Módulos

Puedes registrar un módulo **después** de haber creado el almacén por medio del método `store.registerModule`:

``` js
// Registrar un módulo `myModule`
store.registerModule('myModule', {
  // ...
})

// Registrar un módulo anidado `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

El estado del módulo será expuesto como `store.state.myModule` y `store.state.nested.myModule`.

El registro dinámico de Vuex permite que otros plugins de Vue puedan hacer uso de Vuex en la gestión de estado al adherir un módulo al almacén de la aplicación. Por ejemplo, la librería [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra vue-router con vuex, gestionando el estado de ruta de la aplicación con un módulo creado dinámicamente.

También puedes eliminar dinámicamente modulos registrados con `store.unregisterModule(moduleName)`. Esto no es posible con módulos estáticos (declarados en la creación del almaceń).

# Módulos

Debido al uso de un árbol único de estado, todo el estado de nuestra aplicación se encuentra dentro de un único gran objeto. Sin embargo, a medida que nuestra aplicación crezca, el _store_ puede volverse enorme.

Para ayudar con eso, Vuex nos permite dividir nuestro _store_ en **módulos**. Cada módulo puede contener su propio estado, mutaciones, acciones, _getters_ e, incluso, módulos anidados:

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

### Estado local del módulo

Dentro de las mutaciones y _getters_ del módulo, el primer argumento recibido será **es estado local del mismo**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state es el estado local
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

De la misma forma, dentro de acciones del módulo, `context.state` expondrá el estado local y el estado principal será expuesto como `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if (state.count + rootState.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

También, dentro de los _getters_ del módulo, el estado principal será expuesto como tercer parámetro:

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

### Utilizando espacio de nombres

Por defecto las acciones, mutaciones y _getters_ dentro de los módulos se registran bajo el **nombre de espacios global** - esto permite que múltiples módulos reacciones ante el mismo tipo de mutación/acción.

Si deseas que tus módulos estén más encapsulados o sean reutilizables, puedes utilizar la propiedad `namespaced: true`. Cuando se registre el módulo, todos sus _getters_, acciones y mutaciones tendrán asignados como espacio de nombres la ruta con la que está registrado el módulo. Por ejemplo:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // recursos del módulo
      state: { ... }, // el estado del módulo ya se encuentra anidado y no es afectado por la propiedad namespace
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
        // hereda el espacio de nombres del módulo padre
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // más anidación del espacio de nombres
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

Los _getters_ y acciones bajo un nombre de espacios recibirán `getters`, `dispatch` y `commit` localizados. En otras palabras, puedes utilizar los recursos de un módulo sin necesidad de escribir el prefijo. Utilizar o no el espacio de nombres no afecta el código dentro del módulo.

#### Accediendo a recursos globales dentro de módulos bajo un nombre de espacio

Si quieres utilizar _getters_ y estado globales, `rootState` y `rootGetters` son pasados como tercer y cuarto parámetros de las funciones _getters_ y son expuestas como propiedades del objeto `context` pasado a funciones de acciones.

Para enviar acciones o emitir mutaciones en el nombre de espacio global, pasa `{ root: true }` como tercer parámetro a `dispatch` y `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` apunta a los _getters_ de este módulo
      // puedes usar rootGetters a través del 4to parámetros de los _getters_
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch y commit también apuntan a los recursos de este módulo
      // aceptan la opción `root` para acceder a dispatch/commit globales
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

#### Enlazando funciones auxiliares con nombres de espacio

Cuando se enlaza un módulo bajo un nombre de espacio a un componente con las funciones auxiliares `mapState`, `mapGetters`, `mapActions` y `mapMutations`, puede volverse un tanto redundante:

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

En estos casos, puedes pasar el espacio de nombres del módulo como primer argumento a las funciones auxiliares para que todos los enlaces sean realizados utilizando ese módulo como contexto. Lo anterior puede simplificarse como:

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

#### Advertencias a los desarrolladores de complementos

Puede preocuparte un espacio de nombres impredecible cuando creas un [complemento](plugins.md) que provee funcionalidad a los módulos y permitir a los usuarios agregalos al _store_ de Vuex. Tus módulos estarán también bajo el espacio de nombres si los usuarios del complemento agregan tus módulos dentro de otro que este bajo un espacio de nombres. Para solucionar esto, puedes recibir un valor para el espacio de nombres a través de las opciones de tu complemento:

``` js
// obtiene el valor del espacio de nombres a través de las opciones del complemento:
// y devuelve una función de complemento de Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // agrega el espacio de nombres a los tipos del módulo del complemento
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro dinámico de módulos

Puedes registrar un módulo con el método `store.registerModule` **después** que el _store_ haya sido creado:

``` js
store.registerModule('myModule', {
  // ...
})
```

El estado del módulo será expuesto como `store.state.myModule`.

El registro dinámico de módulos hace posible que otros complementos de Vue confien en Vuex para el manejo de estado, agregando un módulo al _store_ de la aplicación. Por ejemplo, la biblioteca [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra vue-router con vuex manejando el estado de las rutas de la aplicación en un módulo agregado dinámicamente.

También puedes remover un módulo registrado dinámicamente con `store.unregisterModule(moduleName)`. Ten en cuenta que con este método no puedes remover módulos estáticos (declarados cuando se crea el _store_).

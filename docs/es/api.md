# Referencia de la API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Constructor Options

- **state**

  - tipo: `Object`

    El objeto de estado principal del _store_ de Vuex.

    [Detalles](state.md)

- **mutations**

  - tipo: `{ [type: string]: Function }`

    Registra mutaciones en el _store_. La función controladora siempre recibe `state` como primer parámetro (será el estado local de un módulo si se define dentro de este), y como segundo parámetro `payload` si es que existe.

    [Detalles](mutations.md)

- **actions**

  - tipo: `{ [type: string]: Function }`

    Registra acciones en el _store. La función controladora recibe un objeto `context` que expone las siguientes propiedades:

    ``` js
    {
      state,     // lo mismo que store.state, o el estado local si se encuentra dentro de un módulo
      rootState, // lo mismo que store.state, solo en módulos
      commit,    // lo mismo que store.commit
      dispatch,  // lo mismo que store.dispatch
      getters    // lo mismo que store.getters
    }
    ```

    [Detalles](actions.md)

- **getters**

  - tipo: `{ [key: string]: Function }`

    Registra _getters_ en el _store. La función _getter_ recibe los siguientes parámetros:

    ```
    state,     // será el estado local del módulo si se encuentra dentro de uno
    getters,   // lo mismo que store.getters
    rootState  // lo mismo que store.state
    ```
    Los _getters_ registrados son expuestos como `store.getters`.

    [Detalles](getters.md)

- **modules**

  - tipo: `Object`

    Un objeto que contiene los sub módulos a ser fusionados dentro del _store_, de la forma:

    ``` js
    {
      key: {
        state,
        namespaced?,
        mutations?,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    Cada módulo puede contener `state` y `mutations` similares a las opciones globales. El estado de un módulo será agregado al estado del _store_ global usando la llave del módulo. Las mutaciones y _getters_ del módulo reciben el estado local del mismo como primer parámetro en lugar del estado global, y el `context.state` de las acciones del módulo también apuntaran al estado local.

    [Detalles](modules.md)

- **plugins**

  - tipo: `Array<Function>`

    Un arreglo de funciones complemento para ser aplicadas al _store_. El complemento solo recibe el _store_ como argumento y puede tanto escuchar mutaciones (para persistencia de datos saliente, registro o depuración) como emitir mutaciones (para datos entrantes, por ejemplo, websockets u observables).
    
    [Detalles](plugins.md)

- **strict**

  - tipo: `Boolean`
  - valor por defecto: `false`

    Fuerza al _store_ de Vuex a funcionar en modo estricto. Es este modo, cualquier modificación al estado de Vuex fuera de una mutación lanzará un error.

    [Detalles](strict.md)

### Propiedades de instancia de Vuex.Store

- **state**

  - tipo: `Object`

    El estado raiz. Solo lectura.

- **getters**

  - tipo: `Object`

    Expone _getters_ registrados. Solo lectura.

### Métodos de instancia de Vuex.Store

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  Emite una mutación. [Detalles](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  Envia una acción. Devuelve una _Promise_ que resuelve todas las funciones controladoras de acciones disparadas. [Detalles](actions.md)

- **`replaceState(state: Object)`**

  Reemplaza el estado global del _store_. Use this only for state hydration / time-travel purposes.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Observa reactivamente el valor de retorno de una función _getter_ y ejecuta la _callback_ cuando el valor cambia. El _getter_ recibe el estado del _store_ como único parámetro. Acepta opcionalmente un objeto de opciones similar al del método `vm.$watch` de Vue.

  Para dejar de observar, ejecuta la función controladora devuelta.

- **`subscribe(handler: Function)`**

  Suscribe a mutaciones del _store_. `handler` es ejecutada luego de cada mutación y recibe al descriptor de la mutación y al estado luego de la mutación como parámetros:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Usado mayormente en complementos. [Detalles](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Registra un módulo dinámico. [Detalles](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Quita del registro un módulo dinámico. [Detalles](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Intercambia en caliente nuevas acciones y mutaciones. [Detalles](hot-reload.md)

### Funciones auxiliares de enlace de componentes

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Crea opciones de componentes computadas que devuelven el sub-árbol del _store_ de Vuex. [Detalles](state.md#the-mapstate-helper)

  El primer parámetro puede opcionalmente ser una cadena de texto con un espacio de nombres. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Crea opciones de componentes computadas que devuelven el valor evaluado de un _getter_. [Detalles](getters.md#the-mapgetters-helper)

  El primer parámetro puede opcionalmente ser una cadena de texto con un espacio de nombres. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Crea métodos de componentes que envian una accion. [Detalles](actions.md#dispatching-actions-in-components)

  El primer parámetro puede opcionalmente ser una cadena de texto con un espacio de nombres. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Crea métodos de componente que emiten una mutación. [Detalles](mutations.md#commiting-mutations-in-components)

  El primer parámetro puede opcionalmente ser una cadena de texto con un espacio de nombres. [Detalles](modules.md#binding-helpers-with-namespace)

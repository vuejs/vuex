# Documentación de la API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store - Opciones del Constructor

- **state**

  - tipo: `Object`

  El objeto estado del almacén Vuex.

    [Detalles](state.md)

- **mutations**

  - tipo: `{ [type: string]: Function }`

    Registra mutaciones en el almacén. La función hanlder siempre recibe el `state` como primer argumento (será el estado local en un módulo) y el `payload` como segundo parámetro, si este existe.

    [Detalles](mutations.md)

- **actions**

  - tipo: `{ [type: string]: Function }`

    Registra acciones en el almacén. La función handler recibe un Objeto `context` que expone las siguientes propiedades:

    ``` js
    {
      state,     // igual a store.state, ó estado local en módulos
      rootState, // igual a store.state, solo en módulos
      commit,    // igual a store.commit
      dispatch,  // igual a store.dispatch
      getters    // igual a store.getters
    }
    ```

    [Detalles](actions.md)

- **getters**

  - tipo: `{ [key: string]: Function }`

    Registra getters en el almacén. La función getter recibe los siguientes argumentos:

    ```
    state,     // será el estado local de un módulo si se usa dentro de uno
    getters,   // igual a store.getters
    rootState  // igual a store.state
    ```
    Los getters registrados serán expuestos en `store.getters`.

    [Detalles](getters.md)

- **modules**

  - tipo: `Object`

    Un objeto que contiene submódulos a mergear en el almacén, con la siguiente estructura:

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

    Cada módulo contiene `state` y `mutations` de forma similar a las opciones en la instancia root. El estado de un módulo estará vinculado al estado del almaceń root usando la clave del módulo. Las mutaciones y getters de un módulo solo recibirán el estado local del módulo como primer argumento. Las acciones recibirán el estado local en `context.state`.

    [Detalles](modules.md)

- **plugins**

  - tipo: `Array<Function>`

    Un array de funciones plugin a aplicar al almacén. El plugin recibe el almacén como único argmuento y puede escuchar a mutaciones (para persistir datos, logs o depuración) o ejecutar mutaciones (entrada de datos).

    [Detalles](plugins.md)

- **strict**

  - tipo: `Boolean`
  - default: `false`

    Forzar al almacén Vuex a trabajar en modo strict. En modo strict cualquier mutación del estado Vuex fuera de un handler de mutación registrado lanzará un Error.

    [Detalles](strict.md)

### Vuex.Store - Propiedades de Instancia

- **state**

  - tipo: `Object`

    El estado root. Solo lectura.

- **getters**

  - tipo: `Object`

    Expone los getters registrados. Solo lectura.

### Vuex.Store - Métodos de Instancia

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  Commitear una mutación. [Detalles](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  Ejecutar una acción. Devuelve una Promesa que resuelve todos los handlers ejecutados. [Detalles](actions.md)

- **`replaceState(state: Object)`**

  Reemplaza el estado del almacén root. Usar solo para hidratar el estado / 'regreso en el tiempo'.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Observar de manera reactiva el valor retornado por un getter y ejecutar una callback cuando el valor cambie. El getter recibe el estado del almacén como único argumento. Acepta un Objeto de valores opcionales que utiliza los mismos values que el método `vm.$watch` de Vue.

  Para dejar de observar, ejecutar la función retornada.

- **`subscribe(handler: Function)`**

  Subscribirse a mutaciones del almacén. El `handler` es ejecutado después de cada mutación y recibe la descripción de la mutación y un estado por mutación como argumentos:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Comunmente utilizado en plugins. [Detalles](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Registrar un módulo dinámicamente. [Detalles](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Desregistrar un módulo dinámicamente. [Detalles](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Cambiar acciones y mutaciones en caliente. [Detalles](hot-reload.md)

### Helpers de Bindeo en Componentes

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Crear opciones computadas en un componente que devuelven un sub-árbol del almacén Vuex. [Detalles](state.md#the-mapstate-helper)

  El primer argumento puede ser opcionalmente el nombre string de un namespace. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Crear opciones computadas en un componete que devuelven el valor evaluado de un getter. [Detalles](getters.md#the-mapgetters-helper)

  El primer argumento puede ser opcionalmente el nombre string de un namespace. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Crear opciones computadas en un componete que ejecutan una acción. [Detalles](actions.md#dispatching-actions-in-components)

  El primer argumento puede ser opcionalmente el nombre string de un namespace. [Detalles](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Crear opciones computadas en un componete que commitean una mutación. [Detalles](mutations.md#commiting-mutations-in-components)

  El primer argumento puede ser opcionalmente el nombre string de un namespace. [Detalles](modules.md#binding-helpers-with-namespace)

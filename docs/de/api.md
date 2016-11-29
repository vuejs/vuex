# API-Referenz

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Optionen des Konstruktors von Vuex.Store

- **State**

  - Typ: `Object`

    Das Root-State-Objekt für den Vuex-Store.

    [Details](state.md)

- **Mutations**

  - Typ: `{ [type: string]: Function }`

    Registriere Mutations im Store. die Handler-Funktion erhält immer `state` als erstes Argument (wäre lokaler Modul-State, wenn definiert in einem Modul) und erhält ein zweites `payload`-Argument, sofern vorhanden.

    [Details](mutations.md)

- **Actions**

  - Typ: `{ [type: string]: Function }`

    Registriere Actions im Store. Die Handler-Funktion erhält ein `context`-Objekt, welche folgende Eigenschaften freilegt:

    ``` js
    {
      state,     // gleich store.state oder lokalen State in Modulen
      rootState, // gleich store.state, nur in Modulen
      commit,    // gleich store.commit
      dispatch,  // gleich store.dispatch
      getters    // gleich store.getters
    }
    ```

    [Details](actions.md)

- **Getters**

  - Typ: `{ [key: string]: Function }`

    Registriere Getters im Store. Die Getter-Funktion erhält folgende Argumente:

    ``` js
    state,     // wäre lokaler Modul-State, wenn definiert in einem Modul
    getters,   // gleich store.getters
    rootState  // gleich store.state
    ```
    Registrierte Getters sind erreichbar in `store.getters`.

    [Details](getters.md)

- **Modules**

  - Typ: `Object`

    Ein Objekt, welches Sub-Module enthält, die mit dem Store zusammengefügt werden:

    ``` js
    {
      key: {
        state,
        mutations,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    Jedes Modul kann `state` und `mutations` ähnlich den Root-Optionen enthalten. Ein State des Moduls wird an den Root-State des Stores mithilfe des Modulschlüssels angehängt. Mutations und Getters eines Moduls erhalten lediglich den lokalen State als erstes Argument anstelle des Root-States. Zudem ist `context.state` der Modul-Actions ausgerichtet nach dem lokalen State.

    [Details](modules.md)

- **Plugins**

  - Typ: `Array<Function>`

    Ein Array von Plugin-Funktionen, welche auf den Store angewandt werden. Das Plugin erhält den Store als einziges Argument und hört entweder auf Mutations (für ausgehende Datenpersistenz, Logging oder Debugging) oder versendet Mutations (für eingehende Daten, zB. Websockets oder beobachtbare Daten)

    [Details](plugins.md)

- **strict**

  - Typ: `Boolean`
  - Default: `false`

    Force the Vuex store into strict mode. In strict mode any mutations to Vuex state outside of mutation handlers will throw an Error.

    [Details](strict.md)

### Vuex.Store Instance Properties

- **state**

  - Typ: `Object`

    The root state. Read only.

- **getters**

  - Typ: `Object`

    Exposes registered getters. Read only.

### Vuex.Store Instance Methods

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  Commit a mutation. [Details](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  Dispatch an action. Returns a Promise that resolves all triggered action handlers. [Details](actions.md)

- **`replaceState(state: Object)`**

  Replace the store's root state. Use this only for state hydration / time-travel purposes.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Reactively watch a getter function's return value, and call the callback when the value changes. The getter receives the store's state as the only argument. Accepts an optional options object that takes the same options as Vue's `vm.$watch` method.

  To stop watching, call the returned handle function.

- **`subscribe(handler: Function)`**

  Subscribe to store mutations. The `handler` is called after every mutation and receives the mutation descriptor and post-mutation state as arguments:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Most commonly used in plugins. [Details](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Register a dynamic module. [Details](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Unregister a dynamic module. [Details](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Hot swap new actions and mutations. [Details](hot-reload.md)

### Component Binding Helpers

- **`mapState(map: Array<string> | Object): Object`**

  Create component computed options that return the sub tree of the Vuex store. [Details](state.md#the-mapstate-helper)

- **`mapGetters(map: Array<string> | Object): Object`**

  Create component computed options that return the evaluated value of a getter. [Details](getters.md#the-mapgetters-helper)

- **`mapActions(map: Array<string> | Object): Object`**

  Create component methods options that dispatch an action. [Details](actions.md#dispatching-actions-in-components)

- **`mapMutations(map: Array<string> | Object): Object`**

  Create component methods options that commit a mutation. [Details](mutations.md#commiting-mutations-in-components)

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

    Registriere Mutations im Store. Die Handler-Funktion erhält immer `state` als erstes Argument (wäre lokaler Modul-State, wenn definiert in einem Modul) und erhält ein zweites `payload`-Argument, sofern vorhanden.

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

- **Strict**

  - Typ: `Boolean`
  - Default: `false`

    Zwinge den Vuex-Store in den Strict-Mode. Im Strict-Mode gibt jede Mutation des Vuex-States außerhalb des Mutation-Handlers einen Fehler aus.

    [Details](strict.md)

### Instanzeigenschaften von Vuex.Store

- **State**

  - Typ: `Object`

    Der Root-State. Schreibgeschützt.

- **Getters**

  - Typ: `Object`

    Stellt registrierte Getter frei. Schreibgeschützt.

### Instanzmethoden von Vuex.Store

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  Committe eine Mutation. [Details](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  Versende eine Action. Gibt einen Promise wieder, welche alle ausgelösten Action-Handler auflöst. [Details](actions.md)

- **`replaceState(state: Object)`**

  Tausche den Root-State des Stores aus. Nutze dies nur für State-Hydration/Zeitreise.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Observiere reaktionsfähig den wiedergegebenen Wert einer Getter-Funktion und rufe den Callback, wenn der Wert geändert wird. Der Getter erhält den State des Stores als einziges Argument. Akzeptiert ein optionales Objekt der Optionen mit den gleichen Optionen wie in Vues `vm.$watch`-Methode.

  Um die Observierung zu stoppen, rufe die Handle-Funktion auf.

- **`subscribe(handler: Function)`**

  Abonniere Store-Mutations. Der `handler` wird nach jeder Mutation aufgerufen und erhält den Mutation-Descriptor und Post-Mutation:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Meist genutzt in Plugins. [Details](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Registriere ein dynamisches Modul. [Details](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Deregistriere ein dynamisches Modul. [Details](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Tausche neue Actions und Mutations heiß aus (hot swap). [Details](hot-reload.md)


### Bindungshelfer von Komponenten

- **`mapState(map: Array<string> | Object): Object`**

  Erstelle berechnete Optionen für Komponenten, die den Sub-Tree des Vuex-Stores wiedergeben. [Details](state.md#the-mapstate-helper)

- **`mapGetters(map: Array<string> | Object): Object`**

  Erstelle berechnete Optionen für Komponenten, die den ausgewerteten Wert eines Getters wiedergeben. [Details](getters.md#the-mapgetters-helper)


- **`mapActions(map: Array<string> | Object): Object`**

  Erstelle berechnete Optionen für Komponenten, die eine Action versenden. [Details](actions.md#dispatching-actions-in-components)

- **`mapMutations(map: Array<string> | Object): Object`**

  Erstelle berechnete Optionen für Komponenten, die eine Mutation committen. [Details](mutations.md#commiting-mutations-in-components)

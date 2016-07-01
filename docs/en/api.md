# API Reference

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Constructor Options

- **state**

  - type: `Object`

    The root state object for the Vuex store.

    [Details](state.md)

- **mutations**

  - type: `Object`

    An object where each entry's key is the mutation name and the value is a mutation handler function. The handler function always receives `state` as the first argument, and receives all arguments passed to the dispatch call following that.

    [Details](mutations.md)

- **modules**

  - type: `Object`

    An object containing sub modules to be merged into the store, in the shape of:

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    Each module can contain `state` and `mutations` similar to the root options. A module's state will be attached to the store's root state using the module's key. A module's mutations will only receives the module's own state as the first argument instead of the root state.

- **plugins**

  - type: `Array<Function>`

    An array of plugin functions to be applied to the store. The plugin simply receives the store as the only argument and can either listen to mutations (for outbound data persistence, logging, or debugging) or dispatch mutations (for inbound data e.g. websockets or observables).

    [Details](plugins.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    Force the Vuex store into strict mode. In strict mode any mutations to Vuex state outside of mutation handlers will throw an Error.

    [Details](strict.md)

### Vuex.Store Instance Properties

- **state**

  - type: `Object`

    The root state. Read only.

### Vuex.Store Instance Methods

- **dispatch(mutationName: String, ...args) | dispatch(mutation: Object)**

  Directly dispatch a mutation. This is useful in certain situations are in general you should prefer using actions in application code.

  *Object-Style Dispatch*

  > requires >=0.6.2

  You can also dispatch mutations using objects:

  ``` js
  store.dispatch({
    type: 'INCREMENT',
    payload: 10
  })
  ```

- **replaceState(state: Object)**

  Replace the store's root state. Use this only for state restoration / time-travel purposes.

- **watch(getter: Function, cb: Function, [options: Object])**

  Reactively watch a getter function's return value, and call the callback when the value changes. The getter receives the store's state as the only argument. Accepts an optional options object that takes the same options as Vue's `vm.$watch` method.

  To stop watching, call the returned handle function.

- **hotUpdate(newOptions: Object)**

  Hot swap new actions and mutations. [Details](hot-reload.md)

- **on(event: String, cb: Function)**

- **once(event: String, cb: Function)**

- **off([event: String, cb: Function])**

- **emit(event: String, ...args)**

  Same event interface as found on a Vue instance. The only event the store emits is `mutation` (see [Plugins](plugins.md)).

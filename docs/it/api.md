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

- **middlewares**

  - type: `Array<Object>`

    An array of middleware objects that are in the shape of:

    ``` js
    {
      snapshot: Boolean, // default: false
      onInit: Function,
      onMutation: Function
    }
    ```

    All fields are optional. [Details](middlewares.md)

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

- **dispatch(mutationName: String, ...args)**

  Directly dispatch a mutation. This is useful in certain situations are in general you should prefer using actions in application code.

- **watch(pathOrGetter: String|Function, cb: Function, [options: Object])**

  Watch a path or a getter function's value, and call the callback when the value changes. Accepts an optional options object that takes the same options as Vue's `vm.$watch` method.

  To stop watching, call the returned handle function.

- **hotUpdate(newOptions: Object)**

  Hot swap new actions and mutations. [Details](hot-reload.md)

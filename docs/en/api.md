# API Reference

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Constructor Options

- **state**

  - type: `Object | Function`

    The root state object for the Vuex store. [Details](state.md)

    If you pass a function that returns an object, the returned object is used as the root state. This is useful when you want to reuse the state object especially for module reuse. [Details](modules.md#module-reuse)

- **mutations**

  - type: `{ [type: string]: Function }`

    Register mutations on the store. The handler function always receives `state` as the first argument (will be module local state if defined in a module), and receives a second `payload` argument if there is one.

    [Details](mutations.md)

- **actions**

  - type: `{ [type: string]: Function }`

    Register actions on the store. The handler function receives a `context` object that exposes the following properties:

    ``` js
    {
      state,      // same as `store.state`, or local state if in modules
      rootState,  // same as `store.state`, only in modules
      commit,     // same as `store.commit`
      dispatch,   // same as `store.dispatch`
      getters,    // same as `store.getters`, or local getters if in modules
      rootGetters // same as `store.getters`, only in modules
    }
    ```

    [Details](actions.md)

- **getters**

  - type: `{ [key: string]: Function }`

    Register getters on the store. The getter function receives the following arguments:

    ```
    state,     // will be module local state if defined in a module.
    getters    // same as store.getters
    ```

    Specific when defined in a module

    ```
    state,       // will be module local state if defined in a module.
    getters,     // module local getters of the current module
    rootState,   // global state
    rootGetters  // all getters
    ```

    Registered getters are exposed on `store.getters`.

    [Details](getters.md)

- **modules**

  - type: `Object`

    An object containing sub modules to be merged into the store, in the shape of:

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

    Each module can contain `state` and `mutations` similar to the root options. A module's state will be attached to the store's root state using the module's key. A module's mutations and getters will only receives the module's local state as the first argument instead of the root state, and module actions' `context.state` will also point to the local state.

    [Details](modules.md)

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

- **getters**

  - type: `Object`

    Exposes registered getters. Read only.

### Vuex.Store Instance Methods

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  Commit a mutation. `options` can have `root: true` that allows to commit root mutations in [namespaced modules](modules.md#namespacing). [Details](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  Dispatch an action. `options` can have `root: true` that allows to dispatch root actions in [namespaced modules](modules.md#namespacing). Returns a Promise that resolves all triggered action handlers. [Details](actions.md)

- **`replaceState(state: Object)`**

  Replace the store's root state. Use this only for state hydration / time-travel purposes.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Reactively watch a getter function's return value, and call the callback when the value changes. The getter receives the store's state as the first argument, and getters as the second argument. Accepts an optional options object that takes the same options as Vue's `vm.$watch` method.

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

- **`subscribeAction(handler: Function)`**

  > New in 2.5.0

  Subscribe to store actions. The `handler` is called for every dispatched action and receives the action descriptor and current store state as arguments:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Most commonly used in plugins. [Details](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  Register a dynamic module. [Details](modules.md#dynamic-module-registration)

  `options` can have `preserveState: true` that allows to preserve the previous state. Useful with Server Side Rendering.

- **`unregisterModule(path: string | Array<string>)`**

  Unregister a dynamic module. [Details](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Hot swap new actions and mutations. [Details](hot-reload.md)

### Component Binding Helpers

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Create component computed options that return the sub tree of the Vuex store. [Details](state.md#the-mapstate-helper)

  The first argument can optionally be a namespace string. [Details](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Create component computed options that return the evaluated value of a getter. [Details](getters.md#the-mapgetters-helper)

  The first argument can optionally be a namespace string. [Details](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Create component methods options that dispatch an action. [Details](actions.md#dispatching-actions-in-components)

  The first argument can optionally be a namespace string. [Details](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Create component methods options that commit a mutation. [Details](mutations.md#committing-mutations-in-components)

  The first argument can optionally be a namespace string. [Details](modules.md#binding-helpers-with-namespace)

- **`createNamespacedHelpers(namespace?: string): Object`**

  Create namespaced component binding helpers. The returned object contains `mapState`, `mapGetters`, `mapActions` and `mapMutations` that are bound with the given namespace. [Details](modules.md#binding-helpers-with-namespace)

  If the namespace is not specified, it returns the root mapXXX helpers. This behavior is convenient to annotate strict types for mapXXX helpers.

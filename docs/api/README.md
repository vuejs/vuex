---
sidebar: auto
---

# API Reference

## Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

## Vuex.Store Constructor Options

### state

- type: `Object | Function`

  The root state object for the Vuex store. [Details](../guide/state.md)

  If you pass a function that returns an object, the returned object is used as the root state. This is useful when you want to reuse the state object especially for module reuse. [Details](../guide/modules.md#module-reuse)

### mutations

- type: `{ [type: string]: Function }`

  Register mutations on the store. The handler function always receives `state` as the first argument (will be module local state if defined in a module), and receives a second `payload` argument if there is one.

  [Details](../guide/mutations.md)

### actions

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

  And also receives a second `payload` argument if there is one.

  [Details](../guide/actions.md)

### getters

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

  [Details](../guide/getters.md)

### modules

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

  [Details](../guide/modules.md)

### plugins

- type: `Array<Function>`

  An array of plugin functions to be applied to the store. The plugin simply receives the store as the only argument and can either listen to mutations (for outbound data persistence, logging, or debugging) or dispatch mutations (for inbound data e.g. websockets or observables).

  [Details](../guide/plugins.md)

### strict

- type: `Boolean`
- default: `false`

  Force the Vuex store into strict mode. In strict mode any mutations to Vuex state outside of mutation handlers will throw an Error.

  [Details](../guide/strict.md)

### devtools

- type: `Boolean`

  Turn the devtools on or off for a particular vuex instance.  For instance passing false tells the Vuex store to not subscribe to devtools plugin.  Useful for if you have multiple stores on a single page. 

  ``` js
  {
    devtools: false
  }
  ```


## Vuex.Store Instance Properties

### state

- type: `Object`

  The root state. Read only.

### getters

- type: `Object`

  Exposes registered getters. Read only.

## Vuex.Store Instance Methods

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Commit a mutation. `options` can have `root: true` that allows to commit root mutations in [namespaced modules](../guide/modules.md#namespacing). [Details](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object)`
-  `dispatch(action: Object, options?: Object)`

  Dispatch an action. `options` can have `root: true` that allows to dispatch root actions in [namespaced modules](../guide/modules.md#namespacing). Returns a Promise that resolves all triggered action handlers. [Details](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Replace the store's root state. Use this only for state hydration / time-travel purposes.

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Reactively watch `fn`'s return value, and call the callback when the value changes. `fn` receives the store's state as the first argument, and getters as the second argument. Accepts an optional options object that takes the same options as [Vue's `vm.$watch` method](https://vuejs.org/v2/api/#watch).

  To stop watching, call the returned unwatch function.

### subscribe

-  `subscribe(handler: Function): Function`

  Subscribe to store mutations. The `handler` is called after every mutation and receives the mutation descriptor and post-mutation state as arguments:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  To stop subscribing, call the returned unsubscribe function.

  Most commonly used in plugins. [Details](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function): Function`

  > New in 2.5.0

  Subscribe to store actions. The `handler` is called for every dispatched action and receives the action descriptor and current store state as arguments:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  To stop subscribing, call the returned unsubscribe function.

  Most commonly used in plugins. [Details](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Register a dynamic module. [Details](../guide/modules.md#dynamic-module-registration)

  `options` can have `preserveState: true` that allows to preserve the previous state. Useful with Server Side Rendering.

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Unregister a dynamic module. [Details](../guide/modules.md#dynamic-module-registration)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Hot swap new actions and mutations. [Details](../guide/hot-reload.md)

## Component Binding Helpers

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Create component computed options that return the sub tree of the Vuex store. [Details](../guide/state.md#the-mapstate-helper)

  The first argument can optionally be a namespace string. [Details](../guide/modules.md#binding-helpers-with-namespace)

  The second object argument's members can be a function. `function(state: any)`

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  Create component computed options that return the evaluated value of a getter. [Details](../guide/getters.md#the-mapgetters-helper)

  The first argument can optionally be a namespace string. [Details](../guide/modules.md#binding-helpers-with-namespace)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Create component methods options that dispatch an action. [Details](../guide/actions.md#dispatching-actions-in-components)

  The first argument can optionally be a namespace string. [Details](../guide/modules.md#binding-helpers-with-namespace)

  The second object argument's members can be a function. `function(dispatch: function, ...args: any[])`

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Create component methods options that commit a mutation. [Details](../guide/mutations.md#committing-mutations-in-components)

  The first argument can optionally be a namespace string. [Details](../guide/modules.md#binding-helpers-with-namespace)

  The second object argument's members can be a function. `function(commit: function, ...args: any[])`

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Create namespaced component binding helpers. The returned object contains `mapState`, `mapGetters`, `mapActions` and `mapMutations` that are bound with the given namespace. [Details](../guide/modules.md#binding-helpers-with-namespace)

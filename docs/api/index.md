---
sidebar: auto
---

# API Reference

## Store

### createStore

- `createStore<S>(options: StoreOptions<S>): Store<S>`

  Creates a new store.

  ```js
  import { createStore } from 'vuex'

  const store = createStore({ ...options })
  ```

## Store Constructor Options

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

  ```js
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

  ```js
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

- type: `boolean`
- default: `false`

  Force the Vuex store into strict mode. In strict mode any mutations to Vuex state outside of mutation handlers will throw an Error.

  [Details](../guide/strict.md)

### devtools

- type: `boolean`

  Turn the devtools on or off for a particular Vuex instance. For instance, passing `false` tells the Vuex store to not subscribe to devtools plugin. Useful when you have multiple stores on a single page.

  ```js
  {
    devtools: false
  }
  ```

## Store Instance Properties

### state

- type: `Object`

  The root state. Read only.

### getters

- type: `Object`

  Exposes registered getters. Read only.

## Store Instance Methods

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Commit a mutation. `options` can have `root: true` that allows to commit root mutations in [namespaced modules](../guide/modules.md#namespacing). [Details](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object): Promise<any>`
-  `dispatch(action: Object, options?: Object): Promise<any>`

  Dispatch an action. `options` can have `root: true` that allows to dispatch root actions in [namespaced modules](../guide/modules.md#namespacing). Returns a Promise that resolves all triggered action handlers. [Details](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Replace the store's root state. Use this only for state hydration / time-travel purposes.

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Reactively watch `fn`'s return value, and call the callback when the value changes. `fn` receives the store's state as the first argument, and getters as the second argument. Accepts an optional options object that takes the same options as [Vue's `vm.$watch` method](https://vuejs.org/v2/api/#vm-watch).

  To stop watching, call the returned unwatch function.

### subscribe

-  `subscribe(handler: Function, options?: Object): Function`

  Subscribe to store mutations. The `handler` is called after every mutation and receives the mutation descriptor and post-mutation state as arguments.

  ```js
  const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  By default, new handler is added to the end of the chain, so it will be executed after other handlers that were added before. This can be overridden by adding `prepend: true` to `options`, which will add the handler to the beginning of the chain.

  ```js
  store.subscribe(handler, { prepend: true })
  ```

  The `subscribe` method will return an `unsubscribe` function, which should be called when the subscription is no longer needed. For example, you might subscribe to a Vuex Module and unsubscribe when you unregister the module. Or you might call `subscribe` from inside a Vue Component and then destroy the component later. In these cases, you should remember to unsubscribe the subscription manually.

  Most commonly used in plugins. [Details](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function, options?: Object): Function`

  Subscribe to store actions. The `handler` is called for every dispatched action and receives the action descriptor and current store state as arguments.
  The `subscribe` method will return an `unsubscribe` function, which should be called when the subscription is no longer needed. For example, when unregistering a Vuex module or before destroying a Vue component.

  ```js
  const unsubscribe = store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  By default, new handler is added to the end of the chain, so it will be executed after other handlers that were added before. This can be overridden by adding `prepend: true` to `options`, which will add the handler to the beginning of the chain.

  ```js
  store.subscribeAction(handler, { prepend: true })
  ```

  The `subscribeAction` method will return an `unsubscribe` function, which should be called when the subscription is no longer needed. For example, you might subscribe to a Vuex Module and unsubscribe when you unregister the module. Or you might call `subscribeAction` from inside a Vue Component and then destroy the component later. In these cases, you should remember to unsubscribe the subscription manually.

  `subscribeAction` can also specify whether the subscribe handler should be called *before* or *after* an action dispatch (the default behavior is *before*):

  ```js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`before action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`after action ${action.type}`)
    }
  })
  ```

  `subscribeAction` can also specify an `error` handler to catch an error thrown when an action is dispatched. The function will receive an `error` object as the third argument.

  ```js
  store.subscribeAction({
    error: (action, state, error) => {
      console.log(`error action ${action.type}`)
      console.error(error)
    }
  })
  ```

  The `subscribeAction` method is most commonly used in plugins. [Details](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Register a dynamic module. [Details](../guide/modules.md#dynamic-module-registration)

  `options` can have `preserveState: true` that allows to preserve the previous state. Useful with Server Side Rendering.

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Unregister a dynamic module. [Details](../guide/modules.md#dynamic-module-registration)

### hasModule

- `hasModule(path: string | Array<string>): boolean`

  Check if the module with the given name is already registered. [Details](../guide/modules.md#dynamic-module-registration)

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

## Composable Functions

### useStore

- `useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string): Store<S>;`

  Fetches the injected store when called inside the `setup` hook. When using the Composition API, you can retrieve the store by calling this method.

  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
    }
  }
  ```

  TypeScript users can use an injection key to retrieve a typed store. In order for this to work, you must define the injection key and pass it along with the store when installing the store instance to the Vue app.

  First, declare the injection key using Vue's `InjectionKey` interface.

  ```ts
  // store.ts
  import { InjectionKey } from 'vue'
  import { createStore, Store } from 'vuex'

  export interface State {
    count: number
  }

  export const key: InjectionKey<Store<State>> = Symbol()

  export const store = createStore<State>({
    state: {
      count: 0
    }
  })
  ```

  Then, pass the defined key as the second argument for the `app.use` method.

  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { store, key } from './store'

  const app = createApp({ ... })

  app.use(store, key)

  app.mount('#app')
  ```

  Finally, you can pass the key to the `useStore` method to retrieve the typed store instance.

  ```ts
  // in a vue component
  import { useStore } from 'vuex'
  import { key } from './store'

  export default {
    setup () {
      const store = useStore(key)

      store.state.count // typed as number
    }
  }
  ```

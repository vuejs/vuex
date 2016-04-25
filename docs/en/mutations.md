# Mutations

Vuex mutations are essentially events: each mutation has a **name** and a **handler**. The handler function will receive the state as the first argument:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // mutate state
      state.count++
    }
  }
})
```

Using all caps for mutation names is just a convention to make it easier to differentiate them from plain functions.

You cannot directly call a mutation handler. The options here is more like event registration: "When an `INCREMENT` event is dispatched, call this handler." To invoke a mutation handler, you need to dispatch a mutation event:

``` js
store.dispatch('INCREMENT')
```

### Dispatch with Arguments

It is also possible to pass along arguments:

``` js
// ...
mutations: {
  INCREMENT (state, n) {
    state.count += n
  }
}
```
``` js
store.dispatch('INCREMENT', 10)
```

Here `10` will be passed to the mutation handler as the second argument following `state`. Same for any additional arguments. These arguments are called the **payload** for the given mutation.

### Object-Style Dispatch

> requires >=0.6.2

You can also dispatch mutations using objects:

``` js
store.dispatch({
  type: 'INCREMENT',
  payload: 10
})
```

Note when using the object-style, you should include all arguments as properties on the dispatched object. The entire object will be passed as the second argument to mutation handlers:

``` js
mutations: {
  INCREMENT (state, mutation) {
    state.count += mutation.payload
  }
}
```

### Silent Dispatch

> requires >=0.6.3

In some scenarios you may not want the middlewares to record the state change. Multiple dispatches to the store in a short period or polled do not always need to be tracked. In these situations is may be considered appropriate to silent the mutations. 

*Note:* This should be avoided where necessary. Silent mutations break the contract of all state changes being tracked by the devtool. Use sparingly and where absolutely necessary.

Dispatching without hitting middlewares can be achieved with a `silent` flag.

``` js
/**
 * Example: Progress action.
 * Dispatches often for changes that are not necessary to be tracked
 **/
export function start(store, options = {}) {
  let timer = setInterval(() => {
    store.dispatch({
      type: INCREMENT,
      silent: true,
      payload: {
        amount: 1,
      },
    });
    if (store.state.progress === 100) {
      clearInterval(timer);
    }
  }, 10);
}
```

### Mutations Follow Vue's Reactivity Rules

Since a Vuex store's state is made reactive by Vue, when we mutate the state, Vue components observing the state will update automatically. This also means Vuex mutations are subject to the same reactivity caveats when working with plain Vue:

1. Prefer initializing your store's initial state with all desired fields upfront.

2. When adding new properties to an Object, you should either:

  - Use `Vue.set(obj, 'newProp', 123)`, or -

  - Replace that Object with a fresh one. For example, using the stage-2 [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) we can write it like this:

  ``` js
  state.obj = { ...state.obj, newProp: 123 }
  ```

### Using Constants for Mutation Names

It is also common to use constants for mutation names - they allow the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  actions: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Whether to use constants is largely a preference - it can be helpful in large projects with many developers, but it's totally optional if you don't like them.

### Mutations Must Be Synchronous

One important rule to remember is that **mutation handler functions must be synchronous**. Why? Consider the following example:

``` js
mutations: {
  SOME_MUTATION (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Now imagine we are debugging the app and looking at our mutation logs. For every mutation logged, we want to be able to compare snapshots of the state *before* and *after* the mutation. However, the asynchronous callback inside the example mutation above makes that impossible: the callback is not called yet when the mutation is dispatched, and we do not know when the callback will actually be called. Any state mutation performed in the callback is essentially un-trackable!

### On to Actions

Asynchronicity combined with state mutation can make your program very hard to reason about. For example, when you call two methods both with async callbacks that mutate the state, how do you know when they are called and which callback was called first? This is exactly why we want to separate the two concepts. In Vuex, we perform all state mutations in a synchronous manner. We will perform all asynchronous operations inside [Actions](actions.md).

# Mutations

The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string **type** and a **handler**. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```

You cannot directly call a mutation handler. The options here is more like event registration: "When a mutation with type `increment` is triggered, call this handler." To invoke a mutation handler, you need to call **store.commit** with its type:

``` js
store.commit('increment')
```

### Commit with Payload

You can pass an additional argument to `store.commit`, which is called the **payload** for the mutation:

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('INCREMENT', 10)
```

In most cases, the payload should be an object so that it can contain multiple fields, and the recorded mutation will also be more descriptive:

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### Object-Style Commit

An alternative way to commit a mutation is by directly using an object that has a `type` property:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

When using object-style commit, the entire object will be passed as the payload to mutation handlers, so the handler remains the same:

``` js
mutations: {
  INCREMENT (state, payload) {
    state.count += payload.amount
  }
}
```

### Silent Commit

> Note: This is a feature that will likely be deprecated once we implement mutation filtering in the devtools.

By default, every committed mutation is sent to plugins (e.g. the devtools). However in some scenarios you may not want the plugins to record every state change. Multiple commits to the store in a short period or polled do not always need to be tracked. In such cases you can pass a third argument to `store.commit` to "silence" that specific mutation from plugins:

``` js
store.commit('increment', {
  amount: 1
}, { silent: true })

// with object-style dispatch
store.commit({
  type: 'increment',
  amount: 1
}, { silent: true })
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

It is a commonly seen pattern to use constants for mutation types in various Flux implementations. This allow the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:

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
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Now imagine we are debugging the app and looking at the devtool's mutation logs. For every mutation logged, the devtool will need to capture a "before" and "after" snapshots of the state. However, the asynchronous callback inside the example mutation above makes that impossible: the callback is not called yet when the mutation is committed, and there's no way for the devtool to know when the callback will actually be called - any state mutation performed in the callback is essentially un-trackable!

### On to Actions

Asynchronicity combined with state mutation can make your program very hard to reason about. For example, when you call two methods both with async callbacks that mutate the state, how do you know when they are called and which callback was called first? This is exactly why we want to separate the two concepts. In Vuex, **mutations are synchronous transactions**:

``` js
store.commit('increment')
// any state change that the "increment" mutation may cause
// should be done at this moment.
```

To handle asynchronous operations, let's introduce [Actions](actions.md).

# Middlewares

Vuex instances accept the `middlewares` option that exposes hooks for each mutation (Note this is completely unrelated to Redux middlewares). A Vuex middleware is simply an object that implements some hook functions:

``` js
const myMiddleware = {
  onInit (state) {
    // record initial state
  },
  onMutation (mutation, state) {
    // called after every mutation.
    // The mutation comes in the format of { type, payload }
  }
}
```

And can be used like this:

``` js
const vuex = new Vuex({
  // ...
  middlewares: [myMiddleware]
})
```

By default, a middleware receives the actual `state` object. Since middlewares are primarily used for debugging purposes, they are **not allowed to mutate the state**.

Sometimes a middleware may want to receive "snapshots" of the state, and also compare the post-mutation state with pre-mutation state. Such middlewares must declare the `snapshot: true` option:

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState) {
    // nextState and prevState are deep-cloned snapshots
    // of the state before and after the mutation.
  }
}
```

**Middlewares that take state snapshots should be used only during development.** When using Webpack or Browserify, we can let our build tools handle that for us:

``` js
const vuex = new Vuex({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

The middleware will be used by default. For production, use the build setup described [here](http://vuejs.org/guide/application.html#Deploying_for_Production) to convert the value of `process.env.NODE_ENV !== 'production'` to `false` for the final build.

### Built-in Logger Middleware

Vuex comes with a logger middleware for common debugging usage:

``` js
const vuex = new Vuex({
  middlewares: [Vuex.createLogger()]
})
```

The `createLogger` function takes a few options:

``` js
const logger = Vuex.createLogger({
  collapsed: false, // auto-expand logged mutations
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of { type, payload }
    // we can format it anyway we want.
    return mutation.type
  }
})
```

Note the logger middleware takes state snapshots, so use it only during development.

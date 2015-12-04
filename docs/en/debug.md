# Debug Mode

To enable debug mode, simply pass in `debug: true` when creating the Vuex instance:

``` js
const vuex = new Vuex({
  state,
  actions,
  mutations,
  debug: true
})
```

In debug mode, two features are enabled:

1. Every mutation dispatched will be logged in the console, along with a snapshot of the state before that mutation, and a snapshot of the state after that mutation.

2. Whenever Vuex state is mutated outside of mutation handlers, an error will be thrown. This ensures that all state mutations can be explicitly tracked by debugging tools.

### Debug vs. Production

**Do not use debug mode in production!** Debug mode takes a snapshot of the entire state tree for each mutation, and runs a deep watch on the state tree for detecting inappropriate mutations - make sure to turn off debug mode in production to avoid the performance cost.

When using Webpack or Browserify, we can let our build tools handle that for us:

``` js
const vuex = new Vuex({
  // ...
  debug: process.env.NODE_ENV !== 'production'
})
```

In Webpack/Browserify, this will result in debug mode being on by default. Then, use the build setup described [here](http://vuejs.org/guide/application.html#Deploying_for_Production) to convert the value to `false` when building for production.

### Configuring the Logger

You can pass in the `debugOptions` option to configure the logger:

``` js
const vuex = new Vuex({
  // ...
  debug: true,
  debugOptions: {
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
  }
})
```

# Strict Mode

To enable strict mode, simply pass in `strict: true` when creating a Vuex store:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown. This ensures that all state mutations can be explicitly tracked by debugging tools.

### Development vs. Production

**Do not enable strict mode when deploying for production!** Strict mode runs a synchronous deep watcher on the state tree for detecting inappropriate mutations, and it can be quite expensive when you make large amount of mutations to the state. Make sure to turn it off in production to avoid the performance cost.

Similar to plugins, we can let the build tools handle that:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

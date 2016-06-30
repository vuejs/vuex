# Plugins

Vuex stores accept the `plugins` option that exposes hooks for each mutation. A Vuex plugin is simply a function that receives the store as the only argument:

``` js
const myPlugin = store => {
  // called when the store is initialized
  store.on('mutation', (mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of { type, payload } for normal
    // dispatches, and will be the original mutation object for object-style
    // dispatches.
  })
}
```

And can be used like this:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

Plugins are not allowed to directly mutate state - similar to your components, they can only trigger changes by dispatching mutations.

Sometimes a plugin may want to receive "snapshots" of the state, and also compare the post-mutation state with pre-mutation state. To achieve that, you will need to perform a deep-copy on the state object:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.on('mutation', (mutation, state) => {
    let nextState = _.cloneDeep(state)

    // compare prevState and nextState...

    // save state for next mutation
    prevState = nextState
  })
}
```

**Plugins that take state snapshots should be used only during development.** When using Webpack or Browserify, we can let our build tools handle that for us:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

The plugin will be used by default. For production, you will need [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) for Webpack or [envify](https://github.com/hughsk/envify) for Browserify to convert the value of `process.env.NODE_ENV !== 'production'` to `false` for the final build.

### Built-in Logger Plugin

Vuex comes with a logger plugin for common debugging usage:

``` js
import createLogger from 'vuex/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

The `createLogger` function takes a few options:

``` js
const logger = createLogger({
  collapsed: false, // auto-expand logged mutations
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of { type, payload }
    // we can format it any way we want.
    return mutation.type
  }
})
```

Note the logger plugin takes state snapshots, so use it only during development.

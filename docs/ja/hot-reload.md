# Hot Reloading

Vuex supports hot-reloading actions and mutations during development, using Webpack's [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html). You can also use it in Browserify with the [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

It's as simple as calling `store.hotUpdate()` with the new actions and mutations:

``` js
// ...
const store = new Vuex.Store({
  state,
  actions,
  mutations
})

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./actions', './mutations'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    // swap in the new actions and mutations
    store.hotUpdate({
      actions: newActions,
      mutations: newMutations
    })
  })
}
```

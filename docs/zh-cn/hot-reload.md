# 热重载

Vuex 支持在开发中热重载 actions 和 mutations（使用 Webpack 的 [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html)）。你也可以在 Browserify 里使用 [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

只需要简单地调用 `vuex.hotUpdate()`:

``` js
// ...
const vuex = new Vuex({
  state,
  actions,
  mutations
})

if (module.hot) {
  // 使 actions 和 mutations 成为热重载模块
  module.hot.accept(['./actions', './mutations'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    // swap in the new actions and mutations  
    vuex.hotUpdate({
      actions: newActions,
      mutations: newMutations
    })
  })
}
```

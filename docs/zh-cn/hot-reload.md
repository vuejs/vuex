# 热重载

Vuex 支持在开发中热重载 actions 和 mutations（使用 Webpack 的 [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html)）。你也可以在 Browserify 里使用 [browserify-hmr](https://github.com/AgentME/browserify-hmr/) 插件来实现同样的功能。

只需要简单地调用 `store.hotUpdate()`:

``` js
// ...
const store = new Vuex.Store({
  state,
  actions,
  mutations
})

if (module.hot) {
  // 使 actions 和 mutations 成为可热重载模块
  module.hot.accept(['./actions', './mutations'], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    // 加载新模块 
    store.hotUpdate({
      actions: newActions,
      mutations: newMutations
    })
  })
}
```

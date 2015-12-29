# ホットリローディング

Vuex は開発においてホットリローディングなアクションとミューテーションをサポートします。Webpack は [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) を使用します。Browserify においても [browserify-hmr](https://github.com/AgentME/browserify-hmr/) プラグインによって使用することができます。

新しいアクションとミューテーションによって `store.hotUpdate()` として呼び出すのと同じくらい簡単です:

``` js
// ...
const store = new Vuex.Store({
  state,
  actions,
  mutations
})

if (module.hot) {
  // ホットモジュールとしてアクションとモジュールを受け付ける
  module.hot.accept(['./actions', './mutations'], () => {
    // 更新されたモジュールをインポートする
    // babel 6 モジュール出力のため、ここでは .default を追加しなければならない
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    // 新しいアクションとミューテーションにスワップ
    store.hotUpdate({
      actions: newActions,
      mutations: newMutations
    })
  })
}
```

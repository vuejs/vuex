# ホットリローディング

Vuex は webpack の [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/) を使用することで、アプリケーションの開発を行っている間のミューテーション、モジュール、アクション、ゲッターのホットリローディングをサポートします。Browserify では [browserify-hmr](https://github.com/AgentME/browserify-hmr/) プラグインを使用することができます。

ミューテーションとモジュールのホットリローディングのために、`store.hotUpdate()`  API メソッドを利用する必要があります:

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // ホットモジュールとしてアクションとモジュールを受け付けます
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 更新されたモジュールをインポートする
    // babel 6 のモジュール出力のため、ここでは .default を追加しなければならない
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 新しいモジュールとミューテーションにスワップ
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

ホットリローディングを試したい場合は、[counter-hot example](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot)をチェックアウトしてください。

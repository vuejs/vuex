# ホットリローディング

Vuex はアプリケーションの開発を行っている間のミューテーション、モジュール、アクション、ゲッターのホットリローディングをサポートします。Webpack は [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) を使用します。Browserify においても [browserify-hmr](https://github.com/AgentME/browserify-hmr/) プラグインを使用することができます。

ミューテーションとモジュールに対して、API `store.hotUpdate()` メソッドを利用する必要があります:

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
    const newActions = require('./actions').default
    const newMutations = require('./mutations').default
    // 新しいアクションとミューテーションにスワップ
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

アクションとゲッターのために他に特別何かをする必要はあります。 Webpack のホットモジュールリプレースメントシステムは依存関係の変化を "伝播" します。そして、アクションとゲッターの変更は、 Vue コンポーネントに伝播され、それらにインポートされます。 `vue-loader` によってロードされたVue コンポーネントは、自動でホットリロード可能になるので、それらの影響を受けたコンポーネントは自身をホットリロードし、更新されたアクションとゲッターを利用します。

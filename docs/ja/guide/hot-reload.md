# ホットリローディング

Vuex は webpack の [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/) を使用することで、アプリケーションの開発を行っている間のミューテーション、モジュール、アクション、ゲッターのホットリローディングをサポートします。Browserify では [browserify-hmr](https://github.com/AgentME/browserify-hmr/) プラグインを使用することができます。

ミューテーションとモジュールのホットリローディングのために、`store.hotUpdate()`  API メソッドを利用する必要があります:

``` js
// store.js
import { createStore } from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

const state = { ... }

const store = createStore({
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

### 動的モジュールホットリローディング

もしストアでモジュールだけを使用している場合には、`require.context` を使って全てのモジュールを動的に読み込むこともできます。

```js
// store.js
import { createStore } from 'vuex'

// 全てのモジュールをロードする
function loadModules() {
  const context = require.context("./modules", false, /([a-z_]+)\.js$/i)

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

const { context, modules } = loadModules()

const store = createStore({
  modules
})

if (module.hot) {
  // モジュールに変更があった場合にホットリロードする
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}
```

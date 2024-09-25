# 3.x から 4.0 への移行

ほとんどすべての Vuex 4 の API は、Vuex 3 から変更されていません。しかし、修正が必要な破壊的変更がいくつかあります。

- [破壊的変更](#破壊的変更)
  - [インストール手順](#インストール手順)
  - [TypeScript サポート](#typescript-サポート)
  - [バンドルが Vue 3 に対応しました](#バンドルが-vue-3-に対応しました)
  - ["createLogger" 関数はコアモジュールからエクスポートされます](#createlogger-関数はコアモジュールからエクスポートされます)
- [新機能](#新機能)
  - [新しい "useStore" 合成関数](#新しい-usestore-合成関数)

## 破壊的変更

### インストール手順

新しい Vue 3 の初期化の手順に合わせて、Vuex のインストール手順が変更されました。新しいストアを作成するには、新しく導入された createStore 関数を使用することが推奨されます。

```js
import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})
```

VueインスタンスにVuexをインストールするには、Vuexではなく`store`を渡します。

```js
import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

:::tip 注意
厳密にはこれは破壊的変更ではなく、まだ `new Store(...)` 構文を使用することができますが、Vue 3 と Vue Router Next に合わせるためにこの方法を推奨します。
:::

### TypeScript サポート

Vuex 4 は、[issue #994](https://github.com/vuejs/vuex/issues/994) を解決するために、Vue コンポーネント内の `this.$store` のグローバルな型付けを削除します。TypeScript で使用する場合は、独自のモジュール拡張を宣言する必要があります。

次のコードをあなたのプロジェクトに配置して、`this.$store` が正しく型付けされるようにしてください。

```ts
// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module 'vue' {
  // ストアのステートを宣言する
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

詳細は、[TypeScript サポート](./typescript-support) セクションをご覧ください.

### バンドルが Vue 3 に対応しました

以下のバンドルは、Vue 3 のバンドルに合わせて生成されます。

- `vuex.global(.prod).js`
  - ブラウザの `<script src="...">` で直接使用します。Vuexのグローバルを公開しています。
  - グローバルビルドは UMD ではなく IIFE としてビルドされており、`<script src="...">` での直接使用のみを想定しています。
  - ハードコードされた prod/dev ブランチが含まれており、prod ビルドはあらかじめ minify されています。本番環境では、`.prod.js` ファイルを使用してください。
- `vuex.esm-browser(.prod).js`
  - ネイティブの ES モジュールのインポート（`<script type="module">` でブラウザをサポートするモジュールを含む）で使用されます。
- `vuex.esm-bundler.js`
  - `webpack`, `rollup`, `parcel` などのバンドラーで使用されます。
  - `process.env.NODE_ENV` のガードを持つ prod/dev ブランチを残します(バンドラーで置き換える必要があります)。
  - minify されたビルドは出荷されません（バンドル後に他のコードと一緒に行われます）。
- `vuex.cjs.js`
  - Node.js のサーバーサイドレンダリングで、`require()`を使って使用されます。

### "createLogger" 関数はコアモジュールからエクスポートされます

Vuex 3では、`createLogger` 関数は `vuex/dist/logger` からエクスポートされていましたが、現在は core パッケージに含まれています。この関数は `vuex` パッケージから直接インポートする必要があります。

```js
import { createLogger } from 'vuex'
```

## 新機能

### 新しい "useStore" 合成関数

Vuex 4 では、Composition API でストアを操作するための新しい API が導入されました。合成関数の `useStore` を使って、コンポーネントの `setup` フック内でストアを取得することができます。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

詳細は、[Composition API](./composition-api)のセクションをご覧ください。

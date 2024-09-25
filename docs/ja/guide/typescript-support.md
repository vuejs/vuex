# TypeScript サポート

Vuex は型付けを提供しているので、TypeScript を使ってストア定義を書くことができます。Vuex には特別な TypeScript の設定は必要ありません。[Vue の基本的な TypeScript の設定](https://v3.ja.vuejs.org/guide/typescript-support.html) に従ってプロジェクトの設定を行ってください。

しかし、Vue コンポーネントを TypeScript で書いている場合は、ストアの型付けを正しく行うために必要な手順がいくつかあります。

## Vue コンポーネントでの `$store` プロパティの型付け

Vuex はすぐに使用できる `this.$store` プロパティの型付けを提供していません。TypeScriptと併用する場合は、独自のモジュール拡張を宣言する必要があります。

プロジェクトフォルダに宣言ファイルを追加して、Vue の `ComponentCustomProperties` のカスタム型付けを宣言します。

```ts
// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module 'vue' {
  // ストアのステートを宣言する
  interface State {
    count: number
  }

  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## `useStore` 関数の型付け

Composition API で Vue コンポーネントを記述する際には、ほとんどの場合、`useStore`が型付けされたストアを返すようにしたいでしょう。`useStore` が正しく型付けされたストアを返すためには次のことが必要です。

1. 型付けされた `InjectionKey` を定義する。
2. ストアをインストールする際に、型付けされた `InjectionKey` を Vue App インスタンスに渡す。
3. 型付けされた `InjectionKey` を `useStore` メソッドに渡す。

それでは、順を追って説明していきます。まずは、Vue の `InjectionKey` インターフェースを使って独自のストアの型定義とともにキーを定義します。

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// ストアのステートに対して型を定義します
export interface State {
  count: number
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

次に、ストアのインストール時に定義した `InjectionKey` を Vue App インスタンスに渡します。

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// pass the injection key
app.use(store, key)

app.mount('#app')
```

最後に、このキーを `useStore` メソッドに渡すことで型付けされたストアを取得することができます。

```ts
// in a vue component
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // typed as number
  }
}
```

内部的には、Vuex は Vue の [Provide/Inject](https://v3.ja.vuejs.org/api/composition-api.html#provide-inject) 機能を使って Vue App インスタンスにストアをインストールします。これが、 `InjectionKey` によって型定義を提供できる理由です。

### `useStore` 使用方法の簡略化

`useStore` 関数を使うたびに `InjectionKey` をインポートして、 `useStore` へ渡さなければならないのは少し面倒かもしれません。その場合、型付けされたストアを取得する独自の関数を定義すると良いでしょう。

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// 独自の `useStore` 関数を定義します
export function useStore () {
  return baseUseStore(key)
}
```

この関数を使用することで、 `InjectionKey` とその型を提供しなくても、型付けされたストアを取得することができます。

```ts
// vue component 内
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // number として型付け
  }
}
```

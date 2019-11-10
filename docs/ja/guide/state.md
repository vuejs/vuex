# ステート

### 単一ステートツリー

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cWw3Zhb" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

Vuex は **単一ステートツリー (single state tree)** を使います。つまり、この単一なオブジェクトはアプリケーションレベルの状態が全て含まれており、"信頼できる唯一の情報源 (single source of truth)" として機能します。これは、通常、アプリケーションごとに1つしかストアは持たないことを意味します。単一ステートツリーは状態の特定の部分を見つけること、デバッグのために現在のアプリケーションの状態のスナップショットを撮ることを容易にします。

単一ステートツリーはモジュール性と競合しません。以降の章で、アプリケーションの状態とミューテーション(変更)をサブモジュールに分割する方法について説明します。

### Vuex の状態を Vue コンポーネントに入れる

ストアにある状態を Vue コンポーネント に表示するにはどうすればよいのでしょう？　Vuex ストア はリアクティブなので、ストアから状態を"取り出す"一番シンプルな方法は、単純にいくつかのストアの状態を [算出プロパティ](https://jp.vuejs.org/guide/computed.html) で返すことです。

```js
// Counter コンポーネントをつくってみましょう
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

`store.state.count` が変わるたび、算出プロパティの再評価が発生し、関連した DOM の更新をトリガーします。

しかし、このパターンでは、コンポーネントがグローバルストアシングルトンに依存してしまいます。 モジュールシステムを使っているとき、ストアの状態を使っているすべてのコンポーネントでインポートが必要です。また、コンポーネントのテストのときにモック化が必要となります。

Vuex は、ルートコンポーネントに `store` オプションを指定することで (これは、 `Vue.use(Vuex)` で有効にできます)、すべての子コンポーネントにストアを "注入" する機構を提供しています:

```js
const app = new Vue({
  el: '#app',
  // "store" オプションで指定されたストアは、全ての子コンポーネントに注入されます
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

ルートインスタンスに `store` オプションを渡すことで、渡されたストアをルートの全ての子コンポーネントに注入します。これは `this.$store` で各コンポーネントから参照することができます。 `Counter` の実装を変更しましょう:

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### `mapState`  ヘルパー

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c8Pz7BSK" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

コンポーネントが複数のストアのステートプロパティやゲッターを必要としているとき、これらすべてにおいて、算出プロパティを宣言することは繰り返しで冗長です。これに対処するため、算出ゲッター関数を生成し、いくつかのキーストロークを省くのに役立つ `mapState` ヘルパーを使うことができます:

```js
// 完全ビルドでは、ヘルパーは Vuex.mapState として公開されています
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // アロー関数は、コードをとても簡潔にできます！
    count: state => state.count,
    // 文字列を渡すことは、`state => state.count` と同じです
    countAlias: 'count',
    // `this` からローカルステートを参照するときは、通常の関数を使わなければいけません
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

マップされた算出プロパティの名前がステートサブツリーの名前と同じ場合は、文字列配列を `mapState` に渡すこともできます。

```js
computed: mapState([
  // map this.count to store.state.count
  'count'
])
```

### オブジェクトスプレッド演算子

`mapState` はオブジェクトを返すことに注意しましょう。どうやって、他のローカル算出プロパティと組み合わせるのでしょうか？ 通常、最終的にひとつのオブジェクトを `computed` に渡せるように、複数のオブジェクトをひとつにマージするユーティリティを使わなければいけません。しかし、[オブジェクトスプレッド演算子](https://github.com/tc39/proposal-object-rest-spread)で、シンタックスをかなり単純にできます:

```js
computed: {
  localComputed () { /* ... */ },
  // オブジェクトスプレット演算子で、外のオブジェクトとこのオブジェクトを混ぜる
  ...mapState({
    // ...
  })
}
```

### コンポーネントはまだローカルステートを持つことできる

Vuex を使うということは、**全て**の状態を Vuex の中に置くべき、というわけではありません。多くの状態を Vuex に置くことで、状態の変更がさらに明示的、デバッグ可能になりますが、ときにはコードを冗長でまわりくどいものにします。状態の一部がひとつのコンポーネントだけに属している場合は、それをローカルの状態として残しておくとよいでしょう。あなたは、トレードオフを考慮した上で、あなたのアプリの開発ニーズに合った決定をすべきです。

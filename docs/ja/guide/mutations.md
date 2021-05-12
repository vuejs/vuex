# ミューテーション

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/ckMZp4HN" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

実際に Vuex のストアの状態を変更できる唯一の方法は、ミューテーションをコミットすることです。Vuex のミューテーションはイベントにとても近い概念です: 各ミューテーションは**タイプ**と**ハンドラ**を持ちます。ハンドラ関数は Vuex の状態（state）を第1引数として取得し、実際に状態の変更を行います:

```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 状態を変更する
      state.count++
    }
  }
})
```

直接ミューテーションハンドラを呼び出すことはできません。この mutations オプションは、どちらかいうと "タイプが `increment` のミューテーションがトリガーされたときに、このハンドラが呼ばれる" といったイベント登録のようなものです。ミューテーションハンドラを起動するためにはミューテーションのタイプを指定して `store.commit` を呼び出す必要があります:

```js
store.commit('increment')
```

### 追加の引数を渡してコミットする

`store.commit` に追加の引数を渡すこともできます。この追加の引数は、特定のミューテーションに対する**ペイロード**と呼びます:

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```js
store.commit('increment', 10)
```

ほとんどの場合、ペイロードはオブジェクトにすべきです。そうすることで複数のフィールドを含められるようになり、またミューテーションがより記述的に記録されるようになります:

```js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```js
store.commit('increment', {
  amount: 10
})
```

### オブジェクトスタイルのコミット

また `type` プロパティを持つオブジェクトを使って、ミューテーションをコミットすることもできます:

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

オブジェクトスタイルでコミットするとき、オブジェクト全体がペイロードとしてミューテーションハンドラに渡されます。したがってハンドラの例は上記と同じです:

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### ミューテーション・タイプに定数を使用する

いろいろな Flux 実装において、ミューテーション・タイプに定数を使用することが共通して見られるパターンです。これはコードに対してリントツールのようなツールを利用できるという利点があり、また単一ファイルに全ての定数を設定することによって、共同で作業する人に、アプリケーション全体で何のミューテーションが可能であるかを一目見ただけで理解できるようにします:

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = createStore({
  state: { ... },
  mutations: {
    // 定数を関数名として使用できる ES2015 の算出プロパティ名（computed property name）機能を使用できます
    [SOME_MUTATION] (state) {
      // 状態を変更する
    }
  }
})
```

定数を使用するかどうかは好みの問題です。多くの開発者による大規模なプロジェクトで役に立ちますが、完全にオプションなので、もしお気に召さなければ使用しなくても構いません。

### ミューテーションは同期的でなければならない

ひとつの重要なルールを覚えておきましょう。それは**ミューテーションハンドラ関数は同期的でなければならない**ということです。なぜか？次の例で考えてみましょう:

```js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

いま、開発ツールのミューテーションのログを見ながら、アプリケーションのデバッグを行っていることを想像してください。全てのミューテーションをログに記録するためには、ミューテーションの前後の状態のスナップショットを捕捉することが必要です。しかし、上の例にあるミューテーション内の非同期コールバックは、それを不可能にします: そのコールバックは、ミューテーションがコミットされた時点ではまだ呼び出されていません。そして、コールバックが実際にいつ呼び出されるかを、開発ツールは知る術がありません。いかなる状態変更でも、コールバック内で起きる場合は本質的に追跡不可能です。

### コンポーネント内におけるミューテーションのコミット

`this.$store.commit('xxx')` と書くか、もしくはコンポーネントのメソッドを `store.commit` にマッピングする `mapMutations` ヘルパーを呼び出すこと（ルートの `store` の注入が必要）で、コンポーネント内でミューテーションをコミットできます:

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // `this.increment()` を `this.$store.commit('increment')` にマッピングする

      // mapMutations はペイロードサポートする:
      'incrementBy' // `this.incrementBy(amount)` を `this.$store.commit('incrementBy', amount)` にマッピングする
    ]),
    ...mapMutations({
      add: 'increment' // `this.add()` を `this.$store.commit('increment')` にマッピングする
    })
  }
}
```

### アクションへ向けて

状態変更を非同期に組み合わせることは、プログラムの動きを予測することを非常に困難にします。例えば、状態を変更する非同期コールバックを持った 2つのメソッドを両方呼び出すとき、それらがいつ呼び出されたか、どちらが先に呼び出されたかを、どうやって知ればよいのでしょう？これがまさに、状態変更と非同期の 2つの概念を分離したいという理由です。Vuex では**全てのミューテーションは同期的に行う**という作法になっています:

```js
store.commit('increment')
// "increment" ミューテーションによる状態変更は、この時点で行われるべきです
```

非同期的な命令を扱うために[アクション](actions.md)を見てみましょう。

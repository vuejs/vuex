# アクション

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c6ggR3cG" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

アクションはミューテーションと似ていますが、下記の点で異なります:

- アクションは、状態を変更するのではなく、ミューテーションをコミットします。
- アクションは任意の非同期処理を含むことができます。

シンプルなアクションを登録してみましょう:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

アクションハンドラはストアインスタンスのメソッドやプロパティのセットと同じものを呼び出せるコンテキストオブジェクトを受け取ります。したがって `context.commit` を呼び出すことでミューテーションをコミットできます。あるいは `context.state` や `context.getters` で、状態やゲッターにアクセスできます。他のアクションも `context.dispatch` で呼ぶこともできます。なぜコンテキストオブジェクトがストアインスタンスそのものではないのかは、後ほど[モジュール](modules.md)で説明します。

実際にはコードを少しシンプルにするために ES2015 の[引数分割束縛（argument destructuring）](https://github.com/lukehoban/es6features#destructuring)がよく使われます（特に `commit` を複数回呼び出す必要があるとき）:

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

## アクションのディスパッチ

アクションは `store.dispatch` がトリガーとなって実行されます:

``` js
store.dispatch('increment')
```

これは一見ばかげて見えるかもしれません。つまり、カウントをインクリメントしたいときに、どうして直接 `store.commit('increment')` を呼び出してミューテーションをコミットしないのか、と。**ミューテーションは同期的でなければならない**というのを覚えていますか？アクションはそうではありません。アクションの中では**非同期**の操作を行うことができます。

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

アクションはペイロード形式とオブジェクトスタイルのディスパッチをサポートします:

``` js
// ペイロードを使ってディスパッチする
store.dispatch('incrementAsync', {
  amount: 10
})

// オブジェクトを使ってディスパッチする
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

より実践的な例として、ショッピングカートをチェックアウトするアクションを挙げます。このアクションは**非同期な API の呼び出し**と、**複数のミューテーションのコミット**をします:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // 現在のカート内の商品を保存する
    const savedCartItems = [...state.cart.added]
    // チェックアウトのリクエストを送信し、楽観的にカート内をクリアする
    commit(types.CHECKOUT_REQUEST)
    // shop API は成功時のコールバックと失敗時のコールバックを受け取る
    shop.buyProducts(
      products,
      // 成功時の処理
      () => commit(types.CHECKOUT_SUCCESS),
      // 失敗時の処理
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

一連の非同期の処理を実行しつつ、ミューテーションのコミットによってのみ副作用（状態の変更）を与えていることに注意してください。

## コンポーネント内でのアクションのディスパッチ

`this.$store.dispatch('xxx')` でコンポーネント内でアクションをディスパッチできます。あるいはコンポーネントのメソッドを `store.dispatch` にマッピングする `mapActions` ヘルパーを使うこともできます（ルートの `store` の注入が必要です）:

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // `this.increment()` を `this.$store.dispatch('increment')` にマッピングする
      // `mapActions` もペイロードをサポートする:
      'incrementBy' // `this.incrementBy(amount)` を `this.$store.dispatch('incrementBy', amount)` にマッピングする
    ]),
    ...mapActions({
      add: 'increment' // `this.add()` を `this.$store.dispatch('increment')` にマッピングする
    })
  }
}
```

## アクションを構成する

アクションはしばしば非同期処理を行いますが、アクションが完了したことをどうやって知れば良いのでしょう？そしてもっと重要なことは、さらに複雑な非同期処理を取り扱うために、どうやって複数のアクションを構成させるかということです。

まず知っておくべきことは `store.dispatch` がトリガーされたアクションハンドラによって返された Promise を処理できることと、`store.dispatch` もまた Promise を返すことです。

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

すると次のようにできます:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

また別のアクションで下記のように書くと:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

最終的に [async / await](https://tc39.github.io/ecmascript-asyncawait/) を使用することで、次のようにアクションを組み合わせることができます:

``` js
// `getData()` と `getOtherData()` が Promise を返すことを想定している

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // `actionA` が完了するのを待機する
    commit('gotOtherData', await getOtherData())
  }
}
```

> `store.dispatch` で異なるモジュール内の複数のアクションハンドラをトリガーすることができます。そのようなケースでは、全てのトリガーされたハンドラが解決されたときに解決する Promise が戻り値として返ってくることになります。

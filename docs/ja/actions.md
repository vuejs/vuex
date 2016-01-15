# アクション

アクションはミューテーションをディスパッチする機能です。アクションは非同期にすることができ、単一アクションは複数のミューテーションをディスパッチできます。

アクションは何かが起こるための意向を表しており、それを呼び出すコンポーネントから離れて詳細を抽象化します。コンポーネントが何かしたい場合アクション呼び出します。アクションはステート変化をもたらすため、コールバックまたは戻り値について心配する必要はなく、そしてステート変化は更新するコンポーネントの DOM をトリガします。コンポーネントは、アクションが実際に行われている方法から、完全に切り離されます。

それゆえ、通常アクション内部のデータエンドポイントへの API 呼び出しを行い、そしてアクションを呼び出すコンポーネントの両方から非同期に詳細を隠し、さらにミューテーションはアクションによってトリガされます。

> Vuex のアクションは純粋な Flux の定義では実際には "アクションクリエータ (action creators)" ですが、私はその用語は便利よりも混乱していると見ています。

### 単純なアクション

アクションは単純に単一のミューテーションをトリガするのが一般的です。Vuex はそのようなアクションの定義するために省略記法を提供します:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state.count += x
    }
  },
  actions: {
    // 省略記法
    // ミューテーション名を提供する
    increment: 'INCREMENT'
  }
})
```

今、アクションを呼び出すとき:

``` js
store.actions.increment(1)
```

単純に私たちに対して以下を呼び出します:

``` js
store.dispatch('INCREMENT', 1)
```

アクションに渡される任意の引数は、ミューテーションハンドラに渡されることに注意してください。

### 標準なアクション

現在のステートに依存しているロジック、または非同期な操作を必要とするアクションについては、それらを関数として定義します。アクション関数は常に第1引数として呼び出す store を取得します:

``` js
const vuex = new Vuex({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state += x
    }
  },
  actions: {
    incrementIfOdd: (store, x) => {
      if ((store.state.count + 1) % 2 === 0) {
        store.dispatch('INCREMENT', x)
      }
    }
  }
})
```


関数本体それほど冗長にしない ES6 の argument destructuring を使用するのが一般的です(ここでは、`dispatch` 関数は store インスタンスに事前にバインドされているように、それをメソッドとして呼び出す必要はありません):

``` js
// ...
actions: {
  incrementIfOdd: ({ dispatch, state }, x) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch('INCREMENT', x)
    }
  }
}
```

以下のように、文字列省略記法は基本的に糖衣構文 (syntax sugar) です:

``` js
actions: {
  increment: 'INCREMENT'
}
// 以下に相当 ... :
actions: {
  increment: ({ dispatch }, ...payload) => {
    dispatch('INCREMENT', ...payload)
  }
}
```

### 非同期なアクション

非同期なアクションの定義に対して同じ構文を使用することができます:

``` js
// ...
actions: {
  incrementAsync: ({ dispatch }, x) => {
    setTimeout(() => {
      dispatch('INCREMENT', x)
    }, 1000)
  }
}
```

より実践的な例はショッピングカートをチェックアウトする場合です。複数のミューテーションをトリガする必要がある場合があります。チェックアウトを開始されたとき、成功、そして失敗の例を示します:

``` js
// ...
actions: {
  checkout: ({ dispatch, state }, products) => {
    // カートアイテムで現在のアイテムを保存する
    const savedCartItems = [...state.cart.added]
    // チェックアウトリクエストを送り出し、
    // 楽観的にカートをクリアします
    dispatch(types.CHECKOUT_REQUEST)
    // shop API は成功コールバックと失敗コールバックを受け入れます
    shop.buyProducts(
      products,
      // 成功処理
      () => dispatch(types.CHECKOUT_SUCCESS),
      // 失敗処理
      () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

また、全てのコンポーネントは全体のチェックアウトを行うために `store.actions.checkout(products)` を呼び出す必要があります。

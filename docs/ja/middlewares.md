# ミドルウェア

Vuex store は各ミューテーション(これは Redux のミドルウェアとは全く無関係であることに注意してください)に対して公開された hook を `middlewares` オプションとして受け入れます。Vuex のミドルウェアは単純にいくつかの hook 関数を実装したオブジェクトです:

``` js
const myMiddleware = {
  onInit (state) {
    // 初期ステートを記録
  },
  onMutation (mutation, state) {
    // 全ての変異後に呼ばれる
    // ミューテーションは { type, payload } の形式で来る
  }
}
```

そして、このように使用することができます:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: [myMiddleware]
})
```

デフォルトでは、ミドルウェアは実際 `state` オブジェクトを受信します。ミドルウェアは主にデバッギング目的やデータの永続化のために使用されるため、ミドルウェアでは、**ステートを変異することができません**。

時どき、ミドルウェアはステートの"スナップショット"を受信することができ、また事前のミューテーションの状態と事後のミューテーションの状態を比較したいかもしれません。このようなミドルウェアは `snapshot: true` オプションを宣言しなければなりません:

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState) {
    // prevState と nextState は完全コピーされた(deep-cloned)、
    // 前のミューテーションの後のミューテーションのスナップショット
  }
}
```

**ステートのスナップショットを撮るミドルウェアは開発時のみに使用すべきです。** Webpack または Browserify を使用するとき、私たちのためにビルドツールがそれを処理することができます:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

ミドルウェアはデフォルトで使用されるでしょう。本番環境のため、`process.env.NODE_ENV !== 'production'` の値を `false` に変換するために、[ここ](http://vuejs.org/guide/application.html#Deploying_for_Production) で説明したビルドセットアップを最終ビルド向けに使用します。

### ビルドイン Logger ミドルウェア

Vuex は一般的なデバッギングを使用するための logger ミドルウェアが付属しています:

``` js
const store = new Vuex.Store({
  middlewares: [Vuex.createLogger()]
})
```

`createLogger` 関数はいくつかのオプションがあります:

``` js
const logger = Vuex.createLogger({
  collapsed: false, // ログに記録されたミューテーションを自動拡大する
  transformer (state) {
    // それを記録す前にステートを変換する
    // 例えば、特定のサブツリーだけ返します
    return state.subTree
  },
  mutationTransformer (mutation) {
    // ミューテーションは { type, payload } の形式で記録される
    // どんな形式でも欲しいフォーマットに変換できる
    return mutation.type
  }
})
```

ステートのスナップショットを撮る logger ミドルウェアは開発時のみ使用することに注意してください。

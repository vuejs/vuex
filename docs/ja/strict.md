# Strict Mode

strict mode を有効にするには、Vuex store を作成するときに、単純に `strict: true` を指定します:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

strict mode では、Vuex のステートがミューテーションハンドラの外部で変異されたときはいつでも、エラーを投げます。これは全てのステートの変異がデバッギングツールによって明示的に追跡ｄけいるようになります。

### 開発環境 vs 本番環境

**本番環境に対して strict mode を有効にしてデプロイしてはなりません！** Strict mode では不適切なミューテーションを検出するためにステートツリー上で深い監視を実行します。パフォーマンスコストを回避するために本番環境ではそれをオフにしてください。

ミドルウェアと同様に、ビルドツールに処理させることができます:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

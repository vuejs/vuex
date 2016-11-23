# Strict Mode

To enable strict mode, simply pass in `strict: true` when creating a Vuex store:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown. This ensures that all state mutations can be explicitly tracked by debugging tools.

### Development vs. Production

**Do not enable strict mode when deploying for production!** Strict mode runs a deep watch on the state tree for detecting inappropriate mutations - make sure to turn it off in production to avoid the performance cost.

Similar to plugins, we can let the build tools handle that:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

# 厳格モード

厳格( strict )モードを有効にするには、Vuex store を作成するときに、ただ `strict: true` を指定するだけです:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

厳格モードでは、Vuex のステートがミューテーションハンドラの外部で変更されたら、エラーを投げます。これで全てのステートの変異がデバッギングツールで明示的に追跡できることを保証します。

### 開発環境 vs 本番環境

**本番環境に対して 厳格モードを有効にしてデプロイしてはいけません！** 厳格モードでは不適切なミューテーションを検出するためにステートツリー上に対して深い監視を実行します。パフォーマンスコストを回避するために本番環境では無効にしてください。

プラグインと同様に、ビルドツールに処理させることができます:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

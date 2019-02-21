# プラグイン

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cvp8ZkCR" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

Vuex ストア は、各ミューテーションへのフックを公開する `plugins` オプションを受け付けます。 Vuex プラグインは、単一の引数としてストアを受けつけるただの関数です:

``` js
const myPlugin = store => {
  // ストアが初期化されたときに呼ばれます
  store.subscribe((mutation, state) => {
    // それぞれのミューテーションの後に呼ばれます
    // ミューテーションは `{ type, payload }` の形式で提供されます
  })
}
```

そして、このように利用することができます:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### プラグイン内でのミューテーションのコミット

プラグインは直接、状態を変更できません。これはコンポーネントに似ています。プラグインはコンポーネント同様に、ミューテーションのコミットによる変更のトリガーだけで状態を変更できます。

ミューテーションのコミットによるストアとデータソースの同期をプラグインで実現できます。 websocket データソースとストアを例にします (これは不自然な例です。実際には、さらに複雑なタスクのために `createWebSocketPlugin` 関数は、追加でいくつかのオプションを受け取れます):

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('RECEIVE_DATA', data)
    })
    store.subscribe((mutation) => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### 状態のスナップショットを撮る

時々、状態の"スナップショット"を撮って、ミューテーション前後の状態を比較したくなることがあるでしょう。それを実現するために、状態オブジェクトのディープコピーを行う必要があります:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // `prevState` と `nextState` を比較...

    // 次のミューテーションのために状態を保存
    prevState = nextState
  })
}
```

**状態のスナップショットを撮るプラグインはアプリケーションの開発の間だけ使われるべきです。**  webpack や Browserify を使っていれば、ビルドツールにそれを処理させることができます:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

上のように記述すれば、プラグインはデフォルトで利用されることになります。本番環境( production ) では、 `process.env.NODE_ENV !== 'production'` を `false` に置き換えるために、 webpack では[DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 、 Browserify では[envify](https://github.com/hughsk/envify) が必要になります。

### ビルトインロガープラグイン

> もし、あなたが [vue-devtools](https://github.com/vuejs/vue-devtools) を使っている場合は、これは不要でしょう。

Vuex には、一般的なデバッグに利用する用途の備え付けのロガープラグインがあります。

```js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

`createLogger` 関数はいくつかのオプションを受け取ります:

``` js
const logger = createLogger({
  collapsed: false, // ログ出力されたミューテーションを自動で展開します
  filter (mutation, stateBefore, stateAfter) {
    // ミューテーションを記録する必要がある場合は、`true` を返します
    // `mutation` は `{ type, payload }` です
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // ロギングの前に、状態を変換します
    // 例えば、特定のサブツリーのみを返します
    return state.subTree
  },
  mutationTransformer (mutation) {
    // ミューテーションは、`{ type, payload }` の形式でログ出力されます
    // 任意の方法でそれをフォーマットできます
    return mutation.type
  },
  logger: console, // `console` API の実装, デフォルトは `console`
})
```

ロガーファイルは、他にも `<script>` タグで直接読み込むことができ、`createVuexLogger` 関数がグローバルに公開されます。

ロガープラグインは、状態のスナップショットを撮ることに注意しましょう。スナップショットを撮ることはコストがかかるため、開発中だけ利用してください。

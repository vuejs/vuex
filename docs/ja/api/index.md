---
sidebar: auto
---

# API リファレンス

## Store

### createStore

- `createStore<S>(options: StoreOptions<S>): Store<S>`

  新しいストアを作成します。

  ```js
  import { createStore } from 'vuex'

  const store = createStore({ ...options })
  ```

## Store コンストラクタオプション

### state

- 型: `Object | Function`
  ストアのための ルートステートオブジェクトです。 [詳細](../guide/state.md)

  オブジェクトを返す関数を渡す場合、返されたオブジェクトはルートステートとして使用されます。これは特にモジュールの再利用のためにステートオブジェクトを再利用する場合に便利です。[詳細](../guide/modules.md#モジュールの再利用)

### mutations

- 型: `{ [type: string]: Function }`

  ストアにミューテーションを登録します。ハンドラ関数は第 1 引数に `state` を常に受け取り(モジュール内で定義されていれば、モジュールのローカルステートを受け取り)、指定されていれば第 2 引数に `payload` を受け取ります。

  [詳細](../guide/mutations.md)

### actions

- 型: `{ [type: string]: Function }`

  ストアにアクションを登録します。ハンドラ関数は次のプロパティを持つ `context` オブジェクトを受け取ります。:

  ```js
  {
    state,      // `store.state` と同じか、モジュール内にあればローカルステート
    rootState,  // `store.state` と同じ。ただしモジュール内に限る
    commit,     // `store.commit` と同じ
    dispatch,   // `store.dispatch` と同じ
    getters,    // `store.getters` と同じか、モジュール内にあればローカルゲッター
    rootGetters // `store.getters` と同じ。ただしモジュール内に限る
  }
  ```

  そして、第 2 引数の `payload` があれば、それを受け取ります。

  [詳細](../guide/actions.md)

### getters

- 型: `{ [key: string]: Function }`

  ストアにゲッターを登録します. ゲッター関数は次の引数を受け取ります:

  ```
  state,     // モジュール内で定義されていればモジュールのローカルステート
  getters    // store.getters と同じ
  ```

  モジュールで定義されたときの仕様

  ```
  state,       // モジュールで定義された場合、モジュールのローカルステート
  getters,     // 現在のモジュールのモジュールのローカルゲッター
  rootState,   // グローバルステート
  rootGetters  // 全てのゲッター
  ```

  登録されたゲッターは `store.getters` 上に公開されます。

  [詳細](../guide/getters.md)

### modules

- 型: `Object`

  サブモジュールを含む次のような形式のオブジェクトはストアにマージされます。

  ```js
  {
    key: {
      state,
      namespaced?,
      mutations?,
      actions?,
      getters?,
      modules?
    },
    ...
  }
  ```

  各モジュールは、ルートオプションに似た `state` と `mutations` を含むことができます。モジュールの状態は、モジュールのキーを使って、ストアのルートステートに結合されます。モジュールのミューテーションとゲッターは、第 1 引数としてルートステートの代わりに、モジュールのローカルステートだけを受け取り、モジュールのアクションの `context.state` もローカルステートを指すようになります。

  [詳細](../guide/modules.md)

### plugins

- 型: `Array<Function>`

  プラグイン関数の配列は、ストアに適用されます。このプラグインは、ストアだけを引数として受け取り、外部への永続化、ロギング、デバッギングのために、ミューテーションを監視するか、または、 websocket や observable のような外から渡されるデータのためにミューテーションをディスパッチします。

  [詳細](../guide/plugins.md)

### strict

- 型: `boolean`
- デフォルト: `false`

  Vuex ストアを厳格モードにします。厳格モードでは、ミューテーションハンドラ以外で、 Vuex の状態の変更を行うと、エラーが投げられます。

  [詳細](../guide/strict.md)

### devtools

- 型: `boolean`

  特定の Vuex インスタンスに対して開発ツールをオン、またはオフにします。インスタンスに false を渡すと、開発ツールのプラグインを購読しないように Vuex ストアに伝えます。1 ページに複数のストアがある時に便利です。

  ```js
  {
    devtools: false
  }
  ```

## Store インスタンスプロパティ

### state

- 型: `Object`

  ルートステート、読み取り専用です。

### getters

- 型: `Object`

  登録されているゲッターを公開します。読み取り専用です。

## Store インスタンスメソッド

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  ミューテーションをコミットします。`options` は[名前空間付きモジュール](../guide/modules.md#名前空間)で root なミューテーションにコミットできる `root: true` を持つことできます。[詳細](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object): Promise<any>`
-  `dispatch(action: Object, options?: Object): Promise<any>`

  アクションをディスパッチします。`options` は[名前空間付きモジュール](../guide/modules.md#名前空間)で root なアクションにディスパッチできる `root: true` を持つことできます。 すべてのトリガーされたアクションハンドラを解決するPromiseを返します。[詳細](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  ストアのルートステートを置き換えます。これは、ステートのハイドレーションやタイムトラベルのためだけに利用すべきです。

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  `fn`が返す値をリアクティブに監視し、値が変わった時にコールバックを呼びます。`fn`は最初の引数としてストアのステートを、2番目の引数としてゲッターを受け取ります。 [Vue の`vm.$watch`メソッド](https://jp.vuejs.org/v2/api/#watch)と同じオプションをオプションのオブジェクトとして受け付けます。

  監視を止める場合は、返された unwatch 関数を呼び出します。

### subscribe

-  `subscribe(handler: Function, options?: Object): Function`

  ストアへのミューテーションを購読します。`handler` は、全てのミューテーションの後に呼ばれ、引数として、ミューテーション ディスクリプタとミューテーション後の状態を受け取ります。

  ```js
  const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  デフォルトでは、新しい `handler` はチェーンの最後に登録されます。つまり、先に追加された他の `handler` が呼び出された後に実行されます。`prepend: true` を `options` に設定することで、`handler` をチェーンの最初に登録することができます。

  ```js
  store.subscribe(handler, { prepend: true })
  ```

  購読を停止するには、返された unsubscribe 関数呼び出します。

  プラグインの中でもっともよく利用されます。[詳細](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function, options?: Object): Function`

  スストアアクションを購読します。`handler` はディスパッチされたアクションごとに呼び出され、アクション記述子と現在のストア状態を引数として受け取ります:

  ```js
  const unsubscribe = store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  デフォルトでは、新しい `handler` はチェーンの最後に登録されます。つまり、先に追加された他の `handler` が呼び出された後に実行されます。`prepend: true` を `options` に設定することで、`handler` をチェーンの最初に登録することができます。

  ```js
  store.subscribeAction(handler, { prepend: true })
  ```

  購読を停止するには、返された unsubscribe 関数を呼び出します。

  `subscribeAction` は購読ハンドラがアクションディスパッチの*前 (before)*、または*後 (after)* に呼びだすべきかどうか(デフォルトの動作は、*before* です)指定することもできます。

  ```js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`before action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`after action ${action.type}`)
    }
  })
  ```

  `subscribeAction` は `error` ハンドラを指定することもできます。このハンドラは、アクションディスパッチの中で投げられたエラーをキャッチすることができます。`error` ハンドラは投げられた `error` オブジェクトを第 3 引数として受け取ります。

  ```js
  store.subscribeAction({
    error: (action, state, error) => {
      console.log(`error action ${action.type}`)
      console.error(error)
    }
  })
  ```

  `subscribeAction` メソッドはプラグインで最も一般的に使用されます。[詳細](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

   動的なモジュールを登録します。[詳細](../guide/modules.md#dynamic-module-registration)

  `options` は前の状態を保存する `preserveState: true` を持つことができます。サーバサイドレンダリングに役立ちます。

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  動的なモジュールを解除します。[詳細](../guide/modules.md#dynamic-module-registration)

### hasModule

- `hasModule(path: string | Array<string>): boolean`

  動的なモジュールがすでに登録されているかどうかを確認します。[詳細](../guide/modules.md#dynamic-module-registration)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  新しいアクションとミューテーションをホットスワップします。[詳細](../guide/hot-reload.md)

## コンポーネントをバインドするヘルパー

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  ストアのサブツリーを返すコンポーネントの computed オプションを作成します。[詳細](../guide/state.md#the-mapstate-helper)

  第 1 引数は、オプションで名前空間文字列にすることができます。[詳細](../guide/modules.md#binding-helpers-with-namespace)

  第 2 引数のオブジェクトのメンバーには関数 `function(state: any)` を指定できます。

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  ゲッターの評価後の値を返すコンポーネントの computed オプションを作成します。[詳細](../guide/getters.md#the-mapgetters-helper)

  第 1 引数は、オプションで名前空間文字列にすることができます。[詳細](../guide/modules.md#binding-helpers-with-namespace)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  アクションをディスパッチするコンポーネントの methods オプションを作成します。[詳細](../guide/actions.md#dispatching-actions-in-components)

  第 1 引数は、オプションで名前空間文字列にすることができます。[詳細](../guide/modules.md#binding-helpers-with-namespace)

  第 2 引数のオブジェクトのメンバーには関数 `function(dispatch: function, ...args: any[])` を指定できます。

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  ミューテーションをコミットするコンポーネントの methods オプションを作成します。[詳細](../guide/mutations.md#commiting-mutations-in-components)

  第 1 引数は、オプションで名前空間文字列にすることができます。[詳細](../guide/modules.md#binding-helpers-with-namespace)

  第 2 引数のオブジェクトのメンバーには関数 `function(commit: function, ...args: any[])` を指定できます。

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  名前空間付けられたコンポーネントバインディングのヘルパーを作成します。返されるオブジェクトは指定された名前空間にバインドされた `mapState`、`mapGetters`、`mapActions` そして `mapMutations` が含まれます。[詳細はこちら](../guide/modules.md#binding-helpers-with-namespace)

## 構成可能な関数

### useStore

- `useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string): Store<S>;`

  `setup` フックの中で呼ばれた時に、注入されたストアを取得します。Composition API を使用する時、このメソッドを呼ぶことでストアを取得することができます。

  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
    }
  }
  ```

  TypeScript ユーザーは、インジェクション・キーを使って型付けされたストアを取得することができます。これを実現するためには、ストアインスタンスを Vue アプリにインストールする時に、インジェクション・キーを定義してストアと一緒に渡す必要があります。

  まず、Vue の `InjectionKey` インターフェースを使って、インジェクション・キーを宣言します。

  ```ts
  // store.ts
  import { InjectionKey } from 'vue'
  import { createStore, Store } from 'vuex'

  export interface State {
    count: number
  }

  export const key: InjectionKey<Store<State>> = Symbol()

  export const store = createStore<State>({
    state: {
      count: 0
    }
  })
  ```

  そして、その定義したキーを `app.use` メソッドの第 2 引数に渡します。

  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { store, key } from './store'

  const app = createApp({ ... })

  app.use(store, key)

  app.mount('#app')
  ```

  最後に、`useStore` メソッドにそのキーを渡すことで型付けされたストアインスタンスを取得することができます。

  ```ts
  // vue component 内
  import { useStore } from 'vuex'
  import { key } from './store'

  export default {
    setup () {
      const store = useStore(key)

      store.state.count // number として型付け
    }
  }
  ```

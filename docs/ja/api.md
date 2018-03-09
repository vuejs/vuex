# API リファレンス

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
  ```

### Vuex.Store コンストラクタオプション

- **state**

  - 型: `Object | Function`

    ストアのための ルートステートオブジェクトです。[詳細](state.md)

    オブジェクトを返す関数を渡す場合、返されたオブジェクトはルートステートとして使用されます。これは特にモジュールの再利用のためにステートオブジェクトを再利用する場合に便利です。[詳細](modules.md#モジュールの再利用)

- **mutations**

  - 型: `{ [type: string]: Function }`

    ストアにミューテーションを登録します。ハンドラ関数は第一引数に `state` を常に受け取り(モジュール内で定義されていれば、モジュールのローカルステートを受け取り)、指定されていれば第二引数に `payload` を受け取ります。

    [詳細](mutations.md)

- **actions**

  - 型: `{ [type: string]: Function }`

    ストアにアクションを登録します。ハンドラ関数は次のプロパティを持つ `context` オブジェクトを受け取ります。:

    ``` js
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

    [詳細](actions.md)

- **getters**

  - type: `{ [key: string]: Function }`

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

    [詳細](getters.md)

- **modules**

  - 型: `Object`

    サブモジュールを含む次のような形式のオブジェクトはストアにマージされます。

    ``` js
    {
      key: {
        state,
        mutations
        actions?,
        getters?,
        modules?
    
      },
      ...
    }
    ```

    各モジュールは、ルートオプションに似た `state` と `mutations` を含むことができます。モジュールの状態は、モジュールのキーを使って、ストアのルートステートに結合されます。モジュールのミューテーションとゲッターは、第一引数としてルートステートの代わりに、モジュールのローカルステートだけを受け取り、モジュールのアクションの `context.state` もローカルステートを指すようになります。

    [詳細](modules.md)

- **plugins**

  - 型: `Array<Function>`

    プラグイン関数の配列は、ストアに適用されます。このプラグインは、ストアだけを引数として受け取り、外部への永続化、ロギング、デバッギングのために、ミューテーションを監視するか、または、 websocket や observable のような外から渡されるデータのためにミューテーションをディスパッチします。

    [詳細](plugins.md)

- **strict**

  - 型: `Boolean`
  - デフォルト: `false`

    Vuex ストアを厳格モードにします。厳格モードでは、ミューテーションハンドラ以外で、 Vuex の状態の変更を行うと、エラーが投げられます。

    [詳細](strict.md)

### Vuex.Store インスタンスプロパティ

- **state**

  - type: `Object`

    ルートステート、読み取り専用です。

- **getters**

  - type: `Object`

    登録されているゲッターを公開します。読み取り専用です。

### Vuex.Store インスタンスメソッド

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  ミューテーションをコミットします。`options` は[名前空間付きモジュール](modules.md#名前空間)で root なミューテーションにコミットできる `root: true` を持つことできます。[詳細](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  アクションをディスパッチします。`options` は[名前空間付きモジュール](modules.md#名前空間)で root なアクションにディスパッチできる `root: true` を持つことできます。 すべてのトリガーされたアクションハンドラを解決するPromiseを返します。[詳細](actions.md)

- **`replaceState(state: Object)`**

  ストアのルートステートを置き換えます。これは、ステートのハイドレーションやタイムトラベルのためだけに利用すべきです。

- **`watch(getter: Function, cb: Function, options?: Object)`**

  リアクティブにゲッター関数の返す値を監視します。値が変わった場合は、コールバックを呼びます。ゲッターはストアの `state` を最初の引数として、 `getters` を2番目の引数として受け取ります。 Vue の`vm.$watch`メソッドと同じオプションをオプションのオブジェクトとして受け付けます。

  監視を止める場合は、ハンドラ関数の返り値を関数として呼び出します。

- **`subscribe(handler: Function)`**

  ストアへのミューテーションを購読します。`handler` は、全てのミューテーションの後に呼ばれ、引数として、ミューテーション ディスクリプタとミューテーション後の状態を受け取ります。

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  プラグインの中でもっともよく利用されます。[詳細](plugins.md)

- **`subscribeAction(handler: Function)`**

  > 2.5.0 で新規追加

  ストアアクションを購読します。`handler` はディスパッチされたアクションごとに呼び出され、アクション記述子と現在のストア状態を引数として受け取ります:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

　プラグインで最も一般的に使用されます。[Details](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  動的なモジュールを登録します。[詳細](modules.md#dynamic-module-registration)

  `options` は前の状態を保存する `preserveState: true` を持つことができます。サーバサイドレンダリングに役立ちます。

- **`unregisterModule(path: string | Array<string>)`**

  動的なモジュールを解除します。[詳細](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  新しいアクションとミューテーションをホットスワップします。[詳細](hot-reload.md)

### コンポーネントをバインドするヘルパー

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  ストアのサブツリーを返すコンポーネントの computed オプションを作成します。[詳細](state.md#the-mapstate-helper)

  第1引数は、オプションで名前空間文字列にすることができます。[詳細](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  ゲッターの評価後の値を返すコンポーネントの computed オプションを作成します。[詳細](getters.md#the-mapgetters-helper)

  第1引数は、オプションで名前空間文字列にすることができます。[詳細](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  アクションをディスパッチするコンポーネントの methods オプションを作成します。[詳細](actions.md#dispatching-actions-in-components)

  第1引数は、オプションで名前空間文字列にすることができます。[詳細](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  ミューテーションをコミットするコンポーネントの methods オプションを作成します。[詳細](mutations.md#commiting-mutations-in-components)

  第1引数は、オプションで名前空間文字列にすることができます。[詳細](modules.md#binding-helpers-with-namespace)

- **`createNamespacedHelpers(namespace: string): Object`**

  名前空間付けられたコンポーネントバインディングのヘルパーを作成します。返されるオブジェクトは指定された名前空間にバインドされた `mapState`、`mapGetters`、`mapActions` そして `mapMutations` が含まれます。[詳細はこちら](modules.md#binding-helpers-with-namespace)

# API リファレンス

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store コンストラクタオプション

- **state**

  - 型: `Object`

    Vuex store のための ルートステートオブジェクトです。

    [詳細](state.md)

- **mutations**

  - 型: `Object`

    各エントリのキーがミューテーション名、値がミューテーションハンドラ関数のオブジェクトです。ハンドラ関数は常に第1引数として`state` を受け取り、以降はディスパッチ呼び出しで渡された全ての引数を受け取ります。

    [詳細](mutations.md)

- **modules**

  - 型: `Object`

    サブモジュールを含む次のような形式のオブジェクトはストアにマージされます。

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    各モジュールは、ルートオプションに似た `state` と `mutations` を含むことができます。モジュールの状態は、モジュールのキーを使って、ストアのルートステートにアタッチされます。モジュールのミューテーションは、第一引数としてルートステートの代わりに、モジュール自身のステートだけを受け取ります。

- **plugins**

  - 型: `Array<Function>`

    プラグイン関数の配列は、ストアに適用されます。このプラグインは、ストアだけを引数として受け取り、外部への永続化、ロギング、デバッギングのために、ミューテーションを監視するか、または、 websocket や observable のような内部のデータのためにミューテーションをディスパッチします。

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

### Vuex.Store インスタンスメソッド

- **dispatch(mutationName: String, ...args) | dispatch(mutation: Object)**

  ミューテーションを直接ディスパッチします。これは、アプリケーションコードで一般的にアクションを使ったほうがよい特定の状況で有用です。

  *オブジェクトスタイルディスパッチ*

  > requires >=0.6.2

  他にオブジェクトを使って、ミューテーションをディスパッチできます。

  ``` js
  store.dispatch({
    type: 'INCREMENT',
    payload: 10
  })
  ```

- **replaceState(state: Object)**

  ストアのルートステートを置き換えます。これは、ステートの再格納やタイムトラベルのためだけに利用すべきです。

- **watch(getter: Function, cb: Function, [options: Object])**

  リアクティブにゲッター関数の返す値を監視します。値が変わった場合は、コールバックを呼びます。ゲッターはストアの状態のみを引数として受け取ります。 Vue の`vm.$watch`メソッドと同じオプションをオプションのオブジェクトとして受け付けます。

  監視を止める場合は、ハンドラ関数の返り値を関数として呼び出します。

- **hotUpdate(newOptions: Object)**

  新しいアクションとミューテーションでホットスワップします。[詳細](hot-reload.md)

- **subscribe(handler: Function)**

  ストアへのミューテーションを購読します。`handler` は、全てのミューテーションの後に呼ばれ、引数として、ミューテーション ディスクリクタとミューテーション後の状態を受け取ります。

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

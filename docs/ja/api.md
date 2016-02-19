# API リファレンス

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store コンストラクタオプション

- **state**
  
  - 型: `Object`

    Vuex store 向けの root なステートオブジェクト

    [詳細](state.md)

- **mutations**

  - 型: `Object | Array<Object>`

    各エントリキーがミューテーション名とその値がミューテーションハンドラ関数である値であるオブジェクト。ハンドラ関数は常に第1引数として`state` を受信し、そして次のディスパッチ呼び出しに渡される全ての引数を受信する

    オブジェクトの配列を渡す場合は、これらオブジェクトは自動的に最後のオブジェクトにいっしょにマージされる

    [詳細](mutations.md)

- **actions**

  - 型: `Object | Array<Object>`

    各エントリキーがアクション名とその値のいずれかであるオブジェクト

    1. ミューテーション名の文字列。または、
    2. 第1引数として store を受信する関数、第2引数以降は追加されたペイロード引数

    Vuex はこれらエントリを処理し、そして実際に呼び出し可能なアクション関数を作成し、さらに store の `actions` プロパティを公開する

    オブジェクトの配列を渡す場合は、これらオブジェクトは自動的に最後のオブジェクトにいっしょにマージされる

    [詳細](actions.md)

- **getters**
 
   - 型: `Object | Array<Object>`
 
     各エントリキーがゲッター名と第1引数としてステートを受信する関数の値であるオブジェクト
 
     Vuex はそれらエントリを処理し、実際の呼び出し可能なゲッター関数と store の `getters` プロパティ上のそれらを公開する
 
     オブジェクトの配列を渡す場合は、これらオブエジェクトは自動的に最後のオブジェクトにいっしょに自動的にマージされる
 
     [詳細](getters.md)
 

- **middlewares**

  - 型: `Array<Object>`

    ミドルウェアオブジェクトの配列で以下のような形式であること:

    ``` js
    {
      snapshot: Boolean, // default: false
      onInit: Function,
      onMutation: Function
    }
    ```

    全てのフィールドは任意 [詳細](middlewares.md)

- **strict**

  - 型: `Boolean`
  - デフォルト値: `false`

    Vuex store を 厳格モードに強制する。厳格モードではミューテーションハンドラの外側の Vuex ステートに任意に変異するとき、エラーを投げる

    [詳細](strict.md)

### Vuex.Store インスタンスプロパティ

- **state**

  - 型: `Object`

    root なステート。読み取り専用

- **actions**

  - 型: `Object`

    呼び出し可能なアクション関数

### Vuex.Store インスタンスメソッド

- **dispatch(mutationName: String, ...args)**

  直接ミューテーションをディスパッチする。これは一般的には、アプリケーションコードでアクションを使用するほうが必要な場合のような、特定の状況で有用

- **hotUpdate(newOptions: Object)**

  ホットスワップな新しいアクションとミューテーション [詳細](hot-reload.md)

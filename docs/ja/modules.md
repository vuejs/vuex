# モジュール

単一ステートツリーを使うため、アプリケーションの全ての状態は、一つの大きなストアオブジェクトに内包されます。しかしながら、アプリケーションが大きくなるにつれて、ストアオブジェクトは膨れ上がってきます。

そのような場合に役立てるため Vuex ではストアを **モジュール** に分割できるようになっています。

それぞれのモジュールは、ステート、ミューテーション、アクション、ゲッター、モジュールさえも内包できます（モジュールをネストできます）- トップからボトムまでフラクタル構造です:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### モジュールのローカルステート

モジュールのミューテーションやゲッターの中では、渡される第1引数は **モジュールのローカルステート** です。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state はモジュールのローカルステート
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

同様に、モジュールのアクションの中では `context.state` はローカルステートにアクセスでき、ルートのステートは `context.rootState` でアクセスできます:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

また、モジュールのゲッターの中では、ルートのステートは第3引数でアクセスできます:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 名前空間

モジュール内部のアクションやミューテーション、ゲッターは依然として **グローバル名前空間** の下に登録されることに注意してください。そのため、複数のモジュールが同一のミューテーションやアクションタイプに反応してしまいます。接頭語や接尾語を付けることで名前の衝突を回避できますし、再利用可能でかつどこで使われるか分からない Vuex のモジュールを書いているのならば、そうすべきです。例えば `todos` モジュールを作りたいときは以下のようにします:

``` js
// types.js

// ゲッター、アクション、ミューテーションの名前を定数として定義し、
// それらにモジュール名である `todos` を接頭語として付ける
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// 接頭語を付けたゲッター、アクション、ミューテーションを定義する
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

### 動的にモジュールを登録する

ストアが作られた**後**に `store.registerModule` メソッドを使って、モジュールを登録できます:

``` js
store.registerModule('myModule', {
  // ...
})
```

モジュールのステートには `store.state.myModule` でアクセスします。

動的なモジュール登録があることで、他の Vue プラグインが、モジュールをアプリケーションのストアに付属させることで、状態の管理に Vuex を活用できることができます。例えば [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) ライブラリは、動的に付属させたモジュール内部でアプリケーションのルートステートを管理することで vue-router と vuex を統合しています。

`store.unregisterModule(moduleName)` を呼び出せば、動的に登録したモジュールを削除できます。ただしストア作成（store creation）によって宣言された、静的なモジュールはこのメソッドで削除できないことに注意してください。

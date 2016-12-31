# モジュール

単一ステートツリーを使うため、アプリケーションの全ての状態は、一つの大きなストアオブジェクトに内包されます。しかしながら、アプリケーションが大きくなるにつれて、ストアオブジェクトは膨れ上がってきます。

そのような場合に役立てるため Vuex ではストアを**モジュール**に分割できるようになっています。それぞれのモジュールは、モジュール自身の状態（state）、ミューテーション、アクション、ゲッター、モジュールさえも内包できます（モジュールをネストできます）- トップからボトムまでフラクタル構造です:

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

store.state.a // -> moduleA のステート
store.state.b // -> moduleB のステート
```

### モジュールのローカルステート

モジュールのミューテーションやゲッターの中では、渡される第1引数は**モジュールのローカルステート**です。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
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

デフォルトでは、アクション、ミューテーション、そしてゲッター内部のモジュールは**グローバル名前空間**の元で登録されます - これにより、複数のモジュールが同じミューテーション/アクションタイプに反応することができます。

モジュールを自己完結型または再利用可能にするには、`namespaced: true` で名前空間としてマークすることができます。モジュールが登録されると、そのゲッター、アクション、およびミューテーションのすべてが、モジュールが登録されているパスに基づいて自動的に名前空間に入れられます。例えば:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // モジュールのアセット
      state: { ... }, // モジュールステートは名前空間オプションのによって既にネストされており、名前空間のオプションに影響を与える
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // ネストされたモジュール
      modules: {
        // 親モジュールから名前空間を継承する
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // さらに名前空間をネストする
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

名前空間のゲッターとアクションは、ローカライズされた `getters`、`dispatch`、`commit` を受け取ります。言い換えれば、同じモジュールに接頭辞 (prefix) 書き込まずに、モジュールアセットを使用することができます。名前空間の切り替えは、モジュール内のコードには影響しません。

#### 名前空間付きモジュールでのグローバルアセットへのアクセス

グローバルステートとゲッターを使いたい場合、`rootState` と `rootGetters` はゲッター関数の第3引数と第4引数として渡され、アクション関数に渡される `context` オブジェクトのプロパティとしても公開されます。

アクションをディスパッチするか、グローバル名前空間にミューテーションをコミットするには、`dispatch` と `commit` の3番目の引数として `{root: true}` を渡します。

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` はこのモジュールのゲッターにローカライズされています
      // ゲッターの第4引数経由で rootGetters を使うことができます
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // ディスパッチとコミットもこのモジュール用にローカライズされています
      // ルートディスパッチ/コミットの `root` オプションを受け入れます
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### 名前空間によるバインディングヘルパー

`mapState`、`mapGetters`、`mapActions`、そして `mapMutations` ヘルパーを使って名前空間付きモジュールをコンポーネントにバインディングするとき、少し冗長になります:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

このような場合は、第1引数としてモジュールの名前空間文字列をヘルパーに渡すことで、そのモジュールをコンテキストとして使用してすべてのバインディングを行うことができます。上記は次のように単純化できます。

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```

#### プラグイン開発者向けの注意事項

モジュールを提供する[プラグイン](plugins.md)を作成し、ユーザーがそれらを Vuex ストアに追加できるようにすると、モジュールの予測できない名前空間が気になるかもしれません。あなたのモジュールは、プラグインユーザーが名前空間付きモジュールの元にモジュールを追加すると、名前空間になります。この状況に適応するには、プラグインオプションを使用して名前空間の値を受け取る必要があります。

``` js
// プラグインオプションで名前空間値を取得し、
// そして、Vuex プラグイン関数を返す
export function createPlugin (options = {}) {
  return function (store) {
    /// 名前空間をプラグインモジュールの型に追加する
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
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

動的なモジュール登録があることで、他の Vue プラグインが、モジュールをアプリケーションのストアに付属させることで、状態の管理に Vuex を活用できることができます。例えば [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) ライブラリは、動的に付属させたモジュール内部でアプリケーションのルーティングのステートを管理することで vue-router と vuex を統合しています。

`store.unregisterModule(moduleName)` を呼び出せば、動的に登録したモジュールを削除できます。ただしストア作成（store creation）の際に宣言された、静的なモジュールはこのメソッドで削除できないことに注意してください。

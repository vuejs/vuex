# モジュール

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKK4psq" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

単一ステートツリーを使うため、アプリケーションの全ての状態は、一つの大きなストアオブジェクトに内包されます。しかしながら、アプリケーションが大きくなるにつれて、ストアオブジェクトは膨れ上がってきます。

そのような場合に役立てるため Vuex ではストアを**モジュール**に分割できるようになっています。それぞれのモジュールは、モジュール自身の状態（state）、ミューテーション、アクション、ゲッター、モジュールさえも内包できます（モジュールをネストできます）- トップからボトムまでフラクタル構造です:

``` js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA` のステート
store.state.b // -> `moduleB` のステート
```

### モジュールのローカルステート

モジュールのミューテーションやゲッターの中では、渡される第1引数は**モジュールのローカルステート**です。

``` js
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // `state` はモジュールのローカルステート
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
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
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

デフォルトでは、モジュール内部のアクション、ミューテーション、そしてゲッターは**グローバル名前空間**の元で登録されます - これにより、複数のモジュールが同じミューテーション/アクションタイプに反応することができます。

モジュールをより自己完結型にまた再利用可能なものにしたい場合は、それを `namespaced: true` によって名前空間に分けることができます。モジュールが登録されると、そのゲッター、アクション、およびミューテーションのすべてが、モジュールが登録されているパスに基づいて自動的に名前空間に入れられます。例えば:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // モジュールのアセット
      state: () => ({ ... }), // モジュールステートはすでにネストされており、名前空間のオプションによって影響を受けません
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
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // さらに名前空間をネストする
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

名前空間のゲッターとアクションは、ローカライズされた `getters`、`dispatch`、`commit` を受け取ります。言い換えれば、同じモジュールに接頭辞 (prefix) を書き込まずに、モジュールアセットを使用することができます。名前空間オプションの切り替えは、モジュール内のコードには影響しません。

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

#### 名前空間付きモジュールでのグローバルアクションへの登録

名前空間付きモジュールでグローバルアクションに登録したい場合、`root: true` でそれをマークでき、そしてアクション定義を `handler` 関数に置くことができます。例えば:

``` js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,
       actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
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
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
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
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

さらに、`createNamespacedHelpers` を使用することによって名前空間付けされたヘルパーを作成できます。指定された名前空間の値にバインドされた新しいコンポーネントバインディングヘルパーを持つオブジェクトを返します:

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // `some/nested/module` を調べます
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // `some/nested/module` を調べます
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### プラグイン開発者向けの注意事項

モジュールを提供する[プラグイン](plugins.md)を作成し、ユーザーがそれらを Vuex ストアに追加できるようにすると、モジュールの予測できない名前空間が気になるかもしれません。あなたのモジュールは、プラグインユーザーが名前空間付きモジュールの元にモジュールを追加すると、その名前空間に属するようになります。この状況に適応するには、プラグインオプションを使用して名前空間の値を受け取る必要があります。

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
// `myModule` モジュールを登録します
store.registerModule('myModule', {
  // ...
})

// ネストされた `nested/myModule` モジュールを登録します
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

モジュールのステートには `store.state.myModule` と `store.state.nested.myModule` でアクセスします。

動的なモジュール登録があることで、他の Vue プラグインが、モジュールをアプリケーションのストアに付属させることで、状態の管理に Vuex を活用できます。例えば [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) ライブラリは、動的に付属させたモジュール内部でアプリケーションのルーティングのステートを管理することで vue-router と vuex を統合しています。

`store.unregisterModule(moduleName)` を呼び出せば、動的に登録したモジュールを削除できます。ただしストア作成（store creation）の際に宣言された、静的なモジュールはこのメソッドで削除できないことに注意してください。

また、すでにモジュールが登録されているかどうかを `store.hasModule(moduleName)` メソッドを使って確認することができます。

#### ステートの保持

サーバサイドレンダリングされたアプリケーションから状態を保持するなど、新しいモジュールを登録するときに、以前の状態を保持したい場合があります。`preserveState` オプション（`store.registerModule('a', module, { preserveState: true })`）でこれを実現できます。

`preserveState: true` を設定した場合、モジュールを登録する際、アクション、ミューテーション、そしてゲッターは登録されますがステートは登録されません。これはステートがすでにモジュールに登録されていることを前提としており、ステートを上書きしないようにするためです。

### モジュールの再利用

時どき、モジュールの複数インスタンスを作成する必要があるかもしれません。例えば:

- 同じモジュールを使用する複数のストアを作成する;
- 同じストアに同じモジュールを複数回登録する

モジュールの状態を宣言するために単純なオブジェクトを使用すると、その状態オブジェクトは参照によって共有され、変更時にクロスストア/モジュールの状態汚染を引き起こします。(例: `runInNewContext` オプションが `false` または `'once'` のとき、[SSR ではステートフルなシングルトンは避けます](https://ssr.vuejs.org/ja/structure.html#ステートフルなシングルトンの回避)。)

これは、実際には Vue コンポーネント内部の `data` と全く同じ問題です。従って解決策も同じです。モジュールの状態を宣言するために関数を使用してください (2.3.0 以降でサポートされます):

``` js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // ミューテーション、アクション、ゲッター...
}
```

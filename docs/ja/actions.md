# アクション

アクションはミューテーションと似ていますが、下記の点で異なります:

- アクションは、状態を変更するのではなく、ミューテーションをコミットします。
- アクションは任意の非同期処理を含むことができます。

シンプルなアクションを登録してみましょう:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

アクションハンドラはストアインスタンスのメソッドやプロパティのセットと同じものを呼び出せる、コンテキストオブジェクトを受け取ります。したがって `context.commit` を呼び出すことでミューテーションをコミットできます。あるいは `context.state` や `context.getters` で、状態やゲッターにアクセスできます。なぜコンテキストオブジェクトがストアインスタンスそのものではないのかは、後ほど [モジュール](modules.md) で説明します。

実際にはコードを少しシンプルにするために ES2015 の [引数分割束縛（argument destructuring）](https://github.com/lukehoban/es6features#destructuring) がよく使われます（特に `commit` を複数回呼び出す必要があるとき）:

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### アクションのディスパッチ

アクションは `store.dispatch` がトリガーとなって実行されます:

``` js
store.dispatch('increment')
```

これは一見ばかげて見えるかもしれません。つまり、カウントをインクリメントしたいときに、どうして直接 `store.commit('increment')` を呼び出してミューテーションをコミットしないのか、と。**ミューテーションは同期的でなければならない** というのを覚えていますか？アクションはそうではありません。アクションの中では **非同期** の操作をおこなうことができます。

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

アクションはペイロード形式とオブジェクトスタイルのディスパッチをサポートします:

``` js
// ペイロードを使ってディスパッチする
store.dispatch('incrementAsync', {
  amount: 10
})

// オブジェクトを使ってディスパッチする
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

より実践的な例として、ショッピングカートをチェックアウトするアクションを挙げます。このアクションは **非同期な API の呼び出し** と、**複数のミューテーションのコミット** をします:

``` js
actions: {
  checkout ({ commit, state }, payload) {
    // 現在のカート内の商品を保存する
    const savedCartItems = [...state.cart.added]
    // チェックアウトのリクエストを送信し、楽観的にカート内をクリアする
    commit(types.CHECKOUT_REQUEST)
    // shop API は成功時のコールバックと失敗時のコールバックを受け取る
    shop.buyProducts(
      products,
      // 成功時の処理
      () => commit(types.CHECKOUT_SUCCESS),
      // 失敗時の処理
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

一連の非同期の処理を実行しつつ、ミューテーションのコミットによってのみ副作用（状態の変更）を与えていることに注意してください。

### コンポーネント内でのアクションのディスパッチ

`this.$store.dispatch('xxx')` でコンポーネント内でアクションをディスパッチできます。あるいはコンポーネントのメソッドを `store.dispatch` にマッピングする `mapActions` ヘルパーを使うこともできます（ルートの `store` が必要です）:

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // this.increment() を this.$store.dispatch('increment') にマッピングする
    ]),
    ...mapActions({
      add: 'increment' // this.add() を this.$store.dispatch('increment') にマッピングする
    })
  }
}
```

### Composing Actions

Actions are often asynchronous, so how do we know when an action is done? And more importantly, how can we compose multiple actions together to handle more complex async flows?

The first thing to know is that `store.dispatch` returns the value returned by the triggered action handler, so you can return a Promise in an action:

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Now you can do:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

And also in another action:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Finally, if we make use of [async / await](https://tc39.github.io/ecmascript-asyncawait/), a JavaScript feature landing very soon, we can compose our actions like this:

``` js
// assuming getData() and getOtherData() return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for actionA to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

> It's possible for a `store.dispatch` to trigger multiple action handlers in different modules. In such a case the returned value will be a Promise that resolves when all triggered handlers have been resolved.

# アクション

> Vuex のアクションは純粋な Flux の定義では実際には "アクションクリエーター (action creators)" ですが、その用語は有用さよりも混乱を生み出していると考えられます。

アクションはミューテーションをディスパッチする関数です。慣習として、 Vuex のアクションは常に1番目の引数にストアのインスタンスを受け取ることが期待され、2番目以降にはオプショナルな追加の引数が続きます。

``` js
// 最も単純なアクション
function increment (store) {
  store.dispatch('INCREMENT')
}

// 追加の引数を持つアクション
// ES2015 の引数分割束縛（argument destructuring）を使用しています
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

これは、なぜ単純に直接ミューテーションをディスパッチしないのかと、一見馬鹿げて見えるかもしれません。**ミューテーションは同期的でなければならない** というのを覚えていますか？　アクションはそうではありません。アクションの中では **非同期** の操作をおこなうことができます。

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

より実践的な例として、ショッピングカートをチェックアウトするアクションを挙げます。このアクションは **非同期な API の呼び出し** と、**複数のミューテーションのディスパッチ** をします。

``` js
function checkout ({ dispatch, state }, products) {
  // 現在のカート内の商品を保存します
  const savedCartItems = [...state.cart.added]
  // チェックアウトのリクエストを送信し、
  // 楽観的にカート内をクリアします
  dispatch(types.CHECKOUT_REQUEST)
  // shop API は成功時のコールバックと失敗時のコールバックを受け取ります
  shop.buyProducts(
    products,
    // 成功処理
    () => dispatch(types.CHECKOUT_SUCCESS),
    // 失敗処理
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}
```

非同期 API 呼び出しの結果は、アクションの返り値やコールバックから受け取るのではなく、同様にミューテーションをディスパッチすることで扱っていることに注意してください。これは **アクションの呼び出しによって生み出される唯一の副作用はミューテーションのディスパッチであるべき** だという経験則です。

### コンポーネント内でのアクション呼び出し

アクション関数はストアのインスタンスへの参照無しに直接呼び出すことができないということに気づいているかもしれません。技術的に、メソッド内で `action(this.$store)` とアクションを呼び出すことはできます。しかし、ストアを "束縛した" 版のアクションをコンポーネントのメソッドとして呼び出すことができればより良いですし、テンプレートの中から簡単に参照することができるようになります。これは `vuex.actions` オプションを使うことで実現できます。

``` js
// コンポーネント内
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // ステートのゲッター
    actions: {
      incrementBy // ES6 オブジェクトリテラル省略記法（object literal shorthand）、同じ名前で束縛します
    }
  }
})
```

上記のコードは元の `incrementBy` アクションをコンポーネントのストアインスタンスへと束縛し、それをコンポーネントのインスタンスメソッド `vm.incrementBy` として追加しています。`vm.incrementBy` に与えられた任意の引数は、第1引数にストアが渡されている状態で元のアクション関数へと渡されます。つまり以下のように呼ばれます。

``` js
vm.incrementBy(1)
```

これは以下と同様です。

``` js
incrementBy(vm.$store, 1)
```

このようにする利点はコンポーネントのテンプレートの中でより簡単にそれを束縛することができるという点です。

``` html
<button v-on:click="incrementBy(1)">1増加する</button>
```

アクションを束縛するときに、明示的に異なるメソッド名を使うこともできます。

``` js
// コンポーネント内
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // 異なる名前で束縛します
    }
  }
})
```

このようにすることで、アクションは `vm.incrementBy` ではなく、 `vm.plus` と束縛されるでしょう。

### インラインアクション

もしアクションがコンポーネント特有のものであれば、それを単純にインラインで定義することもできます。

``` js
const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: ({ dispatch }) => dispatch('INCREMENT')
    }
  }
})
```

### すべてのアクションの束縛

もし、単純にすべての共通のアクションを束縛したいのであれば、以下のように書くことができます。

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // すべてのアクションを束縛
  }
})
```

### モジュール内でアクションをアレンジする

大抵の大きなアプリケーションでは、アクションは様々な目的にあわせてグループやモジュール内でアレンジされるべきでしょう。例えば、userActions モジュールはユーザーの登録、ログイン、ログアウトなどの処理を行い、その一方で、shoppingCartActions モジュールは買い物のためのその他のタスクを処理します。

モジュール化をすることで、様々なコンポーネントで必要とされている最小限のアクションのインポートがよりしやすくなります。

再利用のためにあるアクションモジュールを別のアクションモジュールにインポートする場合もあるかもしれません。

```javascript
// errorActions.js
export const setError = ({dispatch}, error) => {
  dispatch('SET_ERROR', error)
}
export const showError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', true)
}
export const hideError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', false)
}
```

```javascript
// userActions.js
import {setError, showError} from './errorActions'

export const login = ({dispatch}, username, password) => {
  if (username && password) {
    doLogin(username, password).done(res => {
      dispatch('SET_USERNAME', res.username)
      dispatch('SET_LOGGED_IN', true)
      dispatch('SET_USER_INFO', res)
    }).fail(error => {
      dispatch('SET_INVALID_LOGIN')
      setError({dispatch}, error)
      showError({dispatch})
    })
  }
}

```

アクションを別のモジュールから呼び出す時や、同一モジュール内の別のアクションを呼び出す時は、アクションが第1引数にストアのインスタンスをとることを覚えておきましょう。すなわち、アクション内で呼び出されるアクションには、呼び出し元が受け取った第1引数をそのまま渡すべきです。

もしアクションを ES6 の分割束縛（destructuring）スタイルで書いているのであれば、呼び出し元のアクションの第1引数は、両方のアクションが必要とするすべてのプロパティ、および、メソッドをカバーする必要があります。例えば、呼び出し元のアクションが *dispatch* のみを使用し、呼び出し先のアクションが *state* と *watch* を使用している時、呼び出し元の第1引数には、以下のように *dispatch*, *state*, *watch* のすべてを渡すべきです。

```javascript
import {callee} from './anotherActionModule'

export const caller = ({dispatch, state, watch}) => {
  dispatch('MUTATION_1')
  callee({state, watch})
}
```

そうでなければ、旧式の関数の書き方をするべきです。

```javascript
import {callee} from './anotherActionModule'

export const caller = (store) => {
  store.dispatch('MUTATION_1')
  callee(store)
}
```

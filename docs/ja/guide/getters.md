# ゲッター

例えば項目のリストをフィルタリングしたりカウントするときのように、ストアの状態を算出したいときがあります。

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

もしこの関数を複数のコンポーネントで利用したくなったら、関数をコピーするか、あるいは関数を共用のヘルパーに切り出して複数の場所でインポートする必要があります。しかし、どちらも理想的とはいえません。

Vuex を利用するとストア内に "ゲッター" を定義することができます。それらをストアの算出プロパティと考えることができます。算出プロパティと同様に、ゲッターの結果はその依存関係に基づいて計算され、依存関係の一部が変更されたときにのみ再評価されます。

ゲッターは第1引数として、state を受け取ります:

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### プロパティスタイルアクセス

ゲッターは `store.getters` オブジェクトから取り出され、プロパティとしてアクセスすることができます:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

ゲッターは第2引数として他のゲッターを受け取ります:

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

どのコンポーネントの内部でも簡単にゲッターを利用することができます:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

プロパティとしてアクセスされるゲッターは Vue のリアクティブシステムの一部としてキャッシュされるという点に留意してください。

### メソッドスタイルアクセス

関数を返り値にすることで、ゲッターに引数を渡すこともできます。これは特にストアの中の配列を検索する時に役立ちます：
```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

メソッドによってアクセスされるゲッターは呼び出す度に実行され、その結果はキャッシュされない点に留意してください。

### `mapGetters` ヘルパー

`mapGetters` ヘルパーはストアのゲッターをローカルの算出プロパティにマッピングさせます:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // ゲッターを、スプレッド演算子（object spread operator）を使って computed に組み込む
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

ゲッターを異なる名前でマッピングさせたいときはオブジェクトを使います:

``` js
...mapGetters({
  // `this.doneCount` を `store.getters.doneTodosCount` にマッピングさせる
  doneCount: 'doneTodosCount'
})
```

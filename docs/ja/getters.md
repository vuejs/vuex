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

Vuex を利用するとストア内に "ゲッター" を定義することができます（ストアのための算出プロパティだと考えてください）。ゲッターはステート（状態）を第1引数として受け取ります:

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

ゲッターは `store.getters` オブジェクトから取り出されます:

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

関数を返り値にすることで、ゲッターに引数を渡すこともできます。これは特にストアの中の配列を検索する時に役立ちます：
```js
getters: {
  // ...
  getTodoById: (state, getters) => (id) => {
    return getters.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```


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
  // this.doneCount を store.getters.doneTodosCount にマッピングさせる
  doneCount: 'doneTodosCount'
})
```

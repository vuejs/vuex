
# ゲッター

例えば項目のリストをフィルタリングしたりカウントするときのように、ストアの状態を算出したいときがあります。

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

もしこの関数を複数のコンポーネントで利用したくなったら、関数をコピーするか、あるいは関数を共用のヘルパーに切り出して複数の場所でインポートする必要があります。- しかし、どちらも理想的とはいえません。

Vuex を利用するとストア内に "ゲッター" を定義することができます（ストアのための算出プロパティだと考えてください）。ゲッターはストアを第1引数として受け取ります:

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

### The `mapGetters` Helper

The `mapGetters` helper simply maps store getters to local computed properties:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

If you want to map a getter to a different name, use an object:

``` js
mapGetters({
  // map this.doneCount to store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```

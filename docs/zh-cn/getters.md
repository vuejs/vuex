
# Getters

有时候我们需要在 store 的状态上计算衍生出我们要的状态，例如遍历过滤一个列表每一项，然后计算剩下的个数：


``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果有多个组件需要用到它，那么就得重复拷贝这个方法，或者是把它封装成一个公共的方法，然后在各个地方导入 —— 这两种方式都不够完美。

Vuex 允许我们在 store 中定义 "getters"（把它们想象成 store 的计算属性）。 Getters 接收 store 的 state 作为第一个参数：

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

这个 getters 最终暴露为 `store.getters` 对象：

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters 还会接收其他 getters 作为第二个参数：

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

现在就可以简单地在组件里使用：

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

### `mapGetters` 工具

`mapGetters` 工具方法将 store 的 getters 简单映射到本地的计算属性：

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 通过对象解构操作符，将 getters 混进 computed
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

如果你要将 getter 映射成不同名称，用一个对象：

``` js
mapGetters({
  // map this.doneCount to store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```

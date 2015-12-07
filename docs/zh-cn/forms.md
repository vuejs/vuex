# 表单控制

当在严格模式中使用 Vuex 时，属于 Vuex 的 state 在使用 `v-model` 时需要用一些特殊的技巧。

``` html
<input v-model="obj.message">
```

这里的 `obj` 是在 computed 属性中返回的 Vue state 中的一个对象，在用户输入时，`v-model` 会直接改变 `obj.message`。在严格模式中，因为你只能通过 Vuex mutation handler 改变 state, 所以这里会抛出一个错误。

用 『Vuex 方式』 去解决这个问题的方法是：在 input 中绑定 value，在 `input` 或者 `change` 事件中调用 action:

``` html
<input :value="obj.message" @input="updateMessage">
```
``` js
// ...
methods: {
  updateMessage: function (e) {
    vuex.actions.updateMessage(e.target.value)
  }
}
```

`updateMessage` action 会 dispatch `'UPDATE_MESSAGE'`, 下面是 mutation handler:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

必须承认，这样做比简单地使用 `v-model` 要啰嗦得多，但这换来的是 state 的改变更加清晰和可被跟踪。实际上，Vuex 并不是想你把所有的 state 都放到 Vuex 实例中去 —— 如果有些 state 你不希望去跟踪，你就应该放在 Vuex 外面（比如组件里面），这样就可以愉快地使用 `v-model` 了。

# 表单处理

当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 `v-model` 会比较棘手：

``` html
<input v-model="obj.message">
```

假设这里的 `obj` 是在计算属性中返回的一个属于 Vuex store 的对象，在用户输入时，`v-model` 会试图直接修改 `obj.message`。在严格模式中，由于这个修改不是在 mutation handler 中执行的, 这里会抛出一个错误。

用『Vuex 的思维』去解决这个问题的方法是：给 `<input>` 中绑定 value，然后侦听 `input` 或者 `change` 事件，在事件回调中调用 action:

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

我们假设 `updateMessage` action 会 dispatch `'UPDATE_MESSAGE'`, 下面是 mutation handler:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

必须承认，这样做比简单地使用 `v-model` 要啰嗦得多，但这换来的是 state 的改变更加清晰和可被跟踪。另一方面，Vuex **并不**强制要求所有的状态都必须放在 Vuex store 中 —— 如果有些状态你觉得并没有需要对其变化进行追踪，那么你完全可以把它放在 Vuex 外面（比如作为组件的本地状态），这样就可以愉快地使用 `v-model` 了。

此外，如果仍然希望使用 Vuex 管理跟踪状态，并愉快地使用 `v-model`，还可以在组件中使用带 setter 的计算属性，这样，你就可以使用诸如 lazy、number 和 debounce 这样的参数特性了。

``` html
<input v-model="thisMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, value) => {
      dispatch('UPDATE_MESSAGE', value)
    }
  },
  computed: {
    thisMessage: {
      get () {
        return this.message
      },
      set (val) {
        this.updateMessage(val)
      }
    }
  }
}
```

mutation 保持不变。

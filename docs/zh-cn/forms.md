# 表单处理

使用 Vuex 的严格模式时，如果对 Vuex 管理的状态使用 `v-model` 的话，会有点棘手。

``` html
<input v-model="obj.message">
```

假设 `obj` 是一个计算属性，从 store 返回一个对象，当用户在输入框输入时，这里的 `v-model` 会试图直接修改 `obj.message`，这在严格模式下就会报错，因为不是在 mutation 处理器内改变状态。

『Vuex 式』的解决方案是，绑定 `<input>` 的 value 然后在 `input` 或 `change` 事件中提交修改：

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

然后这里是 mutation 处理器：

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### 双向绑定计算属性

的确，上面的处理方式比起 `v-model` + 本地状态是繁琐了一点，也失去了一些 `v-model` 有用的功能。另一种可选的方案是借助 setter，双向绑定计算属性。


``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```


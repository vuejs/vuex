# Actions

Actions 是用于 dispatch mutations 的函数。Actions 可以是异步的，一个 action 可以 dispatch 多个 mutations.

一个 action 描述了有什么事情应该发生，把本应该在组件中调用的逻辑细节抽象出来。当一个组件需要做某件事时，只需要调用一个 action —— 组件本身并不需要关心具体的后果：不需要提供回调函数也不需要期待返回值，因为 actions 的结果一定是 state 产生了变化，而 state 一旦变化，便会触发组件的 DOM 更新。 这样，组件便完全和 action 的具体逻辑解耦了。

因此，我们通常在 actions 中做 API 相关的请求。通过 actions 的封装，我们使得组件和 mutations 都不需要关心这些异步逻辑。

> Vuex actions 和 Flux 中的 "action creators" 是等同的概念，但是我觉得这个定义常让人感到困惑（比如分不清 actions 和 action creators）。

### 简单的 Actions

最简单的情况下，一个 action 即触发一个 mutation。Vuex 提供一个快捷的方式去定义这样的 actions:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state.count += x
    }
  },
  actions: {
    // 快捷定义
    // 只要提供 mutation 名
    increment: 'INCREMENT'
  }
})
```

调用 action:

``` js
store.actions.increment(1)
```

这相当于调用：

``` js
store.dispatch('INCREMENT', 1)
```

注意所有传递给 action 的参数同样会传递给 mutation handler.

### 正常 Actions

对于包含逻辑或是异步操作的 actions，则用函数来定义。Actions 函数获得的第一个参数永远是其所属的 store 实例：

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state += x
    }
  },
  actions: {
    incrementIfOdd: (store, x) => {
      if ((store.state.count + 1) % 2 === 0) {
        store.dispatch('INCREMENT', x)
      }
    }
  }
})
```

通常我们会用 ES6 的参数解构 (arguments destructuring) 语法来使得函数体更简洁：

``` js
// ...
actions: {
  incrementIfOdd: ({ dispatch, state }, x) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch('INCREMENT', x)
    }
  }
}
```

同时，简单 actions 的快捷定义其实只是如下函数的语法糖：

``` js
actions: {
  increment: 'INCREMENT'
}
// ... 上面的定义等同于：
actions: {
  increment: ({ dispatch }, ...payload) => {
    dispatch('INCREMENT', ...payload)
  }
}
```

### 异步 Actions

异步 actions 同样使用函数定义：

``` js
// ...
actions: {
  incrementAsync: ({ dispatch }, x) => {
    setTimeout(() => {
      dispatch('INCREMENT', x)
    }, 1000)
  }
}
```

举个更实在的例子，比如一个购物车。当用户结账时，我们可能需要在 checkout 这一个 action 中触发多个不同的 mutations：一个在开始检查购物车时触发，一个在成功后触发，还有一个在失败时触发。

``` js
// ...
actions: {
  checkout: ({ dispatch, state }, products) => {
    // 保存结账前的购物车内容
    const savedCartItems = [...state.cart.added]
    // 发出结账的请求，并且清空购物车
    dispatch(types.CHECKOUT_REQUEST)
    // 假设我们的后台 API 接受一个成功回调和一个错误回调
    shop.buyProducts(
      products,
      // 结账成功
      () => dispatch(types.CHECKOUT_SUCCESS),
      // 结账失败，将购物车恢复到结账之前的状态
      () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

这里有相对复杂的异步逻辑，但是购物车的组件依然只需要简单地调用 `store.actions.checkout(products)` 即可.

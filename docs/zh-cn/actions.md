# Actions

Actions 是用于 dispatch mutations 的函数。Actions 可以是异步的，一个 action 可以 dispatch 多个 mutations.

一个 action 描述了有什么事情应该发生，把本应该在组件中调用的逻辑细节抽象出来。当一个组件需要做某件事时，只需要调用一个 action —— 并不需要关心 到底是 callback 还是一个返回值，因为 actions 会把结果直接反应给 state，state 改变时会触发组件的 DOM 更新 —— 组件完全和 action 要做的事情解耦。

因为，我们通常在 actions 中做 API 相关的请求，并把『组件调用 actions、mutations 被 actions 触发』过程中的异步请求隐藏在其中。

> Vuex actions 和 flux 中的 "actions creators" 是一样的，但是我觉得 flux 这样的定义会让人更疑惑。

### 简单的 Actions

通常一个 action 触发一个 mutation. Vuex 提供一个捷径去定义这样的 actions:

``` js
const vuex = new Vuex({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state += x
    }
  },
  actions: {
    // shorthand
    // 只要提供 mutation 名
    increment: 'INCREMENT'
  }
})
```

调用 action:

``` js
vuex.actions.increment(1)
```

这相当于调用：

``` js
vuex.dispatch('INCREMENT', 1)
```

注意所以传递给 action 的参数同样会传递给 mutation handler.

### Thunk Actions

当 actions 里存在逻辑或者异步操作时怎么办？我们可以定义 **Thunks(返回另一个函数的函数) actions**:

``` js
const vuex = new Vuex({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state += x
    }
  },
  actions: {
    incrementIfOdd: function (x) {
      return function (dispatch, state) {
        if ((state.count + 1) % 2 === 0) {
          dispatch('INCREMENT', x)
        }
      }
    }
  }
})
```

在这里，外部的函数接受传递进来的参数，之后返回一个带两个参数的函数：第一个参数是 `dispatch` 函数，另一个是 `state`. 我们在这里用 ES2015 语法中的箭头函数简化代码，使其更清晰好看：

``` js
// ...
actions: {
  incrementIfOdd: x => (dispatch, state) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch('INCREMENT', x)
    }
  }
}
```

下面是更简单的语法糖：

``` js
actions: {
  increment: 'INCREMENT'
}
// ... 相当于：
actions: {
  increment: (...args) => dispatch => dispatch('INCREMENT', ...args)
}
```

Why don't we just define the actions as simple functions that directly access `vuex.state` and `vuex.dispatch`? The reason is that such usage couples the action functions to the specific vuex instance. By using the thunk syntax, our actions only depend on function arguments and nothing else - this important characteristic makes them easy to test and hot-reloadable!

???

### 异步 Actions

我们能像 thunk 一样定义异步 actions

``` js
// ...
actions: {
  incrementAsync: x => dispatch => {
    setTimeout(() => {
      dispatch('INCREMENT', x)
    }, 1000)
  }
}
```

当在检查购物车时，更好的做法是触发多个不同的 mutations：一个在开始检查购物车时触发，一个在成功后触发，还有一个在失败时触发。

``` js
// ...
actions: {
  checkout: products => (dispatch, state) => {
    // save the current in cart items
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    dispatch(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => dispatch(types.CHECKOUT_SUCCESS),
      // handle failure
      () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

这样一来，所以需要检查购物车的组件只需要调用 `vuex.actions.checkout(products)`.

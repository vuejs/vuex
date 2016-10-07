# Actions

Action 跟 mutation 类似，两者的区别是：

- Mutation 修改状态，action 则提交（一个或多个） mutation。
- Action 可以随意包含异步操作。

我们来注册一个简单的 action：

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

Action 处理器接收一个上下文对象（作为参数），该对象提供了跟 store 实例一样的 方法/属性，所以你可以调用 `context.commit` 来提交一个 mutation，或者访问 `context.state` 来访问状态和 getter。我们在稍后介绍的 [modules](modules.md) 章节会看到为什么这个上下文对象不是 store 实例本身。

实际上，我们一般都会使用 ES2015 的 [参数解构](https://github.com/lukehoban/es6features#destructuring) 来简化一点点代码 （特别是多次调用 `commit` 的时候）：

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### 分发 Actions

Action 通过 `store.dispatch` 方法来触发：

``` js
store.dispatch('increment')
```

咋看起来有点无语：如果我们要增加计数，为什么不直接简单地调用 `store.commit('increment')` 呢？**mutation 必须是同步的**，action 则不须要，记起来了吗？我们可以在 action 内执行 **异步** 操作：

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Action 分发同样支持参数对象格式和对象风格：

``` js
// 带有参数对象的分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 通过一个对象来分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

一个更实际的 action 例子：action 用来结算购物车，它包含了 **调用异步 API** 和 **提交多个 mutation**：

``` js
actions: {
  checkout ({ commit, state }, payload) {
    // 把当前商品保存到商品列表
    const savedCartItems = [...state.cart.added]
    // 发出结算请求，然后乐观地处理
    // 清空购物车
    commit(types.CHECKOUT_REQUEST)
    // shop API 接收一个成功和一个失败的回调
    shop.buyProducts(
      products,
      // 处理成功 success
      () => commit(types.CHECKOUT_SUCCESS),
      // 处理失败
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

要注意的是，我们正在执行一些异步操作的工作流，然后通过提交 mutation 来记录 action 引起的副作用（状态变更）。

### 组件内分发 Action

在组件中，可以通过 `this.$store.dispatch('xxx')`来分发 action，或者是用 `mapActions` 工具来映射组件方法到 `store.dispatch` 的调用（需要根实例配置 `store`）：

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
```

### 组合多个 Action

Action 常常是异步的，所以我们如何知道一个 action 已经完成？还有更重要的，如何组合多个 action 来处理更复杂的异步工作流？

首先要知道的是，`store.dispatch` 会将 action 处理器返回的值作为返回值，所以你可以在 action 处理器返回一个 Promise：

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

于是你可以：

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

在另一个 action 也一样：

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

最后，如果我们使用 [async / await](https://tc39.github.io/ecmascript-asyncawait/)，一个很快会成标准的 JavaScript 特性，我们就能像下面这样组合我们的 action：

``` js
// 结社 getData() 和 getOtherData() 返回 Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

> 对于 `store.dispatch` 来说，有可能在不同模块间触发多个 action。这种情况下，返回的值得是一个 Promise，它会在所有触发的 action 处理器都被 resolve 完之后再 resolve。

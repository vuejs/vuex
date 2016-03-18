# 快速开始

每一个基于 Vuex 的应用的核心就是 **store**. "store" 基本上就是一个装有你的应用的大部分 **状态**(即 **state**)的容器. Vuex 和普通的全局对象有以下两点不同：

1. Vuex 的状态存储是动态的. 当 Vue 组件从 store 中的 state 读取状态的时候, 如果 store 中的 state 改变，那么响应的组件也会动态并高效的改变.

2. 你不能直接改变 store 中的 state. 改变 store 中的 state 的唯一途径就是明确的 dispatch **mutations** 事件. 这样使得每一个状态的变化冻很容易追踪, 并且能够让我们通过工具更了解应用内部的状态.

### 最简单的 store

> **注意:** 在接下来的文档中，我们将会在后面的例子中使用 ES2015 的语法。如果你还没能掌握 ES2015，[你应该这样](https://babeljs.io/docs/learn-es2015/)! 文档同样也认为你已经熟悉了 [Building Large-Scale Apps with Vue.js](http://vuejs.org/guide/application.html) 中所涉及的概念.

创建 Vuex 的 store 相当直截了当 - 只要提供一个初始化的 state 对象，以及一些 mutations：

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

const store = new Vuex.Store({
  state,
  mutations
})
```

现在，你可以通过 `store.state` 来读取状态对象，还可以通过 dispatch mutation 的名字来触发改变：

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

如果你更喜欢对象风格的 dispatch，你也可以这么做：

``` js
// 同上例效果
store.dispatch({
  type: 'INCREMENT'
})
```

再次强调，我们通过 dispatch 一个 mutation 而不是直接改变 `store.state.count`，是因为我们想要明确追踪状态的变化。这个简单的约定，能够让你不会状态混乱，这让应用状态改变的时候，在代码中能够更好的定位。此外，这样也给了我们机会通过工具来记录每次状态改变、状态快照、甚至像时间旅行一样调试。

这里只是一个最简单的理解展示 store 的状态存储。但是 Vuex 不仅仅是状态存储。接下来，我们将会深入探讨一些核心概念：[State](state.md), [Mutations](mutations.md) 和 [Actions](actions.md).

# 起步

所有 Vuex 应用的中心就是 **store（状态存储）**。"store" 本质上就是一个掌握了应用状态的容器。这里有两个点，让 Vuex 的 store 与普通的全局对象不一样：

1. Vuex 的状态存储是响应式的. 如果 Vue 组件从 store 中读取状态, 那么当 store 中的状态发生变化时，相应组件也会响应，并且高效地更新。

2. 你不能直接修改 store 中的状态，而是通过唯一的方式 —— 明确的 **committing mutations（提交修改）**。这就保证了每个状态变更都留下可跟踪的记录，并且可以使用工具帮助我们更好地了解我们的应用。

### 最简单的 Store

> **注意:** 后面所有例子代码将使用 ES2015 语法编写，如果你还没用上，[那你应该用用](https://babeljs.io/docs/learn-es2015/)!

[安装](installation.md) Vuex之后，我们来创建一个 store。非常简单 - 提供初始的状态对象，以及一些 mutation：

``` js
// 如果你在模块化工程中使用，确保先调用 Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

现在你可以通过 `store.state` 访问状态对象，然后通过 `store.commit` 方法来触发一个状态改变：

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

再次说明，我们不直接修改 `store.state.count` 而是提交一个 mutation 的原因是，想要明确地跟踪它。这种简单的约定让你的意图更加明确，当你阅读代码的时候，可以更好的理解应用中的状态变化。另外，这也让我们有机会去实现一些工具，记录修改日志、保存状态快照、甚至是进行基于时间轴的调试。

因为 store 的状态是响应式的，要在组件中使用 store 的状态，只需在 computed 属性中返回 store 的状态。而触发状态改变可以简单的理解为在组件方法中提交 mutation。

这里是一个例子: [最基础的 Vuex 计数器应用](https://jsfiddle.net/yyx990803/n9jmu5v7/).

接下来，我们将讨论每个核心概念，给出更详细的解释，那么先从 [State（状态）](state.md)开始吧。
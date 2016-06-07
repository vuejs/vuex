# 准备开始

每一个 Vuex 应用的核心就是 **store**（仓库）。"store" 基本上就是一个容器，它包含着你应用里大部分的 **状态**(即 **state**). Vuex 和单纯的全局对象有以下两点不同：

1. Vuex 的状态存储是响应式的. 当 Vue 组件从 store 中读取状态的时候, 若 store 中的状态发生变化，那么相应的组件也会相应地高效地得到更新.

2. 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地分发 **状态变更事件**(explicitly dispatching **mutations**)。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 最简单的 store

> **注意**：我们将会在后续的文档中用 ES2015 语法进行案例展示。如果你还没能掌握 ES2015，[你得抓紧了](https://babeljs.io/docs/learn-es2015/)！本文同样假设你已经了解了 Vue 本体的官方文档中[构建大型应用](http://vuejs.org.cn/guide/application.html)章节所涉及的概念.

创建 Vuex store 的过程相当直截了当 - 只要提供一个初始化的 state 对象，以及一些 mutations：

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

export default new Vuex.Store({
  state,
  mutations
})
```

现在，你可以通过 `store.state` 来读取 `state` 对象，还可以通过 dispatch 某 mutation 的名字来触发这些状态变更：

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

如果你倾向于对象风格的分发方式，你可以用这种语法：

``` js
// 效果同上
store.dispatch({
  type: 'INCREMENT'
})
```

再次强调，我们通过分发 mutation 的方式，而非直接改变 `store.state.count`，是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。

以上只是一个用来展示 store 究竟是什么的一个极简例子。但是 Vuex 可不仅仅是状态存储。接下来，我们将会更深入地探讨一些核心概念：[State（状态）](state.md)，[Mutations（变更）](mutations.md) 和 [Actions（动作）](actions.md)。

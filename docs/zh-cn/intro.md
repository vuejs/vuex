# Vuex 是什么？

Vuex  是 **状态管理的编程模式 + 工具库**，适用于 Vue.js 编写的应用。它作为一个集中化的 store （状态存储），服务于应用中的所有组件，其中的规则保证了状态只会在可预测的方式下修改。另外，它能与 Vue 官方提供的 [devtools 扩展](https://github.com/vuejs/vue-devtools) 集成，提供高级功能，如，无需配置就可以基于时间轴调试，以及状态快照的 导入 / 导出。

### "状态管理模式" 是什么?

我们先从一个简单的 Vue 计数器 应用开始：

``` js
new Vue({
  // state 状态
  data () {
    return {
      count: 0
    }
  },
  // view 视图
  template: `
    <div>{{ count }}</div>
  `,
  // actions （动作）
  methods: {
    increment () {
      this.count++
    }
  }
})
```

It is a self-contained app with the following parts:

- **state（状态）**，单一的数据源，驱动我们的应用。
- **view（视图）**，也就是声明定义如何从 **state** 映射到界面。
- **actions（动作）**，在响应 **视图** 的用户输入时，所有可能修改状态的方式。

这是一个非常简单的例子，体现了『单向数据流』的核心：

<p style="text-align: center; margin: 2em">
  <img style="max-width:450px;" src="./images/flow.png">
</p>

当我们有 **多个组件使用公共状态** 时，最简单快速的方式就是：

- 多个视图依赖同一份状态。
- 不同视图的动作需要修改同一份状态。

那么第一个问题来了，在深层嵌套的组件间传递属性是很繁琐的，并且不能简单地在同级组件之间传递。接着第二个问题是，我们常常诉诸于这样的解决方案：直接引用 父/子 实例，又或是通过事件来修改和同步多分状态副本，用这样的方式编写的程序是很脆弱的，并且很快导致不可维护。

所以，为什么不把共享的状态从组件分离出来，然后在一个全局单例中管理呢？这样，我们的组件树就变成一个大 "视图"，无论树中的组件处在哪个位置，它都能访问状态或者触发动作。

另外，通过定义和分离状态管理中的概念、强制使用某些规则，同时也让我们的代码结构清晰，并且容易维护。

这是 Vuex 背后的基本思想，受到 [Flux](https://facebook.github.io/flux/docs/overview.html)、[Redux](http://redux.js.org/) 和 [The Elm Architecture](https://guide.elm-lang.org/architecture/) 所启发。
不像其他模式， Vuex 也是一个库，专门为 Vue.js 定制，充分利用了它微妙地响应式机制，从而实现高效更新。

![vuex](./images/vuex.png)

### 什么时候该使用？

虽然 Vuex 帮助处理了共享状态管理，但是它也额外地带来了一些概念和代码，这需要你在短期和长期的效益之间作取舍。

如果你没有开发过大型的单页应用就立刻上 Vuex，可能会觉得繁琐然后排斥，这是很正常的 —— 如果是个简单的应用，大多数情况下，不用 Vuex 还好，你要的可能就是个简单的 [全局事件总线](http://vuejs.org/guide/components.html#Non-Parent-Child-Communication)。不过，如果你构建的是一个 中大型 单页应用，当你在考虑如何更好的在 Vue 组件外处理状态时，Vuex 自然就是你的下一步选择。Redux 的作者有一句话说的不错：

> Flux libraries are like glasses: you’ll know when you need them.（Flux 库正如眼镜：当你需要它们的时候，你就懂了。）

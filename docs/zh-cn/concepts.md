# 核心概念

和 Vue 一样，Vuex 暴露一个 `Vuex` 构造函数，你可以实例化一个 `Vuex 实例`。一般情况下，一个应用中只需要一个 Vuex 实例。你可以把它当成一个『强化版的 store』。

每个 Vuex 实例由三个部分组成：

- **State**: 一个反映应用状态的纯对象。

- **Mutations**: 一些用于改变状态的函数。Mutations **一定是同步的**。

- **Actions**: 一些用于触发 (dispatch) mutations 的函数。一个 action 可以包含异步操作，并且可以触发多个 mutations.

我们把 *mutations* 和 *actions* 分开而不是直接用函数去操作 state，原因是我们希望把 mutation 和异步操作分离。许多应用之所以复杂，正是源自于这两者的耦合。我们解耦两者后，它们都会变得更清晰和易于测试。

> 如果你熟悉 Flux，在这里要注意两者的一些差异：Vuex mutations 相当于 Flux 的 **actions**, 而 Vuex 的 actions 相当于 Flux 的 **action creators**.

### 创建一个 Vuex 实例

> **NOTE:** 我们将用 ES2015 语法写接下来的示例代码。如果你还没开始接触 ES2015，那么你应该[现在就开始用](https://babeljs.io/docs/learn-es2015/)! 我们还默认你已经熟悉 [Building Large-Scale Apps with Vue.js](http://vuejs.org/guide/application.html) 中所提到的概念。

创建一个 Vuex 实例非常简单——只需要把以上提到的三个部分放到一起：

``` js
import Vuex from 'vuex'

const vuex = new Vuex({
  state: { ... },
  actions: { ... },
  mutations: { ... }
})
```

实例化后，你就能通过 `vuex.state` 访问 state, 通过 `vuex.actions` 访问 actions 函数。你不能直接访问 mutation 函数 —— 你只能通过调用 actions 或是 `vuex.disptach()` 来触发 mutations。接下来我们会更详细地讨论这几个概念。

# Mutations

Mutations 本质上是一个事件系统：每个 mutation 都有一个 **事件名 (name)** 和 一个 **回调函数 (handler)**. 任何一个 Mutation handler 的第一个参数永远为所属 store 的整个 state 对象：

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // 改变 state
      state.count++
    }
  }
})
```

用全部大写命名 mutation 是一个惯例，方便将它和 actions 区分开。

你不能直接调用 mutation handler. 这里传入 Store 构造函数的选项更像是在注册事件回调：『当 `INCREMENT` 事件被触发时，调用这个 handler』。触发 mutation handler 的方法是 dispatch 一个 mutation 的事件名：

``` js
store.dispatch('INCREMENT')
```

### 带参数的 dispatch

`store.dispatch` 可以接受额外的参数：

``` js
// ...
mutations: {
  INCREMENT (state, n) {
    state.count += n
  }
}
```
``` js
store.dispatch('INCREMENT', 10)
```

这里的 `10` 会紧跟着 `state` 作为第二个参数被传递到 mutation handler. 所有额外的参数被称为该 mutation 的 payload.

### Object 风格的 Dispatch

> 需要版本 >=0.6.2

你也可以传入对象来 dispatch mutation 操作：

``` js
store.dispatch({
  type: 'INCREMENT',
  payload: 10
})
```

注意，当使用对象风格参数时，你应该把全部传入参数作为对象的属性传入。整个对象都会被作为 mutation 函数的第二个参数被传入：

``` js
mutations: {
  INCREMENT (state, mutation) {
    state.count += mutation.payload
  }
}
```

### 静默 Dispatch

> 需要版本 >=0.6.3

在某些情景中，你也许并不想中间件去记录 state 的变化。在短周期内对 state 的多次 disptach 或轮询并非总需要被追踪。在这种情况下，可以考虑静默掉这些 mutations。  

*注意：* 在关键时应该避免这样使用。静默 mutations 破坏了所有 state 变化都会被 devtool 追踪的约定。请在必须的情况下少量使用。

`silent` 标志可以使得 dispatch 不去命中中间件。

``` js
/**
 * 示例: 进度 action.
 * 不必被追踪改变的频繁 Dispatch
 **/
export function start(store, options = {}) {
  let timer = setInterval(() => {
    store.dispatch({
      type: INCREMENT,
      silent: true,
      payload: {
        amount: 1,
      },
    });
    if (store.state.progress === 100) {
      clearInterval(timer);
    }
  }, 10);
}
```

### Mutations 应当遵守 Vue 的响应系统规则

由于 Vuex store 内部的 state 对象被 Vue 改造成了响应式对象，当我们对 state 进行修改时，任何观测着 state 的 Vue 组件都会自动地进行相应地更新。但同时，这也意味着在 Vuex 的 mutation handler 中修改状态时也需要遵循 Vue 特有的一些注意点：

1. 尽可能在创建 store 时就初始化 state 所需要的所有属性；（就像创建 Vue 实例时应当初始化 `data` 一样）

2. 当添加一个原本不存在的属性时，需要：

  - 使用 `Vue.set(obj, 'newProp', 123)`；或者 -

  - 拷贝并替换原本的对象。利用 stage 2 的语言特性 [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread)，我们可以使用这样的语法:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### 用常量为 Mutations 命名

为了可以使 linters 之类的工具发挥作用，通常我们建议使用常量去命名一个 mutation, 并且把这些常量放在单独的地方。这样做可以让你的代码合作者对整个 app 包含的 mutations 一目了然：

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  actions: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

用不用常量取决于你 —— 在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

### mutation 必须是同步函数

一条重要的原则就是要记住** mutation 必须是同步函数**。为什么？请参考下面的例子：

``` js
mutations: {
  SOME_MUTATION (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

现在想象，我们正在 debug 一个 app 并且观察我们的 mutation 日志。每一条 mutation 被记录，我们都想要能够将快照中前一状态和后一状态对比。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回掉函数还没有被调用，我们不知道什么时候回调函数实际上被调用。实质上任何在回调函数中进行的的状态的改变都是不可追踪的。

### 下一步：Actions

在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你能调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，我们将全部的改变都用同步方式实现。我们将全部的异步操作都放在[Actions](actions.md)中。

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
vuex.dispatch('INCREMENT', 10)
```

这里的 `10` 会紧跟着 `state` 作为第二个参数被传递到 mutation handler. 所有额外的参数被称为该 mutation 的 payload.

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

### 下一步：Actions

到目前为止，我们都通过手动调用 `vuex.dispatch` 来触发 mutations。这样做固然可以，但实际上在组件里我们将会很少这样做。一般我们会通过调用 [actions](actions.md) 来触发 mutations。在 actions 里，我们可以封装异步数据请求之类的复杂逻辑。

最后，切记所有 mutation handler 必须是 **同步** 的。异步的请求都应该在 actions 里处理。

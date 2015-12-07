# Mutations

Vuex mutations 是必要的 events：每个 mutation 都有一个 **name** 和 一个 **handler**. Handler 的第一个参数为整个 state 树：

``` js
import Vuex from 'vuex'

const vuex = new Vuex({
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

用大定命名 mutation 是为了将它和 actions 区分开。

你不能直接调用 mutation handler. 这里的 options 更像是一种事件注册：『当 `INCREMENT` 事件被触发时，调用这个 handler』。引出 mutaion handler 的方法是 dispatch 一个 mutation 事件：

``` js
vuex.dispatch('INCREMENT')
```

### 带参数的 dispatch

It is also possible to pass along arguments:

dispatch 可以带参数：

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

这里的 `10` 会紧跟着 `state` 作为第二个参数被传递到 mutation handler. 和所有额外的参数一样，这些参数被称为 mutation 的 payload.

### 遵守 Vue 响应规则的 mutations

Since Vuex's state is made reactive by Vue, when we mutate the state, Vue components observing the state will update automatically. This also means Vuex mutations are subject to the same reactivity caveats when working with plain Vue:

1. Prefer initializing your Vuex initial state with all desired fields upfront.
2. When adding new properties to an Object, you should either use `Vue.set(obj, 'newProp', 123)`, or replace that Object with a fresh one, e.g. `state.obj = { ...state.obj, newProp: 123 }` (Using stage-2 [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) here).

???

### 用常量为 mutation 命名

为了可以使 linters 之类的工具发挥作用，通常我们建议使用常量去命名一个 mutation, 并且把这些常量放在单独的地方。这样做可以让你的代码合作者对整个 app 的 mutations 一目了然：

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// vuex.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const vuex = new Vuex({
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

用不用常量取决于你 —— 事实上这样做大多数开发者很有帮助。但如果你不喜欢，你完全可以不这样做。

### On to Actions

???

手动调用 `vuex.dispatch` 当然可以，但我们很少在组件里这样做，一般我们会调用 [actions](actions.md)。在 actions 里封装着异步数据请求之类的复杂逻辑。

最后，要记得：所有 mutation handler 必须是 **同步** 的。异步的请求都应在 actions 里。

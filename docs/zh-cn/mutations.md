# Mutations

唯一真正改变 Vuex store 状态的方式就是通过提交一个 mutation。Vuex 的 muatation 跟事件非常像：每个 mutation 有一个 **类型**（字符串） 和 一个 **处理器**。处理器方法就是真正修改状态的地方，并且它会接收 state 作为第一个参数：

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 修改状态
      state.count++
    }
  }
})
```

你不能直接调用一个 mutation 处理器，这里的做法更像是事件注册：『当一个 `increment` 类型的 mutation 触发时，调用这个处理器。』要调用一个 mutation，就得用调用 **store.commit** mutation 的类型。

``` js
store.commit('increment')
```

### Commit with Payload

你可以给 `store.commit` 传入额外的参数，称之为 mutation 的 **payload**：

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('INCREMENT', 10)
```

大多数情况下，payload 应该是一个对象，这样就可以包含多个字段了，然后记录 mutation 时也更方便描述：

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### 对象风格的 Commit

另一种提交 mutation 的方式就是直接使用一个带有 `type` 属性的对象：

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交，整个对象会被传入作为 mutation 处理器的 payload，所以处理器跟之前一样：

``` js
mutations: {
  INCREMENT (state, payload) {
    state.count += payload.amount
  }
}
```

### Silent Commit

> 注意：一旦我们在 devtools 中实现了 mutation 过滤，那么这个功能很可能就会被移除。

默认情况下，每个提交的 mutation 会发送到插件（如 devtools）。不过有些情况，你不希望插件记录每一个状态变化。像是短时间内多次提交到 store 或者是轮询操作，并不都需要记录跟踪。那么你可以传递第三个参数给 `store.commit`，让该 mutation 在插件中 "安静"。

``` js
store.commit('increment', {
  amount: 1
}, { silent: true })

// 对象风格的提交
store.commit({
  type: 'increment',
  amount: 1
}, { silent: true })
```

### Mutations 遵循 Vue 的响应式机制

Vuex 的 store 状态通过 Vue 作成响应式的，当我们修改状态的时候，组件侦测到状态变化后会自动更新。这也意味着，Vuex 的 mutation 要跟单纯的 Vue 一样遵循相同的响应式规则约束。

1. 最好在初始化 store 的初始状态时，直接给出所有需要的字段。

2. 当给一个对象添加新属性时，你要

  - 使用 `Vue.set(obj, 'newProp', 123)`，或者 -

  - 用一个新对象替换。例如使用 stage-2 阶段的[对象解构赋值语法](https://github.com/sebmarkbage/ecmascript-rest-spread)，我们就能像下面这样编码:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### 使用不变常量命名 Mutation

在各种不同的 Flux 实现中，使用不变常量来命名 Mutation 类型是常见的方式。这就可以让代码充分使用 linter 等工具，然后把所有常量放到一个文件中，让你的伙伴们看一眼就知道整个应用的 mutation：

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
  mutations: {
    // 我们使用 ES2015 计算属性名的特性
    // 使用一个常量作为方法名
    [SOME_MUTATION] (state) {
      // 修改状态
    }
  }
})
```

是否使用常量是见仁见智的 —— 在多人开发的大型项目中是有用的，如果你不喜欢，完全可以不用。

### Mutation 一定是同步的

要记住一个重要的规则， **mutation 处理器方法必须是同步的**。为什么呢？看看下面的例子：

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

设想一下我们正在调试程序，然后查看 devtools 的 mutation 记录。对于每一个 mutation 记录， devtool 会捕捉状态的『前』、『后』快照，不过上面例子中，mutation 里的异步回调导致无法实现：回调在 mutation 提交后没有立刻执行，并且 devtool 无法知道这个回调何时执行 —— 本质上，所有在回调中执行的修改都是无法跟踪的！

### 在组件中提交 Mutation

你可以在组件中通过 `this.$store.commit('xxx')` 来提交 mutation，或者是使用 `mapMutations` 工具来映射组件的方法到 `store.commit` 调用（需要在根组件配置 `store`）：

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```

### 走进 Action

异步修改状态会让程序变得很难理解。例如，当你调用两个调用方法，异步修改状态，你怎么知道他们什么时候被调用，哪个回调先调用呢？这正是我们为什么要这两个概念区分开来的原因。在 Vuex 里，**mutations 是同步的事务**：

``` js
store.commit('increment')
// "increate" mutation 引起的所有状态变化any state change that the "increment" mutation may cause
// 都应在这一时刻完成
```

想要处理异步操作，那我们来介绍下 [Actions](actions.md)。

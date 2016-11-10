# Modules

使用单一状态树，导致应用的所有状态集中到一个很大的对象。但是，当应用变得很大时，store 对象会变得臃肿不堪。

为了解决以上问题，Vuex 运行我们将 store 分割到**模块（module）**。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

### 模块的本地状态

对于模块内部的 mutation 和 getter，接收的第一个参数是**模块的本地状态**。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state 模块的本地状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

同样，对于模块内部的 action，`context.state` 是本地状态，根节点的状态是 `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

对于模块内部的 getter，根节点状态会作为第三个参数：

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空间

模块内部的 action、mutation、和 getter 现在仍然注册在**全局命名空间**——这样保证了多个模块能够响应同一 mutation 或 action。你可以通过添加前缀或后缀的方式隔离各模块，以避免名称冲突。你也可能希望写出一个可复用的模块，其使用环境不可控。例如，我们想创建一个 `todos` 模块：

``` js
// types.js

// 定义 getter、action、和 mutation 的名称为常量，以模块名 `todos` 为前缀
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// 实用添加了前缀的名称定义 getter、action 和 mutation
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

### 模块动态注册

在 store 创建**之后**，你可以使用 `store.registerModule` 方法注册模块：

``` js
store.registerModule('myModule', {
  // ...
})
```

模块的状态将是 `store.state.myModule`。

模块动态注册功能可以让其他 Vue 插件为了应用的 store 附加新模块，以此来分割 Vuex 的状态管理。例如，[`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 插件可以集成 vue-router 与 vuex，管理动态模块的路由状态。

你也可以使用 `store.unregisterModule(moduleName)` 动态地卸载模块。注意，你不能使用此方法卸载静态模块（在创建 store 时声明的模块）。

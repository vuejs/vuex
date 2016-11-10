# Modules（模块）

由于使用了单一状态树，应用的所有状态都包含在一个大对象中。那么，随着应用的不断扩展，store 会变得非常臃肿。

为了解决这个问题，Vuex 允许我们把 store 分 **module（模块）**。每一个模块包含各自的状态、mutation、action 和 getter，甚至是嵌套模块 —— 代码轮廓就长下面这样：

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

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### 本地状态模块化

对于模块内的 mutation 和 getter，接收的第一个参数是 **模块的本地状态**，而不是总的根状态。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state, rootState) {
      // state 是本地模块的状态
      state.count++

      // rootState 作为第二个参数传入，但是你不要
      // 在一个模块内修改它
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

类似地，模块 action 中，`context.state` 将暴露为本地状态，而总的根状态会暴露为 `context.rootState`：

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

同样地，模块 getters 中，总的根状态会通过第三个参数穿入：

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

要注意，模块内的 action、mutation 以及 getter 依然注册在 **全局命名空间** 中 —— 这就会让多个模块响应同一种 mutation/action 类型。你可以在模块的名称中加入前缀或者后缀来设定命名空间，从而避免命名冲突。如果你的 Vuex 模块是一个可复用的，执行环境也未知的，那你就应该这么干了。距离，我们想要创建一个 `todo` 模块：

``` js
// types.js

// 定义  getter、 action 和 mutation 的名称为常量
// 并且加入模块名称 `todos` 作为前缀
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// 用带前缀的名称定义 getter、action 和 mutations 
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

### 注册动态模块

你可以用 `store.registerModule` 方法在 store 创建 **之后** 注册一个模块：

``` js
store.registerModule('myModule', {
  // ...
})
```

模块的状态就会暴露为 `store.state.myModule`。

动态注册模块可以让其他 Vue 插件通过给应用的 store 关联一个模块来使用 Vuex 的状态管理。例如，[`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 库，通过在一个动态注册的模块中管理应用的路由状态，从而将 vue-router 和 vuex 集成。

你还可以通过 `store.unregisterModule(moduleName)` 移除一个动态注册的模块。要注意，你不能用这个方法移除静态的模块（在 store 创建的时候声明的）。

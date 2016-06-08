# 应用结构

Vuex 并不限制你的代码结构，但是制定了一套需要遵守的规则：

1. 应用 state 存在于单个对象中；
2. 只有 mutation handlers 可以改变 state；
3. Mutations 必须是同步的，它们做的应该仅仅是改变 state；
4. 所有类似数据获取的异步操作细节都应封装在 actions 里面。
5. 组件通过 getters 从 store 中获取 state，并通过调用 actions 来改变 state。

Vuex actions 和 mutations 优雅的地方在于 **它们都只是一些函数**。只需要遵循以上的准则，怎么组织代码就取决于你自己了。不过，遵循一些规则能够让你更快地熟悉其他使用 vuex 的项目。这里介绍了一些适应不同项目规模的应用结构。

### 简单的项目

在简单的项目里，我们可以把 **actions** 和 **mutations** 分离到各自的文件：

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js     # exports the vuex instance
    ├── actions.js   # exports all actions
    └── mutations.js # exports all mutations
```

参见[计数器 示例](https://github.com/vuejs/vuex/tree/master/examples/todomvc) 或 [TodoMVC 示例](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

另外，你也可以将 mutations 拆分到不同的文件中去。

### 中型到大型项目

对于有一定规模的项目，我们会希望把 Vuex 相关的代码分割到多个『模块 (module)』当中去，每一个 module 负责应用的一个领域（和原始 Flux 中的多个 store 类似）。在 Vuex 中，一个模块所要做的其实也就是导出 state 的一部分（可以理解为一颗子树），以及和该部分 state 相关的所有 mutations：

???

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── actions.js        # exports all actions
    ├── store.js          # where we assemble modules and export the store
    ├── mutation-types.js # constants
    └── modules
        ├── cart.js       # state and mutations for cart
        └── products.js   # state and mutations for products
```

一个典型的模块：

``` js
// store/modules/products.js
import { RECEIVE_PRODUCTS, ADD_TO_CART } from '../mutation-types'

// 该模块的初始状态
const state = {
  all: []
}

// 相关的 mutations
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  },

  [ADD_TO_CART] (state, productId) {
    state.all.find(p => p.id === productId).inventory--
  }
}

export default {
  state,
  mutations
}
```

在 `vuex/store.js` 里我们把多个模块集合在一起来创建 Vuex 实例：

``` js
import Vue from 'vue'
import Vuex from '../../../src'
import * as actions from './actions'
// 导入各个模块的初始状态和 mutations
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // 组合各个模块
  modules: {
    cart,
    products
  }
})
```
在这里，`cart` 模块的初始状态会作为 `store.state.cart` 被设置到底层 state 树上。另外，**所有在子模块上定义的 mutations 都只能改变当前相关联子模块上的 state 子树**。所以在 `cart` 模块上定义的 mutations 接收到的第一个参数将会是 `store.state.cart`。

state 子树的根节点不能在模块内部改写。比如这样的写法是无效的：

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

可替代的写法是将真实的 state 作为子树本身的属性在存储：

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

由于一个模块导出的仅仅是对象和函数，它们也是非常易于测试和维护的。当然，你也可以按你的喜好和需求对这样的组织方式进行修改。

需要注意的一点：我们并不把 actions 放在模块里面，因为一个 action 可能需要触发影响多个模块的 mutations。同时，actions 本来就应该和具体的状态以及 mutations 解耦。如果单独的 actions 文件变得太过庞大，我们也可以划分出一个 actions 文件夹并将 actions 分散到多个文件中。

参见 [购物车示例](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart)。

### 提取共用的 Computed Getters

在大型项目中，你可能会发现有多个组件使用相似的计算属性来获取 state。由于计算属性的 getters 也只是普通函数，你可以把它们独立出来放在一个单独的文件里，以实现在多个组件之间的共享：

``` js
// getters.js
import store from './store'

export function filteredTodos () {
  return store.state.messages.filter(message => {
    return message.threadID === vuex.state.currentThreadID
  })
}
```

``` js
// in a component...
import { filteredTodos } from './getters'

export default {
  computed: {
    filteredTodos
  }
}
```

这和 [NuclearJS 中的 Getters 概念](https://optimizely.github.io/nuclear-js/docs/04-getters.html) 非常相似。

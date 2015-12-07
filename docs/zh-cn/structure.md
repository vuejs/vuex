# 应用结构

Vuex 并非限制你的代码结构，而是遵循一些观点：

1. 应用 state 存在于单个对象中
2. 只有 mutation handlers 可以改变 state
3. Mutations 必须是同步的，它们做的应该仅仅是改变 state
4. 所有类似数据获取的异步操作细节都应在 actions 里

Vuex actions 和 mutations 很好的地方在于 **他们都仅仅是函数**。你只需要遵循以上的准则，怎么组织代码就取决于你自己了。最简单的 Vuex 实例甚至只需要在 [单个文件](https://github.com/vuejs/vuex/blob/master/examples/counter/vuex.js) 中声明！然而这对于很多项目来说并不够，所以这里有些根据不同应用规模推荐的不同结构。

### 简单的项目

在简单的项目里，我们可以把 **actions** 和 **mutations** 分离到各自的文件：

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── index.js     # exports the vuex instance
    ├── actions.js   # exports all actions
    └── mutations.js # exports all mutations
```

一个真实的 [TodoMVC 例子](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

### Medium to Large Project

### 逐渐复杂的项目

For any non-trivial app, we probably want to further split Vuex-related code into multiple "modules" (roughly comparable to "stores" in vanilla Flux), each dealing with a specific domain of our app. Each module would be managing a sub-tree of the state, exporting the initial state for that sub-tree and all mutations that operate on that sub-tree:

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
    ├── actions.js # exports all actions
    ├── index.js
    ├── modules
    │   ├── cart.js       # state and mutations for cart
    │   └── products.js   # state and mutations for products
    └── mutation-types.js # constants
```

一个典型的模块：

``` js
// vuex/modules/products.js
import { RECEIVE_PRODUCTS, ADD_TO_CART } from '../mutation-types'

// initial state
export const productsInitialState = []

// mutations
export const productsMutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.products = products
  },

  [ADD_TO_CART] ({ products }, productId) {
    const product = products.find(p => p.id === productId)
    if (product.inventory > 0) {
      product.inventory--
    }
  }
}
```

在 `vuex/index.js` 里我们把多个模块集合在一起来创建 Vuex 实例：

``` js
import Vue from 'vue'
import Vuex from '../../../src'
import * as actions from './actions'
// import parts from modules
import { cartInitialState, cartMutations } from './modules/cart'
import { productsInitialState, productsMutations } from './modules/products'

Vue.use(Vuex)

export default new Vuex({
  // ...
  // combine sub-trees into root state
  state: {
    cart: cartInitialState,
    products: productsInitialState
  },
  // mutations can be an array of mutation definition objects
  // from multiple modules
  mutations: [cartMutations, productsMutations]
})
```

Since all modules simply export objects and functions, they are quite easy to test and maintain. You are also free to alter the patterns used here to find a structure that fits your preference.

Note that we do not put actions into modules, because a single action may dispatch mutations that affect multiple modules. It's also a good idea to decouple actions from the state shape and the implementation details of mutations for better separation of concerns. If the actions file gets too large, we can turn it into a folder and split out the implementations of long async actions into individual files.

For an actual example, check out the [Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).

???

### 提取共用的 Computed Getters

在大型项目中，多个组件使用同一个基于 Vuex state 的 computed 属性是有可能的。由于 computed getters 只是普通函数，你可以把它们独立在另一个文件里，以实现共享：

``` js
// getters.js
import vuex from './vuex'

export function filteredTodos () {
  return vuex.state.messages.filter(message => {
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

这非常像 [Getters in NuclearJS](https://optimizely.github.io/nuclear-js/docs/04-getters.html).

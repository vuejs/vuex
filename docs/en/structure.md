# Application Structure

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of opinions:

1. Application state lives in a single object.
2. Only mutation handlers can mutate the state.
3. Mutations must be synchronous, and the only side effects they produce should be state mutation.
4. All asynchronous logic such as data fetching should be performed in actions.

The nice thing about Vuex actions and mutations is that **they are just functions with no external dependencies**. As long as you follow these rules, it's up to you how to structure your project. The simplest Vuex instance can even be declared [in a single file](https://github.com/vuejs/vuex/blob/master/examples/counter/vuex.js)! However, this is unlikely to suffice for any serious project, so here are some recommended structures depending on the scale of your app.

### Simple Project

For a simple project, we can simply separate **actions** and **mutations** into respective files:

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

For an actual example, check out the [TodoMVC example](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

### Medium to Large Project

For any non-trivial app, we probably want to further split Vuex-related code into multiple "modules" (roughly comparable to "stores" in vanilla Flux), each dealing with a specific domain of our app. Each module would be managing a sub-tree of the state, exporting the initial state for that sub-tree and all mutations that operate on that sub-tree:

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

A typical module looks like this:

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

And in `vuex/index.js`, we "assemble" multiple modules together to create the Vuex instance:

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

### Extracting Shared Computed Getters

In large projects, it's possible that multiple components will need the same computed property based on Vuex state. Since computed getters are just functions, you can split them out into a separate file so that they can be shared in any component:

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

This is very similar to [Getters in NuclearJS](https://optimizely.github.io/nuclear-js/docs/04-getters.html).

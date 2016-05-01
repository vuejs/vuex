# Application Structure

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of high-level principles:

1. Application state is held in the store, as a single object.

2. The only way to mutate the state is by dispatching mutations on the store.

3. Mutations must be synchronous, and the only side effects they produce should be mutating the state.

4. We can expose a more expressive state mutation API by defining actions. Actions can encapsulate asynchronous logic such as data fetching, and the only side effects they produce should be dispatching mutations.

5. Components use getters to retrieve state from the store, and call actions to mutate the state.

The nice thing about Vuex mutations, actions and getters is that **they are all just functions**. As long as you follow these rules, it's up to you how to structure your project. However, it's nice to have some conventions so that you can instantly become familiar with another project that uses Vuex, so here are some recommended structures depending on the scale of your app.

### Simple Project

For a simple project, we can simply define the **store** and the **actions** in respective files:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── store.js     # exports the store (with initial state and mutations)
    └── actions.js   # exports all actions
```

For an actual example, check out the [Counter example](https://github.com/vuejs/vuex/tree/master/examples/counter) or the [TodoMVC example](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

Alternatively, you can also split out mutations into its own file.

### Medium to Large Project

For any non-trivial app, we probably want to further split Vuex-related code into multiple "modules" (roughly comparable to "stores" in vanilla Flux, and "reducers" in Redux), each dealing with a specific domain of our app. Each module would be managing a sub-tree of the state, exporting the initial state for that sub-tree and all mutations that operate on that sub-tree:

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

A typical module looks like this:

``` js
// vuex/modules/products.js
import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// initial state
const state = {
  all: []
}

// mutations
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

And in `vuex/store.js`, we "assemble" multiple modules together to create the Vuex instance:

``` js
// vuex/store.js
import Vue from 'vue'
import Vuex from '../../../src'
// import parts from modules
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // combine sub modules
  modules: {
    cart,
    products
  }
})
```

Here, `cart` module's initial state will be attached to the root state tree as `store.state.cart`. In addition, **all the mutations defined in a sub-module only receive the sub-state-tree they are associated with**. So mutations defined in the `cart` module will receive `store.state.cart` as their first argument.

The root of the sub-state-tree is irreplaceable inside the module itself. For example this won't work:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

Instead, always store actual state as a property of the sub-tree root:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

Since all modules simply export objects and functions, they are quite easy to test and maintain, and can be hot-reloaded. You are also free to alter the patterns used here to find a structure that fits your preference.

Note that we do not put actions into modules, because a single action may dispatch mutations that affect multiple modules. It's also a good idea to decouple actions from the state shape and the implementation details of mutations for better separation of concerns. If the actions file gets too large, we can turn it into a folder and split out the implementations of long async actions into individual files.

For an actual example, check out the [Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).

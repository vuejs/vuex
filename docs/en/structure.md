# Application Structure

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of opinions:

1. Application state lives in a single object.
2. Only mutation handlers can mutate the state.
3. Mutations must be synchronous and as simple as possible.
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

Note that we do not put actions into modules, because a single action may dispatch mutations that affect multiple modules. Also, since actions are only concerned with how to dispatch mutations, it's a good idea to decouple them from the state shape and the implementation details of mutations. If the actions file gets too large, we can turn it into a folder and split out the implementations of long async actions into individual files as well.

For an actual example, check out the [Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).

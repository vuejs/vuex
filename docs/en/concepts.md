# Core Concepts

You can use the `Vuex.Store` constructor to create Vuex stores. In most cases, you only need a single store for an application. Each Vuex store consists of three types of "ingredients":

- **State**: A plain object representing the application state.

- **Mutations**: Functions that mutates the state. Mutations **must be synchronous**.

- **Actions**: Functions that dispatch mutations. An action can contain asynchronous operations and can dispatch multiple mutations.

- **Getters**: Functions that receive state to return a computed value. Useful for extracting shared computed functions from Vue components.

Why do we differentiate between *mutations* and *actions*, rather then just simple functions that manipulate the state however we want? The reason is because we want to **separate mutation and asynchronicity**. A lot of application complexity roots from the combination of the two. When separated, they both become easier to reason about and write tests for.

> If you are familiar with Flux, note there's a term/concept difference here: Vuex mutations are the equivalent of Flux **actions**, while Vuex actions are equivalent to Flux **action creators**.

### Creating a Vuex Store

> **NOTE:** We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)! The doc also assumes you are already familiar with the concepts discussed in [Building Large-Scale Apps with Vue.js](http://vuejs.org/guide/application.html).

Creating a Vuex store is pretty straightforward - just put the aforementioned ingredients together:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
})
```

Once created, you can access the state via `store.state`, the actions via `store.actions` and the getters though `store.getters`. You cannot directly access the mutation functions - they can only be triggered by actions or calling `store.dispatch()`. We will discuss each concept in more details next.

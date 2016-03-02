# Getting Started

At the center of every Vuex application is the **store**. A "store" is basically a container that holds your application **state**. There are two things that makes a Vuex store different from a plain global object:

1. Vuex stores are reactive. When Vue components retrieve state from it, they will reactively and efficiently update if the store's state changes.

2. You cannot directly mutate the store's state. The only way to change a store's state is by explicitly dispatching **mutations**. This makes every state change easily track-able, and enables tooling that helps us better understand our applications.

### The Simplest Store

> **NOTE:** We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)! The doc also assumes you are already familiar with the concepts discussed in [Building Large-Scale Apps with Vue.js](http://vuejs.org/guide/application.html).

Creating a Vuex store is pretty straightforward - just provide an initial state object, and some mutations:

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

const store = new Vuex.Store({
  state,
  mutations
})
```

Now, you can access the state object as `store.state`, and trigger a mutation by dispatching its name:

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

Again, the reason we are dispatching a mutation instead of changing `store.state.count` directly, is because we want to explicitly track it. This simple convention makes your intention more explicit, so that you can reason about state changes in your app better when reading the code. In addition, this gives us the opportunity to implement tools that can log every mutation, take state snapshots, or even perform time travel debugging.

Now this is just the simplest possible example of what a store is. But Vuex is more than just the store. Next, we will discuss some core concepts in depth: [State](state.md), [Mutations](mutations.md) and [Actions](actions.md).

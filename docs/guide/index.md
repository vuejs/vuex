# Getting Started

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cMPa2Uk" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

At the center of every Vuex application is the **store**. A "store" is basically a container that holds your application **state**. There are two things that make a Vuex store different from a plain global object:

1. Vuex stores are reactive. When Vue components retrieve state from it, they will reactively and efficiently update if the store's state changes.

2. You cannot directly mutate the store's state. The only way to change a store's state is by explicitly **committing mutations**. This ensures every state change leaves a track-able record, and enables tooling that helps us better understand our applications.

## The Simplest Store

:::tip NOTE
We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)!
:::

After [installing](../installation.md) Vuex, let's create a store. It is pretty straightforward - just provide an initial state object, and some mutations:

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* your root component */ })

// Install the store instance as a plugin
app.use(store)
```

Now, you can access the state object as `store.state`, and trigger a state change with the `store.commit` method:

```js
store.commit('increment')

console.log(store.state.count) // -> 1
```

In a Vue component, you can access the store as `this.$store`. Now we can commit a mutation using a component method:

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

Again, the reason we are committing a mutation instead of changing `store.state.count` directly, is because we want to explicitly track it. This simple convention makes your intention more explicit, so that you can reason about state changes in your app better when reading the code. In addition, this gives us the opportunity to implement tools that can log every mutation, take state snapshots, or even perform time travel debugging.

Using store state in a component simply involves returning the state within a computed property, because the store state is reactive. Triggering changes simply means committing mutations in component methods.

Next, we will discuss each core concept in much finer details, starting with [State](state.md).

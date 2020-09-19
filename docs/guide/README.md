# Getting Started

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cMPa2Uk" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

At the center of every Vuex application is the **store**. A "store" is basically a container that holds your application **state**. There are two things that make a Vuex store different from a plain global object:

1. Vuex stores are reactive. When Vue components retrieve state from it, they will reactively and efficiently update if the store's state changes.

2. You cannot directly mutate the store's state. The only way to change a store's state is by explicitly **committing mutations**. This ensures every state change leaves a track-able record, and enables tooling that helps us better understand our applications.

### The Simplest Store

:::tip NOTE
We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)!
:::

After [installing](../installation.md) Vuex, let's create a store. It is pretty straightforward - just provide an initial state object, and some mutations:

#### Vuex 3.x (for Vue 2)

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

#### Vuex 4.x (for Vue 3)

``` js
import { createStore } from 'vuex'
import { createApp } from 'vue'

const store = createStore({
  state () {
    return {
      count: 1
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* your root component */ })
app.use(store)
```

Now, you can access the state object as `store.state`, and trigger a state change with the `store.commit` method:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

In order to have an access to `this.$store` property in your Vue components, you need to provide the created store to Vue instance. Vuex has a mechanism to "inject" the store into all child components from the root component with the `store` option:

``` js
new Vue({
  el: '#app',
  store: store,
})
```

:::tip
If you're using ES6, you can also go for ES6 object property shorthand notation (it's used when object key has the same name as the variable passed-in as a property):

```js
new Vue({
  el: '#app',
  store
})
```
:::

Now we can commit a mutation from component's method:

``` js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

Again, the reason we are committing a mutation instead of changing `store.state.count` directly, is because we want to explicitly track it. This simple convention makes your intention more explicit, so that you can reason about state changes in your app better when reading the code. In addition, this gives us the opportunity to implement tools that can log every mutation, take state snapshots, or even perform time travel debugging.

Using store state in a component simply involves returning the state within a computed property, because the store state is reactive. Triggering changes simply means committing mutations in component methods.

Here's an example of the [most basic Vuex counter app](https://jsfiddle.net/n9jmu5v7/1269/).

Next, we will discuss each core concept in much finer details, starting with [State](state.md).

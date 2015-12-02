# Core Concepts

Similar to Vue itself, Vuex exposes a single `Vuex` constructor. You can use it to create **Vuex instances**. In most cases, you only need one Vuex instance for an app. You can think of a Vuex instance as an "enhanced store" that holds your app state.

Each Vuex instance consists of three core parts:

- **State**: A plain object representing the application state.

- **Mutations**: Functions that mutates the state. Mutations **must be synchronous**.

- **Actions**: Functions that dispatch mutations. An action can contain asynchronous operations and can dispatch multiple mutations.

Why do we have mutations and actions, rather then just simple functions that manipulate the state however we want? The reason is because we want to **separate mutation and asynchronicity**. A lot of application complexity roots from the combination of the two. When separated, they both become easier to reason about and write tests for.

> If you are familiar with Flux, note there's a term/concept difference here: Vuex mutations are the equivalent of Flux *actions*, while Vuex actions are equivalent to Flux *action creators*.

### Creating a Vuex Instance

Creating a Vuex instance is pretty straightforward - just put the aforementioned ingredients together:

``` js
import Vuex from 'vuex'

const vuex = new Vuex({
  state: { ... },
  actions: { ... },
  mutations: { ... }
})
```

Once created, you can access the state via `vuex.state`, and the actions via `vuex.actions`. You cannot directly access the mutation functions - they can only be triggered by actions or calling `vuex.dispatch()`. We will discuss each concept in more details next.

> We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)!
